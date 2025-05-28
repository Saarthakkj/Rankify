// import axios from 'axios';
// import * as cheerio from 'cheerio';
import { NextRequest, NextResponse } from 'next/server';
import FirecrawlApp, {   BatchScrapeStatusResponse ,BatchScrapeResponse , ScrapeResponse} from '@mendable/firecrawl-js';

const app = new FirecrawlApp({apiKey: process.env.FIRECRAWL_API_KEY});

// Scrape a website

export async function scrapePage(url : string) : Promise<string>  {
  try{
    
    // Scrape a website:
    console.log("url : " , url ); 



    const scrapeResult = await app.scrapeUrl(url ,  { formats: ['markdown', 'html'] })  as ScrapeResponse;

    if (!scrapeResult.success) {
      throw new Error(`Failed to scrape: ${scrapeResult.error}`)
    }

    // console.log("scrape result : " , scrapeResult); 

    // console.log( "\n\nscrapreresult : \n\n"  , scrapeResult) ;

    const markdownString = scrapeResult.markdown;
    console.log("scrape result : " , scrapeResult.markdown?.substring(0 , 200)); 

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


export async function scrapePage_multiple(urls: string[]): Promise<string[]> {
    try {
      // 1) Start the batch scrape job
      var init ;
      try{
        init = await app.asyncBatchScrapeUrls(urls, { formats: ['markdown', 'html'] }) as BatchScrapeResponse;
      }catch(err){
        console.log("error in processing process-b reponse : " , err);
        return [] ;
      }

      
      if (!init.success || !init.id) {
        throw new Error(`Batch scrape failed to start: ${init.error}`);
      }

      // 2) Poll until the job completes
      let status: BatchScrapeStatusResponse;
      do {
        await new Promise((r) => setTimeout(r, 1000));
        status = await app.checkBatchScrapeStatus(init.id, true) as BatchScrapeStatusResponse;
      } while (status.status === 'scraping');

      if (!status.success || status.status !== 'completed') {
        throw new Error(`Batch scrape did not complete successfully: ${status.status}`);
      }

      const response = status.data.map(doc => doc.markdown?.substring(0 , 10000) ?? ''); 

      // console.log("\n\n\  --- DATA SCRAPED : \n\n" , response);
      return response; 

    }catch(error){
        console.error("error in processing process-b reponse : " , error);
        return [] ;
    }
}