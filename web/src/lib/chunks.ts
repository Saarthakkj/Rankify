import  {GoogleGenerativeAI } from '@google/generative-ai' ;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro-preview-05-06' });

const MAX_TOKENS_PER_CHUNK = 800_000 ;

export async function chunking(text : string  , maxTokens= MAX_TOKENS_PER_CHUNK) : Promise<string[]>{
    const lines = text.split(/\r?\n+/).filter(Boolean);
    const chunks : string[] = [] ; 
    let bufferLines : string[]  = []
    let bufferTokenCount = 0

    for(const line of lines){
        const candidate = [...bufferLines , line].join('\n') ;
        const {totalTokens} = await model.countTokens(candidate);

        if(totalTokens <= maxTokens){
            bufferLines.push(line); 
            bufferTokenCount = totalTokens; 
        } else{
            if(bufferLines.length){
                chunks.push(bufferLines.join('\n')); 
            }
        }

        const {totalTokens : lineTokens} = await model.countTokens(line) ;
        if(lineTokens <= maxTokens){
            bufferLines = [line]
            bufferTokenCount = lineTokens
        }else{
            chunks.push(line)
            bufferLines = []
            bufferTokenCount = 0
        }

        console.log("Token_count_per_chunks : " ,bufferTokenCount , " \n" ) ; 
    }
    //flush : 
    if(bufferLines.length){
        chunks.push(bufferLines.join('\n')); 
    }
    return chunks ; 
}
