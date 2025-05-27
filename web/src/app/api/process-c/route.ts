import { NextRequest, NextResponse } from 'next/server';
import { scrapePage_multiple } from '@/lib/scrape';
import {chunking} from '@/lib/chunks'; 
import contentModel from '@/models/content.model';
import FirecrawlApp from '@mendable/firecrawl-js';
import {whats_good} from '@/lib/whats_good' ;
import { dbConnect } from '@/lib/dbconnect';
import {urlFinder} from '@/lib/url_finder';
const app = new FirecrawlApp({apiKey: process.env.FIRECRAWL_API_KEY});

import { hashMap } from '@/lib/hashmap'; 

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
    try{
        const {_, url , hashMap} = await req.json();

        console.log('Request body:', { url , hashMap });
            

        const top_3 = [hashMap[0] , hashMap[1] , hashMap[2]] ;

        // call the Sonar-based URL finder
        const sonarRes = await urlFinder(top_3);
        let urls: string[] = [];
        try {
            const parsed = JSON.parse(sonarRes.answer);
            if (Array.isArray(parsed)) urls = parsed.map(u => String(u));
            else throw new Error('Not an array');
        } catch {
            console.warn('Failed to parse JSON answer, falling back to citations');
            urls = sonarRes.citations ?? [];
        }

        console.log('Resolved URLs:', urls);

        let n_tries = 5;
        let scraped_pages_array : string[] = []; 
        for(let i = 0 ; i < n_tries ;i++){
            scraped_pages_array = await scrapePage_multiple(urls);
            if(scraped_pages_array.length > 0) break;
            
            console.log(`Attempt ${i + 1} failed, retrying...`);
        }
        const scrapedPages = scraped_pages_array.join(" ");


        const response_data = await whats_good(scrapedPages  , urls); 

        console.log(response_data);

        return NextResponse.json({response_data});
    }catch(error){
        console.log("received an error in process-c") ;
        return NextResponse.json({"message" : "received an error "} , {status : 500}); 
    }
}