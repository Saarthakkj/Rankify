import axios from 'axios';
import * as cheerio from 'cheerio';

/**
 * Fetches a web page and extracts readable text content.
 * @param url target URL
 * @returns plain-text string without scripts/styles/extra whitespace
 */
export async function scrapePage(url: string): Promise<string> {
  const { data } = await axios.get<string>(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (compatible; RankWaveBot/1.0; +https://example.com/bot)',
      Accept: 'text/html,application/xhtml+xml',
    },
  });

  const $ = cheerio.load(data);
  // Remove unwanted tags
  $('script, style, noscript, svg, iframe').remove();

  const bodyText = $('body').text();

  // Collapse whitespace
  const cleaned = bodyText.replace(/\s+/g, ' ').trim();

  return cleaned;
} 