import Image from "next/image"

export default function AuthLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <div className="relative h-[100dvh] w-full flex items-center justify-center p-4 overflow-hidden">
            <div className="fixed inset-0 z-0">
                <Image
                    src="https://images.unsplash.com/photo-1612278675615-7b093b07772d?q=80&w=2560&auto=format&fit=crop"
                    alt="Background"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/15" />
            </div>

            <div className="relative z-10 w-full max-w-[min(420px,100%)] flex items-center justify-center">
                {children}
            </div>
        </div>
    )
}
