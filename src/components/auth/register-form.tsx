"use client"

import { useState } from "react"
import { register } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Link from "next/link"

export function RegisterForm() {
    const router = useRouter()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

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
            router.push("/login?message=Check your email to confirm your account")
        }
    }

    return (
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
                <p className="text-sm text-muted-foreground">Enter your details to get started</p>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-4">
                <div className="grid gap-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <input
                        name="fullName"
                        className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        placeholder="John Doe"
                        required
                    />
                </div>
                <div className="grid gap-2">
                    <label className="text-sm font-medium">Email</label>
                    <input
                        name="email"
                        type="email"
                        className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        placeholder="name@example.com"
                        required
                    />
                </div>
                <div className="grid gap-2">
                    <label className="text-sm font-medium">Password</label>
                    <input
                        name="password"
                        type="password"
                        className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        required
                    />
                </div>
                {error && <p className="text-sm font-medium text-destructive">{error}</p>}
                <Button disabled={loading}>
                    {loading ? "Creating account..." : "Sign Up"}
                </Button>
            </form>

            <p className="px-8 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                    href="/login"
                    className="underline underline-offset-4 hover:text-primary"
                >
                    Sign In
                </Link>
            </p>
        </div>
    )
}
