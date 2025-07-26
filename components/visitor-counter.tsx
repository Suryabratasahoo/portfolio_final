"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { useScrollInView } from "@/lib/framer-utils"
import { Users, Award } from "lucide-react"
import { useInView } from "framer-motion"
import toast from "react-hot-toast"

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
    const end = Math.min(value, 9999)

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
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}

export default function VisitorCounter() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useScrollInView(sectionRef, { once: false, amount: 0.2 })
  const [visitorCount, setVisitorCount] = useState(0)
  const [email, setEmail] = useState("")
  const [isEmailValid, setIsEmailValid] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showBounce, setShowBounce] = useState(false)



  // ✅ Check email format on change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com|hotmail\.com)$/;

    setIsEmailValid(emailRegex.test(value))
  }
  // Function to trigger confetti effect
  function triggerConfetti() {
    // In a real application, this would also submit the form
    import("canvas-confetti").then((confetti) => {
      const count = 200
      const defaults = {
        origin: { y: 0.7 },
        zIndex: 1000,
      }

      function fire(particleRatio: number, opts: any) {
        confetti.default({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        })
      }

      fire(0.25, {
        spread: 26,
        startVelocity: 55,
      })

      fire(0.2, {
        spread: 60,
      })

      fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
      })

      fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
      })

      fire(0.1, {
        spread: 120,
        startVelocity: 45,
      })
    })
  }
  const subscribeUser = async () => {
    setIsLoading(true)

    console.log("User subscribed with email:", email)
    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      if (response.status === 409) {
        // User is already subscribed
        setIsSubscribed(true)
        toast('You are already a subscriber!', {
          icon: '😍',
        }); // You can display a special message if needed
        return
      }

      if (!response.ok) {
        throw new Error("Failed to subscribe")
      }

      setIsSubscribed(true)
      triggerConfetti()

      // Trigger temporary bounce
      setShowBounce(true)
      setTimeout(() => setShowBounce(false), 2000)
    } catch (error) {
      toast.error("Failed to subscribe. Please try again later.")
    } finally {
      setIsLoading(false)
      setEmail("")
      setIsEmailValid(false)
    }
  }




  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [50, 0, 0, -50])

  // Simulate fetching visitor count from server
  useEffect(() => {
    // In a real application, this would be an API call to get the actual count
    // For demo purposes, we'll generate a random number between 1000 and 5000
    const randomVisitorCount = 100
    setVisitorCount(randomVisitorCount)
  }, [])

  return (
    <section ref={sectionRef} className="py-16 md:py-24 relative overflow-hidden bg-muted/10">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/3 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
          animate={{
            x: [0, 20, 0],
            y: [0, -20, 0],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
      </div>

      <motion.div className="container mx-auto px-4" style={{ opacity, y }}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="bg-background rounded-lg p-8 shadow-sm border border-border/50 relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            whileHover={{
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
              borderColor: "rgba(var(--primary-rgb), 0.3)",
              transition: { duration: 0.2 },
            }}
          >
            {/* Decorative background elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-xl" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/5 rounded-full blur-xl" />

            <div className="relative z-10">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1">
                  <motion.div
                    className="flex items-center gap-3 mb-4"
                    initial={{ opacity: 0, x: -10 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="bg-blue-500/10 p-2 rounded-full">
                      <Users className="h-5 w-5 text-blue-500" />
                    </div>
                    <h3 className="text-xl font-medium">Visitor Statistics</h3>
                  </motion.div>

                  <motion.p
                    className="text-muted-foreground mb-6"
                    initial={{ opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  >
                    Join our growing community of visitors from around the world. Subscribe to our newsletter to stay
                    updated with the latest projects and articles.
                  </motion.p>

                  <motion.div
                    className="flex flex-wrap gap-6 md:gap-10 justify-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  >
                    


                    <div className="text-center">
                      <div className="text-3xl md:text-4xl font-bold text-green-500 mb-1">
                        <Counter value={50} duration={2} delay={0.4} />
                      </div>
                      <p className="text-sm text-muted-foreground">Subscribers</p>
                    </div>
                  </motion.div>
                </div>

                <motion.div
                  className="w-full md:w-auto"
                  initial={{ opacity: 0, x: 10 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 10 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <div className="bg-muted/50 p-6 rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-green-500/10 p-2 rounded-full">
                        <Award className="h-4 w-4 text-green-500" />
                      </div>
                      <h4 className="text-base font-medium">Subscribe</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">Get notified about new projects and updates.</p>
                    <form onSubmit={(e) => e.preventDefault()} className="space-y-3">
                      <input
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        placeholder="Your email"
                        className="w-full px-3 py-2 text-sm rounded-md border border-border bg-background"
                      />

                      <button
                        type="button"
                        onClick={subscribeUser}
                        disabled={!isEmailValid || isLoading || isSubscribed}
                        className={`w-full px-3 py-2 rounded-md text-sm font-medium flex items-center justify-center transition-all duration-300
    ${isSubscribed
                            ? `bg-green-500 text-white cursor-not-allowed ${showBounce ? "animate-bounce" : ""
                            }`
                            : isLoading
                              ? "bg-primary/70 text-white cursor-wait"
                              : "bg-primary text-primary-foreground hover:bg-primary/90"
                          }`}
                      >
                        {isLoading ? (
                          <span className="flex items-center gap-2">
                            <svg
                              className="animate-spin h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v8H4z"
                              ></path>
                            </svg>
                            Subscribing...
                          </span>
                        ) : isSubscribed ? (
                          <span className="flex items-center gap-1">🎉 Subscribed!</span>
                        ) : (
                          "Subscribe"
                        )}
                      </button>


                    </form>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}



// Import at the top level to avoid the error

