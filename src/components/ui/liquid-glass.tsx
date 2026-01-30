"use client"

import React, { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import * as THREE from 'three'
// @ts-ignore
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
// @ts-ignore
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
// @ts-ignore
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
// @ts-ignore
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'

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
    const requestRef = useRef<number>(0)

    useEffect(() => {
        if (!canvasRef.current || !containerRef.current) return

        const canvas = canvasRef.current
        const container = containerRef.current

        // Basic feature detection
        let renderer: THREE.WebGLRenderer
        try {
            renderer = new THREE.WebGLRenderer({
                canvas,
                alpha: true,
                antialias: true,
                powerPreference: "high-performance",
                failIfMajorPerformanceCaveat: false
            })
            canvas.style.opacity = "1"
        } catch (e) {
            console.warn("WebGL not supported, falling back to CSS glass")
            return
        }

        renderer.toneMapping = THREE.ACESFilmicToneMapping
        renderer.toneMappingExposure = 1.5

        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100)
        camera.position.z = 5

        const glassGeometry = new THREE.BoxGeometry(4, 4, 0.5, 64, 64, 64)
        const positionAttribute = glassGeometry.attributes.position

        for (let i = 0; i < positionAttribute.count; i++) {
            const x = positionAttribute.getX(i)
            const y = positionAttribute.getY(i)
            const radius = 0.4
            const distX = Math.abs(x) - 2 + radius
            const distY = Math.abs(y) - 2 + radius

            if (distX > 0 && distY > 0) {
                const len = Math.sqrt(distX * distX + distY * distY)
                if (len > radius) {
                    const factor = radius / len
                    positionAttribute.setX(i, x > 0 ? 2 - radius + distX * factor : -2 + radius - distX * factor)
                    positionAttribute.setY(i, y > 0 ? 2 - radius + distY * factor : -2 + radius - distY * factor)
                }
            }
        }
        glassGeometry.computeVertexNormals()

        const glassMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            metalness: 0,
            roughness: 0.02,
            transmission: 1.0,
            thickness: 2.0,
            ior: 1.5,
            clearcoat: 1.0,
            clearcoatRoughness: 0.05,
            attenuationColor: new THREE.Color(0xffffff),
            attenuationDistance: 1.0,
            transparent: true,
            opacity: 1,
            side: THREE.DoubleSide
        })

        const glassMesh = new THREE.Mesh(glassGeometry, glassMaterial)
        scene.add(glassMesh)

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
        scene.add(ambientLight)

        const pointLight1 = new THREE.PointLight(0xffffff, 15)
        pointLight1.position.set(5, 5, 5)
        scene.add(pointLight1)

        const pointLight2 = new THREE.PointLight(0x3a86ff, 10)
        pointLight2.position.set(-5, 5, 5)
        scene.add(pointLight2)

        const pointLight3 = new THREE.PointLight(0xff006e, 10)
        pointLight3.position.set(0, -5, 3)
        scene.add(pointLight3)

        const composer = new EffectComposer(renderer)
        const renderPass = new RenderPass(scene, camera)
        composer.addPass(renderPass)

        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(1, 1),
            0.4,
            0.5,
            0.9
        )
        composer.addPass(bloomPass)

        const chromaticAberrationShader = {
            uniforms: {
                tDiffuse: { value: null },
                amount: { value: 0.002 }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D tDiffuse;
                uniform float amount;
                varying vec2 vUv;
                void main() {
                    vec2 center = vec2(0.5, 0.5);
                    vec2 dir = vUv - center;
                    float dist = length(dir);
                    vec4 color;
                    color.r = texture2D(tDiffuse, vUv + dir * amount * dist).r;
                    color.g = texture2D(tDiffuse, vUv).g;
                    color.b = texture2D(tDiffuse, vUv - dir * amount * dist).b;
                    color.a = texture2D(tDiffuse, vUv).a;
                    gl_FragColor = color;
                }
            `
        }

        const chromaticPass = new ShaderPass(chromaticAberrationShader)
        composer.addPass(chromaticPass)

        let targetRotationX = 0
        let targetRotationY = 0
        let mouseX = 0
        let mouseY = 0

        const handleMouseMove = (event: MouseEvent) => {
            const rect = container.getBoundingClientRect()
            mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1
            mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1
            targetRotationY = mouseX * 0.2
            targetRotationX = mouseY * 0.2
        }

        if (animate) {
            window.addEventListener('mousemove', handleMouseMove)
        }

        const updateSize = () => {
            const rect = container.getBoundingClientRect()
            const width = Math.max(rect.width, 1)
            const height = Math.max(rect.height, 1)

            renderer.setSize(width, height)
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

            camera.aspect = width / height
            camera.updateProjectionMatrix()

            composer.setSize(width, height)
            if (bloomPass.resolution) bloomPass.resolution.set(width, height)

            const vFOV = THREE.MathUtils.degToRad(camera.fov)
            const visibleHeight = 2 * Math.tan(vFOV / 2) * camera.position.z
            const visibleWidth = visibleHeight * camera.aspect

            // Scale geometry to fill the visible area precisely
            // Base geometry is 4x4, so we divide by 4
            glassMesh.scale.set(visibleWidth / 4, visibleHeight / 4, 1)
        }

        const observer = new ResizeObserver(updateSize)
        observer.observe(container)
        updateSize()

        const clock = new THREE.Clock()
        const animateLoop = () => {
            const time = clock.getElapsedTime()

            glassMesh.rotation.x += (targetRotationX - glassMesh.rotation.x) * 0.05
            glassMesh.rotation.y += (targetRotationY - glassMesh.rotation.y) * 0.05
            glassMesh.position.y = Math.sin(time * 0.5) * 0.05

            pointLight1.position.x = Math.sin(time * 0.5) * 5
            pointLight1.position.z = Math.cos(time * 0.5) * 5

            composer.render()
            requestRef.current = requestAnimationFrame(animateLoop)
        }

        animateLoop()

        return () => {
            cancelAnimationFrame(requestRef.current)
            window.removeEventListener('mousemove', handleMouseMove)
            observer.disconnect()
            renderer.dispose()
            glassGeometry.dispose()
            glassMaterial.dispose()
        }
    }, [animate])

    return (
        <motion.div
            ref={containerRef}
            className={cn(
                "relative group overflow-hidden liquid-glass transition-all duration-300",
                className
            )}
            whileHover={animate ? { scale: 1.01 } : {}}
            whileTap={animate ? { scale: 0.99 } : {}}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
        >
            <canvas
                ref={canvasRef}
                className="absolute inset-0 z-0 pointer-events-none opacity-0 transition-opacity duration-700"
                style={{ width: '100%', height: '100%' }}
                onAnimationEnd={(e) => (e.currentTarget.style.opacity = "1")}
            />
            <div className="relative z-10 w-full h-full glass-content-overlay">
                {children}
            </div>
        </motion.div>
    )
}
