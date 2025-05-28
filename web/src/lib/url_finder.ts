import axios from 'axios';

export interface SonarResponse {
  answer: string;
  citations?: string[];
}
const sys_prompt = "Given three business names separated by commas, search for the official website of each business and provide the URL as plain text. If multiple URLs are found for a business, include only the first one. If no official website is found for a business, output 'No website found'. Return the results as a JSON array of length 3 only, where each element corresponds to the URL or 'No website found' for the respective business in the order provided.";
export async function urlFinder(competitor: string[]): Promise<SonarResponse> {
  const endpoint = 'https://api.perplexity.ai/chat/completions';

  try {
    const { data } = await axios.post(
      endpoint,
      {
        model: 'sonar-pro',
        messages: [{ role: 'user', content: sys_prompt + competitor }],
        max_tokens: 400
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.SONAR_API_KEY}`,
        },
      },
    );

    return {
      answer: data?.choices?.[0]?.message?.content ?? '',
      citations: data?.citations ?? undefined,
    };
  } catch (error: any) {
    console.error('Sonar API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    throw error;
  }
}