"use client"

import { useState } from "react"
import { Download, Loader2 } from "lucide-react"
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

export function ExportReportDialog() {
  const [open, setOpen] = useState(false)
  const [format, setFormat] = useState("pdf")
  const [isLoading, setIsLoading] = useState(false)

  const handleExport = () => {
    setIsLoading(true)

    // Simulate export process
    setTimeout(() => {
      setIsLoading(false)
      setOpen(false)

      toast("Report Exported")
    }, 2000)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Export Report
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Export Report</DialogTitle>
          <DialogDescription>Choose a format to export your analysis report.</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <RadioGroup value={format} onValueChange={setFormat} className="gap-6">
            <div className="flex items-start space-x-3 space-y-0">
              <RadioGroupItem value="pdf" id="pdf" />
              <Label htmlFor="pdf" className="flex flex-col space-y-1 font-normal">
                <span className="font-medium">PDF Document</span>
                <span className="text-xs text-muted-foreground">
                  Export as a professional PDF document with charts and tables.
                </span>
              </Label>
            </div>
            <div className="flex items-start space-x-3 space-y-0">
              <RadioGroupItem value="csv" id="csv" />
              <Label htmlFor="csv" className="flex flex-col space-y-1 font-normal">
                <span className="font-medium">CSV Spreadsheet</span>
                <span className="text-xs text-muted-foreground">
                  Export raw data as CSV for further analysis in spreadsheet software.
                </span>
              </Label>
            </div>
            <div className="flex items-start space-x-3 space-y-0">
              <RadioGroupItem value="json" id="json" />
              <Label htmlFor="json" className="flex flex-col space-y-1 font-normal">
                <span className="font-medium">JSON Data</span>
                <span className="text-xs text-muted-foreground">
                  Export as JSON for developers or data integration.
                </span>
              </Label>
            </div>
          </RadioGroup>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={isLoading} className="bg-purple-600 hover:bg-purple-700">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Export
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
