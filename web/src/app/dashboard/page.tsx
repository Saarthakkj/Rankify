"use client"

import { useState } from "react"
import { motion } from "motion/react"
import { ArrowRight, BarChart3, LineChart, Lightbulb, Search, TrendingUp, Users, Zap } from "lucide-react"
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

export default function DashboardPage() {
  const [url, setUrl] = useState("example.com")
  const [businessDesc, setBusinessDesc] = useState("AI-powered content optimization platform")
  const [aiScore, setAiScore] = useState(78)

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
      title: "Semantic Structure",
      description:
        "Competitors use clear hierarchical heading structures with descriptive H1, H2, and H3 tags that help LLMs understand content organization.",
      score: 92,
    },
    {
      title: "Content Depth",
      description:
        "Top competitors provide comprehensive coverage of topics with detailed explanations, examples, and supporting evidence.",
      score: 87,
    },
    {
      title: "Query Intent Matching",
      description:
        "Leading sites structure content to directly address common user queries and search intents related to their topics.",
      score: 85,
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 ">
      <div className="flex-1">
        <DashboardHeader currentUrl={url} />


        <DashboardShell>
        <div className="container pt-6 max-w-7xl">
          <h1 className="text-2xl font-bold mb-2">Website Analysis Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive analysis and insights for {url}</p>
        </div>
          <Tabs defaultValue="overview" className="space-y-6">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="competitors">Competitors</TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                <TabsTrigger value="content">Content Analysis</TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  Export Report
                </Button>
                <Button variant="outline" size="sm">
                  Schedule Refresh
                </Button>
              </div>
            </div>

            <TabsContent value="overview" className="space-y-6">
              <motion.div
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                {/* Website Info Card */}
                <motion.div variants={fadeIn}>
                  <Card className="border-purple-100 dark:border-purple-900/20">
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
                          <Button className="rounded-l-none bg-purple-600 hover:bg-purple-700">Update</Button>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Business Description</label>
                        <Textarea
                          value={businessDesc}
                          onChange={(e) => setBusinessDesc(e.target.value)}
                          className="mt-1.5 resize-none focus-visible:ring-purple-500"
                          rows={2}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* AI Score Card */}
                <motion.div variants={fadeIn}>
                  <Card className="border-purple-100 dark:border-purple-900/20">
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
                      <div className="mt-4 grid grid-cols-3 w-full gap-2 text-center">
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
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Ranking Trends Card */}
                <motion.div variants={fadeIn}>
                  <Card className="border-purple-100 dark:border-purple-900/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-medium">Ranking Trends</CardTitle>
                      <CardDescription>Last 30 days performance</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="h-[160px] flex items-center justify-center">
                        <div className="w-full h-full bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
                          <BarChart3 className="h-8 w-8 text-muted-foreground" />
                        </div>
                      </div>
                      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                        <div>
                          <p className="text-xs text-muted-foreground">Visibility</p>
                          <p className="font-medium text-sm text-green-500">+12%</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Queries</p>
                          <p className="font-medium text-sm text-green-500">+8%</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">CTR</p>
                          <p className="font-medium text-sm text-red-500">-3%</p>
                        </div>
                      </div>
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
                      <Button variant="outline" size="sm" className="gap-1">
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
                      <Button variant="outline" size="sm" className="gap-1">
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
                      <Button variant="outline" size="sm" className="gap-1">
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
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      Generate Action Plan <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
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
                  <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                    Competitor analysis content will appear here
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
                  <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                    Recommendations content will appear here
                  </div>
                </CardContent>
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
                    Content analysis will appear here
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </DashboardShell>
      </div>
    </div>
  )
}
