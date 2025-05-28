"use client"

import { useState } from "react"
import { Calendar, Loader2 } from "lucide-react"
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ScheduleRefreshDialog() {
  const [open, setOpen] = useState(false)
  const [frequency, setFrequency] = useState("weekly")
  const [day, setDay] = useState("monday")
  const [isLoading, setIsLoading] = useState(false)

  const handleSchedule = () => {
    setIsLoading(true)

    // Simulate scheduling process
    setTimeout(() => {
      setIsLoading(false)
      setOpen(false)

      toast("Refresh Scheduled")
    }, 1500)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Schedule Refresh
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Schedule Analysis Refresh</DialogTitle>
          <DialogDescription>Set up automatic refreshes of your website analysis.</DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <RadioGroup value={frequency} onValueChange={setFrequency} className="gap-4">
            <div className="flex items-start space-x-3 space-y-0">
              <RadioGroupItem value="daily" id="daily" />
              <Label htmlFor="daily" className="flex flex-col space-y-1 font-normal">
                <span className="font-medium">Daily</span>
                <span className="text-xs text-muted-foreground">Refresh your analysis every day</span>
              </Label>
            </div>
            <div className="flex items-start space-x-3 space-y-0">
              <RadioGroupItem value="weekly" id="weekly" />
              <Label htmlFor="weekly" className="flex flex-col space-y-1 font-normal">
                <span className="font-medium">Weekly</span>
                <span className="text-xs text-muted-foreground">Refresh your analysis once a week</span>
              </Label>
            </div>
            <div className="flex items-start space-x-3 space-y-0">
              <RadioGroupItem value="monthly" id="monthly" />
              <Label htmlFor="monthly" className="flex flex-col space-y-1 font-normal">
                <span className="font-medium">Monthly</span>
                <span className="text-xs text-muted-foreground">Refresh your analysis once a month</span>
              </Label>
            </div>
          </RadioGroup>

          {frequency === "weekly" && (
            <div className="grid gap-2 pt-2">
              <Label htmlFor="day">Day of the week</Label>
              <Select value={day} onValueChange={setDay}>
                <SelectTrigger id="day">
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monday">Monday</SelectItem>
                  <SelectItem value="tuesday">Tuesday</SelectItem>
                  <SelectItem value="wednesday">Wednesday</SelectItem>
                  <SelectItem value="thursday">Thursday</SelectItem>
                  <SelectItem value="friday">Friday</SelectItem>
                  <SelectItem value="saturday">Saturday</SelectItem>
                  <SelectItem value="sunday">Sunday</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {frequency === "monthly" && (
            <div className="grid gap-2 pt-2">
              <Label htmlFor="date">Date of the month</Label>
              <Select defaultValue="1">
                <SelectTrigger id="date">
                  <SelectValue placeholder="Select date" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 28 }, (_, i) => (
                    <SelectItem key={i} value={(i + 1).toString()}>
                      {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSchedule} disabled={isLoading} className="bg-purple-600 hover:bg-purple-700">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Scheduling...
              </>
            ) : (
              <>
                <Calendar className="mr-2 h-4 w-4" />
                Schedule
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
