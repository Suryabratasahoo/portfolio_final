"use client"

import { useEffect, useState } from "react"

const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*(){}[]<>?/|"

interface ScrambleTextProps {
  text: string
  interval?: number // speed of scramble
  className?: string
}

export function ScrambleText({ text, interval = 30, className }: ScrambleTextProps) {
  const [output, setOutput] = useState("")
  const [done, setDone] = useState(false)

  useEffect(() => {
    let iterations = 0
    const maxIterations = text.length * 4
    const revealText = text.split("")
    const scrambled = [...revealText]

    const intervalId = setInterval(() => {
      iterations++

      for (let i = 0; i < revealText.length; i++) {
        if (i < iterations / 4) {
          scrambled[i] = revealText[i]
        } else {
          scrambled[i] = characters[Math.floor(Math.random() * characters.length)]
        }
      }

      setOutput(scrambled.join(""))

      if (iterations > maxIterations) {
        setDone(true)
        clearInterval(intervalId)
      }
    }, interval)

    return () => clearInterval(intervalId)
  }, [text, interval])

  return <span className={className}>{output}</span>
}
