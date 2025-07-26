"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useScrollProgress } from "@/lib/animation-utils"

export default function ScrollIndicator() {
  const scrollProgress = useScrollProgress()
  const [activeSection, setActiveSection] = useState("")

  const sections = [
    { id: "hero", label: "Home" },
    { id: "about", label: "About" },
    { id: "projects", label: "Projects" },
    { id: "experience", label: "Experience" },
    { id: "resume", label: "Resume" },
    { id: "testimonials", label: "Testimonials" },
    { id: "contact", label: "Contact" },
  ]

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY
      const windowHeight = window.innerHeight

      // Find which section is currently in view
      for (const section of sections) {
        const element = document.getElementById(section.id)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= windowHeight / 2 && rect.bottom >= windowHeight / 2) {
            setActiveSection(section.id)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Initial check

    return () => window.removeEventListener("scroll", handleScroll)
  }, [sections])

  return (
    <motion.div
      className="fixed right-14 top-1/2 transform -translate-y-1/2 z-40 hidden lg:flex flex-col items-center"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 1 }}
    >
      <div className="h-48 w-0.5 bg-border relative mb-4">
        <motion.div
          className="absolute top-0 left-0 w-full bg-primary"
          style={{ height: `${scrollProgress * 100}%` }}
        />
      </div>

      <div className="space-y-3">
        {sections.map((section) => (
          <motion.a
            key={section.id}
            href={`#${section.id}`}
            className="block relative"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              className={`h-2 w-2 rounded-full transition-colors duration-300 ${
                activeSection === section.id ? "bg-primary" : "bg-muted-foreground/30"
              }`}
              whileHover={{ scale: 1.5 }}
            />
            <motion.span
              className="absolute left-4 top-1/2 -translate-y-1/2 text-xs whitespace-nowrap opacity-0 pointer-events-none"
              animate={{
                opacity: activeSection === section.id ? 1 : 0,
                x: activeSection === section.id ? 0 : -10,
              }}
              transition={{ duration: 0.2 }}
            >
              {section.label}
            </motion.span>
          </motion.a>
        ))}
      </div>
    </motion.div>
  )
}

