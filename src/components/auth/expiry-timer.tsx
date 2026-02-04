"use client"

import { useState, useEffect } from "react"

export function ExpiryTimer({ initialTime, onExpiry }: { initialTime: number, onExpiry?: () => void }) {
    const [timeLeft, setTimeLeft] = useState(initialTime)

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(interval)
                    onExpiry?.()
                    return 0
                }
                return prev - 1
            })
        }, 1000)
        return () => clearInterval(interval)
    }, [onExpiry])

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${minutes}:${secs.toString().padStart(2, '0')}`
    }

    return (
        <span className="text-white/50 font-medium">
            Expires in {formatTime(timeLeft)}
        </span>
    )
}
