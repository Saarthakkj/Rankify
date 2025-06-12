"use client"

import type React from "react"

import { useTheme } from "next-themes"
import { useState } from "react"
import { motion } from "motion/react"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { toast} from "sonner"
import Image from "next/image"
import { serifFont } from "@/fonts/font"
import { supabase } from "@/lib/supabaseClient"

export default function WaitlistPage() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { theme,setTheme } = useTheme()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !email.includes("@")) {
      toast("Invalid email")
      return
    }
    setIsSubmitting(true)
    const { data, error } = await supabase
      .from('waitlist')
      .insert([{ email }]);

      if (error) {
      console.error(error);
        if (error.code === "23505") {
          toast("You are already on the waitlist!");
          setIsSubmitting(false);
        } else {
          toast("Error adding to waitlist. Please try again later.");
          setIsSubmitting(false);
        }

    } else {
      toast("Successfully added to waitlist! 🎉");
      console.log("Email added to waitlist:", data);
      setIsSubmitting(false);
    }
    
    // Simulate API call
    setIsSubmitting(false)
    setEmail("")
  }

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 `}>
      {/* <Toaster /> */}
        <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        
        className="flex justify-between w-full max-w-5xl items-center mb-8">
            <h1 className={`${serifFont.className} font-serif text-xl font-bold`}>Fluxio</h1>
            {/* <h1>Support us</h1> */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  if (theme === "dark") {
                    setTheme("light")
                  } else {
                    setTheme("dark")
                  }
                }}
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              </div>
              
        </motion.div>
      <motion.div
        className="w-full max-w-md text-center mt-24"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-center gap-2 mb-8">
          {/* <Globe className="h-8 w-8 text-purple-600" /> */}
          {/* <span className="text-2xl font-bold">Rankify</span> */}
        </div>

        <motion.h1
          className={`text-4xl font-bold mb-3 ${serifFont.className} font-serif`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          Join the Waitlist
        </motion.h1>

        <motion.p
          className={`text-xl text-muted-foreground mb-8 ${serifFont.className} font-serif`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <span className="text-purple-600 font-medium">Redefining the SEO industry</span> with AI-powered
          insights
        </motion.p>

        <motion.form
          onSubmit={handleSubmit}
          className="mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 focus-visible:ring-purple-500"
              required
            />
            <Button type="submit" className="h-12 bg-purple-600 hover:bg-purple-700 px-8" disabled={isSubmitting}>
              {isSubmitting ? "Joining..." : "Join Waitlist"}
            </Button>
          </div>
        </motion.form>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.8 }}>
        
           
            <span className="text-sm">For any queries contact <Link href={"https://x.com/ayshtwt"} className="hover:text-purple-500 transition-colors"> @ayshtwt</Link> or <Link href={"https://x.com/curlysaarthak"} className="hover:text-purple-500 transition-colors">@curlysaarthak</Link></span>
        </motion.div>
{/* 
        <motion.div
          className="mt-16 text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <p>Be the first to know when we launch.</p>
          <p className="mt-1">Early access for waitlist members.</p>
        </motion.div> */}
      </motion.div>
    <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
    className="mt-40 mx-auto relative bottom-10 border border-zinc-200 dark:border-zinc-800  rounded-lg overflow-hidden max-w-5xl w-full ">
        <Image 
            src={theme === "dark" ? "/landing.png" : "/landinglight.png"}
            alt={"Landing Page"}
            className="w-full h-auto"
            width={1000}
            height={1000}
            style={{
              maxWidth: "100%",
              height: "auto"
            }}
        />
    </motion.div>
      <motion.div
        className="text-xs text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        © {new Date().getFullYear()} Fluxio. All rights reserved.
      </motion.div>
    </div>
  )
}