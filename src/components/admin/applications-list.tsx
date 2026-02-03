"use client"

import { useState, useMemo } from "react"
import { ChevronDown, ChevronUp, User, Mail, Phone, Building2, Clock, CheckCircle2, XCircle, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { updateApplicationStatus } from "@/app/(admin)/admin/applications/actions"

interface ApplicationsListProps {
    applications: any[] // Using any for simplicity with Prisma types or I can define it
}

type SortOption = 'newest' | 'oldest' | 'name' | 'status'

export function ApplicationsList({ applications: initialApplications }: ApplicationsListProps) {
    const [expandedApps, setExpandedApps] = useState<Record<string, boolean>>({})
    const [sortBy, setSortBy] = useState<SortOption>('newest')

    const toggleExpand = (id: string) => {
        setExpandedApps(prev => ({ ...prev, [id]: !prev[id] }))
    }

    const sortedApplications = useMemo(() => {
        return [...initialApplications].sort((a, b) => {
            if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            if (sortBy === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
            if (sortBy === 'name') return a.hotel_name.localeCompare(b.hotel_name)
            if (sortBy === 'status') return a.status.localeCompare(b.status)
            return 0
        })
    }, [initialApplications, sortBy])

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'approved': return <CheckCircle2 className="w-4 h-4 text-success" />
            case 'pending': return <Clock className="w-4 h-4 text-accent" />
            case 'rejected': return <XCircle className="w-4 h-4 text-destructive" />
            default: return null
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-end mb-6">
                <div className="flex items-center gap-2 bg-white/5 p-1 rounded-lg border border-white/10 shadow-sm">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-2 mr-1">Sort By:</span>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                        className="text-sm font-medium bg-transparent border-none focus:ring-0 cursor-pointer pr-8"
                    >
                        <option value="newest">Recent First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="name">Hotel Name</option>
                        <option value="status">Status</option>
                    </select>
                </div>
            </div>

            <div className="grid gap-4">
                {sortedApplications.map((app, index) => {
                    const isExpanded = expandedApps[app.id]
                    return (
                        <div
                            key={app.id}
                            className="card-section overflow-hidden transition-all duration-300 hover:shadow-md border-l-4 border-l-transparent"
                            style={{ borderLeftColor: app.status === 'approved' ? 'var(--secondary)' : app.status === 'pending' ? 'var(--accent)' : 'var(--destructive)' }}
                        >
                            <div className="p-5 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4 flex-1">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${app.status === 'approved' ? 'bg-success/10' :
                                        app.status === 'pending' ? 'bg-accent/10' :
                                            'bg-destructive/10'
                                        }`}>
                                        <Building2 className={`w-6 h-6 ${app.status === 'approved' ? 'text-success' :
                                            app.status === 'pending' ? 'text-accent' :
                                                'text-destructive'
                                            }`} />
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="text-lg font-bold truncate">{app.hotel_name}</h3>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <span>{new Date(app.created_at).toLocaleDateString()}</span>
                                            <span className="w-1 h-1 rounded-full bg-border" />
                                            <span className="flex items-center gap-1">
                                                {getStatusIcon(app.status)}
                                                <span className="capitalize">{app.status}</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => toggleExpand(app.id)}
                                    className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
                                    aria-label={isExpanded ? "Collapse" : "Expand"}
                                >
                                    {isExpanded ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
                                </button>
                            </div>

                            {isExpanded && (
                                <div className="px-5 pb-5 pt-2 border-t border-border animate-fade-in">
                                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                                        <div className="space-y-1">
                                            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Hotel Address</p>
                                            <p className="text-sm font-medium">{app.hotel_address}</p>
                                            <p className="text-sm text-muted-foreground">{app.city}, {app.country}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Contact Person</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <User className="w-3 h-3 text-primary" />
                                                <p className="text-sm font-medium">{app.contact_person}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Mail className="w-3 h-3 text-primary" />
                                                <p className="text-sm text-muted-foreground">{app.applicant_email}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Phone className="w-3 h-3 text-primary" />
                                                <p className="text-sm text-muted-foreground">{app.contact_phone}</p>
                                            </div>
                                        </div>
                                        {app.description && (
                                            <div className="space-y-1 sm:col-span-2 lg:col-span-1">
                                                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Property Description</p>
                                                <p className="text-sm text-muted-foreground line-clamp-3 hover:line-clamp-none transition-all">{app.description}</p>
                                            </div>
                                        )}
                                    </div>

                                    {app.status === 'pending' && (
                                        <div className="flex items-center gap-3 pt-4 border-t border-border">
                                            <form action={async (formData) => { await updateApplicationStatus(app.id, "approved") }}>
                                                <Button size="sm" variant="success" className="min-w-[100px]">
                                                    Approve
                                                </Button>
                                            </form>
                                            <form action={async (formData) => { await updateApplicationStatus(app.id, "rejected") }}>
                                                <Button size="sm" variant="destructive" className="min-w-[100px]">
                                                    Reject
                                                </Button>
                                            </form>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )
                })}

                {sortedApplications.length === 0 && (
                    <div className="card-section py-20 text-center bg-white/50 border-dashed">
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                            <Building2 className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-bold">No applications found</h3>
                        <p className="text-sm text-muted-foreground">When partners apply, they will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
