"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { useScrollInView } from "@/lib/framer-utils"
import * as Icons from "lucide-react";
import {
  Calendar,
  Target,
  Award,
  Briefcase,
  GraduationCap,
  Globe,
  Rocket,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Clock,
} from "lucide-react"

export default function TimelineGoals() {
  const sectionRef = useRef<HTMLElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const isInView = useScrollInView(sectionRef, { once: false, amount: 0.1 })
  const [expandedItem, setExpandedItem] = useState<number | null>(null)
  const [timelineItems, setTimelineItems] = useState<any[]>([])
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [100, 0, 0, -100])

  // Timeline progress animation
  const { scrollYProgress: timelineScrollProgress } = useScroll({
    target: timelineRef,
    offset: ["start end", "end start"],
  })

  const timelineHeight = useTransform(timelineScrollProgress, [0, 1], ["0%", "100%"])


  useEffect(()=>{
    const fetchTimeLines=async()=>{
      const response=await fetch('/api/timelines');
      if(!response.ok){
        throw new Error('Failed to fetch timelines');
      }
      const data=await response.json();
      console.log(data);
      setTimelineItems(data.timelines);
    }

    fetchTimeLines();
  },[])

  // const timelineItems = [
  //   {
  //     id: 1,
  //     icon: <Target className="h-5 w-5" />,
  //     title: "Launch Personal Blog",
  //     description:
  //       "Create and launch a technical blog focusing on web development tutorials and case studies from my projects.",
  //     timeframe: "January 2024",
  //     status: "planning",
  //     category: "Content Creation",
  //     details:
  //       "The blog will feature weekly articles on React, Next.js, and modern web development techniques. I'll share code snippets, performance optimization tips, and lessons learned from real-world projects.",
  //     color: "text-blue-500",
  //     bgColor: "bg-blue-500/10",
  //   },
  //   {
  //     id: 2,
  //     icon: <Award className="h-5 w-5" />,
  //     title: "AWS Solutions Architect Certification",
  //     description:
  //       "Complete the AWS Solutions Architect Professional certification to enhance cloud architecture skills.",
  //     timeframe: "March 2024",
  //     status: "in-progress",
  //     category: "Professional Development",
  //     details:
  //       "Currently studying 2 hours daily following a structured curriculum. The certification will help me design more scalable and cost-effective cloud solutions for my projects and clients.",
  //     color: "text-purple-500",
  //     bgColor: "bg-purple-500/10",
  //   },
  //   {
  //     id: 3,
  //     icon: <Briefcase className="h-5 w-5" />,
  //     title: "Launch Freelance Collective",
  //     description:
  //       "Establish a collective of freelance developers and designers to take on larger, more complex projects.",
  //     timeframe: "June 2024",
  //     status: "planning",
  //     category: "Business",
  //     details:
  //       "The collective will bring together 5-7 specialists across frontend, backend, design, and project management. We'll focus on helping startups and mid-sized businesses with complete digital transformations.",
  //     color: "text-amber-500",
  //     bgColor: "bg-amber-500/10",
  //   },
  //   {
  //     id: 4,
  //     icon: <GraduationCap className="h-5 w-5" />,
  //     title: "Complete AI/ML Specialization",
  //     description:
  //       "Finish the Stanford Machine Learning specialization to integrate AI capabilities into web projects.",
  //     timeframe: "August 2024",
  //     status: "not-started",
  //     category: "Education",
  //     details:
  //       "The specialization covers fundamental ML algorithms, neural networks, and practical applications. I plan to use these skills to build more intelligent web applications with features like content recommendation and user behavior prediction.",
  //     color: "text-green-500",
  //     bgColor: "bg-green-500/10",
  //   },
  //   {
  //     id: 5,
  //     icon: <Globe className="h-5 w-5" />,
  //     title: "Speak at Web Development Conference",
  //     description: "Present a talk on modern frontend architecture at a major web development conference.",
  //     timeframe: "October 2024",
  //     status: "planning",
  //     category: "Public Speaking",
  //     details:
  //       "I'm preparing a presentation on micro-frontend architecture and performance optimization techniques. This will be my first major speaking engagement, with the goal of establishing myself as a thought leader in the space.",
  //     color: "text-pink-500",
  //     bgColor: "bg-pink-500/10",
  //   },
  //   {
  //     id: 6,
  //     icon: <Rocket className="h-5 w-5" />,
  //     title: "Launch SaaS Product",
  //     description: "Develop and launch a SaaS product focused on helping freelancers manage their business operations.",
  //     timeframe: "December 2024",
  //     status: "not-started",
  //     category: "Product Development",
  //     details:
  //       "The product will include features for time tracking, invoicing, client management, and project planning. I'm currently in the market research phase, with development planned to start in July 2024.",
  //     color: "text-indigo-500",
  //     bgColor: "bg-indigo-500/10",
  //   },
  // ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "in-progress":
        return <Clock className="h-4 w-4 text-amber-500" />
      case "planning":
        return <Calendar className="h-4 w-4 text-blue-500" />
      default:
        return <Target className="h-4 w-4 text-gray-500" />
    }
  }
  const getIcon=(iconName:string)=>{
    switch(iconName){
      case "Target":
        return <Target className="h-4 w-4" />
      case "Award":
        return <Award className="h-4 w-4" />
      case "Briefcase":
        return <Briefcase className="h-4 w-4" />
      case "GraduationCap":
        return <GraduationCap className="h-4 w-4" />
      case "Globe":
        return <Globe className="h-4 w-4" />
      case "Rocket":
        return <Rocket className="h-4 w-4" />
      default:
        return null
    }
  }
  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Completed"
      case "in-progress":
        return "In Progress"
      case "planning":
        return "Planning Phase"
      case "not-started":
        return "Not Started"
      default:
        return "Planned"
    }
  }

  const toggleExpand = (id: number) => {
    if (expandedItem === id) {
      setExpandedItem(null)
    } else {
      setExpandedItem(id)
    }
  }

  return (
    <section id="timeline" ref={sectionRef} className="py-20 md:py-32 relative overflow-hidden bg-muted/10">
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
            Upcoming Goals & Milestones
          </motion.h2>
          <motion.p
            className="text-base text-muted-foreground max-w-xl mx-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            A roadmap of my professional journey and future aspirations
          </motion.p>
        </motion.div>

        <div className="max-w-4xl mx-auto relative">
          {/* Timeline line */}
          <div className="absolute left-[15px] md:left-1/2 top-0 bottom-0 w-0.5 bg-border transform md:-translate-x-1/2">
            <motion.div
              className="absolute top-0 left-0 w-full bg-primary"
              style={{ height: timelineHeight }}
              transition={{ duration: 0.2 }}
            />
          </div>

          {/* Timeline items */}
          <div ref={timelineRef} className="relative space-y-12">
            {timelineItems.map((item, index) => (
              <motion.div
                key={item.id}
                className={`relative ${index % 2 === 0 ? "md:ml-auto" : "md:mr-auto"} md:w-[calc(50%-20px)]`}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                {/* Timeline dot */}
                <motion.div
                  className={`absolute left-0 md:left-auto ${
                    index % 2 === 0 ? "md:-left-[25px]" : "md:-right-[25px]"
                  } top-0 w-[30px] h-[30px] rounded-full border-4 border-background ${
                    item.bgColor
                  } flex items-center justify-center z-10`}
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : { scale: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + 0.1 * index }}
                >
                  <span className={item.color}>{getIcon(item.icon)}</span>
                </motion.div>

                {/* Content card */}

                  <motion.div
                    className="ml-10 md:ml-0 bg-background rounded-lg border border-border/50 overflow-hidden"
                    whileHover={{
                      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                      borderColor: "rgba(var(--primary-rgb), 0.3)",
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <div
                      className="p-5 cursor-pointer"
                      onClick={() => toggleExpand(item.id)}
                      role="button"
                      tabIndex={0}
                      aria-expanded={expandedItem === item.id}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          toggleExpand(item.id)
                        }
                      }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span
                            className={`inline-block px-2 py-1 text-xs rounded-full ${item.bgColor} ${item.color} mb-2`}
                          >
                            {item.category}
                          </span>
                          <h3 className="text-lg font-medium">{item.title}</h3>
                        </div>
                        <motion.div
                          animate={{ rotate: expandedItem === item.id ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          {expandedItem === item.id ? (
                            <ChevronUp className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                          )}
                        </motion.div>
                      </div>

                      <p className="text-muted-foreground text-sm mb-3">{item.description}</p>

                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{item.timeframe}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(item.status)}
                          <span>{getStatusText(item.status)}</span>
                        </div>
                      </div>

                      <AnimatePresence>
                        {expandedItem === item.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-4 pt-4 border-t border-border">
                              <h4 className="text-sm font-medium mb-2">Details & Action Plan</h4>
                              <p className="text-sm text-muted-foreground">{item.details}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>

              </motion.div>
            ))}
          </div>
        </div>

        {/* Future indicator */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <div className="inline-block rounded-full bg-primary/10 px-4 py-2 text-sm">
            <span className="text-primary">More goals on the horizon...</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
