"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { Code, Users, Clock, Award } from "lucide-react"

interface CounterProps {
  value: number
  suffix?: string
  duration?: number
  delay?: number
}

function Counter({ value, suffix = "", duration = 2, delay = 0 }: CounterProps) {
  const [count, setCount] = useState(0)
  const nodeRef = useRef<HTMLSpanElement>(null)
  const isInView = useInView(nodeRef, { once: true, amount: 0.5 })

  useEffect(() => {
    if (!isInView) return

    let start = 0
    const end = Math.min(value, 999)

    // First set to 0
    setCount(0)

    // Early return if value is 0
    if (start === end) return

    // Get duration per increment
    const totalDuration = duration * 1000
    const incrementTime = totalDuration / end

    // Timer to increment counter
    const timer = setTimeout(() => {
      const counter = setInterval(() => {
        start += 1
        setCount(start)

        if (start >= end) clearInterval(counter)
      }, incrementTime)

      return () => clearInterval(counter)
    }, delay * 1000)

    return () => clearTimeout(timer)
  }, [value, duration, delay, isInView])

  return (
    <span ref={nodeRef}>
      {count}
      {suffix}
    </span>
  )
}

export default function StatsCounter() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 })
  const [stats, setStats] = useState<any[]>([])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [100, 0, 0, -100])

  const getIconComponent = (iconName: string) => {
      switch (iconName) {
        case "Clock":
          return <Clock className="h-6 w-6" />
        case "Code":
          return <Code className="h-6 w-6" />
        case "Users":
          return <Users className="h-6 w-6" />
        case "Award":
          return <Award className="h-6 w-6" />
        default:
          return <Clock className="h-6 w-6" />
      }
    }
  
    const getColorClass = (color: string) => {
      switch (color) {
        case "blue":
          return "bg-blue-500/10 text-blue-500"
        case "purple":
          return "bg-purple-500/10 text-purple-500"
        case "green":
          return "bg-green-500/10 text-green-500"
        case "amber":
          return "bg-amber-500/10 text-amber-500"
        case "pink":
          return "bg-pink-500/10 text-pink-500"
        case "indigo":
          return "bg-indigo-500/10 text-indigo-500"
        case "rose":
          return "bg-rose-500/10 text-rose-500"
        default:
          return "bg-blue-500/10 text-blue-500"
      }
    }
  

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/stats")
        const data = await response.json()
        setStats(data.stats)
      } catch (error) {
        console.error("Error fetching stats:", error)
      }
    }

    fetchStats()
  },[])


  
  return (
    <section ref={sectionRef} className="py-20 md:py-32 relative overflow-hidden bg-muted/30">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -30, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
          animate={{
            x: [0, -30, 0],
            y: [0, 30, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 18,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
      </div>

      <motion.div className="container mx-auto px-4" style={{ opacity, y }}>
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2
            className="text-2xl md:text-3xl font-light mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.4 }}
          >
            By the Numbers
          </motion.h2>
          <motion.p
            className="text-base text-muted-foreground max-w-xl mx-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            A snapshot of my professional journey and achievements
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <motion.div
              key={stat._id}
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <motion.div
                className="bg-background rounded-lg p-6 text-center shadow-sm border border-border/50 h-full flex flex-col items-center justify-center"
                whileHover={{
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                  borderColor: "rgba(var(--primary-rgb), 0.3)",
                  transition: { duration: 0.2 },
                }}
              >
                <div className={`${getColorClass(stat.color)} p-3 rounded-full mb-4`}>{getIconComponent(stat.icon)}</div>
                <h3 className="text-3xl md:text-4xl font-bold mb-2">
                  <Counter value={stat.value} suffix={stat.suffix} duration={2} delay={0.5 + index * 0.1} />
                </h3>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>

              {/* Decorative elements */}
              <motion.div
                className="absolute -z-10 inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-primary/5 rounded-lg opacity-0"
                animate={isInView ? { opacity: 0.7 } : { opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                style={{
                  transform: "translate(8px, 8px)",
                }}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

