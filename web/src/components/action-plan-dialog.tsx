"use client"

import { useState } from "react"
import { ArrowRight, Check, Lightbulb, Loader2, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export function ActionPlanDialog() {
  const [open, setOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isGenerated, setIsGenerated] = useState(false)
  const [selectedOptions, setSelectedOptions] = useState({
    semantic: true,
    content: true,
    technical: true,
    competitor: false,
  })

  const handleGenerate = () => {
    setIsGenerating(true)

    // Simulate generation process
    setTimeout(() => {
      setIsGenerating(false)
      setIsGenerated(true)

      toast("Action Plan Generated")
    }, 3000)
  }

  const handleDownload = () => {
    setOpen(false)

    toast("Action Plan Downloaded")
  }

  const toggleOption = (option: keyof typeof selectedOptions) => {
    setSelectedOptions({
      ...selectedOptions,
      [option]: !selectedOptions[option],
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-purple-600 hover:bg-purple-700">
          Generate Action Plan <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Generate Custom Action Plan</DialogTitle>
          <DialogDescription>
            Create a personalized action plan to improve your website&apos;s LLM ranking.
          </DialogDescription>
        </DialogHeader>

        {!isGenerated ? (
          <>
            <div className="py-4 space-y-4">
              <div className="text-sm font-medium">Include recommendations for:</div>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="semantic"
                    checked={selectedOptions.semantic}
                    onCheckedChange={() => toggleOption("semantic")}
                  />
                  <Label htmlFor="semantic" className="font-normal">
                    Semantic Structure Optimization
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="content"
                    checked={selectedOptions.content}
                    onCheckedChange={() => toggleOption("content")}
                  />
                  <Label htmlFor="content" className="font-normal">
                    Content Depth & Quality
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="technical"
                    checked={selectedOptions.technical}
                    onCheckedChange={() => toggleOption("technical")}
                  />
                  <Label htmlFor="technical" className="font-normal">
                    Technical SEO for LLMs
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="competitor"
                    checked={selectedOptions.competitor}
                    onCheckedChange={() => toggleOption("competitor")}
                  />
                  <Label htmlFor="competitor" className="font-normal">
                    Competitor Benchmarking
                  </Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !Object.values(selectedOptions).some(Boolean)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Lightbulb className="mr-2 h-4 w-4" />
                    Generate Plan
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <div className="py-4 space-y-4">
              <div className="rounded-md bg-green-50 dark:bg-green-900/20 p-4 flex items-start">
                <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-300">Action Plan Ready</h4>
                  <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                    We&apos;ve created a personalized action plan with{" "}
                    {Object.values(selectedOptions).filter(Boolean).length} focus areas to improve your LLM ranking.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Your Action Plan Includes:</h4>
                <ul className="space-y-2 text-sm">
                  {selectedOptions.semantic && (
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-purple-500 mt-0.5" />
                      <span>Semantic structure optimization recommendations</span>
                    </li>
                  )}
                  {selectedOptions.content && (
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-purple-500 mt-0.5" />
                      <span>Content depth and quality improvement strategies</span>
                    </li>
                  )}
                  {selectedOptions.technical && (
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-purple-500 mt-0.5" />
                      <span>Technical SEO optimizations for LLM understanding</span>
                    </li>
                  )}
                  {selectedOptions.competitor && (
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-purple-500 mt-0.5" />
                      <span>Competitive analysis and benchmarking insights</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                View Online
              </Button>
              <Button onClick={handleDownload} className="bg-purple-600 hover:bg-purple-700">
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
