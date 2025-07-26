"use client"

import { useEffect, useState, type RefObject } from "react"
import { useInView } from "framer-motion"

// Custom hook to detect when an element is in view
export function useScrollInView(ref: RefObject<HTMLElement>, options = { once: true, amount: 0.2 }) {
  const isInView = useInView(ref, options)
  return isInView
}

// Custom hook for parallax effect
export function useParallax(ref: RefObject<HTMLElement>, speed = 0.1) {
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    if (!ref.current) return

    const handleScroll = () => {
      if (!ref.current) return

      const scrollY = window.scrollY
      const rect = ref.current.getBoundingClientRect()
      const elementTop = rect.top + scrollY
      const elementHeight = rect.height
      const windowHeight = window.innerHeight

      // Calculate how far the element is from the center of the viewport
      const distanceFromCenter = elementTop + elementHeight / 2 - (scrollY + windowHeight / 2)

      // Apply parallax effect
      const parallaxOffset = distanceFromCenter * speed
      setOffset(-parallaxOffset)
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Initial calculation

    return () => window.removeEventListener("scroll", handleScroll)
  }, [ref, speed])

  return offset
}

// Stagger children animation variants
export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
}

// Fade up animation variants
export const fadeUpItem = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
}

// Fade in animation variants
export const fadeIn = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      duration: 0.4,
    },
  },
}

// Scale up animation variants
export const scaleUp = {
  hidden: { opacity: 0, scale: 0.95 },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
}

// Slide in from left animation variants
export const slideInLeft = {
  hidden: { opacity: 0, x: -10 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
}

// Slide in from right animation variants
export const slideInRight = {
  hidden: { opacity: 0, x: 10 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
}

