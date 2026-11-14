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

  const tryGenerate = async (modelPath, basePayload, useThinkingLow, timeoutMs) => {
    const cleanPath = modelPath.startsWith("models/") ? modelPath : `models/${modelPath}`;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/${cleanPath}:generateContent?key=${apiKey}`;
    const isGemma = cleanPath.toLowerCase().includes("gemma");

    let requestBody;
    if (isGemma) {
      const sysText = basePayload.systemInstruction?.parts?.[0]?.text || "";
      const contentsCopy = JSON.parse(JSON.stringify(basePayload.contents || []));
      if (sysText && contentsCopy.length > 0 && contentsCopy[0].parts?.length > 0) {
        contentsCopy[0].parts[0].text = `${sysText}\n\nConsulta: ${contentsCopy[0].parts[0].text}`;
      }
      requestBody = {
        contents: contentsCopy,
        generationConfig: { temperature: 0.3, maxOutputTokens: 700 },
      };
    } else {
      requestBody = {
        ...basePayload,
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 700,
          ...(useThinkingLow ? { thinkingConfig: { thinkingLevel: "LOW" } } : {}),
        },
      };
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      const data = await response.json();
      return { ok: response.ok, status: response.status, data };
    } catch (err) {
      clearTimeout(timeoutId);
      return { ok: false, status: 408, data: { error: { message: err.message } } };
    }
  };

  try {
    const payload = JSON.parse(event.body);
    const tried = new Set();

    // 1. Primer intento rápido con gemini-3.8-flash (8s máx)
    tried.add("models/gemini-3.8-flash");
    const primary = await tryGenerate("models/gemini-3.8-flash", payload, true, 8000);
    if (primary.ok) {
      return { statusCode: 200, headers: { "Content-Type": "application/json" }, body: JSON.stringify(primary.data) };
    }
    console.warn(`Aviso gemini-3.8-flash (${primary.status}):`, JSON.stringify(primary.data));

    // 2. Si falla o está saturado (503), consultamos los modelos reales disponibles en tu clave
    const listRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    if (listRes.ok) {
      const listData = await listRes.json();
      const available = (listData.models || [])
        .filter((m) =>
          m.supportedGenerationMethods?.includes("generateContent") &&
          !tried.has(m.name) &&
          !/embedding|imagen|veo|tts|robotics|deep-research|computer-use|aqa|bisect/i.test(m.name)
        )
        .map((m) => m.name);

      console.log("Modelos alternativos en tu cuenta:", available.join(", "));

      // Probamos hasta 4 modelos alternativos (6s máx cada uno) hasta que uno responda OK
      for (const modelName of available.slice(0, 4)) {
        const res = await tryGenerate(modelName, payload, false, 6000);
        if (res.ok) {
          console.log(`Respuesta exitosa usando ${modelName}`);
          return { statusCode: 200, headers: { "Content-Type": "application/json" }, body: JSON.stringify(res.data) };
        }
        console.warn(`Aviso con ${modelName} (${res.status}):`, JSON.stringify(res.data));
      }
    }

    return {
      statusCode: 503,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(primary.data),
    };
  } catch (error) {
    console.error("ERROR CATCH:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
