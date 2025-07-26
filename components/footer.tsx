"use client"

import { useRef } from "react"
import Link from "next/link"
import { Heart } from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"
import { useScrollInView } from "@/lib/framer-utils"

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null)
  const isInView = useScrollInView(footerRef, { once: false, amount: 0.1 })

  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ["start end", "end end"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1])

  const quickLinks = [
    { name: "About", href: "#about" },
    { name: "Projects", href: "#projects" },
    { name: "Experience", href: "#experience" },
    { name: "Resume", href: "#resume" },
    { name: "Contact", href: "#contact" },
  ]

  return (
    <motion.footer
      ref={footerRef}
      className="py-12 relative overflow-hidden border-t border-border"
      style={{ opacity }}
    >
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-3 gap-8 mb-8 ">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.4 }}
          >
            <h3 className="text-base font-medium mb-3">Suryabrata Sahoo</h3>
            <p className="text-sm text-muted-foreground">
              A passionate web developer focused on creating clean, minimal, and functional websites.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <h3 className="text-base font-medium mb-3">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, x: -5 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -5 }}
                  transition={{ duration: 0.4, delay: 0.2 + index * 0.05 }}
                  whileHover={{ x: 3 }}
                >
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors animated-underline"
                  >
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <h3 className="text-base font-medium mb-3">Suryabrata Sahoo</h3>
            <p className="text-sm text-muted-foreground mb-3">A Pre-Final year student,ML Enthusiast and aspiring ML engineer</p>
            
          </motion.div>
        </div>

        <motion.div
          className="border-t border-border pt-6 flex flex-col md:flex-row justify-between items-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Suryabrata Sahoo. All rights reserved.</p>

          <motion.p
            className="text-xs text-muted-foreground flex items-center mt-4 md:mt-0"
            animate={{
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          >
            Made with <Heart className="h-3 w-3 text-red-500 mx-1" /> using Next.js and Tailwind CSS
          </motion.p>
        </motion.div>
      </div>
    </motion.footer>
  )
}

