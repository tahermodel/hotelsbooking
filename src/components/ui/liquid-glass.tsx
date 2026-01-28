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
        <div className="relative group">
            <motion.div
                className={cn(
                    "liquid-glass rounded-2xl overflow-hidden transition-all duration-500",
                    className
                )}
                whileHover={animate ? { scale: 1.01 } : {}}
            >
                {/* Refraction Overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-50 liquid-refract" />

                {/* Glossy Reflection */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-30" />

                <div className="relative z-10">
                    {children}
                </div>
            </motion.div>
        </div>
    )
}
