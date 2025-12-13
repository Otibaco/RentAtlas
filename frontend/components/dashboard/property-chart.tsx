"use client"

import { motion } from "framer-motion"

export function PropertyChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.6 }}
      className="rounded-2xl border border-border/50 bg-card p-4 sm:p-6 shadow-sm"
    >
      <h2 className="text-base font-semibold mb-4 sm:text-lg">Property Trends</h2>
      <div className="h-48 sm:h-64 flex items-end justify-around gap-1.5 sm:gap-2">
        {[65, 45, 70, 55, 80, 60, 75].map((height, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            animate={{ height: `${height}%` }}
            transition={{ duration: 0.6, delay: 0.8 + i * 0.1 }}
            className="flex-1 bg-chart-1 rounded-t-md"
          />
        ))}
      </div>
      <div className="mt-3 sm:mt-4 flex justify-around text-[10px] sm:text-xs text-muted-foreground">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
    </motion.div>
  )
}
