"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"

interface CircularProgressBarProps {
  percentage: number
  size: number
  strokeWidth: number
  circleColor: string
  textColor?: string
}

export function CircularProgressBar({
  percentage,
  size,
  strokeWidth,
  circleColor,
  textColor = "text-foreground",
}: CircularProgressBarProps) {
  const [progress, setProgress] = useState(0)

  // Animation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(percentage)
    }, 300)

    return () => clearTimeout(timer)
  }, [percentage])

  // Calculate circle properties
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Background circle */}
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-200 dark:text-gray-800"
        />

        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={circleColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeInOut" }}
          strokeLinecap="round"
        />
      </svg>

      {/* Percentage text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-3xl font-bold ${textColor}`}>{progress}</span>
        <span className="text-xs text-muted-foreground">/ 100</span>
      </div>
    </div>
  )
}
