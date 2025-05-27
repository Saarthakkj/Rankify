import type React from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"

interface RecommendationCardProps {
  recommendation: {
    title: string
    description: string
    difficulty: string
    impact: string
    icon: React.ReactNode
  }
}

export function RecommendationCard({ index, recommendation }: any) {
  return (
    <Card className="overflow-hidden border-gray-200 dark:border-gray-800 hover:border-purple-200 dark:hover:border-purple-800 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start gap-3 mb-3">
          {/* <div className="bg-purple-100 dark:bg-purple-900/20 p-2 rounded-full">{recommendation.icon}</div> */}
          <div>
            {/* <h3 className="font-medium">{index}</h3> */}
            {/* <div className="flex gap-2 mt-1">
              <Badge variant="outline" className={`text-xs ${getDifficultyClass(recommendation.difficulty)}`}>
                {recommendation.difficulty}
              </Badge>
              <Badge variant="outline" className={`text-xs ${getImpactClass(recommendation.impact)}`}>
                {recommendation.impact} Impact
              </Badge>
            </div> */}
          </div>
        </div>
        <p className="text-sm text-accent-foreground">{recommendation}</p>
      </CardContent>
      {/* <CardFooter className="p-4 pt-0">
        <Button variant="outline" size="sm" className="w-full">
          View Details <ArrowRight className="ml-1 h-3.5 w-3.5" />
        </Button>
      </CardFooter> */}
    </Card>
  )
}

function getDifficultyClass(difficulty: string): string {
  switch (difficulty.toLowerCase()) {
    case "easy":
      return "text-green-500 border-green-200 dark:border-green-900"
    case "medium":
      return "text-yellow-500 border-yellow-200 dark:border-yellow-900"
    case "hard":
      return "text-red-500 border-red-200 dark:border-red-900"
    default:
      return ""
  }
}

function getImpactClass(impact: string): string {
  switch (impact.toLowerCase()) {
    case "high":
      return "text-purple-500 border-purple-200 dark:border-purple-900"
    case "medium":
      return "text-blue-500 border-blue-200 dark:border-blue-900"
    case "low":
      return "text-gray-500 border-gray-200 dark:border-gray-900"
    default:
      return ""
  }
}
