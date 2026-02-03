import Image from "next/image"

export default function AuthLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <div className="relative min-h-screen w-full flex items-center justify-center p-4 bg-neutral-950">
            <div
                className="fixed top-0 left-0 w-full h-[100lvh] z-0 bg-cover bg-center bg-no-repeat pointer-events-none will-change-transform"
                style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1612278675615-7b093b07772d?q=80&w=2560&auto=format&fit=crop')`,
                    transform: 'translateZ(0)',
                    backfaceVisibility: 'hidden'
                }}
            >
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
            </div>

            <div className="relative z-10 w-full max-w-[min(420px,100%)]">
                {children}
            </div>
        </div>
    )
}
