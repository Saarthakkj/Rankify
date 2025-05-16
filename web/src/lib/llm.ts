import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function generateQueries(content: string, domain: string): Promise<string[]> {
  const prompt = `Given the following website content and business domain "${domain}", produce 10 diverse natural-language queries a consumer might ask an AI assistant. Respond ONLY with a JSON array of strings.\n\n###\n${content.slice(0, 5000)}\n###`;

  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-preview-04-17' });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const raw = response.text().trim() ?? '[]';

  try {
    const arr = JSON.parse(raw);
    if (Array.isArray(arr)) return arr.slice(0, 10);
  } catch {
    // Fallback: parse line-based list
  }

  return raw
    .split(/\n|,/) // split by newline or comma
    .map((line) => line.replace(/^[\d\-\*\.\s]+/, '').trim())
    .filter(Boolean)
    .slice(0, 10);
} 