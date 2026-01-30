"use client"

import React, { useEffect, useRef, useCallback } from "react"
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
            
            float angle = atan(uv.y - 0.5, uv.x - 0.5);
            float dist = length(uv - vec2(0.5));
            
            float hue = (angle / (2.0 * PI) + 0.5) + time * 0.2;
            float rainbowStrength = smoothstep(0.2, 0.5, dist) * 0.25;
            rainbowStrength *= 1.0 + sin(angle * 3.0 + time * 2.0) * 0.3;
            vec3 rainbow = hsv2rgb(vec3(hue, 0.6, 1.0));
            
            float movingShine = sin(uv.x * 4.0 + uv.y * 2.0 - time * 2.0) * 0.5 + 0.5;
            movingShine = pow(movingShine, 6.0) * 0.2;
            
            vec3 baseColor = vec3(1.0, 1.0, 1.0);
            
            vec3 finalColor = baseColor;
            finalColor += topHighlight;
            finalColor += specular1;
            finalColor += specular2;
            finalColor += borderGlow;
            finalColor += mouseHighlight;
            finalColor += movingShine;
            finalColor = mix(finalColor, rainbow, rainbowStrength);
            
            float alpha = 0.05;
            alpha += topHighlight * 0.5;
            alpha += specular1 * 0.7;
            alpha += specular2 * 0.5;
            alpha += borderGlow * 0.6;
            alpha += mouseHighlight * 0.5;
            alpha += movingShine * 0.3;
            alpha += rainbowStrength * 0.4;
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
                "backdrop-blur-[2px] backdrop-saturate-150", // Base ultra-subtle refraction
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

            {/* Edge Refraction Layer - Simulates bending at the glass edges */}
            <div
                className="absolute inset-0 z-[2] pointer-events-none rounded-3xl backdrop-blur-md"
                style={{
                    maskImage: 'radial-gradient(ellipse at center, transparent 85%, black 100%)',
                    WebkitMaskImage: 'radial-gradient(ellipse at center, transparent 85%, black 100%)'
                }}
            />

            <div className="absolute inset-0 z-[3] pointer-events-none overflow-hidden rounded-3xl">
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 60%)',
                        mixBlendMode: 'overlay'
                    }}
                />
                <div
                    className="absolute top-0 left-[5%] right-[5%] h-[1px]"
                    style={{
                        background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)'
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
