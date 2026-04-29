import OpenAI from "openai";

// Kreiramo klijent koristeći API ključ iz Environment Variables
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  // Dozvoljavamo samo POST zahteve
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { type } = req.body;

  // Prompt koji šaljemo AI-u. ${type} ubacuje ono što korisnik izabere.
  const prompt = `
    You are a viral YouTube idea generator.
    
    Type: ${type}
    
    Return EXACT format:
    Title: [Your Title Here]
    Idea: [Your Idea Here]
  `;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini", // Koristimo najnoviji mini model koji je brz i jeftin
      messages: [
        { role: "system", content: "You are a creative assistant." },
        { role: "user", content: prompt }
      ],
    });

    // Uzimamo tekst koji je AI generisao
    const resultText = response.choices[0].message.content;

    // Šaljemo odgovor nazad tvom sajtu
    res.status(200).json({ result: resultText });
    
  } catch (err) {
    console.error("Greška kod AI-a:", err);
    res.status(500).json({ error: "AI Failed", details: err.message });
  }
}
