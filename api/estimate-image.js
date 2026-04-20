import OpenAI from "openai";

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { image } = req.body;

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: "Estimate parcel dimensions in cm. Return ONLY JSON: {length, width, height}"
            },
            {
              type: "input_image",
              image_base64: image
            }
          ]
        }
      ]
    });

    const text = response.output[0].content[0].text;
    const dims = JSON.parse(text);

    res.status(200).json(dims);

  } catch (err) {
    res.status(500).json({ error: "AI failed" });
  }
}
