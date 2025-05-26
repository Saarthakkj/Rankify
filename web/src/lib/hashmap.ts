import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function hashMap( chunks : string[] , content : string , businessName : string)  : Promise<Record<string , number>> {
    let hashmap : Record<string , number> = {[businessName] : 0 }; 
    console.log("businessName : " , businessName  ) ;
    const sys_prompt = 
    `
    System Prompt for Competitor Frequency Extraction

    You are an expert in text analysis and entity extraction. Your task is to analyze the provided text, which is scraped data from blogging sites included in Perplexity responses.

    Business A Description: ${content}
    Business A Name: ${businessName}
    Existing Hashmap: You are provided with an existing hashmap of competitor frequencies: {{EXISTING_HASHMAP}}. This is a JSON object where keys are competitor names and values are the current number of times each competitor has been mentioned.
    Your goal is to identify mentions of competitor businesses (other businesses offering similar products or services as Business A) in the text and update the frequency hashmap accordingly.

    Instructions:
    Identify Competitor Mentions: Identify and count mentions of competitor businesses in the text. Competitors are businesses offering similar products or services as Business A.
    Exclude Business A: Exclude Business A ${businessName} from the list of competitors. (Note: Your original prompt said "Include Business A," but based on standard practice and context, I assume this was a typo and should be "Exclude," as Business A is not a competitor to itself. If this assumption is incorrect, please clarify.)
    Count Each Mention: If a competitor is mentioned multiple times in the text, count each mention separately.
    Update Existing Hashmap: Keep in mind the hashmap given to you. For each competitor mentioned in the text:
    If the competitor is already in the existing hashmap, add the new mention count to the existing frequency. For example, if "Hotel X" is mentioned 3 times in the text and the existing hashmap has "Hotel X": 2, return "Hotel X": 5.
    If the competitor is not in the existing hashmap, add it with the mention count from the text.
    If the number of unique competitors in the hashmap exceeds 10, do not add new competitors; only update frequencies for existing competitors.
    Handle Multiple Names: If a competitor is referred to by multiple names, use the most common or full name consistently.
    Output Format: Return the updated hashmap as a JSON object where keys are competitor names and values are the total number of times each competitor has been mentioned (existing + new).
    No Competitors Case: If no competitors are mentioned in the text, return the existing hashmap unchanged.
    Text-Only Focus: Do not perform external searches or add external information; focus only on the provided text.
    Strict JSON Output: Ensure the output is strictly a JSON object without any additional text or explanation.
    Input Text:
    {{CHUNK}}

    Output:
    (The output will be a JSON object, e.g., {"Hotel X": 5, "Hotel Y": 1}, depending on the text and existing hashmap.)

    Explanation of Changes
    Added Hashmap Handling: I incorporated your specific requirement about the existing hashmap into Instruction 4, ensuring cumulative frequency updates (e.g., "Hotel X" from 2 to 5 when mentioned 3 more times).
    Clarified Exclusion: I adjusted Instruction 2 to "Exclude Business A" instead of "Include," assuming your mention of "Include" was a typo, as it aligns with typical competitor analysis goals. If you intended to include Business A, let me know, and I’ll revise accordingly.
    Enhanced Clarity: I restructured the prompt with markdown for readability and explicitly defined the existing hashmap as a JSON object input.
    No Empty Hashmap Default: Your original prompt returned an empty JSON object ({}) when no competitors were mentioned. Since the hashmap is now provided every time (even if empty), I changed this to return the existing hashmap unchanged, preserving prior data.
    Example
    Existing Hashmap: {"Hotel X": 2}
    Input Text: "Hotel X was great. I also stayed at Hotel X and Hotel Y. Hotel X is the best."
    Processing:
    "Hotel X" mentioned 3 times → 3 + 2 (existing) = 5
    "Hotel Y" mentioned 1 time → 1 (new)
    Output: {"Hotel X": 5, "Hotel Y": 1}

    `;


    async function callGemini(prompt: string): Promise<string> {
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash-preview-05-20'
        });
        const result = await model.generateContent(prompt);
        let raw = result.response.text().trim();
        raw = raw.replace(/^```(?:json)?/, '').replace(/```$/, '').trim();
        return raw;
    }
    console.log("\n\n --- CHUNKS LENGTH : "  , chunks.length  , "  \n\n"  );
    for(const chunk of chunks){
        const prompt = sys_prompt.replace('{{EXISTING_HASHMAP}}' , JSON.stringify(hashmap)).replace('{{CHUNK}}' , chunk) ;
        const partialRaw= await callGemini(prompt) ;
        let partial: Record<string, number> = {};
        try {
            const parsed = JSON.parse(partialRaw);
            // Validate that parsed is an object with string keys and number values
            if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
                throw new Error('Response is not a valid object');
            }
            for (const [key, value] of Object.entries(parsed)) {
                if (typeof key !== 'string' || typeof value !== 'number') {
                    throw new Error('Invalid key-value pair in response');
                }
            }
            partial = parsed as Record<string, number>;
            
            // Step 3: Reassign to hashmap (business domain step)
            hashmap = partial; // This can be replaced with your business logic, e.g., updateHashmap(hashmap, partial)
        } catch (e) {
            console.error('Error parsing Gemini response for chunk:', chunk, e);
            // Do not update hashmap; continue with existing hashmap
        }
        hashmap = partial; 
        console.log("hashmap : " , hashmap) ;
    }


    return hashmap ;
    // console.log("generating hashmap from chunks... ");
}