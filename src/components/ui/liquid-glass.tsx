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
        camera: THREE.PerspectiveCamera
        glassMesh: THREE.Mesh
        clock: THREE.Clock
        animationId: number
        mouse: { x: number; y: number; targetX: number; targetY: number }
    } | null>(null)

    const initScene = useCallback(() => {
        const canvas = canvasRef.current
        const container = containerRef.current
        if (!canvas || !container) return

        try {
            const renderer = new THREE.WebGLRenderer({
                canvas,
                alpha: true,
                antialias: true,
                powerPreference: "high-performance"
            })
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
            renderer.toneMapping = THREE.ACESFilmicToneMapping
            renderer.toneMappingExposure = 1.2
            renderer.outputColorSpace = THREE.SRGBColorSpace

            const scene = new THREE.Scene()

            const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
            camera.position.z = 3

            const glassGeometry = new THREE.PlaneGeometry(4, 4, 128, 128)

            const glassMaterial = new THREE.MeshPhysicalMaterial({
                color: new THREE.Color(0xffffff),
                metalness: 0.0,
                roughness: 0.05,
                transmission: 0.95,
                thickness: 0.5,
                ior: 1.45,
                clearcoat: 1.0,
                clearcoatRoughness: 0.1,
                transparent: true,
                opacity: 0.3,
                side: THREE.DoubleSide,
                envMapIntensity: 1.0,
                reflectivity: 0.5,
                sheen: 0.5,
                sheenRoughness: 0.5,
                sheenColor: new THREE.Color(0x88ccff)
            })

            const glassMesh = new THREE.Mesh(glassGeometry, glassMaterial)
            scene.add(glassMesh)

            const envTexture = new THREE.CubeTextureLoader().load([
                'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
                'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
                'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
                'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
                'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
                'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=='
            ])
            scene.environment = envTexture
            glassMaterial.envMap = envTexture
            glassMaterial.needsUpdate = true

            const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
            scene.add(ambientLight)

            const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5)
            directionalLight.position.set(5, 5, 5)
            scene.add(directionalLight)

            const pointLight1 = new THREE.PointLight(0x88ccff, 2, 20)
            pointLight1.position.set(-3, 3, 3)
            scene.add(pointLight1)

            const pointLight2 = new THREE.PointLight(0xffcc88, 1.5, 20)
            pointLight2.position.set(3, -2, 4)
            scene.add(pointLight2)

            const clock = new THREE.Clock()

            sceneRef.current = {
                renderer,
                scene,
                camera,
                glassMesh,
                clock,
                animationId: 0,
                mouse: { x: 0, y: 0, targetX: 0, targetY: 0 }
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
        sceneData.camera.aspect = width / height
        sceneData.camera.updateProjectionMatrix()

        const vFov = (sceneData.camera.fov * Math.PI) / 180
        const planeHeight = 2 * Math.tan(vFov / 2) * sceneData.camera.position.z
        const planeWidth = planeHeight * sceneData.camera.aspect

        sceneData.glassMesh.scale.set(planeWidth / 4, planeHeight / 4, 1)
    }, [])

    const animateScene = useCallback(() => {
        const sceneData = sceneRef.current
        if (!sceneData) return

        const { renderer, scene, camera, glassMesh, clock, mouse } = sceneData
        const time = clock.getElapsedTime()

        mouse.x += (mouse.targetX - mouse.x) * 0.05
        mouse.y += (mouse.targetY - mouse.y) * 0.05

        glassMesh.rotation.x = mouse.y * 0.15 + Math.sin(time * 0.3) * 0.02
        glassMesh.rotation.y = mouse.x * 0.15 + Math.cos(time * 0.4) * 0.02

        const positions = glassMesh.geometry.attributes.position
        const originalPositions = (glassMesh.geometry as any)._originalPositions

        if (!originalPositions) {
            (glassMesh.geometry as any)._originalPositions = positions.array.slice()
        }

        const origPos = (glassMesh.geometry as any)._originalPositions
        if (origPos) {
            for (let i = 0; i < positions.count; i++) {
                const x = origPos[i * 3]
                const y = origPos[i * 3 + 1]

                const wave1 = Math.sin(x * 2 + time * 1.5) * 0.015
                const wave2 = Math.cos(y * 2.5 + time * 1.2) * 0.012
                const wave3 = Math.sin((x + y) * 1.5 + time) * 0.008

                positions.setZ(i, wave1 + wave2 + wave3)
            }
            positions.needsUpdate = true
            glassMesh.geometry.computeVertexNormals()
        }

        renderer.render(scene, camera)
        sceneData.animationId = requestAnimationFrame(animateScene)
    }, [])

    const handleMouseMove = useCallback((e: MouseEvent) => {
        const container = containerRef.current
        const sceneData = sceneRef.current
        if (!container || !sceneData) return

        const rect = container.getBoundingClientRect()
        sceneData.mouse.targetX = ((e.clientX - rect.left) / rect.width) * 2 - 1
        sceneData.mouse.targetY = -((e.clientY - rect.top) / rect.height) * 2 + 1
    }, [])

    const handleMouseLeave = useCallback(() => {
        const sceneData = sceneRef.current
        if (!sceneData) return
        sceneData.mouse.targetX = 0
        sceneData.mouse.targetY = 0
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
                sceneRef.current.glassMesh.geometry.dispose()
                if (sceneRef.current.glassMesh.material instanceof THREE.Material) {
                    sceneRef.current.glassMesh.material.dispose()
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
                "bg-white/5 backdrop-blur-2xl",
                "border border-white/20",
                "shadow-[0_8px_32px_rgba(31,38,135,0.2),inset_0_1px_0_rgba(255,255,255,0.3)]",
                className
            )}
            whileHover={animate ? {
                scale: 1.02,
                boxShadow: "0 20px 50px rgba(31,38,135,0.3), inset 0 1px 0 rgba(255,255,255,0.4)"
            } : {}}
            whileTap={animate ? { scale: 0.99 } : {}}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
            <canvas
                ref={canvasRef}
                className="absolute inset-0 z-[1] pointer-events-none"
                style={{ mixBlendMode: 'overlay' }}
            />
            <div className="absolute inset-0 z-[2] pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-white/25 via-transparent to-white/5 opacity-60" />
                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                <div className="absolute inset-y-0 left-0 w-[1px] bg-gradient-to-b from-white/40 via-white/10 to-transparent" />
            </div>
            <div className="relative z-10 w-full h-full">
                {children}
            </div>
        </motion.div>
    )
}
