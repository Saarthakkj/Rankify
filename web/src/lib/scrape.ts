// import axios from 'axios';
// import * as cheerio from 'cheerio';
import { NextRequest, NextResponse } from 'next/server';
import FirecrawlApp, {ScrapeResponse} from '@mendable/firecrawl-js';

const app = new FirecrawlApp({apiKey: process.env.FIRECRAWL_API_KEY});

// Scrape a website

export async function scrapePage(url : string) : Promise<string>  {
  try{
    
    // Scrape a website:
    // console.log("url : " , url ); 
    const scrapeResult = await app.scrapeUrl(url ,  { formats: ['markdown', 'html'] })  as ScrapeResponse;

    if (!scrapeResult.success) {
      throw new Error(`Failed to scrape: ${scrapeResult.error}`)
    }

    // console.log( "\n\nscrapreresult : \n\n"  , scrapeResult) ;

    const markdownString = scrapeResult.markdown;

    // console.log("\n\n scrapeMarkdwon : \n\n" , markdownString?.slice(0 ,500)) ;

    if (markdownString === undefined) {
      throw new Error('Scraped markdown is undefined');
    }

    return markdownString;
  }catch(error){
      console.error("error in processing process-b reponse : " , error);
      return "" ;
  }
}