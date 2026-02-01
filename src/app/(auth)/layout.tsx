import Image from "next/image"

export default function AuthLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="relative hidden h-full flex-col bg-muted lg:flex overflow-hidden">
                <Image
                    src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&auto=format&fit=crop&q=80"
                    alt="Luxury hotel background"
                    fill
                    className="object-cover"
                    priority
                />

                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-r from-transparent to-background z-10" />

                <div className="relative z-20 p-10 flex items-center text-lg font-medium">
                    <span className="text-2xl font-bold text-white drop-shadow-md">StayEase</span>
                </div>
                <div className="relative z-20 mt-auto p-10">
                    <p className="text-lg text-white drop-shadow-md font-medium">
                        Join thousands of travelers booking their dream stays with ease and security.
                    </p>
                </div>
            </div>
            <div className="lg:p-8">
                {children}
            </div>
        </div>
    )
}
