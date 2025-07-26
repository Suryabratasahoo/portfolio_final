"use client"

import { useRef, useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { useScrollInView } from "@/lib/framer-utils"

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const isInView = useScrollInView(sectionRef, { once: false, amount: 0.1 })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  const testimonials = [
    {
      id: 1,
      name: "Tangella Naga Charan",
      role: "Director, Appe Nexus",
      avatar: "/placeholder.svg?height=100&width=100",
      content:
        "Working with Surya was an absolute pleasure. He delivered our project on time and exceeded our expectations. His attention to detail and problem-solving skills are impressive.",
    },
    {
      id: 2,
      name: "Venu Charan",
      role: "Tech Lead, Appe Nexus",
      avatar: "/placeholder.svg?height=100&width=100",
      content:
        "Surya built a powerful and intuitive admin dashboard for our website, Cheeze Choice. His technical expertise and thoughtful design approach streamlined our operations and elevated the way we manage our platform.",
    },
    
  ]

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 500 : -500,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 500 : -500,
      opacity: 0,
      scale: 0.9,
    }),
  }

  const swipeConfidenceThreshold = 10000
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity
  }

  const [[page, direction], setPage] = useState([0, 0])

  const paginate = (newDirection: number) => {
    const newPage = page + newDirection
    const adjustedPage = ((newPage % testimonials.length) + testimonials.length) % testimonials.length
    setPage([adjustedPage, newDirection])
    setActiveIndex(adjustedPage)
  }

  return (
    <section id="testimonials" ref={sectionRef} className="py-20 md:py-32 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
          animate={{
            y: [0, 30, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
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
            Testimonials
          </motion.h2>
          <motion.p
            className="text-base text-muted-foreground max-w-xl mx-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            What clients say about working with me.
          </motion.p>
        </motion.div>

        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ opacity }}
        >
          <div className="relative">
            <div className="overflow-hidden">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={page}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 250, damping: 30 },
                    opacity: { duration: 0.2 },
                    scale: { duration: 0.3 },
                  }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={1}
                  onDragEnd={(e, { offset, velocity }) => {
                    const swipe = swipePower(offset.x, velocity.x)
                    if (swipe < -swipeConfidenceThreshold) {
                      paginate(1)
                    } else if (swipe > swipeConfidenceThreshold) {
                      paginate(-1)
                    }
                  }}
                  className="w-full px-4"
                >
                  <Card className="border-none shadow-sm bg-background">
                    <CardContent className="pt-6 pb-2">
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="flex justify-center"
                      >
                        <Quote className="h-8 w-8 text-primary/20 mb-4" />
                      </motion.div>
                      <motion.p
                        className="text-base italic text-center"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                      >
                        {testimonials[activeIndex].content}
                      </motion.p>
                    </CardContent>
                    <CardFooter className="flex items-center justify-center gap-4 pt-4 pb-6">
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.3 }}
                      >
                        <Avatar className="h-12 w-12 border-2 border-primary/10">
                          <AvatarImage src={testimonials[activeIndex].avatar} alt={testimonials[activeIndex].name} />
                          <AvatarFallback>{testimonials[activeIndex].name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.4 }}
                      >
                        <p className="text-sm font-medium">{testimonials[activeIndex].name}</p>
                        <p className="text-xs text-muted-foreground">{testimonials[activeIndex].role}</p>
                      </motion.div>
                    </CardFooter>
                  </Card>
                </motion.div>
              </AnimatePresence>
            </div>

            <motion.div
              className="flex justify-center mt-6 gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => paginate(-1)}
                  aria-label="Previous testimonial"
                  className="h-8 w-8 rounded-full"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => paginate(1)}
                  aria-label="Next testimonial"
                  className="h-8 w-8 rounded-full"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              className="flex justify-center mt-4"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              {testimonials.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => {
                    const direction = index > activeIndex ? 1 : -1
                    setPage([index, direction])
                    setActiveIndex(index)
                  }}
                  className={`h-1.5 w-1.5 rounded-full mx-1 ${index === activeIndex ? "bg-primary" : "bg-primary/20"}`}
                  whileHover={{ scale: 1.3 }}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

