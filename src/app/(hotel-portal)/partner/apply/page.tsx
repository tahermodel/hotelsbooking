"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/layout/header"

export default function PartnerApplyPage() {
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        // Simulate application submission
        await new Promise(r => setTimeout(r, 1500))
        setLoading(false)
        setSubmitted(true)
    }

    if (submitted) {
        return (
            <div className="flex min-h-screen flex-col">
                <Header />
                <main className="flex-1 container flex flex-col items-center justify-center py-20 text-center">
                    <h2 className="text-3xl font-bold mb-4">Application Received!</h2>
                    <p className="text-muted-foreground mb-8 max-w-md">
                        Our team will review your application and get back to you within 3-5 business days. Check your email for updates.
                    </p>
                    <Button onClick={() => window.location.href = "/"}>Return Home</Button>
                </main>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 container py-12 max-w-2xl">
                <h1 className="text-3xl font-bold mb-8">Partner Application</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Hotel Name</label>
                            <input className="w-full p-2 border rounded-md" required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Contact Person</label>
                            <input className="w-full p-2 border rounded-md" required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Contact Email</label>
                            <input type="email" className="w-full p-2 border rounded-md" required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Phone Number</label>
                            <input type="tel" className="w-full p-2 border rounded-md" required />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Hotel Address</label>
                        <input className="w-full p-2 border rounded-md" required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Tell us about your property</label>
                        <textarea className="w-full p-2 border rounded-md h-32" required />
                    </div>
                    <Button className="w-full" size="lg" disabled={loading}>
                        {loading ? "Submitting..." : "Submit Application"}
                    </Button>
                </form>
            </main>
        </div>
    )
}
