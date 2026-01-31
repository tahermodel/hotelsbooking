"use client"

import { useState } from "react"
import { Pencil, X, Check, User, Mail, Phone, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AccountSettingsFormProps {
    user: {
        name: string | null
        email: string | null
        phone: string | null
    }
}

export function AccountSettingsForm({ user }: AccountSettingsFormProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({
        name: user.name || "",
        phone: user.phone || ""
    })

    const handleSave = () => {
        setIsEditing(false)
    }

    const handleCancel = () => {
        setFormData({
            name: user.name || "",
            phone: user.phone || ""
        })
        setIsEditing(false)
    }

    return (
        <div className="space-y-8">
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
                            onClick={() => setIsEditing(true)}
                            className="icon-btn"
                            aria-label="Edit profile"
                        >
                            <Pencil className="w-4 h-4" />
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <button
                                onClick={handleCancel}
                                className="icon-btn bg-muted hover:bg-destructive hover:text-white"
                                aria-label="Cancel editing"
                            >
                                <X className="w-4 h-4" />
                            </button>
                            <button
                                onClick={handleSave}
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
                        <div className="h-11 w-full rounded-xl border border-border bg-muted/50 px-4 flex items-center text-sm text-muted-foreground">
                            {user.email || "Not set"}
                            <span className="ml-auto text-xs bg-muted px-2 py-0.5 rounded-full">Cannot be changed</span>
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            Phone Number
                        </label>
                        {isEditing ? (
                            <input
                                type="tel"
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
                </div>

                {isEditing && (
                    <div className="mt-6 pt-4 border-t border-border">
                        <Button onClick={handleSave} className="w-full sm:w-auto">
                            Save Changes
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
                        <Button variant="destructive" size="sm">
                            Delete Account
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    )
}
