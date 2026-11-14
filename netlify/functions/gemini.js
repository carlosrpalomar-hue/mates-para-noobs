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

    // 1. Primer intento: gemini-3.8-flash con 12s de margen
    const primary = await tryGenerate("models/gemini-3.8-flash", payload, true, 12000);
    if (primary.ok) {
      return { statusCode: 200, headers: { "Content-Type": "application/json" }, body: JSON.stringify(primary.data) };
    }
    console.warn(`Aviso gemini-3.8-flash (${primary.status}):`, JSON.stringify(primary.data));

    // 2. Segundo intento: gemini-flash-latest (válido en tu cuenta) con 12s de margen
    const secondary = await tryGenerate("models/gemini-flash-latest", payload, false, 12000);
    if (secondary.ok) {
      return { statusCode: 200, headers: { "Content-Type": "application/json" }, body: JSON.stringify(secondary.data) };
    }
    console.warn(`Aviso gemini-flash-latest (${secondary.status}):`, JSON.stringify(secondary.data));

    // 3. Tercer intento: busca automáticamente un modelo disponible en tu cuenta
    const listRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    if (listRes.ok) {
      const listData = await listRes.json();
      const validModels = (listData.models || []).filter((m) =>
        m.supportedGenerationMethods?.includes("generateContent") &&
        !["models/gemini-3.8-flash", "models/gemini-flash-latest"].includes(m.name) &&
        !/embedding|imagen|veo|tts|robotics|deep-research|computer-use/i.test(m.name)
      );
      validModels.sort((a, b) => (/flash|lite/i.test(a.name) ? -1 : 1));

      if (validModels.length > 0) {
        const dynamicRes = await tryGenerate(validModels[0].name, payload, false, 5000);
        if (dynamicRes.ok) {
          return { statusCode: 200, headers: { "Content-Type": "application/json" }, body: JSON.stringify(dynamicRes.data) };
        }
      }
    }

    return {
      statusCode: 503,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(secondary.data || primary.data),
    };
  } catch (error) {
    console.error("ERROR CATCH:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
