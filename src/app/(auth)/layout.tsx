import Image from "next/image"

export default function AuthLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <div className="relative h-[100dvh] w-full flex items-center justify-center p-4 overflow-hidden">
            <div className="fixed inset-0 z-0 overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1612278675615-7b093b07772d?q=100&auto=format&fit=crop&w=3840')`,
                    }}
                />
                <div className="absolute inset-0 bg-black/45 backdrop-blur-[1px]" />
            </div>

            <div className="relative z-10 w-full max-w-[min(420px,100%)] flex items-center justify-center">
                {children}
            </div>
        </div>
    )
}
