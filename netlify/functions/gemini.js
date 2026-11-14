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

    // Modelos activos y ultrarrápidos confirmados en tu cuenta (evita los 2.5 retirados y los Gemma lentos)
    const models = [
      "gemini-3.1-flash-lite",
      "gemini-3.7-flash",
      "gemini-3.6-flash",
      "gemini-3.8-flash",
      "gemini-flash-lite-latest",
    ];

    let lastError = null;

    for (const model of models) {
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const requestBody = {
        ...payload,
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 700,
          ...(model === "gemini-3.8-flash" ? { thinkingConfig: { thinkingLevel: "LOW" } } : {}),
        },
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5500);

      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        const data = await response.json();

        if (response.ok) {
          console.log(`Respuesta exitosa usando ${model}`);
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
        console.warn(`Timeout/red con ${model}:`, err.message);
        lastError = { error: { message: err.message } };
      }
    }

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
