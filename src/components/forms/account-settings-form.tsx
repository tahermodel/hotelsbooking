"use client"

import { useState } from "react"
import { Pencil, X, Check, User, Mail, Phone, AlertTriangle, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { updateUserAccount, deleteAccountAction } from "@/actions/user"
import { useRouter } from "next/navigation"
import { CountryCodePicker } from "@/components/ui/country-code-picker"
import { LiquidGlass } from "@/components/ui/liquid-glass"
import { motion, AnimatePresence } from "framer-motion"

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
            <LiquidGlass className="p-8 rounded-3xl border-white/20 shadow-2xl backdrop-blur-md" animate={false}>
                <motion.div layout className="relative z-10">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                                <User className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Personal Information</h2>
                                <p className="text-sm text-white/60 font-medium">Manage your profile details</p>
                            </div>
                        </div>
                        <AnimatePresence mode="wait">
                            {!isEditing ? (
                                <motion.button
                                    key="edit"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    type="button"
                                    onClick={() => setIsEditing(true)}
                                    className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300"
                                    aria-label="Edit profile"
                                >
                                    <Pencil className="w-4 h-4" />
                                </motion.button>
                            ) : (
                                <motion.button
                                    key="cancel"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    type="button"
                                    onClick={handleCancel}
                                    className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white hover:bg-red-500 hover:text-white transition-all duration-300"
                                    aria-label="Cancel editing"
                                >
                                    <X className="w-4 h-4" />
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="grid gap-6">
                        <motion.div layout className="grid gap-2">
                            <label className="text-sm font-bold flex items-center gap-2 !text-white/80">
                                <User className="w-4 h-4 text-white/40" />
                                Full Name
                            </label>
                            <AnimatePresence mode="wait">
                                {isEditing ? (
                                    <motion.input
                                        key="name-input"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 10 }}
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                        className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-bold !text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/10 focus:bg-white/10 focus:border-white/30"
                                    />
                                ) : (
                                    <motion.div
                                        key="name-view"
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        className="h-12 w-full rounded-2xl border border-white/5 bg-white/5 px-4 flex items-center text-sm font-bold !text-white"
                                    >
                                        {user.name || "Not set"}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        <motion.div layout className="grid gap-2">
                            <label className="text-sm font-bold flex items-center gap-2 !text-white/80">
                                <Mail className="w-4 h-4 text-white/40" />
                                Email Address
                            </label>
                            <AnimatePresence mode="wait">
                                {isEditing ? (
                                    <motion.input
                                        key="email-input"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 10 }}
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                        className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-bold !text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/10 focus:bg-white/10 focus:border-white/30"
                                    />
                                ) : (
                                    <motion.div
                                        key="email-view"
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        className="h-12 w-full rounded-2xl border border-white/5 bg-white/5 px-4 flex items-center text-sm font-bold !text-white"
                                    >
                                        {user.email || "Not set"}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        <motion.div layout className="grid gap-2">
                            <label className="text-sm font-bold flex items-center gap-2 !text-white/80">
                                <Phone className="w-4 h-4 text-white/40" />
                                Phone Number
                            </label>
                            <AnimatePresence mode="wait">
                                {isEditing ? (
                                    <motion.div
                                        key="phone-edit"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 10 }}
                                        className="flex flex-col sm:flex-row gap-3 max-w-full overflow-hidden"
                                    >
                                        <div className="flex-shrink-0">
                                            <CountryCodePicker
                                                value={formData.country_code}
                                                onChange={(val) => setFormData(prev => ({ ...prev, country_code: val }))}
                                                variant="compact"
                                            />
                                        </div>
                                        <input
                                            type="tel"
                                            name="phone_number"
                                            value={formData.phone_number}
                                            onChange={(e) => setFormData(prev => ({ ...prev, phone_number: e.target.value }))}
                                            placeholder="Enter your phone number"
                                            className="h-12 flex-1 min-w-0 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-bold !text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/10 focus:bg-white/10 focus:border-white/30"
                                        />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="phone-view"
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        className="h-12 w-full rounded-2xl border border-white/5 bg-white/5 px-4 flex items-center text-sm font-bold !text-white"
                                    >
                                        {user.phone || "Not set"}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        <AnimatePresence>
                            {isEditing && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="grid gap-2"
                                >
                                    <label className="text-sm font-bold flex items-center gap-2 !text-white/80">
                                        <Lock className="w-4 h-4 text-white/40" />
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                        placeholder="Leave blank to keep current password"
                                        className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-bold !text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/10 focus:bg-white/10 focus:border-white/30"
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <AnimatePresence>
                        {isEditing && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="mt-8 pt-6 border-t border-white/5"
                            >
                                <Button
                                    type="submit"
                                    className="w-full sm:w-auto bg-white text-black hover:bg-white/90 font-bold rounded-xl h-12 px-8"
                                    disabled={!hasChanges}
                                >
                                    Update Account Info
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </LiquidGlass>

            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                <LiquidGlass className="p-8 rounded-3xl border-white/20 shadow-2xl backdrop-blur-md" animate={false}>
                    <div className="flex items-start gap-5 relative z-10">
                        <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center flex-shrink-0">
                            <AlertTriangle className="w-6 h-6 text-red-500" />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-xl font-bold text-white mb-1">Danger Zone</h2>
                            <p className="text-sm text-white/60 font-medium mb-6">
                                Permanently delete your account and all associated data. This action cannot be undone.
                            </p>
                            <Button
                                type="button"
                                variant="destructive"
                                className="bg-transparent text-red-500 border-2 border-red-500/20 hover:bg-red-500 hover:text-white hover:border-red-500 font-bold rounded-xl h-11 px-6 transition-all"
                                onClick={handleDelete}
                                disabled={isDeleting}
                            >
                                {isDeleting ? "Deleting..." : "Delete Account"}
                            </Button>
                        </div>
                    </div>
                </LiquidGlass>
            </motion.div>
        </form>
    )
}
