'use client';

import { useState  ,useRef ,  useEffect} from "react";
import {useSearchParams} from "next/navigation" ;
interface QueryResult {
  question: string;
  answer: string;
  citations?: string[];
}


export default function Home() {
  // const [url, setUrl] = useState("");
  // const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams() ;
  const hasNotified = useRef(false); 
  const urlParam = searchParams.get("url"); 
  const [results, setResults] = useState<QueryResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [citationFrequency, setCitationFrequency] = useState<Record<string, number>>({});
  const [processBCalls, setProcessBCalls] = useState(0);
  
  async function notifyCitationChange(freq: Record<string, number>) {

    // console.log("Called once"); 
    setProcessBCalls((c) => c+1); 
    const citations = Object.keys(freq);
    const response = await fetch('/api/process-b', 
      { method: 'POST', body: JSON.stringify(citations) }
    );

    if(!response.ok ) throw new Error("error in response of process-b"); 
    console.log("process-b response : ", response); 
  }


  
  
  function isSameDomain( a : string  , b : string ){
    try{
      return new URL(a).hostname === new URL(b).hostname ;
    }catch{
      return false;
    }
  }

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      setResults([]);
      try {
        const res = await fetch("/api/process", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url : urlParam   }),
        });
        if (!res.ok) {
          throw new Error("Server error");
        }
        const data = await res.json();
        setResults(data.results || []);
        
        // Calculate citation frequency
        const citations: Record<string, number> = {};
        const uniqueCitations = new Set<string>();
        
        data.results?.forEach((result: QueryResult) => {
          // Filter out duplicate citations by URL domain
          const resultCitations = result.citations || [];
          const filteredCitations = resultCitations.filter(citation => {
            // Skip if we already added this exact citation
            if (uniqueCitations.has(citation)) return false;
            
            // Check if the domain is the same as any already added citation
            for (const existingCitation of uniqueCitations) {
              if (isSameDomain(citation, existingCitation)) {
                return false;
              }
            }
            
            uniqueCitations.add(citation);
            return true;
          });
          
          // Update result with filtered citations
          result.citations = filteredCitations;
          
          // Count citations for frequency display
          filteredCitations.forEach(citation => {
            citations[citation] = (citations[citation] || 0) + 1;
          });
        });
        
        setCitationFrequency(citations);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchData() ;
  } ,   [urlParam]) ;

  // new effect for citationFrequency changes
  useEffect(() => {
    // console.log("\n----CALLED : \n")
    if (!Object.keys(citationFrequency).length  || hasNotified.current) return;
    hasNotified.current = true; 
    notifyCitationChange(citationFrequency);
  }, [citationFrequency]);



  return (
    <main className="min-h-screen p-8 space-y-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-center">Rankify Demo</h1>
      
      {error && (
        <p className="text-red-600 text-center">Error: {error}</p>
      )}

      {/* display the number of calls */}
      <p className="text-sm text-gray-500">
        process-b calls made: {processBCalls}
      </p>


      {Object.keys(citationFrequency).length > 0 && (
        <section className="space-y-4 mt-8 border-t pt-4">
          <h2 className="text-2xl font-semibold">Citation Frequency</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(citationFrequency)
              .sort(([, countA], [, countB]) => countB - countA)
              .map(([citation, count]) => (
                <div 
                  key={citation} 
                  className="flex justify-between items-center p-3 border rounded bg-white/50 dark:bg-gray-900/50"
                >
                  <span className="truncate flex-1">{citation}</span>
                  <span className="ml-4 px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded-full text-sm font-medium">
                    {count} {count === 1 ? 'mention' : 'mentions'}
                  </span>
                </div>
              ))}
          </div>
        </section>
      )}
    </main>
  );
}