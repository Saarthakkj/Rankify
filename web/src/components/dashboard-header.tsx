"use client"

import type React from "react"

import { useState } from "react"
import { BarChart3, ChevronDown, Globe, Home, LineChart, Settings, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface DashboardHeaderProps {
  children?: React.ReactNode
  currentUrl?: string
}

export function DashboardHeader({ children, currentUrl = "example.com" }: DashboardHeaderProps) {
  const [activeItem, setActiveItem] = useState("dashboard")

  const navItems = [
    { name: "Dashboard", value: "dashboard", icon: Home },
    { name: "Analytics", value: "analytics", icon: BarChart3 },
    { name: "Competitors", value: "competitors", icon: Users },
    { name: "Rankings", value: "rankings", icon: LineChart },
    { name: "Settings", value: "settings", icon: Settings },
  ]

  return (
    <header className="sticky px-4 top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex items-center gap-2 mr-6">
          <Globe className="h-6 w-6 text-purple-600" />
          <Link href={"/"} className="font-bold text-lg hidden sm:inline-block">RankInsight</Link>
        </div>

        <nav className="flex items-center gap-1 md:gap-2">
          {/* {navItems.map((item) => (
            <Button
              key={item.value}
              variant="ghost"
              size="sm"
              className={cn(
                "hidden sm:flex gap-1 h-9",
                activeItem === item.value
                  ? "bg-purple-50 text-purple-700 hover:bg-purple-100 hover:text-purple-900 dark:bg-purple-900/20 dark:text-purple-400 dark:hover:bg-purple-900/30 dark:hover:text-purple-300"
                  : "",
              )}
              onClick={() => setActiveItem(item.value)}
            >
              <item.icon className="h-4 w-4" />
              <span className="hidden md:inline-block">{item.name}</span>
            </Button>
          ))} */}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="sm:hidden">
                <Home className="h-4 w-4 mr-1" />
                Menu
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {navItems.map((item) => (
                <DropdownMenuItem
                  key={item.value}
                  className={cn(
                    activeItem === item.value
                      ? "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400"
                      : "",
                  )}
                  onClick={() => setActiveItem(item.value)}
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1 hidden sm:flex">
                <Globe className="h-4 w-4" />
                {currentUrl}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>example.com</DropdownMenuItem>
              <DropdownMenuItem>mywebsite.com</DropdownMenuItem>
              <DropdownMenuItem>newproject.org</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <ThemeToggle />
          <Button size="sm">New Analysis</Button>
        </div>
      </div>

      {children && <div className="container py-2 border-t">{children}</div>}
    </header>
  )
}
