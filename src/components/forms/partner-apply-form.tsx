"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export function PartnerApplyForm() {
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [error, setError] = useState("")
    const [formData, setFormData] = useState({
        hotel_name: "",
        contact_person: "",
        applicant_email: "",
        contact_phone: "",
        hotel_address: "",
        property_description: ""
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const response = await fetch("/api/partner/apply", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData)
            })

            if (!response.ok) {
                throw new Error("Failed to submit application")
            }

            setSubmitted(true)
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred")
        } finally {
            setLoading(false)
        }
    }

    if (submitted) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <h2 className="text-3xl font-bold mb-4">Application Received!</h2>
                <p className="text-muted-foreground mb-8 max-w-md">
                    Our team will review your application and get back to you within 3-5 business days. Check your email for updates.
                </p>
                <Button onClick={() => window.location.href = "/"}>Return Home</Button>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
                    {error}
                </div>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Hotel Name</label>
                    <input
                        name="hotel_name"
                        value={formData.hotel_name}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Contact Person</label>
                    <input
                        name="contact_person"
                        value={formData.contact_person}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Contact Email</label>
                    <input
                        type="email"
                        name="applicant_email"
                        value={formData.applicant_email}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Phone Number</label>
                    <input
                        type="tel"
                        name="contact_phone"
                        value={formData.contact_phone}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                        required
                    />
                </div>
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Hotel Address</label>
                <input
                    name="hotel_address"
                    value={formData.hotel_address}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                    required
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Tell us about your property</label>
                <textarea
                    name="property_description"
                    value={formData.property_description}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md h-32"
                    required
                />
            </div>
            <Button className="w-full" size="lg" disabled={loading}>
                {loading ? "Submitting..." : "Submit Application"}
            </Button>
        </form>
    )
}
