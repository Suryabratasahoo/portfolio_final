"use client"

import { useEffect, useRef,useState } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { useScrollInView } from "@/lib/framer-utils"
import { useInView } from "framer-motion"
import { set } from "mongoose"


interface Category {
  name: string
  color: string
  skills:Skill[]
  _id:string
}
interface Skill{
  _id:string
  name:string
  icon:string
  level:number
  categoryId:string
}

const getColorClass=(color:string)=>{
  switch(color){
    case 'blue':
      return 'from-blue-500 to-cyan-400'
    case 'purple':
      return 'from-purple-500 to-indigo-400'
    case 'pink':
      return 'from-pink-500 to-rose-400'
    case 'green':
      return 'from-green-500 to-emerald-400'
    case 'amber': 
      return 'from-amber-500 to-yellow-400'
    case 'indigo':
      return 'from-indigo-500 to-violet-400'
    case 'rose':
      return 'from-rose-500 to-pink-400'
    default:
      return 'from-blue-500 to-cyan-400'  

  }
}


export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useScrollInView(sectionRef, { once: false, amount: 0.1 })
  const [categories,setCategories]= useState<Category[]>([])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [100, 0, 0, -100])
  useEffect(()=>{
    const fetchSkills = async () => {
      const response=await fetch('/api/skills');
      if(!response.ok){
        throw new Error('Failed to fetch skills');
      }
      const data=await response.json();
      console.log(data);
      setCategories(data);
    }
    fetchSkills();
  },[])

  const skillCategories = [
    {
      name: "Frontend",
      color: "from-blue-500 to-cyan-400",
      skills: [
        {
          name: "React",
          icon: "/react.webp",
          level: 90,
        },
        {
          name: "Next.js",
          icon: "/nextjs.png",
          level: 85,
        },
        {
          name: "TypeScript",
          icon: "/typescript.webp",
          level: 80,
        },
        {
          name: "Tailwind CSS",
          icon: "/tailwind.jpg",
          level: 95,
        },
      ],
    },
    {
      name: "Backend",
      color: "from-purple-500 to-indigo-400",
      skills: [
        {
          name: "Node.js",
          icon: "/nodejs.webp",
          level: 85,
        },
        {
          name: "Express",
          icon: "/express.png",
          level: 80,
        },
        {
          name: "MongoDB",
          icon: "/mongo.webp",
          level: 75,
        },
        {
          name: "PostgreSQL",
          icon: "/placeholder.svg?height=60&width=60",
          level: 70,
        },
      ],
    },
    // {
    //   name: "Design",
    //   color: "from-pink-500 to-rose-400",
    //   skills: [
    //     {
    //       name: "Figma",
    //       icon: "/figma.png",
    //       level: 90,
    //     },
    //     {
    //       name: "Adobe XD",
    //       icon: "/placeholder.svg?height=60&width=60",
    //       level: 85,
    //     },
    //     {
    //       name: "Photoshop",
    //       icon: "/placeholder.svg?height=60&width=60",
    //       level: 75,
    //     },
    //     {
    //       name: "Illustrator",
    //       icon: "/placeholder.svg?height=60&width=60",
    //       level: 70,
    //     },
    //   ],
    // },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  }

  return (
    <section id="skills" ref={sectionRef} className="py-20 md:py-32 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
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
          className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
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
            My Skills
          </motion.h2>
          <motion.p
            className="text-base text-muted-foreground max-w-xl mx-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            A showcase of my technical expertise and proficiency in various technologies
          </motion.p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {categories.map((category) => (
            <motion.div
              key={category._id}
              variants={itemVariants}
              className="relative"
              whileHover={{ y: -5, transition: { duration: 0.15 } }}
            >
              <motion.div
                className="bg-background rounded-lg p-6 shadow-sm border border-border/50 h-full"
                whileHover={{
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                  borderColor: "rgba(var(--primary-rgb), 0.3)",
                  transition: { duration: 0.15 },
                }}
              >
                <div className={`bg-gradient-to-r ${category.color} p-3 rounded-lg mb-6 inline-block`}>
                  <h3 className="text-white font-medium">{category.name}</h3>
                </div>

                <div className="space-y-6">
                  {category.skills.map((skill) => (
                      <motion.div
                        key={skill._id}
                        className="flex items-center gap-4"
                        whileHover={{ x: 3 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div
                          className={`relative w-12 h-12 rounded-full bg-gradient-to-r ${getColorClass(category.color)} p-0.5 flex items-center justify-center`}
                        >
                          <div className="bg-background rounded-full p-2 w-full h-full flex items-center justify-center">
                            <Image
                              src={skill.icon || "/placeholder.svg"}
                              alt={skill.name}
                              width={30}
                              height={30}
                              className="rounded-full"
                            />
                          </div>
                        </div>

                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">{skill.name}</span>
                            <span className="text-xs text-muted-foreground">{skill.level}%</span>
                          </div>
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <motion.div
                              className={`h-full bg-gradient-to-r ${getColorClass(category.color)}`}
                              initial={{ width: 0 }}
                              animate={isInView ? { width: `${skill.level}%` } : { width: 0 }}
                              transition={{ duration: 1, delay: 0.3 }}
                            />
                          </div>
                        </div>
                      </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Decorative element */}
              <motion.div
                className={`absolute -z-10 inset-0 bg-gradient-to-tr ${category.color} rounded-lg opacity-0`}
                animate={isInView ? { opacity: 0.05 } : { opacity: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                  transform: "translate(8px, 8px)",
                }}
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
