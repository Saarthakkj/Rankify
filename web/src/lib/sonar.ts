import axios from 'axios';

export interface SonarResponse {
  answer: string;
  citations?: unknown;
}

export async function querySonar(question: string): Promise<SonarResponse> {
  const endpoint = 'https://api.perplexity.ai/chat/completions';

  try {
    const { data } = await axios.post(
      endpoint,
      {
        model: 'sonar-pro',
        messages: [{ role: 'user', content: question }],
        max_tokens: 500
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
      citations: data?.choices?.[0]?.message?.citations ?? undefined,
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