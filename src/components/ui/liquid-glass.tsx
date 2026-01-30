"use client"

import React, { useEffect, useRef, useCallback, useState, useMemo } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import * as THREE from 'three'

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
    const rimFilterId = useMemo(() => `rim-distortion-${Math.random().toString(36).substr(2, 9)}`, [])
    const bodyFilterId = useMemo(() => `body-distortion-${Math.random().toString(36).substr(2, 9)}`, [])
    const [refractionScale, setRefractionScale] = useState(0)

    useEffect(() => {
        // Choose magnification (positive) or minification (negative) - Scale reduced for quality
        const scale = Math.random() > 0.5 ? 50 : -50
        setRefractionScale(scale)
    }, [])
    const containerRef = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const sceneRef = useRef<{
        renderer: THREE.WebGLRenderer
        scene: THREE.Scene
        camera: THREE.OrthographicCamera
        mesh: THREE.Mesh
        clock: THREE.Clock
        animationId: number
        uniforms: any
        mouse: THREE.Vector2
        targetMouse: THREE.Vector2
    } | null>(null)

    const vertexShader = `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `

    const fragmentShader = `
        precision highp float;
        
        varying vec2 vUv;
        uniform float uTime;
        uniform vec2 uMouse;
        uniform float uAspect;
        
        #define PI 3.14159265359
        
        vec3 hsv2rgb(vec3 c) {
            vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
            vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
            return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
        }
        
        void main() {
            vec2 uv = vUv;
            float time = uTime * 0.5;
            
            float topHighlight = pow(1.0 - uv.y, 2.0) * 0.7;
            
            float specular1 = pow(max(0.0, 1.0 - length(uv - vec2(0.3, 0.2)) * 2.0), 4.0) * 0.6;
            float specular2 = pow(max(0.0, 1.0 - length(uv - vec2(0.7, 0.15)) * 3.0), 5.0) * 0.3;
            
            float edgeDist = min(min(uv.x, 1.0 - uv.x), min(uv.y, 1.0 - uv.y));
            float borderGlow = pow(smoothstep(0.08, 0.0, edgeDist), 1.5) * 0.5;
            
            vec2 mouseOffset = (uMouse - vec2(0.5)) * 0.15;
            float mouseHighlight = pow(max(0.0, 1.0 - length(uv - vec2(0.5) - mouseOffset) * 2.5), 3.0) * 0.3;
            
            float movingShine = sin(uv.x * 4.0 + uv.y * 2.0 - time * 2.0) * 0.5 + 0.5;
            movingShine = pow(movingShine, 6.0) * 0.2;
            
            vec3 finalColor = vec3(1.0);
            finalColor += topHighlight;
            finalColor += specular1;
            finalColor += specular2;
            finalColor += borderGlow;
            finalColor += mouseHighlight;
            finalColor += movingShine;
            
            float alpha = 0.05;
            alpha += topHighlight * 0.5;
            alpha += specular1 * 0.7;
            alpha += specular2 * 0.5;
            alpha += borderGlow * 0.6;
            alpha += mouseHighlight * 0.5;
            alpha += movingShine * 0.3;
            alpha = clamp(alpha, 0.0, 0.8);
            
            gl_FragColor = vec4(finalColor, alpha);
        }
    `

    const initScene = useCallback(() => {
        const canvas = canvasRef.current
        const container = containerRef.current
        if (!canvas || !container) return

        try {
            const renderer = new THREE.WebGLRenderer({
                canvas,
                alpha: true,
                antialias: true,
                premultipliedAlpha: false
            })
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
            renderer.setClearColor(0x000000, 0)

            const scene = new THREE.Scene()

            const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10)
            camera.position.z = 1

            const uniforms = {
                uTime: { value: 0 },
                uMouse: { value: new THREE.Vector2(0.5, 0.5) },
                uAspect: { value: 1 }
            }

            const geometry = new THREE.PlaneGeometry(2, 2)
            const material = new THREE.ShaderMaterial({
                vertexShader,
                fragmentShader,
                uniforms,
                transparent: true,
                depthWrite: false,
                blending: THREE.AdditiveBlending
            })

            const mesh = new THREE.Mesh(geometry, material)
            scene.add(mesh)

            const clock = new THREE.Clock()

            sceneRef.current = {
                renderer,
                scene,
                camera,
                mesh,
                clock,
                animationId: 0,
                uniforms,
                mouse: new THREE.Vector2(0.5, 0.5),
                targetMouse: new THREE.Vector2(0.5, 0.5)
            }

            updateSize()
            animateScene()

        } catch (error) {
            console.warn('WebGL initialization failed:', error)
        }
    }, [])

    const updateSize = useCallback(() => {
        const container = containerRef.current
        const sceneData = sceneRef.current
        if (!container || !sceneData) return

        const rect = container.getBoundingClientRect()
        const width = Math.max(rect.width, 1)
        const height = Math.max(rect.height, 1)

        sceneData.renderer.setSize(width, height)
        sceneData.uniforms.uAspect.value = width / height
    }, [])

    const animateScene = useCallback(() => {
        const sceneData = sceneRef.current
        if (!sceneData) return

        const { renderer, scene, camera, clock, uniforms, mouse, targetMouse } = sceneData

        mouse.lerp(targetMouse, 0.08)
        uniforms.uMouse.value.copy(mouse)
        uniforms.uTime.value = clock.getElapsedTime()

        renderer.render(scene, camera)
        sceneData.animationId = requestAnimationFrame(animateScene)
    }, [])

    const handleMouseMove = useCallback((e: MouseEvent) => {
        const container = containerRef.current
        const sceneData = sceneRef.current
        if (!container || !sceneData) return

        const rect = container.getBoundingClientRect()
        sceneData.targetMouse.x = (e.clientX - rect.left) / rect.width
        sceneData.targetMouse.y = 1.0 - (e.clientY - rect.top) / rect.height
    }, [])

    const handleMouseLeave = useCallback(() => {
        const sceneData = sceneRef.current
        if (!sceneData) return
        sceneData.targetMouse.set(0.5, 0.5)
    }, [])

    useEffect(() => {
        initScene()

        const container = containerRef.current
        if (container && animate) {
            container.addEventListener('mousemove', handleMouseMove)
            container.addEventListener('mouseleave', handleMouseLeave)
        }

        const resizeObserver = new ResizeObserver(updateSize)
        if (container) {
            resizeObserver.observe(container)
        }

        return () => {
            if (sceneRef.current) {
                cancelAnimationFrame(sceneRef.current.animationId)
                sceneRef.current.renderer.dispose()
                sceneRef.current.mesh.geometry.dispose()
                if (sceneRef.current.mesh.material instanceof THREE.Material) {
                    sceneRef.current.mesh.material.dispose()
                }
            }
            if (container && animate) {
                container.removeEventListener('mousemove', handleMouseMove)
                container.removeEventListener('mouseleave', handleMouseLeave)
            }
            resizeObserver.disconnect()
        }
    }, [initScene, updateSize, handleMouseMove, handleMouseLeave, animate])

    return (
        <motion.div
            ref={containerRef}
            className={cn(
                "relative overflow-hidden rounded-3xl",
                "bg-white/5", // Very transparent base
                "backdrop-blur-[1px] backdrop-saturate-150", // Base ultra-subtle refraction
                "border border-white/20", // Subtle border
                "shadow-sm",
                className
            )}
            whileHover={animate ? {
                scale: 1.015,
            } : {}}
            whileTap={animate ? { scale: 0.99 } : {}}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
        >
            <canvas
                ref={canvasRef}
                className="absolute inset-0 z-[1] pointer-events-none opacity-80"
            />

            {/* Whole Surface Refraction Layer - Removed, reverting to Rim Only */}


            {/* Invisible SVG for filters */}
            <svg style={{ position: 'absolute', width: '0', height: '0', pointerEvents: 'none' }}>
                <defs>
                    {/* Rim Filter: Strong Scale Distortion */}
                    <filter id={rimFilterId} x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency="0.03"
                            numOctaves="2"
                            seed="5"
                            result="noise"
                        />
                        <feDisplacementMap
                            in="SourceGraphic"
                            in2="noise"
                            scale={Math.abs(refractionScale)}
                            xChannelSelector="R"
                            yChannelSelector="G"
                        />
                    </filter>

                    {/* Body Filter: Horizontal Bending */}
                    <filter id={bodyFilterId} x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
                        <feTurbulence
                            type="turbulence"
                            baseFrequency="0.01 0.005"
                            numOctaves="2"
                            seed="5"
                            result="noise"
                        />
                        <feDisplacementMap
                            in="SourceGraphic"
                            in2="noise"
                            scale="20"
                            xChannelSelector="R"
                            yChannelSelector="G"
                        />
                    </filter>
                </defs>
            </svg>

            {/* 0. DISPLACEMENT LAYERS (Bottom) - Only affect the BACKDROP */}
            {/* These divs must have background:transparent to only distort the content BEHIND the component */}

            {/* Body Filter: Horizontal Bending (Center) */}
            <div
                className="absolute inset-0 z-[0] pointer-events-none rounded-3xl"
                style={{
                    backgroundColor: 'transparent',
                    backdropFilter: `url(#${bodyFilterId})`, // Distorts what is BEHIND
                    WebkitBackdropFilter: `url(#${bodyFilterId})`,
                    maskImage: 'radial-gradient(ellipse at center, black 60%, transparent 100%)', // Focus on body
                    WebkitMaskImage: 'radial-gradient(ellipse at center, black 60%, transparent 100%)'
                }}
            />

            {/* Rim Filter: Magnification/Minification (Edges) */}
            <div
                className="absolute inset-0 z-[0] pointer-events-none rounded-3xl"
                style={{
                    backgroundColor: 'transparent',
                    backdropFilter: `url(#${rimFilterId}) blur(0.5px)`, // Distorts what is BEHIND
                    WebkitBackdropFilter: `url(#${rimFilterId}) blur(0.5px)`,
                    maskImage: 'radial-gradient(ellipse at center, transparent 80%, black 100%)', // Focus on rim
                    WebkitMaskImage: 'radial-gradient(ellipse at center, transparent 80%, black 100%)'
                }}
            />

            {/* 1. VISUAL LAYERS (Top) - Sitting ON TOP of the distortion */}
            {/* WebGL Canvas (Noise/Shine) - NOT distorted by the filters above because it's higher z-index/separate */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 z-[1] pointer-events-none opacity-80"
            />

            {/* Static Glass Highlights/Reflection - NOT distorted */}
            <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden rounded-3xl">
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 40%)',
                        mixBlendMode: 'overlay',
                        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.1)'
                    }}
                />
                <div
                    className="absolute top-0 left-[2%] right-[2%] h-[2px]"
                    style={{
                        background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.9) 50%, transparent 100%)',
                        filter: 'blur(1px)'
                    }}
                />
                <div
                    className="absolute bottom-0 left-[15%] right-[15%] h-[1px]"
                    style={{
                        background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)'
                    }}
                />
            </div>
            <div className="relative z-10 w-full h-full">
                {children}
            </div>
        </motion.div>
    )
}
