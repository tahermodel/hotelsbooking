"use client"

import { useState } from "react"
import { register } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { Eye, EyeOff, User, Mail, Lock, ArrowRight } from "lucide-react"
import { LiquidGlass } from "@/components/ui/liquid-glass"
import { Input } from "@/components/ui/input"

export function RegisterForm() {
    const router = useRouter()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        setError("")

        const formData = new FormData(e.currentTarget)
        const result = await register(formData)

        if (result?.error) {
            setError(result.error)
            setLoading(false)
        } else {
            router.push("/auth/verify-email?email=" + encodeURIComponent(formData.get("email") as string))
        }
    }

    return (
        <LiquidGlass className="w-full max-w-md p-8 md:p-10 shadow-2xl space-y-8 backdrop-blur-xl border-white/30" animate={false}>
            <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-sm">Create Account</h1>
                <p className="text-white/70 text-sm">Join StayEase and start your journey</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-4">
                    <div className="relative group">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50 group-focus-within:text-white transition-colors" />
                        <Input
                            name="fullName"
                            className="pl-10 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:bg-white/20 focus:border-white/40 rounded-xl transition-all"
                            placeholder="Full Name"
                            required
                        />
                    </div>
                    <div className="relative group">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50 group-focus-within:text-white transition-colors" />
                        <Input
                            name="email"
                            type="email"
                            className="pl-10 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:bg-white/20 focus:border-white/40 rounded-xl transition-all"
                            placeholder="name@example.com"
                            required
                        />
                    </div>
                    <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50 group-focus-within:text-white transition-colors" />
                        <Input
                            name="password"
                            type={showPassword ? "text" : "password"}
                            className="pl-10 pr-10 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:bg-white/20 focus:border-white/40 rounded-xl transition-all"
                            placeholder="Password (min 6 chars)"
                            required
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="p-4 rounded-xl bg-red-500/20 border border-red-500/30 text-center animate-in fade-in slide-in-from-top-2">
                        <p className="text-sm font-medium text-red-100 tracking-tight leading-relaxed">
                            {error}
                        </p>
                    </div>
                )}

                <Button
                    disabled={loading}
                    className="w-full h-12 bg-white text-primary hover:bg-white/90 font-bold rounded-xl shadow-lg transition-transform active:scale-[0.98]"
                >
                    {loading ? "Creating account..." : (
                        <span className="flex items-center justify-center gap-2">
                            Sign Up <ArrowRight className="h-4 w-4" />
                        </span>
                    )}
                </Button>
            </form>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-transparent px-2 text-white/50">Or continue with</span>
                </div>
            </div>

            <Button
                variant="outline"
                type="button"
                disabled={loading}
                onClick={() => signIn("google")}
                className="h-12 border-white/20 bg-white/5 text-white hover:bg-white/10 rounded-xl w-full flex items-center justify-center gap-2"
            >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                    />
                    <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                    />
                    <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                    />
                    <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                    />
                </svg>
                Google
            </Button>

            <p className="text-center text-sm text-white/70">
                Already have an account?{" "}
                <Link
                    href="/login"
                    className="text-white font-bold hover:underline underline-offset-4"
                >
                    Sign In
                </Link>
            </p>
        </LiquidGlass>
    )
}
