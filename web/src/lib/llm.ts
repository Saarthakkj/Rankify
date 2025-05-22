import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function generateQueries(content: string): Promise<string[]> {
  const prompt = `Review the following website content carefully. Imagine you are a potential customer or user of this service or business in this domain.

  Based solely on this content, generate 10 diverse, realistic questions that you, as a user, would naturally ask an AI assistant when looking for this specific type of service or solution. Your questions should be ones that would logically lead to this website being recommended as an answer.

  Think about different user intents, pain points, information needs, and purchase journeys. Include both direct questions about specific services and broader problem-solving queries where this business would be relevant.

  Respond ONLY with a JSON array of strings without any markdown formatting or code blocks.

  ###
  ${content.slice(0, 5000)}
  ###`;
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-preview-04-17' });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const raw = response.text().trim() ?? '[]';

  // Remove code block formatting if present (```json, etc)
  const cleanedText = raw
    .replace(/^```(?:json)?/, '')
    .replace(/```$/, '')
    .trim();

  try {
    const arr = JSON.parse(cleanedText);
    if (Array.isArray(arr)) return arr.slice(0, 10);
  } catch (error) {
    console.error('JSON parse error:', error, 'Raw text:', raw);
    // Fallback: parse line-based list
  }

  // More robust fallback parsing for various formats
  return cleanedText
    .split(/\n|,/) // split by newline or comma
    .map(line => {
      // Remove list markers, quotes, and clean the strings
      return line
        .replace(/^[\d\-\*\.\s"'\[\]]+/, '') // Remove list markers, quotes, brackets at start
        .replace(/["'\]\s]+$/, '')           // Remove quotes, brackets at end
        .trim();
    })
    .filter(Boolean)
    .slice(0, 10);
} 