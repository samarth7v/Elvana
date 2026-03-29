import { motion } from "framer-motion"
import { ReactNode } from "react"

interface RevealProps {
  children: ReactNode
  delay?: number
  width?: "fit-content" | "100%"
  className?: string
}

export const Reveal = ({ children, delay = 0, width = "100%", className = "" }: RevealProps) => {
  return (
    <div style={{ width, overflow: "hidden" }} className={className}>
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.8, delay: delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </div>
  )
}
