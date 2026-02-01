import { LoginForm } from "@/components/auth/login-form"
import { Suspense } from "react"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

async function LoginPageContent({
    searchParams
}: {
    searchParams: Promise<{ message?: string; error?: string }>
}) {
    const session = await auth()

    if (session) {
        redirect("/")
    }

    const { message, error } = await searchParams
    return <LoginForm message={message} error={error} />
}

export default function LoginPage({
    searchParams
}: {
    searchParams: Promise<{ message?: string; error?: string }>
}) {
    return (
        <Suspense fallback={<div className="h-full w-full flex items-center justify-center">Loading...</div>}>
            <LoginPageContent searchParams={searchParams} />
        </Suspense>
    )
}
