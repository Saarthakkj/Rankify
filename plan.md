# Project Plan: URL ➜ Content ➜ Context ➜ Queries ➜ Sonar Results

## 1. Project Setup
1.1 Initialize a new Next.js (TypeScript) application in the workspace.
1.2 Install and configure Tailwind CSS (or Shadcn UI built on Tailwind).
1.3 Install runtime dependencies:
   - `axios`, `cheerio` – web-scraping
   - `remark`, `remark-parse`, `remark-stringify` – markdown handling
   - `fs-extra` – file utilities
   - `openai` – LLM for context & query generation
   - `dotenv` – environment variables
   - `swr` or React Query – client data fetching (optional)
1.4 Configure `.env` with:
   - `OPENAI_API_KEY`
   - `SONAR_API_KEY`
1.5 Add helpful npm scripts (dev, build, lint, format).

## 2. Directory / File Structure (proposed)
```
/ (project root)
 ├─ app/ or pages/          # Next.js routing
 ├─ components/             # Reusable UI components
 ├─ lib/                    # Shared business logic
 │   ├─ scrape.ts           # Fetch + parse helpers
 │   ├─ markdown.ts         # Markdown generation utilities
 │   ├─ llm.ts              # OpenAI wrapper
 │   ├─ sonar.ts            # Perplexity Sonar client
 │   └─ types.ts            # Shared TypeScript types
 ├─ data/parsed/            # Generated .md files (git-ignored)
 ├─ styles/                 # Tailwind base / globals
 ├─ pages/api/              # Serverless API routes (if using pages/ dir)
 │   └─ process.ts          # Main orchestration endpoint
 ├─ plan.md                 # This file
 └─ status.md               # Running implementation log
```

## 3. Frontend Design
3.1 Simple form:
   - Input 1: URL (string)
   - Input 2: Business domain / niche (string)
   - Submit → POST to `/api/process`.
3.2 Handle loading & error states.
3.3 Present results as:
   1. Generated user-style queries (ordered list)
   2. Accordion / expandable cards for each query showing Sonar answer snippets.
3.4 Styling via Tailwind / Shadcn components.

## 4. Backend API Endpoints
- **`/api/process`** (POST)
  1. Validate inputs.
  2. `scrapePage(url)` – fetch HTML & extract meaningful text.
  3. `saveMarkdown(text, url)` – persist markdown under `data/parsed/` (timestamp-based filename) and return filepath.
  4. `generateQueries(text, domain)` – call gemini → array of 10 queries.
  5. For each query → `querySonar(q)` → return answer snippet(s).
  6. Aggregate & respond `{ queries: [ { q, answer } ] }`.

## 5. Web-Scraping Logic
- Use `axios` for GET.
- Parse with `cheerio`.
- Strip scripts/style tags, select key content tags (`article, main, p, h1-h6, li`).
- Normalize whitespace, truncate to ~6-8 k tokens (OpenAI input budget).

## 6. Markdown Generation
- Prepend front-matter with URL & timestamp.
- Use `remark` to stringify HTML-to-markdown if beneficial, else plain text.
- Store filename pattern: `data/parsed/{slugifiedUrl}-{ISO}.md`.

## 7. Context Understanding & Query Generation
- Use Gemini API to generate 10 natural-language user queries based on the content and business domain.
- Prompt: "Given the following website content and business domain ___, produce 10 diverse natural-language queries a consumer might ask an AI assistant. Respond ONLY with a JSON array of strings."
- Return as JSON array.

## 8. Perplexity Sonar API Integration
- Endpoint: `https://api.perplexity.ai/...` (Sonar)
- Use `Authorization: Bearer <SONAR_API_KEY>`.
- Parameters: model = sonar-medium / sonar-small.
- Extract `answer` / `output` field for display.

## 9. Result Display Logic
- Client receives array → maps over list.
- For each item render question & answer.
- Provide copy-to-clipboard or expand features.

## 10. Error Handling & Observability
- Comprehensive try/catch around each stage.
- Return meaningful HTTP errors.
- Log to console (server) and surface minimal messages to UI.

## 11. CI / Lint / Formatting
- Use ESLint + Prettier.
- Optionally GitHub Actions for CI.

---

This plan will guide incremental implementation. After each concrete coding step, `status.md` will be updated with the exact actions and code snippets applied. 