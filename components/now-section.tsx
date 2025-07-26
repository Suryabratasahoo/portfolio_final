"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { useScrollInView } from "@/lib/framer-utils"
import { useMousePosition } from "@/lib/animation-utils"

import {
  Code,
  BookOpen,
  Briefcase,
  Coffee,
  Music,
  Zap,
} from "lucide-react"
import Image from "next/image"

export default function NowSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const mousePosition = useMousePosition()
  const isInView = useScrollInView(sectionRef, { once: false, amount: 0.2 })
  const [activeCard, setActiveCard] = useState<number | null>(null)
  const [nowItems, setNowItems] = useState<any[]>([])


  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [100, 0, 0, -100])


  useEffect(()=>{
    const fetchNowItems=async()=>{
      const response=await fetch('/api/now');
      if(!response.ok){
        throw new Error('Failed to fetch now items');
      }
      const data=await response.json();
      setNowItems(data);
    }
    fetchNowItems()
  },[])
  
  const getIconComponent = (iconName: string) => {
      switch (iconName) {
        case "Code":
          return <Code className="h-5 w-5" />
        case "BookOpen":
          return <BookOpen className="h-5 w-5" />
        case "Briefcase":
          return <Briefcase className="h-5 w-5" />
        case "Coffee":
          return <Coffee className="h-5 w-5" />
        case "Music":
          return <Music className="h-5 w-5" />
        default:
          return <Code className="h-5 w-5" />
      }
    }
  
    const getColorClass = (color: string) => {
      switch (color) {
        case "blue":
          return "from-blue-500 to-cyan-400"
        case "purple":
          return "from-purple-500 to-indigo-400"
        case "amber":
          return "from-amber-500 to-orange-400"
        case "green":
          return "from-green-500 to-emerald-400"
        case "pink":
          return "from-pink-500 to-rose-400"
        case "indigo":
          return "from-indigo-500 to-blue-400"
        case "rose":
          return "from-rose-500 to-pink-400"
        default:
          return "from-blue-500 to-cyan-400"
      }
    }
  

  return (
    <section id="now" ref={sectionRef} className="py-20 md:py-32 relative overflow-hidden">
      <motion.div className="container mx-auto px-4 relative z-10" style={{ opacity, y }}>
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center justify-center mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              className="relative flex items-center justify-center w-12 h-12 rounded-full bg-primary/10"
              animate={{
                boxShadow: [
                  "0 0 0 0 rgba(var(--primary-rgb), 0.3)",
                  "0 0 0 10px rgba(var(--primary-rgb), 0)",
                  "0 0 0 0 rgba(var(--primary-rgb), 0)",
                ],
              }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              <Zap className="h-5 w-5 text-primary" />
            </motion.div>
          </motion.div>

          <motion.h2
            className="text-2xl md:text-3xl font-light mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.4 }}
          >
            What I'm Doing Now
          </motion.h2>
          <motion.p
            className="text-base text-muted-foreground max-w-xl mx-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            A snapshot of my current focus, projects, and interests
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {nowItems.map((item, index) => (
            <motion.div
              key={item._id}
              className="relative group"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              onHoverStart={() => setActiveCard(item._id)}
              onHoverEnd={() => setActiveCard(null)}
            >
              <motion.div
                className="bg-background rounded-lg p-6 shadow-sm border border-border/50 h-full relative overflow-hidden"
                whileHover={{
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                  borderColor: "rgba(var(--primary-rgb), 0.3)",
                  transition: { duration: 0.2 },
                }}
              >
                {/* Status indicator */}
                <div className="absolute top-4 right-4 flex items-center">
                  <motion.div
                    className={`h-2 w-2 rounded-full bg-gradient-to-r ${getColorClass(item.color)} mr-2`}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  />
                  <span className="text-xs text-muted-foreground">{item.status}</span>
                </div>

                {/* Icon */}
                <div
                  className={`inline-flex items-center justify-center p-3 rounded-lg bg-gradient-to-r ${getColorClass(item.color)} text-white mb-4`}
                >
                  {getIconComponent(item.icon)}
                </div>

                {/* Content */}
                <h3 className="text-lg font-medium mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{item.description}</p>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mb-1">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${getColorClass(item.color)}`}
                    initial={{ width: 0 }}
                    animate={isInView ? { width: `${item.progress}%` } : { width: 0 }}
                    transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                  />
                </div>

                {/* Progress percentage */}
                <div className="flex justify-end">
                  <span className="text-xs text-muted-foreground">{item.progress}% complete</span>
                </div>

                {/* Hover effect overlay */}
                <AnimatePresence>
                  {activeCard === item._id && (
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-tr ${getColorClass(item.color)} opacity-0 flex items-center justify-center`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.97 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <motion.div
                        className="text-white text-center p-6"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="mb-4">{getIconComponent(item.icon)}</div>
                        <h3 className="text-xl font-medium mb-2">{item.title}</h3>
                        <p className="mb-4">{item.description}</p>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Decorative element */}
              <motion.div
                className={`absolute -z-10 inset-0 bg-gradient-to-tr ${getColorClass(item.color)} rounded-lg opacity-0`}
                animate={isInView ? { opacity: 0.05 } : { opacity: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                  transform: "translate(8px, 8px)",
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* Last updated indicator */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4, delay: 0.8 }}
        >
          <p className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>
        </motion.div>
      </motion.div>
    </section>
  )
}