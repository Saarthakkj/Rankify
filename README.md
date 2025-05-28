# Rankify

A generative-AI powered content optimization dashboard built for the Perplexity Hackathon.  
Analyze your website’s content, discover top competitors, extract key insights, and get actionable recommendations to boost your LLM visibility score.

## Features

- Submit any URL for analysis via a clean Next.js interface  
- Ingest and dedupe citations, then run competitor analysis  
- Visualize an **LLM Visibility Score** with a circular progress bar  
- Present top competitors and key insights in customizable cards  
- Generate actionable recommendations and export or schedule reports  
- Persist raw scraped content to `data/parsed/*.md` with metadata

## Repository structure

```
/
├── data/parsed/          # Persisted markdown files from scraped URLs
├── web/                   # Next.js front-end application
│   ├── package.json       # Scripts: dev, build, start, lint
│   ├── src/
│   │   ├── app/           # Next.js App Router pages & API routes
│   │   │   └── dashboard/ # Dashboard page and API handlers
│   │   ├── components/    # UI components (cards, dialogs, charts)
│   │   └── lib/           # Utilities (e.g., markdown persistence)
│   └── README.md          # Front-end setup & deployment instructions
└── README.md              # This file
```

## Getting Started

### Prerequisites

- Node.js v18+  
- npm, Yarn, or pnpm  
- (Optional) [Vercel CLI](https://vercel.com/docs/cli) for deployment

### Install & Run Locally

```bash
cd web
npm install            # or yarn / pnpm install
npm run dev            # start Next.js in development mode
```

Open http://localhost:3000 in your browser.

### Build & Start

```bash
cd web
npm run build
npm run start
```

## Data Persistence

Incoming scraped content is saved under `data/parsed/` as Markdown files.  
See [`web/src/lib/markdown.ts`](web/src/lib/markdown.ts) for details on filename templating and front-matter.

## API Endpoints

- `POST /api/process`  
  - Accepts `{ url: string }` JSON payload  
  - Returns citation-filtered results for display  
- `POST /api/process-b`  
  - Accepts `{ citations_list: string[], url: string }`  
  - Returns competitor insights, sorted frequencies, and recommendations

## Deployment

### Vercel

This Next.js app works out of the box on Vercel:

1. Push to your GitHub repo  
2. Import the project in Vercel  
3. Set build command to `npm run build` and output directory to `.next`

For more details, see [web/README.md](web/README.md).

