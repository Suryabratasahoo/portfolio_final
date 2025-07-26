"use client"

import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

interface LoadingScreenProps {
  text?: string
}

export default function LoadingScreen({ text = "Loading data..." }: LoadingScreenProps) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-50">
      <div className="relative flex flex-col items-center">
        {/* Main circle */}
        <motion.div
          className="w-16 h-16 rounded-full border-4 border-primary/20"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        />

        {/* Spinning gradient circle */}
        <motion.div
          className="absolute top-0 w-16 h-16 rounded-full border-t-4 border-r-4 border-primary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, rotate: 360 }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />

        {/* Pulsing inner circle */}
        <motion.div
          className="absolute top-0 w-4 h-4 mt-6 ml-6 bg-primary rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
        />

        {/* Loading text */}
        <motion.p
          className="mt-6 text-sm text-muted-foreground"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {text}
        </motion.p>

        {/* Progress bar */}
        <motion.div
          className="mt-4 h-1 bg-muted rounded-full overflow-hidden w-48"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            className="h-full bg-primary"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </div>
  )
}
