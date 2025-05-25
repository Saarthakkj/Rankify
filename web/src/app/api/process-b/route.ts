import { NextRequest, NextResponse } from 'next/server';
import { scrapePage_multiple } from '@/lib/scrape';
import {chunking} from '@/lib/chunks'; 
import FirecrawlApp from '@mendable/firecrawl-js';
const app = new FirecrawlApp({apiKey: process.env.FIRECRAWL_API_KEY});
import {hashMap} from '@/lib/hashmap'; 

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
    try {
        const citations_list = await req.json();
        // console.log("citations list : " , citations_list); 

        const dummy = [citations_list[0] , citations_list[1]  ,  citations_list[2] ] ;

        console.log("citations dummy : " , dummy); 

        // var scraped_page = "";

        const scrapedpage = await scrapePage_multiple(citations_list) ;

       




        // const scraped_page = (await scrapePage(citations_list));

        // citations_list.forEach(async (citation : string) => {
        //     scraped_page + (await scrapePage(citation)) ;
        // });

        console.log("\n\n --- SCRAPED----- \n\n") ; 

        // const chunks = chunking(scraped_page) ;

        console.log("\n\n --- CHUKING DONE----- \n\n") ;

        return NextResponse.json({ message: "hello world" });
    }
    catch(error){
        console.error("error in processing process-b reponse");
        return NextResponse.json({error : 'Internal server error'} ,{status : 500}); 
    }
}
