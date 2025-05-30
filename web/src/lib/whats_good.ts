import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function whats_good(content: string, urls : string[]): Promise<{ url: string; optimized_content: string }[]>{

  const input_data = {urls , content};
  // console.log("input data to whats_good gemini : " , input_data) ;
  const prompt = 
  `
    You are an AI assistant powered by Gemini, specialized in identifying Generative Engine Optimization (GEO) strategies in web content. 
    You will be provided with a input_data which is an object containing a list of 3 page URLs and the scraped content respectively of each url to analyze. of from top-performing sites. 
    Your task is to analyze each page and produce a concise yet detailed summary of its GEO-optimized content.

    Each summary should highlight the key GEO strategies used, providing specific examples from the content that illustrate each strategy, along with any nuanced aspects of their application. The GEO strategies to look for are:

    - Quotation Addition: Incorporation of direct quotes from authoritative sources to lend credibility and depth. Look for phrases in quotation marks attributed to experts or reputable publications. Note how the quote is integrated into the narrative, such as framing an argument or emphasizing a key point.
    - Statistics Addition: Use of concrete numbers or statistics to provide factual hooks that make the content more compelling and trustworthy. Identify numerical data, percentages, or statistical findings. Observe how these statistics are contextualized or emphasized, such as through comparisons or bold formatting.
    - Cite Sources: Inclusion of inline references or citations that ground claims in citable documents, enhancing reliability. Look for footnotes, hyperlinks to sources, or mentions of studies and reports. Note the frequency and relevance of these citations to the content’s claims.
    - Fluency Optimization: Ensuring smooth transitions and coherent flow throughout the text for better readability. Pay attention to the logical progression of ideas and the use of transitional phrases. Highlight any particularly effective transitions or structural elements that enhance comprehension.
    - Authoritative Tone: Use of assertive phrasing and confident language to enhance credibility and persuasiveness. Look for strong, definitive statements and the absence of hedging language like "perhaps" or "maybe." Note the overall tone and any rhetorical devices used to reinforce authority.
    - Easy-to-Understand: Prioritization of clear explanations and avoidance of jargon to make content accessible to a broad audience. Identify simple, straightforward language and explanations of technical terms. Observe how complex ideas are simplified without losing accuracy.
    - Unique Terms: Use of domain-specific terminology or uncommon phrases that add specificity and expertise. Look for specialized vocabulary or phrases not commonly used in everyday language. Note how these terms are introduced or explained to maintain clarity.

    Return your results as a JSON array of strings, where each string is a three-to-four sentence summary of the page’s GEO-optimized content. Each summary should:
    1. Identify the GEO strategies used.
    2. Provide specific examples from the content for each strategy.
    3. Highlight any nuanced or sophisticated applications of the strategies.
      
    Ensure that your analysis is objective and based solely on the content provided, avoiding personal opinions or interpretations not supported by the text. Only include strategies that are evidently used in the content; do not mention strategies that are absent.

    Example summary:  
    "The page employs Quotation Addition by including a direct quote from Dr. Jane Smith, a leading expert, saying, 'The impact of this technology is profound,' which not only adds credibility but also sets the tone for the discussion. It also uses Statistics Addition with the claim, 'Studies show a 25% increase in efficiency,' where the statistic is emphasized by a comparison to industry standards, enhancing its persuasive impact. Additionally, an authoritative tone shines through in statements like, 'It is clear that this is the best approach,' projecting confidence, while unique terms like 'quantum entanglement' are simplified as 'a special connection between particles,' blending expertise with accessibility."
    Return type - Strictly Don't put any aeshtrick in the content. Return type is JSON array of strings. And keep the character limit of each point not more than 200
    
    input_data : ${input_data}
    `;
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-preview-04-17",
  });
  const result = await model.generateContent(prompt);
  const response = result.response;
  const raw = response.text().trim() ?? "[]";

  // strip any surrounding markdown fences
  let cleanedText = raw
    .replace(/^```(?:json)?/, "")
    .replace(/```$/, "")
    .trim();

  // extract only the JSON array between the first '[' and last ']'
  const start = cleanedText.indexOf("[");
  const end = cleanedText.lastIndexOf("]");
  if (start !== -1 && end !== -1) {
    cleanedText = cleanedText.slice(start, end + 1);
  }

  try {
    const arr = JSON.parse(cleanedText);
    if (Array.isArray(arr)) {
      const response = urls.map((url, i) => ({
        url,
        optimized_content: arr[i] || ""
      }));
      return response;
    }
  } catch (error) {
    console.error("JSON parse error:", error, "Cleaned text:", cleanedText);
  }

  return [];
}
