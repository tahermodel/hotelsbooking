"use client"

import React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface LiquidGlassProps {
    children: React.ReactNode
    className?: string
    animate?: boolean
}

export function LiquidGlass({
    children,
    className,
    animate = true
}: LiquidGlassProps) {
    return (
        <motion.div
            className={cn(
                "liquid-glass relative group",
                className
            )}
            whileHover={animate ? { scale: 1.02 } : {}}
            whileTap={animate ? { scale: 0.98 } : {}}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
            {children}
        </motion.div>
    )
}
