"use client"

import { useEffect, useRef } from "react"
import { Badge } from "@/components/ui/badge"
import { motion, useScroll, useTransform } from "framer-motion"
import { useScrollInView, staggerContainer, fadeUpItem } from "@/lib/framer-utils"
import {useState} from "react"
export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const skillsRef = useRef<HTMLDivElement>(null)
  const [experiences, setExperiences] = useState<any[]>([])

  const isInView = useScrollInView(sectionRef, { once: false, amount: 0.1 })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const timelineY = useTransform(scrollYProgress, [0, 1], [50, -50])
  const skillsY = useTransform(scrollYProgress, [0, 1], [70, -70])
   
  useEffect(()=>{
    const fetchExperiences=async()=>{
      const response=await fetch('/api/experiences');
      
      const data=await response.json();
      setExperiences(data);
    }
    fetchExperiences();

  },[])

  return (
    <section id="experience" ref={sectionRef} className="py-20 md:py-32 relative">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.4 }}
        >
          <motion.h2
            className="text-2xl md:text-3xl font-light mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.4 }}
          >
            Experience
          </motion.h2>
          <motion.p
            className="text-base text-muted-foreground max-w-xl mx-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            My professional journey in web development.
          </motion.p>
        </motion.div>

        <motion.div
          ref={timelineRef}
          style={{ y: timelineY }}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <motion.div
            className="relative border-l border-border pl-6 space-y-12"
            variants={staggerContainer}
            initial="hidden"
            animate={isInView ? "show" : "hidden"}
          >
            {experiences.map((exp, index) => (
              <motion.div
                key={exp._id}
                className="relative"
                variants={fadeUpItem}
                custom={index}
                whileHover={{ x: 3 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  className="absolute -left-1.5 top-1 h-3 w-3 rounded-full bg-primary"
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : { scale: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                />
                <Badge variant="outline" className="mb-2 font-normal">
                  {exp.period}
                </Badge>
                <h4 className="text-base font-medium">{exp.role}</h4>
                <p className="text-sm text-muted-foreground mb-2">{exp.company}</p>
                <p className="text-sm">{exp.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

