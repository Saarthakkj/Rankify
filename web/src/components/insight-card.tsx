import { Card, CardContent } from "@/components/ui/card"
import { ExternalLink } from "lucide-react"

interface InsightCardProps {
  insight: {
    title: string
    website: string
    url: string
    description: string
    // examples: string[]
  }
}

export function InsightCard({ insight }: InsightCardProps) {
  return (
    <Card className="overflow-hidden border-gray-200 dark:border-gray-800 hover:border-purple-200 dark:hover:border-purple-800 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-1">
          {/* <h3 className="font-medium">{insight.title}</h3> */}
          <a
            href={insight.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1  text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
          >
            {insight.website}
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
        <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
        {/* <div className="space-y-2">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Key Strategies:</h4>
          <ul className="space-y-1">
            {insight.examples.map((example, index) => (
              <li key={index} className="flex items-start gap-2 text-xs">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 flex-shrink-0"></div>
                <span className="text-muted-foreground">{example}</span>
              </li>
            ))}
          </ul>
        </div> */}
      </CardContent>
    </Card>
  )
}
