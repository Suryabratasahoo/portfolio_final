"use client"

import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Github, ArrowRight } from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"
import { useScrollInView, staggerContainer, fadeUpItem } from "@/lib/framer-utils"

interface Project {
  _id: string
  title: string
  description: string
  image: string
  tags: string[]
  liveUrl: string
  githubUrl: string
  createdAt: string
}

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null) as React.RefObject<HTMLElement>
  const titleRef = useRef<HTMLDivElement>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const isInView = useScrollInView(sectionRef, { once: false, amount: 0.1 })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const titleY = useTransform(scrollYProgress, [0, 0.5], [30, -30])
  const titleOpacity = useTransform(scrollYProgress, [0, 0.2, 0.3], [0, 1, 1])

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/projects')
        const data = await response.json()

        if (data.success) {
          setProjects(data.data)
        } else {
          setError(data.message || 'Failed to fetch projects')
        }
      } catch (err) {
        setError('Something went wrong while fetching projects')
        console.error('Error fetching projects:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  // Loading state
  if (loading) {
    return (
      <section id="projects" ref={sectionRef} className="py-20 md:py-32 relative bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-light mb-4">My Projects</h2>
            <p className="text-base text-muted-foreground max-w-xl mx-auto">Loading projects...</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden h-full border-none bg-background shadow-sm">
                <div className="relative h-80 bg-muted animate-pulse" />
                <CardHeader className="px-4 py-3">
                  <div className="h-5 bg-muted animate-pulse rounded mb-2" />
                  <div className="h-4 bg-muted animate-pulse rounded" />
                </CardHeader>
                <CardContent className="px-4 py-2">
                  <div className="flex gap-2">
                    <div className="h-6 w-16 bg-muted animate-pulse rounded" />
                    <div className="h-6 w-20 bg-muted animate-pulse rounded" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Error state
  if (error) {
    return (
      <section id="projects" ref={sectionRef} className="py-20 md:py-32 relative bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-light mb-4">My Projects</h2>
            <p className="text-base text-muted-foreground max-w-xl mx-auto text-red-500">
              {error}
            </p>
          </div>
        </div>
      </section>
    )
  }

  // Empty state
  if (projects.length === 0) {
    return (
      <section id="projects" ref={sectionRef} className="py-20 md:py-32 relative bg-muted/20">
        <div className="container mx-auto px-4">
          <motion.div ref={titleRef} className="text-center mb-16" style={{ y: titleY, opacity: titleOpacity }}>
            <motion.h2
              className="text-2xl md:text-3xl font-light mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.4 }}
            >
              My Projects
            </motion.h2>
            <motion.p
              className="text-base text-muted-foreground max-w-xl mx-auto"
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              No projects available at the moment.
            </motion.p>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section id="projects" ref={sectionRef} className="py-20 md:py-32 relative bg-muted/20">
      <div className="container mx-auto px-4">
        <motion.div ref={titleRef} className="text-center mb-16" style={{ y: titleY, opacity: titleOpacity }}>
          <motion.h2
            className="text-2xl md:text-3xl font-light mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.4 }}
          >
            My Projects
          </motion.h2>
          <motion.p
            className="text-base text-muted-foreground max-w-xl mx-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            A selection of my recent work. Each project was built with a focus on user experience and clean code.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-6 lg:gap-8"
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
        >
          {projects.map((project, index) => (
            <motion.div
              key={project._id}
              variants={fadeUpItem}
              custom={index}
              whileHover={{
                y: -8,
                transition: { duration: 0.2 },
              }}
              className="group"
            >
              <Card className="overflow-hidden h-full border-none bg-background shadow-sm hover:shadow-md transition-all duration-300">
                <motion.div
                  className="relative h-80 overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>
                <CardHeader className="px-4 py-3">
                  <CardTitle className="text-lg font-medium group-hover:text-primary transition-colors">
                    {project.title}
                  </CardTitle>
                  <CardDescription className="text-sm">{project.description}</CardDescription>
                </CardHeader>
                <CardContent className="px-4 py-2">
                  <motion.div
                    className="flex flex-wrap gap-1.5 mt-1"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="show"
                  >
                    {project.tags.map((tag) => (
                      <motion.div
                        key={tag}
                        variants={fadeUpItem}
                        whileHover={{ y: -2, scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300, damping: 10 }}
                      >
                        <Badge variant="outline" className="px-2 py-0.5 text-xs font-normal">
                          {tag}
                        </Badge>
                      </motion.div>
                    ))}
                  </motion.div>
                </CardContent>
                <CardFooter className="flex justify-between px-4 py-3">
                  <motion.div whileHover={{ scale: 1.05, x: -2 }} whileTap={{ scale: 0.97 }}>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      asChild={project.githubUrl !== "#"} 
                      className="text-xs"
                      disabled={project.githubUrl === "#"}
                    >
                      {project.githubUrl !== "#" ? (
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                          <Github className="h-3.5 w-3.5 mr-1.5" />
                          Code
                        </a>
                      ) : (
                        <span className="opacity-50 cursor-not-allowed">
                          <Github className="h-3.5 w-3.5 mr-1.5" />
                          Code
                        </span>
                      )}
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05, x: 2 }} whileTap={{ scale: 0.97 }}>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      asChild={project.liveUrl !== "#"} 
                      className="text-xs group"
                      disabled={project.liveUrl === "#"}
                    >
                      {project.liveUrl !== "#" ? (
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center">
                          <span>Live Demo</span>
                          <ArrowRight className="h-3.5 w-3.5 ml-1.5 transition-transform duration-300 group-hover:translate-x-1" />
                        </a>
                      ) : (
                        <span className="flex items-center opacity-50 cursor-not-allowed">
                          <span>Live Demo</span>
                          <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                        </span>
                      )}
                    </Button>
                  </motion.div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}