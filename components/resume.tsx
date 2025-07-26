"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, Calendar, Award, Briefcase } from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"
import { useScrollInView, staggerContainer, fadeUpItem } from "@/lib/framer-utils"
import { useEffect, useState } from "react"

export default function Resume() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [education, setEducation] = useState<any[]>([])
  const [certifications, setCertifications] = useState<any[]>([])

  const isInView = useScrollInView(sectionRef, { once: false, amount: 0.1 })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const contentY = useTransform(scrollYProgress, [0, 1], [50, -50])



  useEffect(() => {
    const fetchEducationData = async () => {
      try {
        // Fetch education data
        const educationResponse = await fetch('/api/education');
        if (!educationResponse.ok) {
          throw new Error('Failed to fetch education data');
        }
        const educationData = await educationResponse.json();
        const educationItems = Array.isArray(educationData) ? educationData :
          educationData.education && Array.isArray(educationData.education) ? educationData.education : [];

        setEducation(educationItems);
      } catch (error) {
        console.error('Error fetching education data:', error);
      }
    };
    const fetchCertificationsData = async () => {
      try {
        // Fetch certifications data
        const certificationsResponse = await fetch('/api/certifications');
        if (!certificationsResponse.ok) {
          throw new Error('Failed to fetch certifications data');
        }
        const certificationsData = await certificationsResponse.json();
        const certificationsItems = Array.isArray(certificationsData) ? certificationsData :
          certificationsData.certifications && Array.isArray(certificationsData.certifications) ? certificationsData.certifications : [];

        setCertifications(certificationsItems);
      } catch (error) {
        console.error('Error fetching certifications data:', error);
      }
    }
    fetchCertificationsData();
    fetchEducationData();
  }, []);

  const skills = {
    technical: ["JavaScript", "TypeScript", "React", "Next.js", "Node.js", "HTML/CSS", "Tailwind CSS", "Git", "AWS"],
    soft: ["Problem Solving", "Communication", "Team Leadership", "Project Management", "Time Management"],
  }

  return (
    <section id="resume" ref={sectionRef} className="py-20 md:py-32 relative bg-muted/20">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
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
            Resume
          </motion.h2>
          <motion.p
            className="text-base text-muted-foreground max-w-xl mx-auto mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            My education, certifications, and skills.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <a href="/Resume (2).pdf" download>
              <Button variant="outline" className="rounded-full gap-2">
                <Download className="h-4 w-4" />
                Download Resume
              </Button>
            </a>
          </motion.div>
        </motion.div>

        <motion.div ref={contentRef} style={{ y: contentY }} className="max-w-4xl mx-auto">
          <Card className="border-none shadow-sm overflow-hidden">
            <CardContent className="p-6 md:p-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Education */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <div className="flex items-center mb-4">
                    <div className="bg-primary/10 p-2 rounded-full mr-3">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <h3 className="text-lg font-medium">Education</h3>
                  </div>

                  <motion.div
                    className="space-y-6"
                    variants={staggerContainer}
                    initial="hidden"
                    animate={isInView ? "show" : "hidden"}
                  >
                    {education.map((item, index) => (
                      <motion.div
                        key={item.id}
                        variants={fadeUpItem}
                        custom={index}
                        whileHover={{ x: 3 }}
                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                        className="relative pl-6 border-l border-primary/20"
                      >
                        <div className="absolute left-[-4px] top-1 h-2 w-2 rounded-full bg-primary" />
                        <h4 className="text-base font-medium">{item.degree}</h4>
                        <p className="text-sm text-muted-foreground">{item.institution}</p>
                        <p className="text-xs text-muted-foreground mb-1">{item.period}</p>
                        <p className="text-sm">{item.description}</p>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>

                {/* Certifications and Skills */}
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 10 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <div className="flex items-center mb-4">
                    <div className="bg-primary/10 p-2 rounded-full mr-3">
                      <Award className="h-4 w-4 text-primary" />
                    </div>
                    <h3 className="text-lg font-medium">Certifications</h3>
                  </div>

                  <motion.div
                    className="space-y-3 mb-8"
                    variants={staggerContainer}
                    initial="hidden"
                    animate={isInView ? "show" : "hidden"}
                  >
                    {certifications.map((cert, index) => (
                      <motion.div
                        key={cert._id}
                        variants={fadeUpItem}
                        custom={index}
                        whileHover={{ x: 3 }}
                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                        className="relative pl-6 border-l border-primary/20"
                      >
                        <div className="absolute left-[-4px] top-1 h-2 w-2 rounded-full bg-primary" />
                        <h4 className="text-base font-medium">{cert.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {cert.issuer} • {cert.date}
                        </p>
                      </motion.div>
                    ))}
                  </motion.div>

                  <div className="flex items-center mb-4">
                    <div className="bg-primary/10 p-2 rounded-full mr-3">
                      <Briefcase className="h-4 w-4 text-primary" />
                    </div>
                    <h3 className="text-lg font-medium">Skills</h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Technical Skills</h4>
                      <motion.div
                        className="flex flex-wrap gap-1.5"
                        variants={staggerContainer}
                        initial="hidden"
                        animate={isInView ? "show" : "hidden"}
                      >
                        {skills.technical.map((skill, index) => (
                          <motion.div
                            key={skill}
                            variants={fadeUpItem}
                            custom={index}
                            whileHover={{ y: -2, scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 300, damping: 10 }}
                          >
                            <Badge
                              variant="outline"
                              className="px-2 py-0.5 text-xs font-normal hover:bg-primary/10 transition-colors"
                            >
                              {skill}
                            </Badge>
                          </motion.div>
                        ))}
                      </motion.div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2">Soft Skills</h4>
                      <motion.div
                        className="flex flex-wrap gap-1.5"
                        variants={staggerContainer}
                        initial="hidden"
                        animate={isInView ? "show" : "hidden"}
                      >
                        {skills.soft.map((skill, index) => (
                          <motion.div
                            key={skill}
                            variants={fadeUpItem}
                            custom={index}
                            whileHover={{ y: -2, scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 300, damping: 10 }}
                          >
                            <Badge
                              variant="outline"
                              className="px-2 py-0.5 text-xs font-normal hover:bg-primary/10 transition-colors"
                            >
                              {skill}
                            </Badge>
                          </motion.div>
                        ))}
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}

