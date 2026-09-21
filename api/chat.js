export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Only POST requests are allowed."
    });
  }

  try {

    const { message } = req.body || {};

    if (!message || !message.trim()) {
      return res.status(400).json({
        error: "Message is empty."
      });
    }

    const response = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },

        body: JSON.stringify({
          model: "gpt-5.6-luna",

          instructions:
            "You are My AI, a helpful practical AI assistant. " +
            "Answer clearly and accurately. " +
            "For maths, show the working when useful. " +
            "For coding questions, provide working code and explain it simply. " +
            "If you are unsure about current information, say so rather than inventing facts.",

          input: message.trim()
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(data);

      return res.status(response.status).json({
        error: data.error?.message || "OpenAI API error."
      });
    }

    return res.status(200).json({
      reply: data.output_text || "I couldn't generate a response."
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error: "Server error. Please try again."
    });
  }
}
