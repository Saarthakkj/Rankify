import { scrapePage } from '@/lib/scrape';
import { saveMarkdown } from '@/lib/markdown';
import { generateQueries } from '@/lib/llm';
import { querySonar } from '@/lib/sonar';

export async function processContent(url: string) {
  if (!url) throw new Error('url is required');
  const content = await scrapePage(url);
  saveMarkdown(content, url).catch(console.error);
  const queries = await generateQueries(content);
  const results = await Promise.all(
    queries.map(async q => {
      try {
        const { answer, citations } = await querySonar(q);
        return { question: q, answer, citations };
      } catch {
        return { question: q, answer: 'Error fetching answer.' };
      }
    })
  );
  return { url, content, results };
}