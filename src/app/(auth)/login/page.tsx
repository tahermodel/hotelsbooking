import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
    return (
        <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="relative hidden h-full flex-col bg-gradient-to-br from-teal-600 to-cyan-500 p-10 text-white lg:flex dark:border-r">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-600 to-cyan-500" />
                <div className="relative z-20 flex items-center text-lg font-medium">
                    <span className="text-2xl font-bold">StayEase</span>
                </div>
                <div className="relative z-20 mt-auto">
                    <blockquote className="space-y-2">
                        <p className="text-lg">
                            "This platform has transformed how our hotel manages bookings. The pay-later system is a game changer for guest trust."
                        </p>
                        <footer className="text-sm">Sofia Davis, General Manager</footer>
                    </blockquote>
                </div>
            </div>
            <div className="lg:p-8">
                <LoginForm />
            </div>
        </div>
    )
}
