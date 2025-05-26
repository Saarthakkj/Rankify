import { dbConnect } from "@/lib/dbconnect";
import contentModel from "@/models/content.model";

export async function GET(req: Request) {
    dbConnect()

    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");
    if (!url) {
        console.error("Missing required URL parameter");
        return new Response(JSON.stringify({ error: "URL parameter is required" }), { status: 400 });
    }
    
    console.log("url : " , url); 
    const content = await contentModel.findOne({ url });

    if (!content) {
        console.error("No content found for URL:", url);
        return new Response(JSON.stringify({ error: "Content not found" }), { status: 404 });
    } else {
        return new Response(JSON.stringify(content), { status: 200 });
    }
}