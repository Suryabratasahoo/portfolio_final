"use client"

import { useRef, useEffect } from "react"
import { useMousePosition } from "@/lib/animation-utils"

export default function BackgroundGradient() {
  const mousePosition = useMousePosition()
  const gradientRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!gradientRef.current) return

    const handleMouseMove = () => {
      if (!gradientRef.current) return

      const { x, y } = mousePosition
      const { innerWidth, innerHeight } = window

      // Calculate position as percentage of screen
      const xPercent = (x / innerWidth) * 100
      const yPercent = (y / innerHeight) * 100

      // Update gradient position
      gradientRef.current.style.background = `
        radial-gradient(
          600px circle at ${xPercent}% ${yPercent}%, 
          rgba(var(--primary-rgb), 0.05), 
          transparent 40%
        )
      `
    }

    handleMouseMove()

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [mousePosition])

  return (
    <div
      ref={gradientRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-80 transition-opacity duration-1000 hidden md:block"
    />
  )
}

