'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { GA_TRACKING_ID } from '@/lib/gtag'

export function AnalyticsProvider() {
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window.gtag !== 'function') return
    window.gtag('config', GA_TRACKING_ID, {
      page_path: pathname,
    })
  }, [pathname])

  return null
}
