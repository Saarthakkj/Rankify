import { NextRequest, NextResponse } from 'next/server';
import { scrapePage_multiple } from '@/lib/scrape';
import {chunking} from '@/lib/chunks'; 
import FirecrawlApp from '@mendable/firecrawl-js';
const app = new FirecrawlApp({apiKey: process.env.FIRECRAWL_API_KEY});

import { hashMap } from '@/lib/hashmap'; 

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
    try {
        const {citations_list, url} = await req.json();

        console.log('Request body:', { citations_list, url });
        
        // console.log("citations list : " , citations_list); 
        // const citations_list = await req.json();
        const dummy_citations_list = citations_list.slice(0, 3);
        let scrapedPages_array : string[] = []; 
        let n_tries = 5;

        for(let i = 0; i < n_tries ; i++){
            scrapedPages_array = await scrapePage_multiple(dummy_citations_list);
            
            // Check if we got results
            if(scrapedPages_array.length > 0) break;
            
            // If it's the first try and we got empty array, it might be a 403 error
            // Don't retry for permanent failures
            // if(i === 0 && scrapedPages_array.length === 0) {
            //     console.log("Permanent failure detected, not retrying");
            //     permanentFailure = true;
            // }
            
            console.log(`Attempt ${i + 1} failed, retrying...`);
        }

        console.log("\n\n --- SCRAPED----- \n\n") ; 

        const scrapedPages = scrapedPages_array.join(" ");

        if(scrapedPages === ""){
            console.log("nothing to chunk");
            return NextResponse.json({ message: "Nothign to chunk" });
        }

        const chunks = await chunking(scrapedPages);

        

        console.log("\n\n --- CHUKING DONE----- \n\n") ;



        //hashmap generation 

        

        return NextResponse.json({ message: "hello world" });
    }
    catch(error){
        console.error("error in processing process-b reponse");
        return NextResponse.json({error : 'Internal server error'} ,{status : 500}); 
    }
}
