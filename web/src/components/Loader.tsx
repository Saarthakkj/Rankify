import React, { useState, useEffect } from 'react';

const SimpleLoadingWithText = ({ url = "your website" }) => {
  const [loadingText, setLoadingText] = useState("Analyzing");
  const [dots, setDots] = useState("");

  const loadingMessages = [
    "Analyzing",
    "Crawling pages", 
    "Checking SEO factors",
    "Processing content",
    "Evaluating performance",
    "Generating insights",
    "Almost ready"
  ];

  useEffect(() => {
    // Change loading message every 2 seconds
    const textInterval = setInterval(() => {
      setLoadingText(prev => {
        const currentIndex = loadingMessages.indexOf(prev);
        const nextIndex = (currentIndex + 1) % loadingMessages.length;
        return loadingMessages[nextIndex];
      });
    }, 7000);

    // Animate dots every 500ms
    const dotsInterval = setInterval(() => {
      setDots(prev => {
        if (prev === "") return ".";
        if (prev === ".") return "..";
        if (prev === "..") return "...";
        return "";
      });
    }, 500);

    return () => {
      clearInterval(textInterval);
      clearInterval(dotsInterval);
    };
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-10"> AI is Analyzing {url}</h2>
        <h2 className="text-2xl font-bold mb-2">{loadingText}{dots}</h2>
        <p className="text-muted-foreground">This may take a few moments.</p>
      </div>
    </div>
  );
};

export default SimpleLoadingWithText;