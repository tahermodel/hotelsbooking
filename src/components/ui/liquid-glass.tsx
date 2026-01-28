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
                whileHover={animate ? {
                    scale: 1.05,
                    y: -10,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 20px 2px rgba(255, 255, 255, 0.05)",
                    transition: { type: "spring", stiffness: 300, damping: 15 }
                } : {}}
                whileTap={{ scale: 0.98 }}
            >
                {/* 1. Underlying Refraction (Outer distortion & Magnification) */}
                <div className="absolute inset-[-20%] pointer-events-none opacity-100 liquid-refract scale-[1.3]" />

                {/* 2. Frosted Blur Layer (Implicit in liquid-glass class) */}

                {/* 3. Deep Inner Shadow for volume */}
                <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_40px_rgba(255,255,255,0.05)]" />

                {/* 4. Glossy Specular Highlight (Top-left) */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/20 via-transparent to-white/5 opacity-40" />

                {/* 5. Edge Highlight (Bezel effect) */}
                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />

                <div className="relative z-10 h-full w-full">
                    {children}
                </div>
            </motion.div>
        </div>
    )
}
