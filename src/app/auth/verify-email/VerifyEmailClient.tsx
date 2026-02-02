"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { verifyCode, resendVerificationEmail } from "@/actions/auth"
import { LiquidGlass } from "@/components/ui/liquid-glass"
import { Input } from "@/components/ui/input"
import { ArrowRight, Mail, CheckCircle2, Loader2, RefreshCw } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

export default function VerifyEmailClient() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const email = searchParams.get("email") || ""

    const [code, setCode] = useState("")
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)
    const [resendLoading, setResendLoading] = useState(false)
    const [resendMessage, setResendMessage] = useState("")
    const [timeLeft, setTimeLeft] = useState(600)

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(interval)
                    return 0
                }
                return prev - 1
            })
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${minutes}:${secs.toString().padStart(2, '0')}`
    }

    async function handleVerify(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError("")

        if (!code || code.length !== 6) {
            setError("Please enter a valid 6-digit code")
            setLoading(false)
            return
        }

        const result = await verifyCode(email, code)

        if (result?.error) {
            setError(result.error)
            setLoading(false)
        } else {
            setSuccess(true)
            setTimeout(() => {
                router.push("/login?message=Email verified! You can now sign in.")
            }, 1200)
        }
    }

    async function handleResend() {
        setResendLoading(true)
        setResendMessage("")
        setError("")

        const result = await resendVerificationEmail(email)

        if (result?.error) {
            setError(result.error)
        } else {
            setResendMessage("Code resent! Check your email.")
            setTimeLeft(600)
        }
        setResendLoading(false)
    }

    const Layout = ({ children }: { children: React.ReactNode }) => (
        <div className="relative min-h-screen w-full flex items-center justify-center p-4">
            <div className="fixed inset-0 z-0">
                <Image
                    src="https://images.unsplash.com/photo-1612278675615-7b093b07772d?q=100&auto=format&fit=crop&w=2560"
                    alt="Background"
                    fill
                    className="object-cover"
                    priority
                    quality={100}
                />
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
            </div>
            <div className="relative z-10 w-full max-w-[min(440px,100%)] flex items-center justify-center">
                {children}
            </div>
        </div>
    )

    if (success) {
        return (
            <Layout>
                <LiquidGlass className="w-full p-6 sm:p-10 md:p-12 text-center space-y-6 backdrop-blur-xl border-white/30" animate={false}>
                    <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30 shadow-lg shadow-green-500/10">
                        <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-green-400" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white drop-shadow-sm">Verified!</h1>
                        <p className="text-white/70 text-sm">Your email has been successfully verified.</p>
                    </div>
                    <div className="pt-2">
                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 animate-[loading_1.5s_ease-in-out_infinite] w-1/3" />
                        </div>
                        <p className="text-xs text-white/50 mt-4">Redirecting you to sign in...</p>
                    </div>
                </LiquidGlass>
            </Layout>
        )
    }

    return (
        <Layout>
            <LiquidGlass className="w-full p-6 sm:p-8 md:p-10 shadow-2xl space-y-6 sm:space-y-8 backdrop-blur-xl border-white/30" animate={false}>
                <div className="space-y-3 text-center">
                    <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/10 mb-2 border border-white/20">
                        <Mail className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white drop-shadow-sm">Verify Email</h1>
                    <p className="text-white/70 text-xs sm:text-sm">
                        Please enter the 6-digit code sent to<br />
                        <span className="font-semibold text-white underline underline-offset-4 decoration-white/20">{email}</span>
                    </p>
                </div>

                <form onSubmit={handleVerify} className="space-y-6 sm:space-y-8">
                    <div className="flex justify-center gap-1.5 sm:gap-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="relative w-9 h-12 sm:w-12 sm:h-16">
                                <input
                                    id={`code-${i}`}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={code[i] || ""}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, "");
                                        if (val) {
                                            const newCode = code.split("");
                                            newCode[i] = val;
                                            const finalCode = newCode.join("").slice(0, 6);
                                            setCode(finalCode);
                                            if (i < 5) document.getElementById(`code-${i + 1}`)?.focus();
                                        }
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Backspace" && !code[i] && i > 0) {
                                            document.getElementById(`code-${i - 1}`)?.focus();
                                        }
                                    }}
                                    className="w-full h-full rounded-lg sm:rounded-xl border border-white/20 bg-white/10 backdrop-blur-xl text-center text-xl sm:text-2xl font-bold text-white shadow-lg transition-all duration-300 focus:border-white/40 focus:bg-white/15 focus:scale-110 focus:outline-none"
                                />
                            </div>
                        ))}
                    </div>

                    <div className="min-h-[20px]">
                        {error && (
                            <div className="p-4 rounded-xl bg-red-500/20 border border-red-500/30 text-center animate-in fade-in slide-in-from-top-2">
                                <p className="text-sm font-medium text-red-100 tracking-tight">{error}</p>
                            </div>
                        )}
                        {resendMessage && (
                            <div className="p-4 rounded-xl bg-white/10 border border-white/20 text-center animate-in fade-in slide-in-from-top-2">
                                <p className="text-sm font-medium text-white tracking-tight">{resendMessage}</p>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <Button
                            disabled={loading || code.length !== 6}
                            className="w-full h-12 bg-white text-primary hover:bg-white/90 font-bold rounded-xl shadow-lg transition-transform active:scale-[0.98]"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="animate-spin h-5 w-5" />
                                    Verifying...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    Verify Email <ArrowRight className="h-4 w-4" />
                                </span>
                            )}
                        </Button>

                        <div className="flex items-center justify-between text-sm">
                            <span className="text-white/50 font-medium">
                                Expires in {formatTime(timeLeft)}
                            </span>
                            <button
                                type="button"
                                onClick={handleResend}
                                disabled={resendLoading}
                                className="flex items-center gap-1.5 font-bold text-white hover:text-white/80 transition-colors disabled:opacity-50"
                            >
                                <RefreshCw className={cn("w-3.5 h-3.5", resendLoading && "animate-spin")} />
                                {resendLoading ? "Sending..." : "Resend Code"}
                            </button>
                        </div>
                    </div>
                </form>
            </LiquidGlass>
        </Layout>
    )
}
