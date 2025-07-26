"use client"

import { useEffect, useState, type ReactNode } from "react"
import LoadingScreen from "@/components/admin/loading-screen"

interface DataLoaderProps {
  children: ReactNode
  loadingText?: string
  delay?: number
}

export default function DataLoader({ children, loadingText = "Loading data...", delay = 1500 }: DataLoaderProps) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  if (loading) {
    return <LoadingScreen text={loadingText} />
  }

  return <>{children}</>
}
