import type React from "react"
interface DashboardShellProps {
  children: React.ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  return <div className="container flex-1 space-y-6 py-6 max-w-7xl mx-auto">{children}</div>
}
