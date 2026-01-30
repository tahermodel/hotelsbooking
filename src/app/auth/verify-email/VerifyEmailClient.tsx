"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { verifyCode, resendVerificationEmail } from "@/actions/auth"

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
    const [timeLeft, setTimeLeft] = useState(600) // 10 minutes in seconds

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
            setTimeLeft(600) // Reset timer
        }
        setResendLoading(false)
    }

    if (success) {
        return (
            <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0 bg-background text-foreground">
                <div className="relative hidden h-full flex-col bg-gradient-to-br from-primary to-primary/70 p-10 text-white lg:flex overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/70 opacity-90" />
                    {/* Ambient Background Elements for visual interest */}
                    <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-white/10 blur-[100px]" />
                    <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-white/5 blur-[120px]" />

                    <div className="relative z-20 flex items-center text-lg font-medium">
                        <span className="text-2xl font-bold italic tracking-tighter">StayEase</span>
                    </div>
                    <div className="relative z-20 mt-auto">
                        <blockquote className="space-y-2">
                            <p className="text-lg">
                                Verification successful. Welcome to the future of seamless stays.
                            </p>
                        </blockquote>
                    </div>
                </div>
                <div className="flex items-center justify-center p-8 w-full h-full">
                    <div className="liquid-glass p-8 md:p-12 w-full max-w-md rounded-2xl text-center space-y-6 animate-in fade-in zoom-in duration-500">
                        <div className="mx-auto w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20 shadow-lg shadow-green-500/5">
                            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold tracking-tight text-[var(--primary)] text-primary">Verified!</h1>
                            <p className="text-[var(--muted-foreground)] text-muted-foreground">Your email has been successfully verified.</p>
                        </div>
                        <div className="pt-2">
                            <div className="h-1 w-full bg-[var(--muted)] bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 animate-[loading_1.5s_ease-in-out_infinite] w-1/3" />
                            </div>
                            <p className="text-xs text-[var(--muted-foreground)] text-muted-foreground mt-2">Redirecting you to sign in...</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0 bg-background text-foreground">
            <div className="relative hidden h-full flex-col bg-gradient-to-br from-primary to-primary/70 p-10 text-white lg:flex overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/70 opacity-90" />
                {/* Ambient Background Elements for visual interest */}
                <div className="absolute top-[-10%] right-[10%] w-[400px] h-[400px] rounded-full bg-white/10 blur-[80px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-white/5 blur-[100px]" />

                <div className="relative z-20 flex items-center text-lg font-medium">
                    <span className="text-2xl font-bold italic tracking-tighter">StayEase</span>
                </div>
                <div className="relative z-20 mt-auto">
                    <div className="space-y-2">
                        <p className="text-lg">
                            One last step to unlock exclusive travel experiences.
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-center p-4 md:p-8 w-full h-full">
                <div className="liquid-glass p-8 md:p-12 w-full max-w-md rounded-2xl space-y-8 animate-in fade-in zoom-in duration-500 border border-white/40 shadow-2xl relative z-10">
                    <div className="space-y-3 text-center">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[var(--primary)]/10 bg-primary/10 mb-2 border border-[var(--primary)]/20 border-primary/20">
                            <svg className="w-7 h-7 text-[var(--primary)] text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Verify Email</h1>
                        <p className="text-muted-foreground text-sm">
                            Please enter the 6-digit code sent to<br />
                            <span className="font-semibold text-primary">{email}</span>
                        </p>
                    </div>

                    <form onSubmit={handleVerify} className="space-y-10">
                        <div className="flex justify-center gap-2 sm:gap-4 lg:gap-3 xl:gap-4">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="relative w-10 h-14 sm:w-12 sm:h-16 md:w-14 md:h-20 lg:w-12 lg:h-18 xl:w-14 xl:h-20">
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
                                        className="w-full h-full rounded-2xl border-2 border-white/20 bg-white/10 backdrop-blur-xl text-center text-2xl md:text-3xl font-black text-foreground shadow-[0_8px_32px_rgba(0,0,0,0.1)] transition-all focus:border-primary focus:bg-white/20 focus:scale-105 focus:outline-none ring-offset-background"
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="min-h-[20px]">
                            {error && (
                                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-center animate-in fade-in slide-in-from-top-4">
                                    <p className="text-sm font-bold text-red-600 tracking-tight">{error}</p>
                                </div>
                            )}
                            {resendMessage && (
                                <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 text-center animate-in fade-in slide-in-from-top-4">
                                    <p className="text-sm font-bold text-primary tracking-tight">{resendMessage}</p>
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <Button
                                disabled={loading || code.length !== 6}
                                className="w-full h-12 text-lg font-medium bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Verifying...
                                    </span>
                                ) : "Verify Email"}
                            </Button>

                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground whitespace-nowrap">
                                    Expires in {formatTime(timeLeft)}
                                </span>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={handleResend}
                                    disabled={resendLoading}
                                    className="p-0 h-auto font-medium text-primary hover:text-primary/80 hover:bg-transparent"
                                >
                                    {resendLoading ? "Sending..." : "Resend Code"}
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
