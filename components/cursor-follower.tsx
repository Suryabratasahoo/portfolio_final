"use client"

import { useEffect, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"
import { useMousePosition } from "@/lib/animation-utils"

export default function CursorFollower() {
  const [isVisible, setIsVisible] = useState(false)
  const [isPointer, setIsPointer] = useState(false)
  const mousePosition = useMousePosition()

  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)

  const springConfig = { damping: 25, stiffness: 300 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)

  useEffect(() => {
    cursorX.set(mousePosition.x - 4)
    cursorY.set(mousePosition.y - 4)
  }, [mousePosition, cursorX, cursorY])

  useEffect(() => {
    const handleMouseEnter = () => setIsVisible(true)
    const handleMouseLeave = () => setIsVisible(false)

    const handlePointerElements = () => {
      const pointerElements = document.querySelectorAll(
        'a, button, [role="button"], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )

      pointerElements.forEach((el) => {
        el.addEventListener("mouseenter", () => setIsPointer(true))
        el.addEventListener("mouseleave", () => setIsPointer(false))
      })

      return () => {
        pointerElements.forEach((el) => {
          el.removeEventListener("mouseenter", () => setIsPointer(true))
          el.removeEventListener("mouseleave", () => setIsPointer(false))
        })
      }
    }

    document.addEventListener("mouseenter", handleMouseEnter)
    document.addEventListener("mouseleave", handleMouseLeave)

    const cleanup = handlePointerElements()

    return () => {
      document.removeEventListener("mouseenter", handleMouseEnter)
      document.removeEventListener("mouseleave", handleMouseLeave)
      cleanup()
    }
  }, [])

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 z-50 pointer-events-none hidden md:block"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          opacity: isVisible ? 1 : 0,
        }}
      >
        <motion.div
          className="relative flex items-center justify-center"
          animate={{
            scale: isPointer ? 2 : 1,
            opacity: isPointer ? 0.5 : 1,
          }}
          transition={{ duration: 0.2 }}
        >
          <div className="h-2 w-2 bg-primary rounded-full" />
        </motion.div>
      </motion.div>

      <motion.div
        className="fixed top-0 left-0 z-50 pointer-events-none hidden md:block"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          opacity: isVisible ? 1 : 0,
        }}
      >
        <motion.div
          className="relative flex items-center justify-center"
          animate={{
            scale: isPointer ? 4 : 0,
            opacity: isPointer ? 0.2 : 0,
          }}
          transition={{ duration: 0.2 }}
        >
          <div className="h-2 w-2 bg-primary rounded-full" />
        </motion.div>
      </motion.div>
    </>
  )
}

