"use client"

import { useState } from "react"
import { Pencil, X, Check, User, Mail, Phone, AlertTriangle, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { updateUserAccount, deleteAccountAction } from "@/actions/user"
import { useRouter } from "next/navigation"
import { CountryCodePicker } from "@/components/ui/country-code-picker"

interface AccountSettingsFormProps {
    user: {
        name: string | null
        email: string | null
        phone: string | null
    }
}

export function AccountSettingsForm({ user }: AccountSettingsFormProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    // Helper to split phone into code and number
    const splitPhone = (phone: string | null) => {
        if (!phone) return { code: "+1", number: "" }
        const parts = phone.split(" ")
        if (parts.length > 1) {
            return { code: parts[0], number: parts.slice(1).join(" ") }
        }
        return { code: "+1", number: phone }
    }

    const initialPhone = splitPhone(user.phone)

    const [formData, setFormData] = useState({
        name: user.name || "",
        email: user.email || "",
        country_code: initialPhone.code,
        phone_number: initialPhone.number,
        password: ""
    })
    const router = useRouter()

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        const data = new FormData()
        data.append("name", formData.name)
        data.append("email", formData.email)
        data.append("phone", `${formData.country_code} ${formData.phone_number}`)
        if (formData.password) data.append("password", formData.password)

        const result = await updateUserAccount(data)
        if (result.success) {
            setIsEditing(false)
            if (result.redirectUrl) {
                router.push(result.redirectUrl)
            }
        } else {
            alert(result.error)
        }
    }

    const handleCancel = () => {
        setFormData({
            name: user.name || "",
            email: user.email || "",
            country_code: initialPhone.code,
            phone_number: initialPhone.number,
            password: ""
        })
        setIsEditing(false)
    }

    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            setIsDeleting(true)
            const result = await deleteAccountAction()
            if (result.success) {
                router.push("/login")
            } else {
                setIsDeleting(false)
                alert(result.error)
            }
        }
    }

    const hasChanges =
        formData.name !== (user.name || "") ||
        formData.email !== (user.email || "") ||
        `${formData.country_code} ${formData.phone_number}` !== (user.phone || "") ||
        formData.password !== ""

    return (
        <form onSubmit={handleSave} className="space-y-8">
            <section className="glass-liquid p-8 animate-fade-in-up stagger-1 rounded-3xl">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-black/5 flex items-center justify-center">
                            <User className="w-6 h-6 text-black" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-black">Personal Information</h2>
                            <p className="text-sm text-black/60 font-medium">Manage your profile details</p>
                        </div>
                    </div>
                    {!isEditing ? (
                        <button
                            type="button"
                            onClick={() => setIsEditing(true)}
                            className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center text-black hover:bg-black hover:text-white transition-all duration-300"
                            aria-label="Edit profile"
                        >
                            <Pencil className="w-4 h-4" />
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center text-black hover:bg-black/80 hover:text-white transition-all duration-300"
                                aria-label="Cancel editing"
                            >
                                <X className="w-4 h-4" />
                            </button>

                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <div className="grid gap-2">
                        <label className="text-sm font-bold flex items-center gap-2 text-black">
                            <User className="w-4 h-4 text-black/40" />
                            Full Name
                        </label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                className="h-12 w-full rounded-2xl border border-black/10 bg-white/50 px-4 text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-black/5 focus:bg-white focus:border-black/20"
                            />
                        ) : (
                            <div className="h-12 w-full rounded-2xl border border-black/5 bg-black/5 px-4 flex items-center text-sm font-semibold text-black">
                                {user.name || "Not set"}
                            </div>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <label className="text-sm font-bold flex items-center gap-2 text-black">
                            <Mail className="w-4 h-4 text-black/40" />
                            Email Address
                        </label>
                        {isEditing ? (
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                className="h-12 w-full rounded-2xl border border-black/10 bg-white/50 px-4 text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-black/5 focus:bg-white focus:border-black/20"
                            />
                        ) : (
                            <div className="h-12 w-full rounded-2xl border border-black/5 bg-black/5 px-4 flex items-center text-sm font-semibold text-black">
                                {user.email || "Not set"}
                            </div>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <label className="text-sm font-bold flex items-center gap-2 text-black">
                            <Phone className="w-4 h-4 text-black/40" />
                            Phone Number
                        </label>
                        {isEditing ? (
                            <div className="flex gap-2">
                                <CountryCodePicker
                                    value={formData.country_code}
                                    onChange={(val) => setFormData(prev => ({ ...prev, country_code: val }))}
                                />
                                <input
                                    type="tel"
                                    name="phone_number"
                                    value={formData.phone_number}
                                    onChange={(e) => setFormData(prev => ({ ...prev, phone_number: e.target.value }))}
                                    placeholder="Enter your phone number"
                                    className="h-12 flex-1 rounded-2xl border border-black/10 bg-white/50 px-4 text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-black/5 focus:bg-white focus:border-black/20"
                                />
                            </div>
                        ) : (
                            <div className="h-12 w-full rounded-2xl border border-black/5 bg-black/5 px-4 flex items-center text-sm font-semibold text-black">
                                {user.phone || "Not set"}
                            </div>
                        )}
                    </div>

                    {isEditing && (
                        <div className="grid gap-2">
                            <label className="text-sm font-bold flex items-center gap-2 text-black">
                                <Lock className="w-4 h-4 text-black/40" />
                                New Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                placeholder="Leave blank to keep current password"
                                className="h-12 w-full rounded-2xl border border-black/10 bg-white/50 px-4 text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-black/5 focus:bg-white focus:border-black/20"
                            />
                        </div>
                    )}
                </div>

                {isEditing && (
                    <div className="mt-8 pt-6 border-t border-black/5">
                        <Button
                            type="submit"
                            className="w-full sm:w-auto bg-black text-white hover:bg-black/90 font-bold rounded-xl h-12 px-8"
                            disabled={!hasChanges}
                        >
                            Update Account Info
                        </Button>
                    </div>
                )}
            </section>

            <section className="glass-liquid p-8 border-none animate-fade-in-up stagger-2 rounded-3xl">
                <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-black/5 flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="w-6 h-6 text-black" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-xl font-bold text-black mb-1">Danger Zone</h2>
                        <p className="text-sm text-black/60 font-medium mb-6">
                            Permanently delete your account and all associated data. This action cannot be undone.
                        </p>
                        <Button
                            type="button"
                            variant="destructive"
                            className="bg-transparent text-black border-2 border-black/20 hover:bg-black hover:text-white hover:border-black font-bold rounded-xl h-11 px-6 transition-all"
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Deleting..." : "Delete Account"}
                        </Button>
                    </div>
                </div>
            </section>
        </form>
    )
}
