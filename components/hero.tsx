"use client"

import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowDown, Code, Sparkles, Zap } from "lucide-react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { useMousePosition } from "@/lib/animation-utils"
import { Typewriter } from "react-simple-typewriter"
import { FadeInText } from "@/components/FadeInText"


export default function Hero() {
  const heroRef = useRef<HTMLElement>(null)
  const mousePosition = useMousePosition()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const textY = useTransform(scrollYProgress, [0, 0.5], [0, 50])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Particles for background
  const particles = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 10 + 2,
    duration: Math.random() * 20 + 10,
  }))

  return (
    <motion.section
      id="hero"
      ref={heroRef}
      className="relative h-screen flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background particles */}
      {mounted &&
        particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-primary/5 dark:bg-primary/10"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
            }}
            animate={{
              x: [0, (mousePosition.x / window.innerWidth - 0.5) * -20, 0],
              y: [0, (mousePosition.y / window.innerHeight - 0.5) * -20, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
        ))}

      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/20"></div>

      <motion.div className="container mx-auto px-4 z-10 text-center" style={{ y: textY, opacity }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6 flex justify-center"
        >
          <motion.div
            className="relative inline-flex items-center justify-center p-1 overflow-hidden rounded-full bg-background border border-primary/20"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <motion.span
              className="relative z-10 px-4 py-1 text-xs font-medium text-foreground flex items-center gap-1.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Sparkles className="h-3 w-3 text-primary" />
              <span>Web Developer & UI Designer</span>
              <Sparkles className="h-3 w-3 text-primary" />
            </motion.span>
          </motion.div>
        </motion.div>

        <motion.h1
          className="text-4xl md:text-6xl lg:text-7xl font-light mb-6 tracking-tight"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <FadeInText text="Suryabrata Sahoo" className="text-foreground" delay={0.2} />
          <motion.span
            className="block mt-2 text-primary font-normal"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 1.4 }}
          >
            Creating Digital Experiences
          </motion.span>
        </motion.h1>


        <motion.p
          className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          I design and build clean, minimal, and user-friendly websites that deliver exceptional digital experiences.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button size="lg" className="rounded-full px-8 gap-2" onClick={() => scrollToSection("projects")}>
              <Code className="h-4 w-4" />
              View My Work
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-8 gap-2"
              onClick={() => scrollToSection("contact")}
            >
              <Zap className="h-4 w-4" />
              Contact Me
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        style={{ opacity }}
      >
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, ease: "easeInOut" }}
        >
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full border border-border"
              onClick={() => scrollToSection("about")}
              aria-label="Scroll down"
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.section>
  )
}

