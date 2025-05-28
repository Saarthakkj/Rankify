"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "motion/react"
import { LineChart, Lightbulb, Search, TrendingUp, Users, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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
import SimpleLoadingWithText from "@/components/Loader"
import generatePDF, { usePDF } from 'react-to-pdf';


export default function DashboardPage() {
  const [url, setUrl] = useState(() => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem("url") || "example.com";
  }
  return "example.com"; // fallback for SSR or non-browser environments
});
  const [results, setResults] = useState([])
  const [citationFrequency, setCitationFrequency] = useState<Record<string, number>>({})
  const [error, setError] = useState<string | null>(null)
  const [businessDesc, setBusinessDesc] = useState("AI-powered content optimization platform")
  const hasNotified = useRef(false)
  const [processBCalls, setProcessBCalls] = useState(0)
  const [aiScore, setAiScore] = useState(78)
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(false)
  const [competitors, setCompetitors] = useState({
    "Forethought": 20,
    "Zendesk": 19,
    "Ada": 12,
    "chatbase": 0
})
  const [whatTheyAreDoingRight, setWhatTheyAreDoingRight] = useState([
    {
        url: "https://www.health.harvard.edu/blog/what-are-the-real-risks-of-e-cigarettes-2020010818604",
        optimized_content: "There is also substantial — and growing — evidence that e-cigarettes pose other health risks. Here are some examples:\n\nIn addition to nicotine, e-cigarettes contain other harmful substances. Vaping liquid contains a solvent, often glycerin and/or propylene glycol, that creates the aerosol when heated. Although these solvents are considered safe when used in foods and cosmetics, their safety when inhaled is not clear. When heated and inhaled, propylene glycol can irritate the airways and eyes. Glycerin when heated can be converted to a chemical called acrolein, which can damage the lungs and blood vessels. In addition, e-cigarette vapor contains other substances, such as heavy metals, volatile organic compounds, and cancer-causing agents, at concentrations higher than in ambient air, although lower than in cigarette smoke. These substances have been linked to lung and heart disease.\n\nVaping can cause lung damage. Cases of serious lung damage requiring hospitalization and even leading to death have been reported in people who use e-cigarettes. These cases, collectively called EVALI (e-cigarette or vaping product use-associated lung injury), are believed to be caused by a substance in vaping liquid called vitamin E acetate, which is especially common in products that contain THC (tetrahydrocannabinol). EVALI cases have declined recently, but some cases are still occurring, and the long-term consequences of inhaling vitamin E acetate are not yet known."
    },
    {
        url: "https://www.nerdwallet.com/article/finance/how-to-budget",
        optimized_content: "Budgeting is simply creating a plan for how you will spend and save your money. A budget is essential for taking control of your finances and setting yourself up for financial success. Following a budget can help you pay off debt, save money and afford the things you want.\n\nReady to make a budget? Here’s a five-step guide on how to budget your money. Remember to choose a budgeting strategy that works for you. It doesn’t have to be painful or complex.\n\n1. Calculate your monthly income. This is the amount of money you expect to bring in each month after taxes. Make sure you're working with your actual take-home pay.\n\n2. Track your spending. See where your money is going for a month. You can use a simple spreadsheet, notebook or budgeting app to do this. This step is critical for understanding your spending habits and identifying areas where you can cut back.\n\n3. Create a spending plan. Now it’s time to categorize your expenses and allocate funds based on your income and spending habits. Be realistic and make sure your essential expenses (like rent, utilities and groceries) are covered first.\n\n4. Monitor and adjust regularly. A budget isn’t a one-time thing. Review your spending regularly and adjust your budget as needed to reflect changes in income, expenses or financial goals.\n\n5. Set financial goals. What do you want your money to do for you? Whether it’s paying off debt, saving for a down payment or building an emergency fund, having clear goals will give your budget purpose and keep you motivated."
    },
    {
        url: "https://www.travelandleisure.com/travel-guide/london/things-to-do",
        optimized_content: "There's no shortage of world-class museums and galleries in London, many of which are free to enter. The British Museum, with its vast collection of artifacts from around the globe, and the National Gallery, home to a staggering array of European paintings, are essential stops. Art lovers should also visit the Tate Modern for modern and contemporary art and the Victoria and Albert Museum (V&A) for decorative arts and design.\n\nExploring London's neighborhoods is another excellent way to experience the city. Each area has its own distinct character, from the trendy streets of Shoreditch and the bohemian vibe of Notting Hill to the upscale boutiques of Chelsea and the historic charm of Hampstead. Wander through borough markets like Borough Market or Columbia Road Flower Market for a taste of local life and unique finds.\n\nFor a break from the urban bustle, head to one of London's many parks. Hyde Park, Regent's Park, and Richmond Park offer vast green spaces perfect for strolling, picnicking, or simply relaxing. Richmond Park is particularly known for its herds of deer roaming freely."
    }
])
const [whatYouShouldDo, setWhatYouShouldDo] = useState([
    "Here are recommended changes to optimize your content for Generative Engine Optimization (GEO):",
    "*   **Structure content with clear headings and explicit questions/answers:** Organize information using H2, H3 tags, and consider incorporating sections formatted as \"Q: [User question]? A: [Your answer].\" or clear introductory sentences that directly address potential user queries (e.g., \"Here's how Chatbase streamlines customer support...\", \"Benefits of using AI agents include...\"). This helps generative AI extract specific answers efficiently.",
    "*   **Incorporate statistics and quantifiable results directly into relevant benefit statements:** Instead of just listing \"Advanced reporting,\" integrate metrics like \"Gain insights and optimize agent performance with detailed analytics, leading to an average X% improvement in resolution time.\" Mentioning \"9000+ businesses worldwide\" is a good start; integrate similar data points where possible (e.g., support deflection rates, time saved).",
    "*   **Add external citations or references where applicable:** While testimonials and certifications provide authority, consider citing industry reports, market research, or academic papers that support claims about AI agent effectiveness, security standards, or the future of customer service. This adds a layer of verifiable authority similar to academic or news sources.",
    "*   **Ensure technical terms are clearly explained for a broad audience:** While using terms like \"LLMs,\" \"RAG,\" and \"agentic approach\" is necessary, provide concise, easy-to-understand definitions or explanations within the text or link to a glossary. This makes the content accessible to non-technical users and ensures generative AI can accurately explain complex concepts.",
    "*   **Refine content fluency by minimizing unnecessary clutter:** Ensure the core textual content is dominant and easily readable, reducing reliance on image descriptions, video placeholders, or repetitive elements in the scraped text format. Focus on smooth transitions between ideas and sections.",
    "*   **Expand on specific use cases and benefits with concrete examples:** Instead of general statements like \"solve your customers' hardest problems,\" provide short, real-world examples or scenarios illustrating how specific features (like real-time data sync or actions) deliver tangible value (e.g., \"Chatbase helps customers track their order status instantly by connecting to your order management system,\" or \"Allow agents to update customer details directly within the chat by integrating with your CRM.\").",
    "*   **Consider adding concise \"How-To\" or \"Getting Started\" summaries:** Simple, step-by-step instructions on core processes (e.g., \"How to build your first AI agent in 5 steps\") provide highly actionable content that generative AI can easily summarize for users seeking guidance."
])

   const { toPDF, targetRef } = usePDF({filename: 'page.pdf'});


  // const [whatTheyAreDoingRight, setWhatTheyAreDoingRight] = useState([])
  // const [whatYouShouldDo, setWhatYouShouldDo] = useState([])
  // const [competitors, setCompetitors] = useState({})



  // Mock data for the dashboard
  // const competitors = [
  //   { name: "contentai.com", score: 92, strengths: ["Semantic structure", "Topic coverage"] },
  //   { name: "aiwriter.io", score: 87, strengths: ["Content depth", "Query matching"] },
  //   { name: "rankgenius.com", score: 85, strengths: ["Technical SEO", "Content freshness"] },
  //   { name: "llmoptimize.net", score: 82, strengths: ["Entity recognition", "Contextual relevance"] },
  //   { name: "semanticboost.ai", score: 79, strengths: ["Keyword optimization", "Content structure"] },
  //   { name: "aicontentpro.com", score: 76, strengths: ["Topic clustering", "Content readability"] },
  // ]

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

  async function notifyCitationChange(freq: Record<string, number>) {
    setProcessBCalls((c) => c+1); 
    const citations = Object.keys(freq);
    const response = await fetch('/api/process-b', 
      { method: 'POST', body: JSON.stringify({ citations_list: citations, url }) }
    );

    const data = await response.json();
    setWhatTheyAreDoingRight(data.what_good_competitors);
    setCompetitors(data.sortedHashmap)
    setWhatYouShouldDo(data.response_data);

    if(!response.ok ) throw new Error("error in response of process-b"); 
    console.log("process-b response : ", data); 
    toast.success("Competitor analysis and recommendations updated successfully")
    setIsLoading(false);
  }

  async function handleAnalyze() {
    if (!url) {
      toast.error("Please enter a valid URL")
      return
    }

    setIsLoading(true)
    setResults([]);
    localStorage.setItem("url", url)
    // const response = await fetch(`/api/process?url=${encodeURIComponent(url)}`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   }
    // })

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

        console.log("process response : ", data);
        
        
        // Calculate citation frequency
        const citations: Record<string, number> = {};
        const uniqueCitations = new Set<string>();
        
        data.results?.forEach((result: any) => {
          // Filter out duplicate citations by URL domain
          const resultCitations = result.citations || [];
          // @ts-expect-error type of citation is not defined
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
          // @ts-expect-error type of citation is not defined
          filteredCitations.forEach(citation => {
            citations[citation] = (citations[citation] || 0) + 1;
          });
        });
        
        setCitationFrequency(citations);
      } catch (err: any) {
        setIsLoading(false);
        setError(err.message || "Unknown error");
      } 
    }

    useEffect(() => {
        // console.log("\n----CALLED : \n")
        if (!Object.keys(citationFrequency).length  || hasNotified.current) return;
        hasNotified.current = true; 
        notifyCitationChange(citationFrequency);
      }, [citationFrequency]);
    

  

  // const handleViewAll = (section: string) => {
  //   setActiveTab(section === "competitors" ? "competitors" : "recommendations")
  //   // toast({
  //   //   title: `Viewing All ${section === "competitors" ? "Competitors" : "Recommendations"}`,
  //   //   description: `Showing detailed ${section === "competitors" ? "competitor" : "recommendation"} information`,
  //   // })
  // }
  if (isLoading) {
    return (
      // <div className="flex items-center justify-center min-h-screen">
      //   <div className="text-center">
      //     <h2 className="text-2xl font-bold mb-4">Analyzing {url}...</h2>
      //     <p className="text-muted-foreground">This may take a few moments.</p>
      //   </div>
      // </div>
      <SimpleLoadingWithText url={url} />
    )
    
  }

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
                {/* <TabsTrigger value="recommendations">Recommendations</TabsTrigger> */}
                {/* <TabsTrigger value="content">Content Analysis</TabsTrigger> */}
              </TabsList>

              <div className="flex items-center gap-2">
                {/* <ExportReportDialog toPdf={toPDF} />
                 */}
                 <Button variant="outline" size="sm" onClick={() => generatePDF(targetRef, {filename: 'page.pdf'})}>Export Report</Button>
                <ScheduleRefreshDialog />
              </div>
            </div>

            <TabsContent value="overview" className="space-y-6" ref={targetRef}>
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
                      {/* {competitors.map((competitor, index) => (
                        <CompetitorCard key={index} competitor={competitor} />
                      ))} */}
                      {Object.entries(competitors).map(([name, competitor], index) => ( 
                        <CompetitorCard key={index} name={name} competitor={competitor} />
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
                      {/* {insights.map((insight, index) => (
                        <InsightCard key={index} insight={insight} />
                      ))} */}
                      {whatTheyAreDoingRight.map((insight, index) => (
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
                      {/* {recommendations.map((recommendation, index) => (
                        <RecommendationCard key={index} recommendation={recommendation} />
                      ))} */}
                      {whatYouShouldDo.map((recommendation, index) => (
                        <RecommendationCard key={index} index={index} recommendation={recommendation} />
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
                    {/* {competitors.map((competitor, index) => (
                      <CompetitorCard key={index} competitor={competitor} />
                    ))} */}
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
