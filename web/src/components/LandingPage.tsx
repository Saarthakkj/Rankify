"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "motion/react"
import { ArrowRight, BarChart3, Globe, Search, Shield, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

export default function LandingPage() {
  const [url, setUrl] = useState("https://")
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!url) return

    setIsAnalyzing(true)
    // Simulate analysis
    setTimeout(() => {
      setIsAnalyzing(false)
      // In a real app, you would redirect to results or show them
    }, 2000)
  }

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <Globe className="h-6 w-6 text-purple-600" />
            <Link href={"/"}>RankWave</Link>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="#features" className="text-sm font-medium transition-colors hover:text-primary">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium transition-colors hover:text-primary">
              How It Works
            </Link>
            <Link href="#pricing" className="text-sm font-medium transition-colors hover:text-primary">
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <ThemeToggle />
              <Link href={"/dashboard"}>
              
            <Button variant="outline" size="sm" className="hidden md:flex">
              Dashboard
            </Button>
               </Link>
            {/* <Button variant="outline" size="sm" className="hidden md:flex">
              Log in
            </Button>
            <Button size="sm">Sign up</Button> */}
          </div>
        </div>
      </header>

      <main className="flex-1 ">
        <section className="relative  overflow-hidden py-20 md:py-32 bg-gradient-to-b from-white to-purple-50 dark:from-background dark:to-background">
          <div className="container relative">
            <motion.div
              className="grid gap-8 md:grid-cols-2 items-center max-w-7xl mx-auto"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.div className="flex flex-col gap-4 text-center md:text-left" variants={fadeIn}>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                  Discover Your Website&apos;s <span className="text-purple-600">LLM Ranking</span>
                </h1>
                <p className="text-xl text-muted-foreground">
                  Analyze how your website performs in AI-powered search engines and get insights to improve your
                  ranking.
                </p>
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 mt-4">
                  <div className="flex-1">
                    <Input
                      type="url"
                      placeholder="Enter website URL"
                      className="h-12"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="h-12 px-8" disabled={isAnalyzing}>
                    {isAnalyzing ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                          className="mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"
                        />
                        Analyzing...
                      </>
                    ) : (
                      <>Analyze Now</>
                    )}
                  </Button>
                </form>
              </motion.div>
              <motion.div className="relative" variants={fadeIn}>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="relative"
                >
                  <div className="relative rounded-lg shadow-2xl overflow-hidden bg-white dark:bg-gray-800 py-4">
                    <div className="absolute top-0 left-0 right-0 h-12 bg-gray-100 dark:bg-gray-700 flex items-center px-4">
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                      <div className="mx-auto bg-white dark:bg-gray-600 rounded-full px-4 py-1 text-sm text-gray-600 dark:text-gray-200 flex items-center">
                        <Globe className="h-3 w-3 mr-2" />
                        example.com
                      </div>
                    </div>
                    <div className="pt-12 p-4">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                          <h4 className="text-sm font-medium mb-2">LLM Visibility Score</h4>
                          <div className="flex items-end">
                            <span className="text-3xl font-bold text-purple-600">87</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">/100</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-2">
                            <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: "87%" }}></div>
                          </div>
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                          <h4 className="text-sm font-medium mb-2">Content Quality</h4>
                          <div className="flex items-end">
                            <span className="text-3xl font-bold text-blue-600">92</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">/100</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-2">
                            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "92%" }}></div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Semantic Relevance</span>
                          <span className="text-sm font-medium">94%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                          <div className="bg-green-500 h-1.5 rounded-full" style={{ width: "94%" }}></div>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm">Context Understanding</span>
                          <span className="text-sm font-medium">82%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                          <div className="bg-yellow-500 h-1.5 rounded-full" style={{ width: "82%" }}></div>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm">Information Density</span>
                          <span className="text-sm font-medium">76%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                          <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: "76%" }}></div>
                        </div>
                      </div>
                      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <h4 className="text-sm font-medium mb-2">Top Recommendations</h4>
                        <ul className="text-xs space-y-1 text-gray-600 dark:text-gray-300">
                          <li className="flex items-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-600 mr-2"></div>
                            Enhance semantic structure with more descriptive headings
                          </li>
                          <li className="flex items-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-600 mr-2"></div>
                            Add more contextual information about your core topics
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  className="absolute -bottom-6 -right-6 z-[999] bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg"
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full">
                      <BarChart3 className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium">LLM Score</p>
                      <p className="text-2xl font-bold">87/100</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.div
              className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 text-center max-w-7xl mx-auto "
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              {[
                { label: "Websites Analyzed", value: "10M+" },
                { label: "Accuracy Rate", value: "99.8%" },
                { label: "LLM Models", value: "15+" },
                { label: "Happy Customers", value: "50K+" },
              ].map((stat, i) => (
                <motion.div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm" variants={fadeIn}>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section id="features" className="py-20 bg-white dark:bg-background">
          <div className="container">
            <motion.div
              className="text-center max-w-3xl mx-auto mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features for AI-Driven Insights</h2>
              <p className="text-xl text-muted-foreground">
                Understand how AI search engines view and rank your website with our comprehensive analysis tools.
              </p>
            </motion.div>

            <motion.div
              className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              {[
                {
                  icon: <Search className="h-10 w-10 text-purple-600" />,
                  title: "LLM Search Ranking",
                  description:
                    "See exactly how your website ranks in AI-powered search engines and what factors influence your position.",
                },
                {
                  icon: <Zap className="h-10 w-10 text-purple-600" />,
                  title: "Content Optimization",
                  description:
                    "Get actionable recommendations to optimize your content for better AI understanding and higher rankings.",
                },
                {
                  icon: <Shield className="h-10 w-10 text-purple-600" />,
                  title: "Competitor Analysis",
                  description:
                    "Compare your website's performance against competitors and identify opportunities to outrank them.",
                },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
                  variants={fadeIn}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-full w-fit mb-6">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section id="how-it-works" className="py-20 px-4 bg-gray-50 dark:bg-gray-900 max-w-7xl mx-auto">
          <div className="container">
            <motion.div
              className="text-center max-w-3xl mx-auto mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
              <p className="text-xl text-muted-foreground">
                Get comprehensive insights about your website&apos;s performance in AI search in just three simple steps.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-12 items-center mb-20 ">
              <motion.div
                className="aspect-video rounded-xl overflow-hidden shadow-xl"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
              >
                <div className="relative pb-[56.25%] h-0 overflow-hidden max-w-full">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                    title="Product Demo Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </motion.div>

              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
              >
                <h3 className="text-2xl font-bold">Watch Our Product Demo</h3>
                <p className="text-muted-foreground">
                  This video walks you through how our platform analyzes your website and provides actionable insights
                  to improve your LLM ranking.
                </p>
                <ul className="space-y-3">
                  {[
                    "See the analysis process in real-time",
                    "Understand how we measure LLM visibility",
                    "Learn how to implement our recommendations",
                    "Discover advanced features for power users",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <svg
                        className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Button className="mt-4">Learn More</Button>
              </motion.div>
            </div>

            <motion.div
              className="grid md:grid-cols-3 gap-8 relative"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >

              {[
                {
                  step: "01",
                  title: "Enter Your URL",
                  description: "Simply paste your website URL into our analyzer and let our system start working.",
                },
                {
                  step: "02",
                  title: "AI Analysis",
                  description: "Our advanced AI models analyze how LLMs interpret and rank your website content.",
                },
                {
                  step: "03",
                  title: "Get Insights",
                  description: "Receive detailed reports and actionable recommendations to improve your ranking.",
                },
              ].map((step, i) => (
                <motion.div key={i} className="flex flex-col items-center text-center" variants={fadeIn}>
                  <motion.div
                    className="w-16 h-16 rounded-full bg-purple-600 text-white flex items-center justify-center text-xl font-bold mb-6"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {step.step}
                  </motion.div>
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section id="pricing" className="py-20 bg-white dark:bg-background">
          <div className="container">
            <motion.div
              className="text-center max-w-3xl mx-auto mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
              <p className="text-xl text-muted-foreground">
                Choose the plan that fits your needs. No hidden fees or long-term commitments.
              </p>
            </motion.div>

            <motion.div
              className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              {[
                {
                  name: "Starter",
                  price: "$29",
                  description: "Perfect for small websites and blogs",
                  features: [
                    "5 website analyses per month",
                    "Basic LLM ranking insights",
                    "Content optimization tips",
                    "Email support",
                  ],
                  cta: "Get Started",
                  highlighted: false,
                },
                {
                  name: "Professional",
                  price: "$79",
                  description: "Ideal for growing businesses",
                  features: [
                    "20 website analyses per month",
                    "Advanced LLM ranking insights",
                    "Competitor analysis",
                    "Content optimization recommendations",
                    "Priority support",
                  ],
                  cta: "Get Started",
                  highlighted: true,
                },
                {
                  name: "Enterprise",
                  price: "$199",
                  description: "For large websites and agencies",
                  features: [
                    "Unlimited website analyses",
                    "Comprehensive LLM ranking insights",
                    "Advanced competitor analysis",
                    "Custom optimization strategies",
                    "API access",
                    "Dedicated support",
                  ],
                  cta: "Contact Sales",
                  highlighted: false,
                },
              ].map((plan, i) => (
                <motion.div
                  key={i}
                  className={`rounded-xl overflow-hidden border ${
                    plan.highlighted
                      ? "border-purple-200 dark:border-purple-800 shadow-lg"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                  variants={fadeIn}
                  whileHover={{ y: -10, transition: { duration: 0.2 } }}
                >
                  <div
                    className={`p-8 ${
                      plan.highlighted ? "bg-purple-50 dark:bg-purple-900/20" : "bg-white dark:bg-gray-800"
                    }`}
                  >
                    <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                    <div className="flex items-baseline mb-4">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground ml-2">/month</span>
                    </div>
                    <p className="text-muted-foreground mb-6">{plan.description}</p>
                    <Button
                      className={`w-full ${plan.highlighted ? "bg-purple-600 hover:bg-purple-700" : ""}`}
                      variant={plan.highlighted ? "default" : "outline"}
                    >
                      {plan.cta}
                    </Button>
                  </div>
                  <div className="p-8 h-full bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
                    <ul className="space-y-3">
                      {plan.features.map((feature, j) => (
                        <li key={j} className="flex items-center gap-2">
                          <svg
                            className="h-5 w-5 text-green-500 flex-shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="py-20 bg-purple-600 text-white">
          <div className="container">
            <motion.div
              className="max-w-3xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Improve Your LLM Ranking?</h2>
              <p className="text-xl mb-8 text-purple-100">
                Join thousands of websites already optimizing for AI search engines.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                  Get Started Free
                </Button>
                <Button size="lg" variant="outline" className="text-white bg-purple-600 border-white hover:bg-purple-700">
                  Schedule Demo <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="border-t py-12 px-3 bg-gray-50 dark:bg-gray-900">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 font-bold text-xl mb-4">
                <Globe className="h-6 w-6 text-purple-600" />
                <span>RankWave</span>
              </div>
              <p className="text-muted-foreground mb-4">Helping websites optimize for AI-powered search engines.</p>
              {/* TO ADD LOGOS HERE */}
              {/* <div className="flex gap-4">
                {["twitter", "facebook", "instagram", "linkedin"].map((social) => (
                  <Link key={social} href="#" className="text-muted-foreground hover:text-purple-600">
                    <span className="sr-only">{social}</span>
                    <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                  </Link>
                ))}
              </div> */}
            </div>
            {[
              {
                title: "Product",
                links: ["Features", "Pricing", "Case Studies", "Reviews", "Updates"],
              },
              {
                title: "Company",
                links: ["About", "Careers", "Contact", "Blog", "Press"],
              },
              {
                title: "Resources",
                links: ["Documentation", "Help Center", "API", "Community", "Partners"],
              },
            ].map((column, i) => (
              <div key={i}>
                <h3 className="font-bold mb-4">{column.title}</h3>
                <ul className="space-y-3">
                  {column.links.map((link, j) => (
                    <li key={j}>
                      <Link href="#" className="text-muted-foreground hover:text-purple-600">
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-muted-foreground">
            <p>© {new Date().getFullYear()} RankWave. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
