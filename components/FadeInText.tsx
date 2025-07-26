"use client"

import { motion } from "framer-motion"

interface FadeInTextProps {
  text: string
  className?: string
  delay?: number
}

export function FadeInText({ text, className = "", delay = 0 }: FadeInTextProps) {
  const letters = text.split("")

  return (
    <span className={className}>
      {letters.map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: delay + i * 0.05 }}
          className="inline-block"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  )
}
