"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ReactNode } from "react"

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
}

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
}

interface ClientAnimationWrapperProps {
    children: ReactNode
    className?: string
}

export function ClientContentWrapper({ children, className }: ClientAnimationWrapperProps) {
    return (
        <motion.main
            className={className}
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            {children}
        </motion.main>
    )
}

export function AnimatedSection({ children, className }: ClientAnimationWrapperProps) {
    return (
        <motion.div variants={itemVariants} className={className}>
            {children}
        </motion.div>
    )
}

export function AnimatedScaleButton({ children, className, onClick, type = "button", disabled }: { children: ReactNode, className?: string, onClick?: () => void, type?: "button" | "submit", disabled?: boolean }) {
    return (
        <motion.button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={className}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            {children}
        </motion.button>
    )
}
