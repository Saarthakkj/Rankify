import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface InsightCardProps {
  insight: {
    title: string
    description: string
    score: number
  }
}

export function InsightCard({ insight }: InsightCardProps) {
  return (
    <Card className="overflow-hidden border-gray-200 dark:border-gray-800 hover:border-purple-200 dark:hover:border-purple-800 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">{insight.title}</h3>
          <span className={`text-sm font-semibold ${getScoreTextColorClass(insight.score)}`}>{insight.score}%</span>
        </div>
        <Progress value={insight.score} className="h-1.5 mb-3" />
        <p className="text-sm text-muted-foreground">{insight.description}</p>
      </CardContent>
    </Card>
  )
}

function getScoreTextColorClass(score: number): string {
  if (score >= 90) return "text-green-500"
  if (score >= 80) return "text-emerald-500"
  if (score >= 70) return "text-yellow-500"
  if (score >= 60) return "text-orange-500"
  return "text-red-500"
}
