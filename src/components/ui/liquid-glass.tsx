"use client"

import React, { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

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
    const [isWebGLReady, setIsWebGLReady] = useState(false)
    const animationRef = useRef<number>(0)
    const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 })

    useEffect(() => {
        const canvas = canvasRef.current
        const container = containerRef.current
        if (!canvas || !container) return

        const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
        if (!gl) {
            console.warn('WebGL not supported')
            return
        }

        const vertexShaderSource = `
            attribute vec2 a_position;
            attribute vec2 a_texCoord;
            varying vec2 v_texCoord;
            void main() {
                gl_Position = vec4(a_position, 0.0, 1.0);
                v_texCoord = a_texCoord;
            }
        `

        const fragmentShaderSource = `
            precision highp float;
            varying vec2 v_texCoord;
            uniform float u_time;
            uniform vec2 u_resolution;
            uniform vec2 u_mouse;

            float noise(vec2 p) {
                return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
            }

            float smoothNoise(vec2 p) {
                vec2 i = floor(p);
                vec2 f = fract(p);
                f = f * f * (3.0 - 2.0 * f);
                float a = noise(i);
                float b = noise(i + vec2(1.0, 0.0));
                float c = noise(i + vec2(0.0, 1.0));
                float d = noise(i + vec2(1.0, 1.0));
                return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
            }

            float fbm(vec2 p) {
                float value = 0.0;
                float amplitude = 0.5;
                for (int i = 0; i < 4; i++) {
                    value += amplitude * smoothNoise(p);
                    p *= 2.0;
                    amplitude *= 0.5;
                }
                return value;
            }

            void main() {
                vec2 uv = v_texCoord;
                vec2 center = vec2(0.5);
                
                float distFromCenter = length(uv - center);
                float edgeFade = smoothstep(0.5, 0.35, distFromCenter);
                
                float wave1 = sin(uv.x * 8.0 + u_time * 0.5) * 0.02;
                float wave2 = sin(uv.y * 6.0 + u_time * 0.7) * 0.015;
                float wave3 = cos((uv.x + uv.y) * 4.0 + u_time * 0.3) * 0.01;
                
                vec2 distortion = vec2(wave1 + wave3, wave2 + wave3);
                distortion += (u_mouse - center) * 0.05 * edgeFade;
                
                float n = fbm(uv * 3.0 + u_time * 0.1) * 0.03;
                distortion += vec2(n);
                
                vec2 refractUV = uv + distortion * edgeFade;
                
                vec3 baseColor = vec3(0.95, 0.97, 1.0);
                
                float fresnel = pow(1.0 - dot(normalize(vec3(uv - center, 0.3)), vec3(0.0, 0.0, 1.0)), 2.0);
                fresnel = clamp(fresnel, 0.0, 1.0);
                
                vec3 highlight = vec3(1.0) * fresnel * 0.4;
                
                float specX = smoothstep(0.3, 0.5, uv.x) * smoothstep(0.7, 0.5, uv.x);
                float specY = smoothstep(0.2, 0.4, uv.y) * smoothstep(0.6, 0.4, uv.y);
                float specular = specX * specY * 0.3;
                specular *= 1.0 + sin(u_time * 2.0) * 0.1;
                
                float topHighlight = smoothstep(0.6, 0.3, uv.y) * 0.15;
                topHighlight *= smoothstep(0.1, 0.3, uv.x) * smoothstep(0.9, 0.7, uv.x);
                
                float bottomShadow = smoothstep(0.3, 0.7, uv.y) * 0.1;
                
                float caustic = fbm(uv * 5.0 + u_time * 0.2) * 0.08;
                caustic *= edgeFade;
                
                float rainbowAngle = atan(uv.y - 0.5, uv.x - 0.5);
                vec3 rainbow = vec3(
                    sin(rainbowAngle * 2.0 + u_time) * 0.5 + 0.5,
                    sin(rainbowAngle * 2.0 + u_time + 2.094) * 0.5 + 0.5,
                    sin(rainbowAngle * 2.0 + u_time + 4.189) * 0.5 + 0.5
                );
                rainbow = mix(vec3(1.0), rainbow, 0.15 * fresnel);
                
                vec3 finalColor = baseColor;
                finalColor += highlight;
                finalColor += specular;
                finalColor += topHighlight;
                finalColor -= bottomShadow;
                finalColor += caustic;
                finalColor *= rainbow;
                
                float alpha = 0.12 + fresnel * 0.08 + specular * 0.3 + topHighlight;
                alpha *= edgeFade * 1.5;
                alpha = clamp(alpha, 0.0, 0.5);
                
                gl_FragColor = vec4(finalColor, alpha);
            }
        `

        function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
            const shader = gl.createShader(type)
            if (!shader) return null
            gl.shaderSource(shader, source)
            gl.compileShader(shader)
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error('Shader compile error:', gl.getShaderInfoLog(shader))
                gl.deleteShader(shader)
                return null
            }
            return shader
        }

        function createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram | null {
            const program = gl.createProgram()
            if (!program) return null
            gl.attachShader(program, vertexShader)
            gl.attachShader(program, fragmentShader)
            gl.linkProgram(program)
            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                console.error('Program link error:', gl.getProgramInfoLog(program))
                gl.deleteProgram(program)
                return null
            }
            return program
        }

        const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
        const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)
        if (!vertexShader || !fragmentShader) return

        const program = createProgram(gl, vertexShader, fragmentShader)
        if (!program) return

        const positionBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            -1, -1, 1, -1, -1, 1,
            -1, 1, 1, -1, 1, 1
        ]), gl.STATIC_DRAW)

        const texCoordBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            0, 0, 1, 0, 0, 1,
            0, 1, 1, 0, 1, 1
        ]), gl.STATIC_DRAW)

        const positionLocation = gl.getAttribLocation(program, 'a_position')
        const texCoordLocation = gl.getAttribLocation(program, 'a_texCoord')
        const timeLocation = gl.getUniformLocation(program, 'u_time')
        const resolutionLocation = gl.getUniformLocation(program, 'u_resolution')
        const mouseLocation = gl.getUniformLocation(program, 'u_mouse')

        gl.useProgram(program)

        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
        gl.enableVertexAttribArray(positionLocation)
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)

        gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer)
        gl.enableVertexAttribArray(texCoordLocation)
        gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0)

        gl.enable(gl.BLEND)
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

        const resize = () => {
            const rect = container.getBoundingClientRect()
            const dpr = Math.min(window.devicePixelRatio, 2)
            canvas.width = rect.width * dpr
            canvas.height = rect.height * dpr
            canvas.style.width = rect.width + 'px'
            canvas.style.height = rect.height + 'px'
            gl.viewport(0, 0, canvas.width, canvas.height)
        }

        const handleMouseMove = (e: MouseEvent) => {
            const rect = container.getBoundingClientRect()
            mouseRef.current.targetX = (e.clientX - rect.left) / rect.width
            mouseRef.current.targetY = 1.0 - (e.clientY - rect.top) / rect.height
        }

        const handleMouseLeave = () => {
            mouseRef.current.targetX = 0.5
            mouseRef.current.targetY = 0.5
        }

        resize()
        const resizeObserver = new ResizeObserver(resize)
        resizeObserver.observe(container)

        if (animate) {
            container.addEventListener('mousemove', handleMouseMove)
            container.addEventListener('mouseleave', handleMouseLeave)
        }

        setIsWebGLReady(true)

        const startTime = performance.now()
        const render = () => {
            const time = (performance.now() - startTime) / 1000

            mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.1
            mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.1

            gl.clearColor(0, 0, 0, 0)
            gl.clear(gl.COLOR_BUFFER_BIT)

            gl.useProgram(program)
            gl.uniform1f(timeLocation, time)
            gl.uniform2f(resolutionLocation, canvas.width, canvas.height)
            gl.uniform2f(mouseLocation, mouseRef.current.x, mouseRef.current.y)

            gl.drawArrays(gl.TRIANGLES, 0, 6)

            animationRef.current = requestAnimationFrame(render)
        }

        render()

        return () => {
            cancelAnimationFrame(animationRef.current)
            resizeObserver.disconnect()
            if (animate) {
                container.removeEventListener('mousemove', handleMouseMove)
                container.removeEventListener('mouseleave', handleMouseLeave)
            }
            gl.deleteProgram(program)
            gl.deleteShader(vertexShader)
            gl.deleteShader(fragmentShader)
            gl.deleteBuffer(positionBuffer)
            gl.deleteBuffer(texCoordBuffer)
        }
    }, [animate])

    return (
        <motion.div
            ref={containerRef}
            className={cn(
                "relative overflow-hidden",
                "bg-white/10 backdrop-blur-xl border border-white/30 rounded-3xl",
                "shadow-[0_8px_32px_rgba(31,38,135,0.15),inset_0_0_0_1px_rgba(255,255,255,0.1)]",
                className
            )}
            whileHover={animate ? { scale: 1.01, y: -2 } : {}}
            whileTap={animate ? { scale: 0.99 } : {}}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
            <canvas
                ref={canvasRef}
                className={cn(
                    "absolute inset-0 z-0 pointer-events-none transition-opacity duration-500",
                    isWebGLReady ? "opacity-100" : "opacity-0"
                )}
            />
            <div className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-br from-white/20 via-transparent to-white/5" />
            <div className="absolute inset-x-0 top-0 h-px z-[2] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />
            <div className="relative z-10 w-full h-full">
                {children}
            </div>
        </motion.div>
    )
}
