from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from crawl4ai import WebCrawler
import asyncio

app = FastAPI()

class CrawlRequest(BaseModel):
    url: str
    options: dict = {}

@app.post("/crawl")
async def crawl_url(request: CrawlRequest):
    try:
        async with WebCrawler(verbose=True) as crawler:
            result = await crawler.arun(url=request.url, **request.options)
            return {
                "success": True,
                "data": {
                    "markdown": result.markdown,
                    "html": result.html,
                    "links": result.links_internal + result.links_external,
                    "media": result.media
                }
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))