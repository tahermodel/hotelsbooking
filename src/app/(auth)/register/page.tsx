import { RegisterForm } from "@/components/auth/register-form"

export default function RegisterPage() {
    return (
        <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="relative hidden h-full flex-col bg-gradient-to-br from-teal-600 to-cyan-500 p-10 text-white lg:flex dark:border-r">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-600 to-cyan-500" />
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
