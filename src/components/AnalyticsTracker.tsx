'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { logVisit } from '@/lib/analytics'

export default function AnalyticsTracker() {
  const pathname = usePathname()

  useEffect(() => {
    if (!pathname?.startsWith('/dashboard') && !pathname?.startsWith('/telemetry')) {
        logVisit(pathname)
    }
  }, [pathname])

  return null
}