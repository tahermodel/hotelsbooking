"use client"

import React from "react"

export function LiquidFilters() {
    return (
        <svg className="fixed pointer-events-none opacity-0 h-0 w-0" aria-hidden="true">
            <filter id="liquid-distortion">
                <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0.01 0.01"
                    numOctaves="3"
                    seed="1"
                >
                    <animate
                        attributeName="baseFrequency"
                        dur="60s"
                        values="0.01 0.01; 0.015 0.02; 0.01 0.01"
                        repeatCount="indefinite"
                    />
                </feTurbulence>
                <feDisplacementMap in="SourceGraphic" scale="10" />
            </filter>
        </svg>
    )
}
