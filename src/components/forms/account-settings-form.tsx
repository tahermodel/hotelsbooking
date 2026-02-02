"use client"

import { useState } from "react"
import { Pencil, X, Check, User, Mail, Phone, AlertTriangle, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { updateUserAccount, deleteAccountAction } from "@/actions/user"
import { useRouter } from "next/navigation"

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
    const [formData, setFormData] = useState({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        password: ""
    })
    const router = useRouter()

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        const data = new FormData()
        data.append("name", formData.name)
        data.append("email", formData.email)
        data.append("phone", formData.phone)
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
            phone: user.phone || "",
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

    return (
        <form onSubmit={handleSave} className="space-y-8">
            <section className="card-section p-6 animate-fade-in-up stagger-1">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <User className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="font-semibold">Personal Information</h2>
                            <p className="text-sm text-muted-foreground">Manage your profile details</p>
                        </div>
                    </div>
                    {!isEditing ? (
                        <button
                            type="button"
                            onClick={() => setIsEditing(true)}
                            className="icon-btn"
                            aria-label="Edit profile"
                        >
                            <Pencil className="w-4 h-4" />
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="icon-btn bg-muted hover:bg-destructive hover:text-white"
                                aria-label="Cancel editing"
                            >
                                <X className="w-4 h-4" />
                            </button>
                            <button
                                type="submit"
                                className="icon-btn bg-primary text-white hover:bg-primary/90"
                                aria-label="Save changes"
                            >
                                <Check className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <div className="grid gap-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                            <User className="w-4 h-4 text-muted-foreground" />
                            Full Name
                        </label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                className="h-11 w-full rounded-xl border border-input bg-background px-4 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            />
                        ) : (
                            <div className="h-11 w-full rounded-xl border border-border bg-muted/30 px-4 flex items-center text-sm">
                                {user.name || "Not set"}
                            </div>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            Email Address
                        </label>
                        {isEditing ? (
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                className="h-11 w-full rounded-xl border border-input bg-background px-4 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            />
                        ) : (
                            <div className="h-11 w-full rounded-xl border border-border bg-muted/30 px-4 flex items-center text-sm">
                                {user.email || "Not set"}
                            </div>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            Phone Number
                        </label>
                        {isEditing ? (
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                placeholder="Enter your phone number"
                                className="h-11 w-full rounded-xl border border-input bg-background px-4 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            />
                        ) : (
                            <div className="h-11 w-full rounded-xl border border-border bg-muted/30 px-4 flex items-center text-sm">
                                {user.phone || "Not set"}
                            </div>
                        )}
                    </div>

                    {isEditing && (
                        <div className="grid gap-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <Lock className="w-4 h-4 text-muted-foreground" />
                                New Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                placeholder="Leave blank to keep current password"
                                className="h-11 w-full rounded-xl border border-input bg-background px-4 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            />
                        </div>
                    )}
                </div>

                {isEditing && (
                    <div className="mt-6 pt-4 border-t border-border">
                        <Button type="submit" className="w-full sm:w-auto">
                            Update Account Info
                        </Button>
                    </div>
                )}
            </section>

            <section className="card-section p-6 border-destructive/20 animate-fade-in-up stagger-2">
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="w-5 h-5 text-destructive" />
                    </div>
                    <div className="flex-1">
                        <h2 className="font-semibold text-destructive mb-1">Danger Zone</h2>
                        <p className="text-sm text-muted-foreground mb-4">
                            Permanently delete your account and all associated data. This action cannot be undone.
                        </p>
                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
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
