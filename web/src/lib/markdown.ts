import path from 'path';
import fs from 'fs-extra';

/**
 * Persist scraped content into a markdown file under data/parsed/.
 * Returns absolute filepath.
 */
export async function saveMarkdown(content: string, url: string): Promise<string> {
  // Resolve path relative to project root (../data/parsed from web/ directory)
  const parsedDir = path.resolve(process.cwd(), '..', 'data', 'parsed');
  await fs.ensureDir(parsedDir);

  const slug = url
    .replace(/https?:\/\//, '')
    .replace(/[^\w\d]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();

  const iso = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `${slug}-${iso}.md`;
  const filepath = path.join(parsedDir, filename);

  const markdown = `---\nurl: ${url}\ndate: ${new Date().toISOString()}\n---\n\n${content}\n`;
  await fs.writeFile(filepath, markdown, 'utf8');

  return filepath;
} 