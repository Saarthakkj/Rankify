import { NextRequest, NextResponse } from 'next/server';
import { scrapePage } from '@/lib/scrape';
import {chunking} from '@/lib/chunks'; 
import {hashMap} from '@/lib/hashmap'; 

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
    try {
        const citations_list = await req.json();
        // console.log("citations list : " , citations_list); 

        var scraped_page = "";

        citations_list.forEach(async (citation : string) => {
             scraped_page + (await scrapePage(citation)) ;
        });

        console.log("\n\n --- SCRAPED----- \n\n") ; 

        const chunks = chunking(scraped_page) ;

        console.log("\n\n --- CHUKING DONE----- \n\n") ;

        return NextResponse.json({ message: "hello world" });
    }
    catch(error){
        console.error("error in processing process-b reponse");
        return NextResponse.json({error : 'Internal server error'} ,{status : 500}); 
    }
}
