'use client';

import { useState } from "react";

interface QueryResult {
  question: string;
  answer: string;
}

export default function Page() {
  const [url, setUrl] = useState("");
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<QueryResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults([]);
    try {
      const res = await fetch("/api/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, domain }),
      });
      if (!res.ok) {
        throw new Error("Server error");
      }
      const data = await res.json();
      setResults(data.results || []);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 space-y-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-center">Rankify Pipeline Demo</h1>
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
            placeholder="https://example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Business Domain</label>
          <input
            type="text"
            required
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="w-full border px-3 py-2 rounded dark:bg-gray-900"
            placeholder="e.g. Hotels in Bangladesh"
          />
        </div>
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
            </details>
          ))}
        </section>
      )}
    </main>
  );
}
