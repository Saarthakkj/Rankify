import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface CompetitorCardProps {
  competitor: {
    name: string
    score: number
    strengths: string[]
  }
}

export function CompetitorCard({ competitor, name }: any) {
  return (
    <Card className="overflow-hidden border-gray-200 dark:border-gray-800 hover:border-purple-200 dark:hover:border-purple-800 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">{name}</h3>
          <span className={`text-sm font-semibold ${getScoreTextColorClass(competitor)}`}>
            {competitor}
          </span>
        </div>
        {/* <div className="flex flex-wrap gap-1.5">
          {competitor.strengths.map((strength, index) => (
            <Badge key={index} variant="outline" className="text-xs bg-gray-50 dark:bg-gray-800">
              {strength}
            </Badge>
          ))}
        </div> */}
      </CardContent>
    </Card>
  )
}



function getScoreTextColorClass(score: number): string {
  if (score >= 4) return "text-green-500"
  if (score >= 3) return "text-emerald-500"
  if (score >= 2) return "text-yellow-500"
  if (score >= 1) return "text-orange-500"
  return "text-red-500"
}
