import OpenAI from "openai";

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { item } = req.body;

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: `
Estimate realistic courier package dimensions in cm for this item: ${item}.
Include packaging box.
Return ONLY JSON:
{ "length": number, "width": number, "height": number }
`
    });

    const text = response.output[0].content[0].text;
    const dims = JSON.parse(text);

    res.status(200).json(dims);

  } catch (err) {
    res.status(500).json({ error: "AI failed" });
  }
}
