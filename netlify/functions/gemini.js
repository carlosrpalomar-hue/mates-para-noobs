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

    // Orden de prioridad: Gemini 3.8 rápido -> Lite -> Latest -> Gemma 3 (servidor independiente si Flash da 503)
    const candidates = [
      { model: "gemini-3.8-flash", useThinkingLow: true, isGemma: false },
      { model: "gemini-3.8-flash-lite", useThinkingLow: false, isGemma: false },
      { model: "gemini-flash-latest", useThinkingLow: false, isGemma: false },
      { model: "gemma-3-27b-it", useThinkingLow: false, isGemma: true }
    ];

    let lastError = null;

    for (const candidate of candidates) {
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${candidate.model}:generateContent?key=${apiKey}`;

      let requestBody;
      if (candidate.isGemma) {
        // Gemma integra las instrucciones dentro del primer mensaje de usuario
        const sysText = payload.systemInstruction?.parts?.[0]?.text || "";
        const contentsCopy = JSON.parse(JSON.stringify(payload.contents || []));
        if (sysText && contentsCopy.length > 0 && contentsCopy[0].parts?.length > 0) {
          contentsCopy[0].parts[0].text = `${sysText}\n\nConsulta del alumno: ${contentsCopy[0].parts[0].text}`;
        }
        requestBody = {
          contents: contentsCopy,
          generationConfig: { temperature: 0.3, maxOutputTokens: 700 }
        };
      } else {
        requestBody = {
          ...payload,
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 700,
            ...(candidate.useThinkingLow ? { thinkingConfig: { thinkingLevel: "LOW" } } : {})
          }
        };
      }

      // Si un modelo se queda colgado más de 7s, abortamos y saltamos al siguiente antes del límite de 30s de Netlify
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 7000);

      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
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
        console.warn(`Aviso con ${candidate.model} (${response.status}):`, JSON.stringify(data));
      } catch (err) {
        clearTimeout(timeoutId);
        console.warn(`Timeout/red con ${candidate.model}:`, err.message);
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
    console.error("ERROR CATCH:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
