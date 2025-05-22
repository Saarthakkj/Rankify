import { NextRequest, NextResponse } from 'next/server';
import { scrapePage } from '@/lib/scrape';
import { saveMarkdown } from '@/lib/markdown';
import { generateQueries } from '@/lib/llm';
import { querySonar } from '@/lib/sonar';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { url, domain } = await req.json();
    console.log('Request body:', { url, domain });

    if (!url || !domain) {
      console.log('Missing required fields:', { url, domain });
      return NextResponse.json({ error: 'url and domain are required' }, { status: 400 });
    }

    // 1. Scrape content
    const content = await scrapePage(url);
    console.log('Scraped content length:', content.length);
    console.log('Content preview:', content.slice(0, 200));

    // 2. Persist markdown (fire and forget)
    saveMarkdown(content, url).catch((err) => {
      console.error('Markdown save error:', err);
    });

    // 3. Generate 10 user-style queries
    const queries = await generateQueries(content, domain);
    console.log('Generated queries:', queries);

    // 4. Query Sonar for each question (in parallel but with basic throttling)
    const results = await Promise.all(
      queries.map(async (q) => {
        try {
          console.log('Querying Sonar for:', q);
          const sonar = await querySonar(q);
          console.log('Sonar response:', sonar);
          return { question: q, answer: sonar.answer , citations : sonar.citations };
        } catch (err: any) {
          console.error('Sonar error for query:', q, err);
          return { question: q, answer: 'Error fetching answer.' };
        }
      }),
    );

    console.log('Final results:', results);
    return NextResponse.json({ results });
  } catch (err: any) {
    console.error('Top-level error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}