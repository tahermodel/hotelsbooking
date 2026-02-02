import Image from "next/image"

export default function AuthLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <div className="relative min-h-screen w-full flex items-center justify-center p-4">
            <div className="fixed inset-0 z-0 overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
                    style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1612278675615-7b093b07772d?q=100&fm=jpg&w=2560&fit=max')`,
                    }}
                />
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
            </div>

            <div className="relative z-10 w-full max-w-[min(440px,100%)] flex items-center justify-center py-10">
                {children}
            </div>
        </div>
    )
}
