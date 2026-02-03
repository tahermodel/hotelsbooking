import { Header } from "@/components/layout/header"

export default function Loading() {
    return (
        <div className="flex min-h-screen flex-col bg-neutral-950">
            <Header />
            <main className="flex-1 container mx-auto px-4 pt-32 pb-12 flex flex-col items-center justify-center">
                <div className="relative">
                    <div className="w-16 h-16 border-2 border-white/10 rounded-full animate-spin border-t-white" />
                    <p className="mt-8 text-white/40 text-xs font-black uppercase tracking-[0.3em] animate-pulse">
                        Finalizing Details
                    </p>
                </div>
            </main>
        </div>
    )
}
