"use client"

import { useState } from "react"
import { motion } from "motion/react"
import { LineChart, Lightbulb, Search, TrendingUp, Users, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CircularProgressBar } from "@/components/circular-progress"
import { CompetitorCard } from "@/components/competitor-card"
import { RecommendationCard } from "@/components/recommendation-card"
import { InsightCard } from "@/components/insight-card"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { ExportReportDialog } from "@/components/export-report-dialog"
import { ScheduleRefreshDialog } from "@/components/schedule-refresh-dialog"
import { ActionPlanDialog } from "@/components/action-plan-dialog"
import {toast} from "sonner"

export default function DashboardPage() {
  const [url, setUrl] = useState(() => localStorage.getItem("url") || "example.com")
  const [results, setResults] = useState([])
  const [citationFrequency, setCitationFrequency] = useState<Record<string, number>>({})
  const [error, setError] = useState<string | null>(null)
  const [businessDesc, setBusinessDesc] = useState("AI-powered content optimization platform")
  const [aiScore, setAiScore] = useState(78)
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(false)

  // Mock data for the dashboard
  const competitors = [
    { name: "contentai.com", score: 92, strengths: ["Semantic structure", "Topic coverage"] },
    { name: "aiwriter.io", score: 87, strengths: ["Content depth", "Query matching"] },
    { name: "rankgenius.com", score: 85, strengths: ["Technical SEO", "Content freshness"] },
    { name: "llmoptimize.net", score: 82, strengths: ["Entity recognition", "Contextual relevance"] },
    { name: "semanticboost.ai", score: 79, strengths: ["Keyword optimization", "Content structure"] },
    { name: "aicontentpro.com", score: 76, strengths: ["Topic clustering", "Content readability"] },
  ]

  const insights = [
    {
      title: "Semantic Structure Excellence",
      website: "hubspot.com",
      url: "https://hubspot.com",
      description:
        "HubSpot excels at creating content that LLMs can easily understand and categorize through superior semantic structure.",
      examples: [
        "Clear H1-H6 hierarchy with descriptive headings",
        "Schema markup for articles and FAQ sections",
        "Logical content flow with topic clustering",
        "Consistent use of semantic HTML elements",
      ],
    },
    {
      title: "Comprehensive Content Depth",
      website: "moz.com",
      url: "https://moz.com",
      description:
        "Moz provides in-depth, authoritative content that covers topics comprehensively, making it highly valuable for LLM training.",
      examples: [
        "Long-form guides with 3000+ words",
        "Multiple perspectives on complex topics",
        "Data-backed insights and case studies",
        "Regular content updates and fact-checking",
      ],
    },
    {
      title: "Query Intent Optimization",
      website: "ahrefs.com",
      url: "https://ahrefs.com",
      description:
        "Ahrefs structures content to directly answer user questions and search intents, making it highly relevant for AI-powered search.",
      examples: [
        "FAQ sections addressing common queries",
        "Step-by-step tutorials and how-to guides",
        "Problem-solution content structure",
        "Featured snippets optimization",
      ],
    },
  ]

  const recommendations = [
    {
      title: "Enhance Semantic Structure",
      description:
        "Implement a clearer heading hierarchy with descriptive H1, H2, and H3 tags that better signal content organization to LLMs.",
      difficulty: "Easy",
      impact: "High",
      icon: <LineChart className="h-5 w-5 text-purple-500" />,
    },
    {
      title: "Expand Content Depth",
      description: "Add more comprehensive explanations, examples, and supporting evidence to your key topic pages.",
      difficulty: "Medium",
      impact: "High",
      icon: <TrendingUp className="h-5 w-5 text-purple-500" />,
    },
    {
      title: "Improve Query Intent Matching",
      description:
        "Restructure content to directly address the most common user queries and search intents related to your topics.",
      difficulty: "Medium",
      impact: "Medium",
      icon: <Search className="h-5 w-5 text-purple-500" />,
    },
  ]
  
  
  function isSameDomain( a : string  , b : string ){
    try{
      return new URL(a).hostname === new URL(b).hostname ;
    }catch{
      return false;
    }
  }

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  async function handleAnalyze() {
    if (!url) {
      toast.error("Please enter a valid URL")
      return
    }

    setIsLoading(true)
    setResults([]);
    localStorage.setItem("url", url)
    const response = await fetch(`/api/process?url=${encodeURIComponent(url)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      }
    })

      try {
        const res = await fetch("/api/process", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });
        if (!res.ok) {
          throw new Error("Server error");
        }
        const data = await res.json();
        setResults(data.results || []);
        
        // Calculate citation frequency
        const citations: Record<string, number> = {};
        const uniqueCitations = new Set<string>();
        
        data.results?.forEach((result: any) => {
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
        setIsLoading(false);
      }
    }

    

  

  // const handleViewAll = (section: string) => {
  //   setActiveTab(section === "competitors" ? "competitors" : "recommendations")
  //   // toast({
  //   //   title: `Viewing All ${section === "competitors" ? "Competitors" : "Recommendations"}`,
  //   //   description: `Showing detailed ${section === "competitors" ? "competitor" : "recommendation"} information`,
  //   // })
  // }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex-1">
        <DashboardHeader currentUrl={url} />

        <div className="container pt-6 max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">Website Analysis Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive analysis and insights for {url}</p>
        </div>

        <DashboardShell>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="competitors">Competitors</TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                <TabsTrigger value="content">Content Analysis</TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2">
                <ExportReportDialog />
                <ScheduleRefreshDialog />
              </div>
            </div>

            <TabsContent value="overview" className="space-y-6">
              <motion.div
                className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                {/* Website Info Card */}
                <motion.div variants={fadeIn}>
                  <Card className="border-purple-100 dark:border-purple-900/20 h-full">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-medium">Website Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Website URL</label>
                        <div className="flex mt-1.5">
                          <Input
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="rounded-r-none focus-visible:ring-purple-500"
                          />
                          <Button
                            className="rounded-l-none bg-purple-600 hover:bg-purple-700"
                            onClick={handleAnalyze}
                          >
                            Analyze
                          </Button>
                        </div>
                      </div>
                      {/* <div>
                        <label className="text-sm font-medium text-muted-foreground">Business Description</label>
                        <Textarea
                          value={businessDesc}
                          onChange={(e) => setBusinessDesc(e.target.value)}
                          className="mt-1.5 resize-none focus-visible:ring-purple-500"
                          rows={3}
                        />
                      </div> */}
                    </CardContent>
                  </Card>
                </motion.div>

                {/* AI Score Card */}
                <motion.div variants={fadeIn}>
                  <Card className="border-purple-100 dark:border-purple-900/20 h-full">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-medium">LLM Visibility Score</CardTitle>
                      <CardDescription>How well LLMs understand your content</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center pt-4">
                      <CircularProgressBar
                        percentage={aiScore}
                        size={160}
                        strokeWidth={12}
                        circleColor="rgb(147, 51, 234)"
                        textColor="text-purple-600 dark:text-purple-400"
                      />
                      {/* <div className="mt-4 grid grid-cols-3 w-full gap-2 text-center">
                        <div>
                          <p className="text-xs text-muted-foreground">Semantic</p>
                          <p className="font-medium text-sm">82%</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Context</p>
                          <p className="font-medium text-sm">75%</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Relevance</p>
                          <p className="font-medium text-sm">79%</p>
                        </div>
                      </div>
                      <div className="mt-4 w-full">
                        <div className="grid grid-cols-2 gap-2 text-center text-xs">
                          <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-2">
                            <p className="text-muted-foreground">Last Updated</p>
                            <p className="font-medium">2 hours ago</p>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-2">
                            <p className="text-muted-foreground">Trend</p>
                            <p className="font-medium text-green-500">+5.2%</p>
                          </div>
                        </div>
                      </div> */}
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>

              {/* Top Competitors Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="border-purple-100 dark:border-purple-900/20">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Top 6 Competitors</CardTitle>
                        <CardDescription>Websites with similar content and audience</CardDescription>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1"
                        // onClick={() => handleViewAll("competitors")}
                      >
                        <Users className="h-4 w-4" />
                        View All
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {competitors.map((competitor, index) => (
                        <CompetitorCard key={index} competitor={competitor} />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* What Are They Doing Right Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="border-purple-100 dark:border-purple-900/20">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>What Are They Doing Right?</CardTitle>
                        <CardDescription>Key insights from top-performing competitors</CardDescription>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1"
                        // onClick={() =>
                          // toast({
                          //   title: "Viewing Details",
                          //   description: "Showing detailed competitor insights",
                          // })
                        // }
                      >
                        <Zap className="h-4 w-4" />
                        View Details
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                      {insights.map((insight, index) => (
                        <InsightCard key={index} insight={insight} />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* What You Should Do Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card className="border-purple-100 dark:border-purple-900/20">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>What You Should Do?</CardTitle>
                        <CardDescription>Actionable recommendations to improve your LLM ranking</CardDescription>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1"
                        // onClick={() => handleViewAll("recommendations")}
                      >
                        <Lightbulb className="h-4 w-4" />
                        View All
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                      {recommendations.map((recommendation, index) => (
                        <RecommendationCard key={index} recommendation={recommendation} />
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-center border-t pt-6">
                    <ActionPlanDialog />
                  </CardFooter>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="competitors">
              <Card>
                <CardHeader>
                  <CardTitle>Competitor Analysis</CardTitle>
                  <CardDescription>Detailed comparison with your top competitors</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {competitors.map((competitor, index) => (
                      <CompetitorCard key={index} competitor={competitor} />
                    ))}
                    <Card className="flex items-center justify-center p-6 border-dashed border-2 border-gray-200 dark:border-gray-700">
                      <Button
                        variant="outline"
                        // onClick={() =>
                        //   toast({
                        //     title: "Add Competitor",
                        //     description: "Feature coming soon",
                        //   })
                        // }
                      >
                        Add Competitor
                      </Button>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recommendations">
              <Card>
                <CardHeader>
                  <CardTitle>Recommendations</CardTitle>
                  <CardDescription>Detailed action items to improve your LLM ranking</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[...recommendations, ...recommendations].map((recommendation, index) => (
                      <RecommendationCard key={index} recommendation={recommendation} />
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center border-t pt-6">
                  <ActionPlanDialog />
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="content">
              <Card>
                <CardHeader>
                  <CardTitle>Content Analysis</CardTitle>
                  <CardDescription>In-depth analysis of your website content</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                    <Button
                      // onClick={() =>
                      //   toast({
                      //     title: "Content Analysis",
                      //     description: "This feature is coming soon",
                      //   })
                      // }
                    >
                      Run Content Analysis
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </DashboardShell>
      </div>

      {/* <Toaster /> */}
    </div>
  )
}
