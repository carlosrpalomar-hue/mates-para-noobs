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
    // Añadimos configuración para respuesta rápida sin que agote el límite de 10s de Netlify
    const fastPayload = {
      ...payload,
      generationConfig: {
        temperature: 0.4,
        thinkingConfig: { thinkingBudget: 0 }
      }
    };

    const models = ["gemini-3.8-flash", "gemini-2.5-flash", "gemini-flash-latest"];
    let lastError = null;

    for (const model of models) {
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      
      // Si un modelo tarda más de 6 segundos, cortamos y saltamos al siguiente antes de que Netlify corte la función
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(fastPayload),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

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
      } catch (err) {
        clearTimeout(timeoutId);
        console.warn(`Timeout o error de red con ${model}:`, err.message);
        lastError = { error: { message: err.message } };
      }
    }

    console.error("ERROR FINAL API GEMINI:", JSON.stringify(lastError));
    return {
      statusCode: 503,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lastError),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
