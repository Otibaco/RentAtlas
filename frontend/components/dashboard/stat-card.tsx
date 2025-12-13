"use client"

import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: number
  icon: LucideIcon
  color: string
  delay?: number
}

export function StatCard({ title, value, icon: Icon, color, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-4 sm:p-6 shadow-sm transition-shadow duration-200 hover:shadow-lg hover:shadow-primary/5"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground sm:text-sm">{title}</p>
          <motion.p
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: delay + 0.1 }}
            className="mt-2 text-2xl font-bold tracking-tight sm:mt-2.5 sm:text-3xl"
          >
            {value}
          </motion.p>
        </div>
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.5, delay: delay + 0.15, type: "spring", stiffness: 200 }}
          className={`rounded-xl p-2.5 shadow-sm sm:p-3.5 ${color}`}
        >
          <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
        </motion.div>
      </div>
    </motion.div>
  )
}
