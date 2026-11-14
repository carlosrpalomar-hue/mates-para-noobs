export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Falta GEMINI_API_KEY en Netlify" }),
    };
  }

  try {
    const payload = JSON.parse(event.body);

    // Pedimos respuestas concisas y rápidas para que tarden 2-3 segundos (muy por debajo del límite de 10s de Netlify)
    const fastPayload = {
      ...payload,
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 700,
        thinkingConfig: { thinkingBudget: 0 }
      }
    };

    const models = ["gemini-3.8-flash", "gemini-3.8-flash-lite"];
    let lastError = null;

    for (const model of models) {
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fastPayload),
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
      console.warn(`Aviso con ${model} (${response.status}):`, JSON.stringify(data));
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
