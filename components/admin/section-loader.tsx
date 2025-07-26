"use client"

import { motion } from "framer-motion"

interface SectionLoaderProps {
  title?: string
}

export default function SectionLoader({ title }: SectionLoaderProps) {
  return (
    <div className="w-full h-full min-h-[300px] flex flex-col items-center justify-center">
      <motion.div
        className="relative w-12 h-12"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      >
        {[0, 1, 2, 3].map((index) => (
          <motion.div
            key={index}
            className="absolute w-3 h-3 bg-primary/20 rounded-full"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1, 0] }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              delay: index * 0.2,
              ease: "easeInOut",
            }}
            style={{
              top: index === 0 || index === 1 ? 0 : "auto",
              bottom: index === 2 || index === 3 ? 0 : "auto",
              left: index === 0 || index === 3 ? 0 : "auto",
              right: index === 1 || index === 2 ? 0 : "auto",
            }}
          />
        ))}
        <motion.div
          className="absolute inset-2 bg-primary/10 rounded-full"
          animate={{ scale: [0.8, 1, 0.8], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
      </motion.div>
      {title && (
        <motion.p
          className="mt-4 text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {title}
        </motion.p>
      )}
      <motion.div
        className="mt-6 grid grid-cols-3 gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="h-2 w-16 bg-muted rounded-full overflow-hidden"
            initial={{ opacity: 0.3 }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: i * 0.2 }}
          />
        ))}
      </motion.div>
    </div>
  )
}
