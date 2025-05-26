import { NextRequest, NextResponse } from 'next/server';
import { scrapePage_multiple } from '@/lib/scrape';
import {chunking} from '@/lib/chunks'; 
import contentModel from '@/models/content.model';
import FirecrawlApp from '@mendable/firecrawl-js';
import { dbConnect } from '@/lib/dbconnect';
const app = new FirecrawlApp({apiKey: process.env.FIRECRAWL_API_KEY});

import { hashMap } from '@/lib/hashmap'; 

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const {citations_list, url , _} = await req.json();

        console.log('Request body:', { citations_list, url });

        const {hostname} = new URL(url) ;
        const parts = hostname.split('.');
        const businessName = parts.length >= 2 ? parts[parts.length -2] : parts[0] ;
        console.log('\n business name : ' , businessName);
        

        // 1) pull in the stored content for this URL

        const origin = new URL(req.url).origin;
        const apiURL = `${origin}/api/get-url-data?url=${encodeURIComponent(url)}`;
        console.log("api url : " , apiURL); 
        const getUrlRes = await fetch(apiURL);
        if (!getUrlRes.ok) {
            console.error('Failed to fetch stored content', getUrlRes.status);
            return NextResponse.json(
                { error: 'Could not load content for URL' },
                { status: getUrlRes.status }
            );
        }
        const { content } = await getUrlRes.json();
        console.log('Stored content:', content.slice(0, 200));

        // console.log("citations list : " , citations_list); 
        // const citations_list = await req.json();
        const dummy_citations_list = citations_list.slice(0, 4);
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
        console.log("\n\n --- CHUKING DONE----- \n\n");


        const response_hashmap = await hashMap(chunks , content , businessName);
        console.log(response_hashmap); 
        const sortedEntries = Object.entries(response_hashmap)
          .sort(([, aVal], [, bVal]) => aVal - bVal);
        const sortedHashmap: Record<string, number> = Object.fromEntries(sortedEntries);
        console.log("SORTED HASHMAP:", sortedHashmap);

        const doc = await contentModel.findOne({ url }).lean();
        if (!doc) {
            return NextResponse.json({ content: '', sortedHashmap: {} });
        }
    
        console.log("----GENERATED HASHMAP ---"); 
        
        return NextResponse.json({sortedHashmap }); 
    }
    catch(error){
        console.error("error in processing process-b reponse" , error);
        return NextResponse.json({error : 'Internal server error'} ,{status : 500}); 
    }
}
