"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export function PartnerApplyForm() {
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [error, setError] = useState("")
    const [formData, setFormData] = useState({
        hotel_name: "",
        contact_person: "",
        applicant_email: "",
        country_code: "+1",
        contact_phone: "",
        hotel_address: "",
        city: "",
        country: "",
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
            <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Hotel Name</label>
                    <Input
                        name="hotel_name"
                        value={formData.hotel_name}
                        onChange={handleChange}
                        placeholder="e.g. Grand Hotel"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Contact Person</label>
                    <Input
                        name="contact_person"
                        value={formData.contact_person}
                        onChange={handleChange}
                        placeholder="Your full name"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Contact Email</label>
                    <Input
                        type="email"
                        name="applicant_email"
                        value={formData.applicant_email}
                        onChange={handleChange}
                        placeholder="email@example.com"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">Phone Number</label>
                    <div className="flex gap-2">
                        <select
                            name="country_code"
                            value={formData.country_code}
                            onChange={(e) => setFormData(prev => ({ ...prev, country_code: e.target.value }))}
                            className="flex h-10 w-[120px] rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="+1">+1 (US)</option>
                            <option value="+44">+44 (UK)</option>
                            <option value="+971">+971 (UAE)</option>
                            <option value="+20">+20 (EG)</option>
                            <option value="+966">+966 (KSA)</option>
                            <option value="+33">+33 (FR)</option>
                            <option value="+49">+49 (DE)</option>
                            <option value="+91">+91 (IN)</option>
                            <option value="+81">+81 (JP)</option>
                            <option value="+86">+86 (CN)</option>
                            <option value="+7">+7 (RU)</option>
                            <option value="+55">+55 (BR)</option>
                            <option value="+90">+90 (TR)</option>
                            <option value="+61">+61 (AU)</option>
                        </select>
                        <Input
                            type="tel"
                            name="contact_phone"
                            value={formData.contact_phone}
                            onChange={handleChange}
                            placeholder="000 000 0000"
                            className="flex-1"
                            required
                        />
                    </div>
                </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">City</label>
                    <Input
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="e.g. New York"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">Country</label>
                    <Input
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        placeholder="e.g. United States"
                        required
                    />
                </div>
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Hotel Address</label>
                <Input
                    name="hotel_address"
                    value={formData.hotel_address}
                    onChange={handleChange}
                    placeholder="e.g. 123 Luxury Ave, Manhattan"
                    required
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Tell us about your property</label>
                <Textarea
                    name="property_description"
                    value={formData.property_description}
                    onChange={handleChange}
                    placeholder="Describe your hotel, amenities, and why you want to partner with us..."
                    className="min-h-[120px] resize-y"
                    required
                />
            </div>
            <Button className="w-full bg-[#ff9f1c] hover:bg-[#ff9f1c]/90 text-white" size="lg" disabled={loading}>
                {loading ? "Submitting..." : "Submit Application"}
            </Button>
        </form>
    )
}

