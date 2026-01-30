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
        uniform vec2 uResolution;
        uniform float uAspect;
        
        #define PI 3.14159265359
        
        float hash(vec2 p) {
            return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
        }
        
        float noise(vec2 p) {
            vec2 i = floor(p);
            vec2 f = fract(p);
            f = f * f * (3.0 - 2.0 * f);
            
            float a = hash(i);
            float b = hash(i + vec2(1.0, 0.0));
            float c = hash(i + vec2(0.0, 1.0));
            float d = hash(i + vec2(1.0, 1.0));
            
            return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
        }
        
        float fbm(vec2 p) {
            float value = 0.0;
            float amplitude = 0.5;
            float frequency = 1.0;
            for(int i = 0; i < 5; i++) {
                value += amplitude * noise(p * frequency);
                amplitude *= 0.5;
                frequency *= 2.0;
            }
            return value;
        }
        
        vec3 rgb2hsv(vec3 c) {
            vec4 K = vec4(0.0, -1.0/3.0, 2.0/3.0, -1.0);
            vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
            vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
            float d = q.x - min(q.w, q.y);
            float e = 1.0e-10;
            return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
        }
        
        vec3 hsv2rgb(vec3 c) {
            vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
            vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
            return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
        }
        
        void main() {
            vec2 uv = vUv;
            vec2 aspect = vec2(uAspect, 1.0);
            vec2 center = vec2(0.5);
            
            float time = uTime * 0.4;
            
            vec2 mouseInfluence = (uMouse - center) * 0.1;
            
            vec2 warp = vec2(0.0);
            warp.x = sin(uv.y * 8.0 + time * 2.0) * 0.006;
            warp.y = cos(uv.x * 6.0 + time * 1.5) * 0.004;
            warp += mouseInfluence;
            
            float n = fbm(uv * 3.0 + time * 0.3);
            warp += (n - 0.5) * 0.01;
            
            vec2 warpedUv = uv + warp;
            
            vec3 glassColor = vec3(1.0);
            
            float topGradient = 1.0 - uv.y;
            float mainHighlight = pow(topGradient, 1.5) * 0.6;
            
            float diagonalHighlight = pow(max(0.0, 1.0 - length(uv - vec2(0.3, 0.2)) * 2.0), 2.0) * 0.4;
            
            float bottomReflect = pow(uv.y, 3.0) * 0.15;
            
            float movingShine1 = sin(uv.x * 3.0 + uv.y * 2.0 + time * 1.5) * 0.5 + 0.5;
            movingShine1 = pow(movingShine1, 4.0) * 0.25;
            
            float movingShine2 = sin(uv.x * 5.0 - uv.y * 3.0 + time * 2.0) * 0.5 + 0.5;
            movingShine2 = pow(movingShine2, 6.0) * 0.2;
            
            float sparkle = sin(uv.x * 50.0 + time * 5.0) * sin(uv.y * 40.0 + time * 4.0);
            sparkle = pow(max(0.0, sparkle), 8.0) * 0.3;
            
            float caustics = fbm(warpedUv * 8.0 + time * 0.5) * 0.15;
            caustics += fbm(warpedUv * 12.0 - time * 0.3) * 0.1;
            
            float edgeDist = min(min(uv.x, 1.0 - uv.x), min(uv.y, 1.0 - uv.y));
            float borderShine = smoothstep(0.08, 0.0, edgeDist) * 0.6;
            borderShine *= 1.0 + sin(atan(uv.y - 0.5, uv.x - 0.5) * 4.0 + time * 3.0) * 0.3;
            
            float angle = atan(uv.y - 0.5, uv.x - 0.5);
            vec3 rainbow = vec3(
                sin(angle + time) * 0.5 + 0.5,
                sin(angle + time + 2.094) * 0.5 + 0.5,
                sin(angle + time + 4.189) * 0.5 + 0.5
            );
            rainbow = mix(vec3(1.0), rainbow, 0.08);
            
            vec3 finalColor = glassColor;
            finalColor *= rainbow;
            finalColor += mainHighlight;
            finalColor += diagonalHighlight;
            finalColor += bottomReflect;
            finalColor += movingShine1;
            finalColor += movingShine2;
            finalColor += sparkle;
            finalColor += caustics;
            finalColor += borderShine;
            
            float alpha = 0.25;
            alpha += mainHighlight * 0.4;
            alpha += diagonalHighlight * 0.5;
            alpha += movingShine1 * 0.3;
            alpha += movingShine2 * 0.2;
            alpha += sparkle * 0.5;
            alpha += borderShine * 0.6;
            alpha = clamp(alpha, 0.15, 0.85);
            
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
                uResolution: { value: new THREE.Vector2(1, 1) },
                uAspect: { value: 1 }
            }

            const geometry = new THREE.PlaneGeometry(2, 2)
            const material = new THREE.ShaderMaterial({
                vertexShader,
                fragmentShader,
                uniforms,
                transparent: true,
                depthWrite: false,
                blending: THREE.NormalBlending
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
        sceneData.uniforms.uResolution.value.set(width, height)
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
                "bg-white/25 backdrop-blur-md",
                "border border-white/50",
                "shadow-[inset_0_1px_0_rgba(255,255,255,0.6),inset_0_-1px_0_rgba(255,255,255,0.1)]",
                className
            )}
            whileHover={animate ? {
                scale: 1.015,
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(255,255,255,0.2), 0 0 30px rgba(255,255,255,0.15)"
            } : {}}
            whileTap={animate ? { scale: 0.99 } : {}}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
        >
            <canvas
                ref={canvasRef}
                className="absolute inset-0 z-[1] pointer-events-none opacity-80"
            />
            <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden rounded-3xl">
                <div
                    className="absolute top-0 left-[5%] right-[5%] h-[1px]"
                    style={{
                        background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%)'
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
            </div>
            <div className="relative z-10 w-full h-full">
                {children}
            </div>
        </motion.div>
    )
}
