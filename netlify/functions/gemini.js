export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("ERROR: Falta GEMINI_API_KEY en process.env");
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Falta GEMINI_API_KEY en Netlify" }),
    };
  }

  try {
    const payload = JSON.parse(event.body);
    // Lista de modelos por orden de prioridad por si alguno tiene saturación puntual (503)
    const models = ["gemini-3.8-flash", "gemini-2.5-flash", "gemini-2.0-flash"];
    let lastError = null;

    for (const model of models) {
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        return {
          statusCode: 200,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        };
      }

      lastError = data;
      console.warn(`Aviso con modelo ${model} (${response.status}):`, JSON.stringify(data));

      // Si el error NO es saturación (503/429) ni modelo no encontrado (404), salimos del bucle
      if (![503, 429, 404].includes(response.status)) {
        break;
      }
    }

    console.error("ERROR FINAL API GEMINI:", JSON.stringify(lastError));
    return {
      statusCode: 503,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lastError),
    };
  } catch (error) {
    console.error("ERROR CATCH:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
