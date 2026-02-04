"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CountryCodePicker } from "@/components/ui/country-code-picker"
import { CheckCircle2, AlertCircle } from "lucide-react"

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
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-8">
                <div className="w-24 h-24 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                    <CheckCircle2 className="w-12 h-12" />
                </div>
                <div className="space-y-4">
                    <h2 className="text-4xl font-black tracking-tight">Application Transmitted</h2>
                    <p className="text-white/40 font-medium max-w-md mx-auto leading-relaxed">
                        Our review committee has received your dossier. Expect a premium onboarding consultation within 3-5 business days.
                    </p>
                </div>
                <Button
                    onClick={() => window.location.href = "/"}
                    className="h-14 px-10 bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-white/90 transition-all"
                >
                    Return to Exploration
                </Button>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-10">
            {error && (
                <div className="p-6 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl flex items-center gap-4">
                    <AlertCircle className="w-6 h-6 shrink-0" />
                    <p className="text-sm font-bold tracking-tight">{error}</p>
                </div>
            )}

            <div className="space-y-8">
                <div className="grid gap-8 sm:grid-cols-2">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Establishment Name</label>
                        <input
                            name="hotel_name"
                            value={formData.hotel_name}
                            onChange={handleChange}
                            placeholder="e.g. The Ritz-Carlton"
                            required
                            className="w-full h-14 px-5 border border-white/10 rounded-2xl bg-white/5 text-white font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/10 focus:bg-white/[0.08]"
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Applicant Name</label>
                        <input
                            name="contact_person"
                            value={formData.contact_person}
                            onChange={handleChange}
                            placeholder="Full Name"
                            required
                            className="w-full h-14 px-5 border border-white/10 rounded-2xl bg-white/5 text-white font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/10 focus:bg-white/[0.08]"
                        />
                    </div>
                </div>

                <div className="grid gap-8 sm:grid-cols-2">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Professional Email</label>
                        <input
                            type="email"
                            name="applicant_email"
                            value={formData.applicant_email}
                            onChange={handleChange}
                            placeholder="concierge@hotel.com"
                            required
                            className="w-full h-14 px-5 border border-white/10 rounded-2xl bg-white/5 text-white font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/10 focus:bg-white/[0.08]"
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Contact Phone</label>
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-3">
                            <div className="flex gap-2 w-full sm:w-auto">
                                <CountryCodePicker
                                    value={formData.country_code}
                                    onChange={(val) => setFormData(prev => ({ ...prev, country_code: val }))}
                                />
                            </div>
                            <input
                                type="tel"
                                name="contact_phone"
                                value={formData.contact_phone}
                                onChange={handleChange}
                                placeholder="Phone number"
                                required
                                className="flex-1 min-w-0 h-14 px-5 border border-white/10 rounded-2xl bg-white/5 text-white font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/10 focus:bg-white/[0.08]"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid gap-8 sm:grid-cols-2">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">City</label>
                        <input
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            placeholder="Manhattan"
                            required
                            className="w-full h-14 px-5 border border-white/10 rounded-2xl bg-white/5 text-white font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/10 focus:bg-white/[0.08]"
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Country</label>
                        <input
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            placeholder="United States"
                            required
                            className="w-full h-14 px-5 border border-white/10 rounded-2xl bg-white/5 text-white font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/10 focus:bg-white/[0.08]"
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Physical Address</label>
                    <input
                        name="hotel_address"
                        value={formData.hotel_address}
                        onChange={handleChange}
                        placeholder="123 Luxury Ave, Premium District"
                        required
                        className="w-full h-14 px-5 border border-white/10 rounded-2xl bg-white/5 text-white font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/10 focus:bg-white/[0.08]"
                    />
                </div>

                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Property Vision</label>
                    <textarea
                        name="property_description"
                        value={formData.property_description}
                        onChange={handleChange}
                        placeholder="Describe your establishment's unique legacy and why it belongs on StayEase..."
                        required
                        className="w-full min-h-[160px] p-5 border border-white/10 rounded-2xl bg-white/5 text-white font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/10 focus:bg-white/[0.08] resize-none"
                    />
                </div>
            </div>

            <Button
                type="submit"
                className="w-full h-16 bg-white text-black font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-white/90 shadow-2xl shadow-white/5 transition-all active:scale-[0.98]"
                disabled={loading}
            >
                {loading ? "Transmitting..." : "Submit Application"}
            </Button>
        </form>
    )
}
