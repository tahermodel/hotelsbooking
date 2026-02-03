import { Header } from "@/components/layout/header"

export default function Loading() {
    return (
        <div className="flex min-h-screen flex-col bg-neutral-950">
            <Header />
            <main className="flex-1 container mx-auto px-4 pt-32 pb-12 flex flex-col items-center justify-center">
                <div className="relative">
                    <div className="w-24 h-24 border-4 border-white/5 rounded-full animate-spin border-t-white" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 border-4 border-white/5 rounded-full animate-spin-slow border-b-white" />
                    </div>
                </div>
                <p className="mt-8 text-white/40 text-xs font-black uppercase tracking-[0.3em] animate-pulse">
                    Preparing Luxury
                </p>
            </main>
        </div>
    )
}
