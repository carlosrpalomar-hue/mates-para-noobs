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
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`;

    const fastPayload = {
      ...payload,
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 700,
        thinkingConfig: { thinkingLevel: "LOW" }
      }
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fastPayload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("ERROR API GEMINI:", JSON.stringify(data));
      return {
        statusCode: response.status,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      };
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("ERROR CATCH:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
