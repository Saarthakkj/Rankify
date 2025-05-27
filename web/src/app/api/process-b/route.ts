import { NextRequest, NextResponse } from 'next/server';
import { scrapePage_multiple } from '@/lib/scrape';
import {chunking} from '@/lib/chunks'; 
import {whats_good} from '@/lib/whats_good' ;
import {urlFinder} from '@/lib/url_finder';
import contentModel from '@/models/content.model';
import FirecrawlApp from '@mendable/firecrawl-js';
import { dbConnect } from '@/lib/dbconnect';
import {what_to_do} from '@/lib/what_to_do' ;
const app = new FirecrawlApp({apiKey: process.env.FIRECRAWL_API_KEY});

import { hashMap } from '@/lib/hashmap'; 

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        console.log("inside-process-b") ;
        const {citations_list, url , _} = await req.json();

        // console.log('Request body:', { citations_list, url });

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
        const n_tries = 5;

        for(let i = 0; i < n_tries ; i++){
            scrapedPages_array = await scrapePage_multiple(dummy_citations_list);
            
            // Check if we got results
            if(scrapedPages_array.length > 0) break;
            
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

        const startTime = Date.now(); 
        const response_hashmap = await hashMap(chunks , content , businessName);
        const endTime = Date.now();
        console.log(` hashmap geneartaion- ${(endTime - startTime)/1000}`)
        console.log(response_hashmap); 
    
        // …existing code…
        const sortedEntries = Object.entries(response_hashmap)
        .sort(([, aVal], [, bVal]) => bVal - aVal);

        // ensure businessName is in position 3 (zero-based) of the sortedEntries
        const idx = sortedEntries.findIndex(([k]) => k === businessName);
        if (idx !== -1 && idx < 4) {
        // if already in top4, swap it with the 4th element
        [sortedEntries[idx], sortedEntries[3]] = [sortedEntries[3], sortedEntries[idx]];
        } else {
        // not in top4: pull it out if present, or create it with freq=0
        let entry: [string, number];
        if (idx !== -1) {
            entry = sortedEntries.splice(idx, 1)[0];
        } else {
            entry = [businessName, 0];
        }
        // drop the current 4th element and insert ours
        sortedEntries.splice(3, 1, entry);
        }

        const sortedHashmap: Record<string, number> = Object.fromEntries(sortedEntries);

        // const doc = await contentModel.findOne({ url }).lean();
        // if (!doc) {
        //     return NextResponse.json({ content: '', sortedHashmap: {} });
        // }
    
        console.log("----GENERATED HASHMAP ---"); 


        console.log('process-c starts'); 

        // then rebuild your “top4” (and top3) from the mutated order:
        const top4 = sortedEntries.slice(0, 4).map(([k]) => k);
        const top3 = top4.filter(k => k !== businessName).slice(0, 3);

                
       
        // const top3 = Object.keys(sortedHashmap).slice(0, 4);

        console.log("top 3 :  ," ,top3);


        const sonarRes = await urlFinder(top3);
        // console.log("sonarResponse : " , sonarRes);
        let urls: string[];
        try {
            const parsed = JSON.parse(sonarRes.answer);
            urls = Array.isArray(parsed) ? parsed : sonarRes.citations ?? [];
        } catch {
            urls = sonarRes.citations ?? [];
        }

        console.log("urls : " , urls); 

        // — scrape again + whats_good
        let pages : string[] = [];

        // static-retry logic : 
        for (let i = 0; i < 5; i++) {
            pages = await scrapePage_multiple(urls);
            if (pages.length) break;
        }


        const what_good_competitors = await whats_good(pages.join(' '), urls);

        console.log("response_data : " , what_good_competitors); 

        const input_final_feature = {competitors: what_good_competitors ,user_content: content};

        //process-c

        const response_data = await what_to_do(input_final_feature);

        console.log('suggestions for current business : ' , response_data);

        return NextResponse.json({ sortedHashmap, what_good_competitors, response_data});
    }
    catch(error){
        console.error("error in processing process-b reponse" , error);
        return NextResponse.json({error : 'Internal server error'} ,{status : 500}); 
    }
}
