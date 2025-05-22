'use client';

import { useState } from "react";

interface QueryResult {
  question: string;
  answer: string;
  citations?: string[];
}

export default function Home() {
  const [url, setUrl] = useState("");
  // const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<QueryResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [citationFrequency, setCitationFrequency] = useState<Record<string, number>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults([]);
    try {
      const res = await fetch("/api/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url,   }),
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
  };

  function isSameDomain(url1 : string, url2 : string ) {
    try {
      // Create URL objects to properly parse the URLs
      const parsedUrl1 = new URL(url1);
      const parsedUrl2 = new URL(url2);
      
      // Compare the hostnames (domains)
      return parsedUrl1.hostname === parsedUrl2.hostname;
    } catch (error : any) {
      // Handle invalid URLs
      console.error('Invalid URL format:', error.message);
      return false;
    }
  }




  return (
    <main className="min-h-screen p-8 space-y-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-center">RankWave Pipeline Demo</h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-gray-50 dark:bg-gray-800 p-6 rounded shadow"
      >
        <div>
          <label className="block text-sm font-medium mb-1">Target URL</label>
          <input
            type="url"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full border px-3 py-2 rounded dark:bg-gray-900"
            placeholder="https://www.chatbase.co/"
          />
        </div>
        {/* <div>
          <label className="block text-sm font-medium mb-1">More about your business</label>
          <input
            type="text"
            required
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="w-full border px-3 py-2 rounded dark:bg-gray-900"
            placeholder="e.g. Offers tools to build AI chatbots trained on your data."
          />
        </div> */}
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Processing..." : "Generate"}
        </button>
      </form>

      {error && (
        <p className="text-red-600 text-center">Error: {error}</p>
      )}

      {results.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Results</h2>
          {results.map((item, idx) => (
            <details
              key={idx}
              className="border rounded p-4 bg-white/50 dark:bg-gray-900/50"
            >
              <summary className="font-medium cursor-pointer">
                {item.question}
              </summary>
              <p className="mt-2 whitespace-pre-wrap">{item.answer}</p>
              <details className="mt-2">
                <summary className="font-medium cursor-pointer">
                  Citations
                </summary>
                <ul className="list-disc pl-5">
                  {item.citations?.map((citation: any, index: number) => (
                    <li key={index} className="mt-1">
                      {citation}
                    </li>
                  ))}
                </ul>
              </details>
            </details>
          ))}
        </section>
      )}

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