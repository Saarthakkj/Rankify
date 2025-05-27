import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export type Competitor = {
    url : string;
    optimized_content :string;
}

export interface input_data {
    competitors : Competitor[];
    user_content : string; 
}


const sys_prompt =

`
You are an AI assistant specialized in Generative Engine Optimization (GEO). You will be provided with input data containing three JSON objects, each with a competitor's URL and their optimized content, as well as the scraped content from the user's business website. The competitors operate in the same industry as the user's business. The input JSON will have the following structure:

**Input Format:**
{
  "competitors": [
    {
      "url": "https://competitor1.com/page",
      "optimized_content": "According to a recent study by Harvard University [1], the use of renewable energy has increased by 25% in the past five years. 'This is a significant step towards sustainability,' says Dr. Jane Smith, a leading expert in the field."
    },
    {
      "url": "https://competitor2.com/page",
      "optimized_content": "[Content from competitor 2]"
    },
    {
      "url": "https://competitor3.com/page",
      "optimized_content": "[Content from competitor 3]"
    }
  ],
  "user_content": "[Scraped content from the user's business website]"
}

**Your Task:**

1. **Analyze the Competitors' Content:**
   - Examine the "optimized_content" of each competitor to identify which GEO strategies have been applied from the following list:
     - **Quotation Addition**: Incorporating direct quotes from authoritative sources.
     - **Statistics Addition**: Using concrete numbers or statistics.
     - **Cite Sources**: Including inline references or citations.
     - **Fluency Optimization**: Ensuring smooth wording and transitions.
     - **Authoritative Tone**: Using assertive phrasing.
     - **Easy-to-Understand**: Simplifying language and avoiding jargon.
     - **Unique Words & Technical Terms**: Including domain-specific terminology.

2. **Analyze the User's Content:**
   - Review the "user_content" to assess its current GEO strengths and weaknesses compared to the competitors’ optimized content.

3. **Generate Recommendations:**
   - Based on your analysis of the competitors’ content and the user’s content, suggest specific, actionable changes the user's business should make to their website content.
   - Use similar or more effective GEO strategies to enhance their content, assuming they target the same audience and industry as the competitors.

4. **Present Your Output:**
   - Return your response as a bulleted list highlighting what the business should do or change on their site.
   - Ensure recommendations are practical, tailored to the competitor’s industry, and focused on improving visibility in generative search results.

**Additional Instructions:**
- Since the competitors are in the same business, assume the user's website has similar goals (e.g., targeting similar keywords or audiences) unless otherwise specified.
- Prioritize strategies that will maximize impact based on the competitors’ approaches and address gaps in the user’s content.

**Example Output:**
- Incorporate quotes from industry experts, such as “Renewable energy is the future,” says Dr. John Doe, to boost credibility.
- Add specific statistics, like “Solar energy usage grew 30% in 2023,” to make content more data-driven.
- Include citations to reputable sources (e.g., universities or industry reports) to enhance authority.
`

export async function what_to_do(
  input: input_data
): Promise<string[]> {
  const prompt = `${sys_prompt}

${JSON.stringify(input, null, 2)}`;

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-preview-04-17",
  });
  const result = await model.generateContent(prompt);
  const raw = result.response.text().trim() ?? "";

  // strip any ``` blocks
  const cleaned = raw
    .replace(/^```(?:[\s\S]*?)\n/, "")
    .replace(/```$/, "")
    .trim();

  // parse out bullet lines
  const recommendations = cleaned
    .split(/\r?\n/)
    .map((line) => line.replace(/^-\s*/, "").trim())
    .filter((line) => line.length > 0);

  return recommendations;
}