# Rankify

A generative-AI powered content optimization dashboard built for the Perplexity Hackathon.  
Analyze your website’s content, discover top competitors, extract key insights, and get actionable recommendations to boost your LLM visibility score.

## Demo 

Watch the demo here: [Rankify Demo](https://youtu.be/o7vJ7U546fE)

## Features

- **URL Analysis**: Submit any URL for deep content analysis via a clean Next.js interface.
- **Intelligent Scraping**: Uses **Firecrawl** to scrape and parse web content into clean Markdown.
- **Competitor Discovery**: Automatically identifies top competitors by generating user queries and analyzing Sonar (Perplexity) citations.
- **Deep Dive Analysis**: 
  - Scrapes competitor sites to understand "What they are doing right".
  - Generates specific "What you should do" recommendations.
- **LLM Visibility Score**: Visualizes your standing against competitors with a circular progress bar.
- **Data Persistence**: Persists raw scraped content to MongoDB and local Markdown files (`data/parsed/*.md`).

## How it Works

1. **Input**: User provides a URL.
2. **Initial Scrape**: The app scrapes the URL using `Firecrawl`.
3. **Query Generation**: An LLM generates potential user queries related to the content.
4. **Sonar Analysis**: These queries are sent to Perplexity's Sonar API to retrieve answers and citations.
5. **Competitor Identification**: Citations are analyzed to find top competitors.
6. **Deep Analysis**: The top competitors are scraped and analyzed to extract successful strategies.
7. **Recommendation**: The system compares your content with competitors to generate actionable advice.

## Repository structure

```
/
├── crawler/               # Standalone Python crawler service (using crawl4ai)
│   └── crawl-service.py   # FastAPI service for crawling
├── data/parsed/           # Persisted markdown files from scraped URLs
├── web/                   # Next.js front-end application
│   ├── package.json       # Scripts: dev, build, start, lint
│   ├── src/
│   │   ├── app/           # Next.js App Router pages & API routes
│   │   │   ├── api/       # API Routes (process, process-b, get-url-data)
│   │   │   └── dashboard/ # Dashboard page
│   │   ├── components/    # UI components (cards, dialogs, charts)
│   │   ├── lib/           # Utilities (scrape, sonar, llm, etc.)
│   │   └── models/        # Mongoose models
│   └── README.md          # Front-end setup & deployment instructions
└── README.md              # This file
```

## Getting Started

### Prerequisites

- Node.js v18+  
- npm, Yarn, or pnpm  
- MongoDB (local or Atlas)
- Firecrawl API Key
- Perplexity/Sonar API Key

### Install & Run Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/Saarthakkj/Rankify.git
   cd Rankify
   ```

2. **Setup the Web App**
   ```bash
   cd web
   npm install            # or yarn / pnpm install
   ```

3. **Environment Variables**
   Create a `.env` file in the `web` directory with the following:
   ```
   MONGODB_URI=...
   FIRECRAWL_API_KEY=...
   SONAR_API_KEY=...
   GEMINI_API_KEY=...
   ```

4. **Run the App**
   ```bash
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

Incoming scraped content is saved to MongoDB and locally under `data/parsed/` as Markdown files.  
See [`web/src/lib/markdown.ts`](web/src/lib/markdown.ts) for details on filename templating and front-matter.

## API Endpoints

- `POST /api/process`  
  - Accepts `{ url: string }` JSON payload  
  - Scrapes the URL, generates queries, and queries Sonar.
  - Returns initial results and citations.

- `POST /api/process-b`  
  - Accepts `{ citations_list: string[], url: string }`  
  - Scrapes competitors, analyzes strategies, and generates recommendations.
  - Returns competitor insights and "What you should do".

## Deployment

### Vercel

This Next.js app works out of the box on Vercel:

1. Push to your GitHub repo  
2. Import the project in Vercel  
3. Set build command to `npm run build` and output directory to `.next`
4. Configure Environment Variables in Vercel dashboard.

For more details, see [web/README.md](web/README.md).
