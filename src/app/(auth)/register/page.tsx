import { RegisterForm } from "@/components/auth/register-form"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function RegisterPage() {
    const session = await auth()

    if (session) {
        redirect("/")
    }

    return (
        <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="relative hidden h-full flex-col bg-gradient-to-br from-primary to-primary/70 p-10 text-white lg:flex">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/70" />
                <div className="relative z-20 flex items-center text-lg font-medium">
                    <span className="text-2xl font-bold">StayEase</span>
                </div>
                <div className="relative z-20 mt-auto">
                    <p className="text-lg">Join thousands of travelers booking their dream stays with ease and security.</p>
                </div>
            </div>
            <div className="lg:p-8">
                <RegisterForm />
            </div>
        </div>
    )
}
