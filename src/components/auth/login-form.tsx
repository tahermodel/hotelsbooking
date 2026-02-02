"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Chrome, Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react"
import { loginAction } from "@/actions/auth"
import { LiquidGlass } from "@/components/ui/liquid-glass"
import { Input } from "@/components/ui/input"

interface LoginFormProps {
    message?: string
    error?: string
}

const ERROR_MESSAGES: Record<string, string> = {
    "user_not_found": "This email is not registered with us.",
    "invalid_password": "The password you entered is incorrect.",
    "email_not_verified": "Your email is not verified yet.",
    "login_with_google_required": "This account uses Google Sign-In. Please use the Google button.",
    "CredentialsSignin": "Invalid email or password. Please try again.",
    "OAuthAccountNotLinked": "Email already in use with another provider.",
    "default": "An unexpected error occurred. Please try again."
}

export function LoginForm({ message, error: urlError }: LoginFormProps) {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(urlError ? (ERROR_MESSAGES[urlError] || ERROR_MESSAGES.default) : "")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        const formData = new FormData()
        formData.append("email", email)
        formData.append("password", password)

        const result = await loginAction(formData)

        setLoading(false)

        if (result?.error) {
            if (result.error === "email_not_verified") {
                router.push(`/auth/verify-email?email=${encodeURIComponent(email)}`)
                return
            }

            setError(ERROR_MESSAGES[result.error] || ERROR_MESSAGES.default)
        } else if (result?.success) {
            router.push("/")
            router.refresh()
        }
    }

    return (
        <LiquidGlass className="w-full p-5 sm:p-8 md:p-10 shadow-2xl space-y-6 sm:space-y-8 backdrop-blur-xl border-white/30" animate={false}>
            <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white drop-shadow-sm">Welcome Back</h1>
                <p className="text-white/70 text-xs sm:text-sm">Sign in to continue your journey with StayEase</p>
            </div>

            <div className="grid gap-6">
                {message && (
                    <div className="p-4 bg-white/10 border border-white/20 text-white rounded-xl text-sm backdrop-blur-md animate-in fade-in slide-in-from-top-2">
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-4">
                        <div className="relative group">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50 group-focus-within:text-white transition-colors" />
                            <Input
                                className="pl-10 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:bg-white/15 focus:border-white/30 rounded-xl transition-all duration-300 focus:scale-[1.02] shadow-none ring-0 focus-visible:ring-0"
                                placeholder="name@example.com"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="relative group">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50 group-focus-within:text-white transition-colors" />
                            <Input
                                className="pl-10 pr-10 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:bg-white/15 focus:border-white/30 rounded-xl transition-all duration-300 focus:scale-[1.02] shadow-none ring-0 focus-visible:ring-0"
                                placeholder="Password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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
                        {loading ? "Signing in..." : (
                            <span className="flex items-center justify-center gap-2">
                                Sign In <ArrowRight className="h-4 w-4" />
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
                    className="h-12 border-white/20 bg-white/5 text-white hover:bg-white/10 rounded-xl"
                >
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
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
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/register"
                        className="text-white font-bold hover:underline underline-offset-4"
                    >
                        Sign Up
                    </Link>
                </p>
            </div>
        </LiquidGlass>
    )
}
