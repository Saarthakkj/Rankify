import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function whats_good(content: string, urls : string[]): Promise<{ url: string; optimized_content: string }[]>{
  const prompt = 
  `
    You are an AI assistant specialized in identifying Generative Engine Optimization (GEO) strategies in web content. You will be provided with a list of three URLs and their corresponding scraped content. They all are top-performing websites in Perplexity's responses in their respective domain. Your task is to analyze each content piece and identify the sub-content (e.g., a paragraph or section) that is most likely to have contributed to the website's high ranking in generative search results. This sub-content should exemplify one or more of the following GEO strategies:

    Quotation Addition: Direct quotes from authoritative sources.
    Statistics Addition: Concrete numbers or statistics providing factual hooks.
    Cite Sources: Inline references or citations grounding claims in citable documents.
    Fluency Optimization: Well-polished wording, smooth transitions, and coherent sentence flow.
    Authoritative Tone: Assertive phrasing that enhances perceived influence.
    Easy-to-Understand: Simplified language or explanations avoiding jargon.
    Unique Words & Technical Terms: Domain-specific terminology or uncommon phrases.
    For each URL, extract the key segment that best aligns with these strategies and is most likely to have been featured in generative search responses. The selected segment should be a direct excerpt from the original content, not modified or enhanced further. Aim to choose a contiguous block of text (e.g., one to three paragraphs) that is informative, well-supported, and exhibits qualities appealing to a generative engine, such as clarity, authority, and factual grounding.

    Once you have identified the optimized sub-content for each URL, return the results in a JSON array where each entry is an object with:

    "url": The original URL.
    "optimized_content": The extracted segment that exemplifies GEO strategies and likely contributed to the website's high ranking.
    Ensure that the selected segments are coherent, self-contained, and representative of the content's optimization for generative search engines.

    Example Output:
    [{
        "url": "https://example1.com",
        "optimized_content": "According to a recent study by Harvard University [1], the use of renewable energy has increased by 25% in the past five years. 'This is a significant step towards sustainability,' says Dr. Jane Smith, a leading expert in the field."
    },
    {
        "url": "https://example2.com",
        "optimized_content": "The latest report from the World Health Organization [2] indicates that global vaccination rates have reached 85%, a milestone in public health. Experts emphasize that 'continued efforts are essential to maintain this progress.'"
    }]
    
    `;
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-preview-04-17",
  });
  const result = await model.generateContent(prompt);
  const response = result.response;
  const raw = response.text().trim() ?? "[]";

   // strip ```json blocks
  const cleanedText = raw
    .replace(/^```(?:json)?/, "")
    .replace(/```$/, "")
    .trim();

  try {
    const arr = JSON.parse(cleanedText);
    if (Array.isArray(arr)) {
      // assume each element already has {url, optimized_content}
      return arr.slice(0, 10) as { url: string; optimized_content: string }[];
    }
  } catch (error) {
    console.error("JSON parse error:", error, "Raw text:", raw);
  }

  // fallback: map lines into objects
  return cleanedText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 10)
    .map((optimized_content, idx) => ({
      url: urls[idx] || "",
      optimized_content,
    }));
}
