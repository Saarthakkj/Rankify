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
    try{
        const {_, url , hashMap} = await req.json();

        console.log('Request body:', { url , hashMap });
        

    }catch(error){
        console.log("received an error in process-c") ;
        return NextResponse.json({"message" : "received an error "} , {status : 500}); 
    }
}