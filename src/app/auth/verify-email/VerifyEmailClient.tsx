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
            <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--background)] to-[var(--secondary)] overflow-hidden">
                {/* Ambient Background Elements */}
                <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[var(--primary)]/10 blur-[100px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[var(--accent)]/5 blur-[120px]" />

                <div className="liquid-glass p-8 md:p-12 w-full max-w-md rounded-2xl text-center space-y-6 animate-in fade-in zoom-in duration-500">
                    <div className="mx-auto w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20 shadow-lg shadow-green-500/5">
                        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight text-[var(--primary)]">Verified!</h1>
                        <p className="text-[var(--muted-foreground)]">Your email has been successfully verified.</p>
                    </div>
                    <div className="pt-2">
                        <div className="h-1 w-full bg-[var(--muted)] rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 animate-[loading_1.5s_ease-in-out_infinite] w-1/3" />
                        </div>
                        <p className="text-xs text-[var(--muted-foreground)] mt-2">Redirecting you to sign in...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--background)] to-[var(--secondary)] overflow-hidden">
            {/* Ambient Background Elements */}
            <div className="absolute top-[-20%] right-[20%] w-[500px] h-[500px] rounded-full bg-[var(--primary)]/10 blur-[100px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[var(--accent)]/5 blur-[120px]" />

            <div className="liquid-glass p-8 md:p-12 w-full max-w-md rounded-2xl space-y-8 animate-in fade-in zoom-in duration-500 border border-white/40 shadow-2xl relative z-10">
                <div className="space-y-3 text-center">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[var(--primary)]/10 mb-2 border border-[var(--primary)]/20">
                        <svg className="w-7 h-7 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">Verify Email</h1>
                    <p className="text-[var(--muted-foreground)] text-sm">
                        Please enter the 6-digit code sent to<br />
                        <span className="font-semibold text-[var(--primary)]">{email}</span>
                    </p>
                </div>

                <form onSubmit={handleVerify} className="space-y-6">
                    <div className="space-y-2">
                        <div className="relative">
                            <input
                                id="code"
                                type="text"
                                inputMode="numeric"
                                maxLength={6}
                                value={code}
                                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="000000"
                                className="flex h-16 w-full rounded-xl border-2 border-white/40 bg-white/40 px-3 py-2 text-center text-4xl font-bold tracking-[1rem] shadow-sm transition-all text-[var(--foreground)] placeholder:text-gray-300/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:border-transparent"
                            />
                        </div>
                    </div>

                    <div className="min-h-[20px]">
                        {error && (
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-center animate-in fade-in slide-in-from-top-2">
                                <p className="text-sm font-medium text-red-600">{error}</p>
                            </div>
                        )}
                        {resendMessage && (
                            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-center animate-in fade-in slide-in-from-top-2">
                                <p className="text-sm font-medium text-green-600">{resendMessage}</p>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <Button
                            disabled={loading || code.length !== 6}
                            className="w-full h-12 text-lg font-medium bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-[var(--primary-foreground)] shadow-lg shadow-[var(--primary)]/25 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
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
                            <span className="text-[var(--muted-foreground)]">
                                Expires in {formatTime(timeLeft)}
                            </span>
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={handleResend}
                                disabled={resendLoading}
                                className="p-0 h-auto font-medium text-[var(--primary)] hover:text-[var(--primary)]/80 hover:bg-transparent"
                            >
                                {resendLoading ? "Sending..." : "Resend Code"}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
