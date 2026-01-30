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
            
            float time = uTime * 0.3;
            
            vec2 mouseInfluence = (uMouse - center) * 0.08;
            
            float dist = length((uv - center) * aspect);
            float edgeMask = smoothstep(0.6, 0.2, dist);
            
            vec2 warp = vec2(0.0);
            warp.x = sin(uv.y * 12.0 + time * 2.0) * 0.008;
            warp.y = cos(uv.x * 10.0 + time * 1.7) * 0.006;
            warp += sin(uv.yx * 8.0 + time) * 0.004;
            warp += mouseInfluence * edgeMask;
            
            float n = fbm(uv * 4.0 + time * 0.5);
            warp += (n - 0.5) * 0.015;
            
            vec2 warpedUv = uv + warp * edgeMask;
            
            vec3 glassColor = vec3(0.97, 0.98, 1.0);
            
            vec2 fromCenter = (uv - center) * aspect;
            float angle = atan(fromCenter.y, fromCenter.x);
            float fresnelDist = length(fromCenter);
            float fresnel = pow(fresnelDist * 1.5, 2.0);
            fresnel = clamp(fresnel, 0.0, 1.0) * 0.4;
            
            float hue = (angle / (2.0 * PI) + 0.5) + time * 0.1;
            vec3 rainbow = hsv2rgb(vec3(hue, 0.15, 1.0));
            glassColor = mix(glassColor, rainbow, fresnel * 0.5);
            
            float specAngle = angle + PI * 0.25;
            float specular1 = pow(max(0.0, cos(specAngle * 2.0)), 8.0) * 0.2;
            specular1 *= smoothstep(0.5, 0.2, fresnelDist);
            
            float topLight = smoothstep(0.7, 0.2, uv.y);
            topLight *= smoothstep(0.1, 0.3, uv.x) * smoothstep(0.9, 0.7, uv.x);
            topLight *= 0.25;
            
            float caustics = 0.0;
            for(float i = 1.0; i <= 3.0; i++) {
                float scale = 6.0 * i;
                float speed = 0.5 / i;
                caustics += fbm(warpedUv * scale + time * speed) * (0.15 / i);
            }
            caustics *= edgeMask;
            
            float edgeHighlight = 0.0;
            float edgeDist = min(min(uv.x, 1.0 - uv.x), min(uv.y, 1.0 - uv.y));
            edgeHighlight = smoothstep(0.15, 0.0, edgeDist) * 0.3;
            edgeHighlight *= 1.0 + sin(angle * 4.0 + time * 2.0) * 0.3;
            
            float shimmer = sin(uv.x * 30.0 + uv.y * 20.0 + time * 3.0) * 0.02;
            shimmer *= edgeMask;
            
            vec3 finalColor = glassColor;
            finalColor += specular1;
            finalColor += topLight;
            finalColor += caustics;
            finalColor += edgeHighlight;
            finalColor += shimmer;
            
            float alpha = 0.08;
            alpha += fresnel * 0.15;
            alpha += specular1 * 0.5;
            alpha += topLight * 0.4;
            alpha += caustics * 0.3;
            alpha += edgeHighlight * 0.6;
            alpha *= edgeMask;
            alpha = clamp(alpha, 0.0, 0.6);
            
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
                "bg-gradient-to-br from-white/8 via-white/5 to-white/3",
                "border border-white/25",
                "shadow-[0_4px_24px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)]",
                className
            )}
            whileHover={animate ? {
                scale: 1.015,
                boxShadow: "0 12px 40px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.06)"
            } : {}}
            whileTap={animate ? { scale: 0.99 } : {}}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
        >
            <canvas
                ref={canvasRef}
                className="absolute inset-0 z-[1] pointer-events-none"
            />
            <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden rounded-3xl">
                <div
                    className="absolute top-0 left-[10%] right-[10%] h-[1px]"
                    style={{
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)'
                    }}
                />
                <div
                    className="absolute bottom-0 left-[20%] right-[20%] h-[1px]"
                    style={{
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)'
                    }}
                />
            </div>
            <div className="relative z-10 w-full h-full">
                {children}
            </div>
        </motion.div>
    )
}
