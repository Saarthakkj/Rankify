// import { GoogleGenerativeAI } from '@google/generative-ai';
import { getEncoding } from 'js-tiktoken';

const MAX_TOKENS_PER_CHUNK = 800_000;

export async function chunking(text: string, maxTokens = MAX_TOKENS_PER_CHUNK): Promise<string[]> {
  console.log('chunking start');
  const enc = getEncoding('cl100k_base');
  console.log(` tokensize of text : ${enc.encode(text).length}`);

  
  
  // split & pre-count
  const lines = text.split(/\r?\n+/).filter(Boolean);
  const lineInfos = lines.map(line => ({ line, tokens: enc.encode(line).length }));

  const chunks: string[] = [];
  let bufTokens = 0, bufLines: string[] = [];

  // const startTime = Date.now(); 

  for (const { line, tokens } of lineInfos) {
    if (bufTokens + tokens <= maxTokens) {
      bufLines.push(line);
      bufTokens += tokens;
    } else {
      if (bufLines.length) chunks.push(bufLines.join('\n'));
      if (tokens <= maxTokens) {
        bufLines = [line];
        bufTokens = tokens;
      } else {
        chunks.push(line);
        bufLines = [];
        bufTokens = 0;
      }
    }
  }
  if (bufLines.length) chunks.push(bufLines.join('\n'));
  // const endTime = Date.now();
  // console.log(`chunking done in ${(endTime - startTime)/1000}s`);
  console.log("token size of each chunk - ");
  chunks.forEach(chunk => {console.log((enc.encode(chunk).length) + "\n");});
  return chunks;
}