"use client"

import React from "react"

export function LiquidFilters() {
    return (
        <svg className="fixed pointer-events-none opacity-0 h-0 w-0" aria-hidden="true">
            <filter id="liquid-distortion">
                <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0.008 0.006"
                    numOctaves="2"
                    seed="2"
                >
                    <animate
                        attributeName="baseFrequency"
                        dur="45s"
                        values="0.008 0.006; 0.012 0.01; 0.008 0.006"
                        repeatCount="indefinite"
                    />
                </feTurbulence>
                <feDisplacementMap in="SourceGraphic" scale="28" />
                <feOffset dx="8" dy="8" />
                <feGaussianBlur stdDeviation="1.2" />
            </filter>
        </svg>
    )
}
