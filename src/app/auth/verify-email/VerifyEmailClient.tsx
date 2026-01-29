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
            <div className="container relative h-screen flex-col items-center justify-center grid">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <div className="text-center space-y-4">
                        <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-semibold tracking-tight">Email Verified!</h1>
                        <p className="text-sm text-muted-foreground">Redirecting you to sign in...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="container relative h-screen flex-col items-center justify-center grid">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                <div className="flex flex-col space-y-2 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">Verify your email</h1>
                    <p className="text-sm text-muted-foreground">
                        We've sent a 6-digit code to<br />
                        <span className="font-medium text-foreground">{email}</span>
                    </p>
                </div>

                <form onSubmit={handleVerify} className="grid gap-4">
                    <div className="grid gap-2">
                        <label htmlFor="code" className="text-sm font-medium">
                            Verification Code
                        </label>
                        <input
                            id="code"
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            value={code}
                            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            placeholder="000000"
                            className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm text-center text-lg tracking-widest shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        />
                    </div>

                    {error && <p className="text-sm font-medium text-destructive">{error}</p>}
                    {resendMessage && <p className="text-sm font-medium text-green-600">{resendMessage}</p>}

                    <div className="text-xs text-muted-foreground text-center">
                        Code expires in {formatTime(timeLeft)}
                    </div>

                    <Button disabled={loading || code.length !== 6}>
                        {loading ? "Verifying..." : "Verify Email"}
                    </Button>
                </form>

                <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-2">
                        Didn't receive the code?
                    </p>
                    <Button
                        variant="ghost"
                        onClick={handleResend}
                        disabled={resendLoading}
                        className="text-xs h-auto p-1 hover:text-primary"
                    >
                        {resendLoading ? "Sending..." : "Resend Code"}
                    </Button>
                </div>
            </div>
        </div>
    )
}
