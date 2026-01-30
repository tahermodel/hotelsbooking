"use client"

import React from "react"

export function LiquidFilters() {
    return (
        <svg style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }} aria-hidden="true" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <filter id="liquid-glass-refraction" x="-50%" y="-50%" width="200%" height="200%">
                    {/* Create displacement map for refraction */}
                    <feImage href="data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3CradialGradient id='g'%3E%3Cstop offset='0%25' stop-color='%23ffffff'/%3E%3Cstop offset='100%25' stop-color='%23000000'/%3E%3C/radialGradient%3E%3Crect width='100' height='100' fill='url(%23g)'/%3E%3C/svg%3E" result="map" />
                    <feDisplacementMap in="SourceGraphic" in2="map" scale="8" xChannelSelector="R" yChannelSelector="G" />
                    <feGaussianBlur stdDeviation="2" />
                    <feComposite operator="in" in2="SourceGraphic" />
                </filter>
            </defs>
        </svg>
    )
}
