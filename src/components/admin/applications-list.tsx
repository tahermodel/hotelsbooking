"use client"

import { useState, useMemo } from "react"
import { ChevronDown, ChevronUp, User, Mail, Phone, Building2, Clock, CheckCircle2, XCircle, ArrowUpDown, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { updateApplicationStatus } from "@/app/(admin)/admin/applications/actions"

interface ApplicationsListProps {
    applications: any[]
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
            case 'approved': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            case 'pending': return <Clock className="w-4 h-4 text-amber-500" />
            case 'rejected': return <XCircle className="w-4 h-4 text-rose-500" />
            default: return null
        }
    }

    return (
        <div className="space-y-8">
            {/* Improved Sort Component */}
            <div className="flex justify-between items-center px-2">
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-white/20" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Filtering {sortedApplications.length} Entries</span>
                </div>
                <div className="relative group">
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                        className="appearance-none bg-white/5 border border-white/10 rounded-xl px-4 py-2 pr-10 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white hover:bg-white/10 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/10"
                    >
                        <option value="newest" className="bg-neutral-900">Recent First</option>
                        <option value="oldest" className="bg-neutral-900">Oldest First</option>
                        <option value="name" className="bg-neutral-900">Alphabetical</option>
                        <option value="status" className="bg-neutral-900">By Status</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40 pointer-events-none group-hover:text-white transition-colors" />
                </div>
            </div>

            <div className="grid gap-4">
                {sortedApplications.map((app, index) => {
                    const isExpanded = expandedApps[app.id]
                    return (
                        <div
                            key={app.id}
                            className={`card-section overflow-hidden transition-all duration-500 border-white/5 ${isExpanded ? 'bg-white/[0.04] border-white/20 shadow-2xl scale-[1.01]' : 'bg-white/[0.02] hover:bg-white/[0.03] hover:border-white/10'}`}
                        >
                            <div
                                onClick={() => toggleExpand(app.id)}
                                className="p-6 flex items-center justify-between gap-4 cursor-pointer"
                            >
                                <div className="flex items-center gap-6 flex-1">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 border transition-colors ${app.status === 'approved' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                                            app.status === 'pending' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                                                'bg-rose-500/10 border-rose-500/20 text-rose-500'
                                        }`}>
                                        <Building2 className="w-7 h-7" />
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="text-xl font-black tracking-tight mb-1 truncate">{app.hotel_name}</h3>
                                        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/40">
                                            <span>{new Date(app.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                            <div className="h-1 w-1 rounded-full bg-white/10" />
                                            <span className="flex items-center gap-1.5">
                                                {getStatusIcon(app.status)}
                                                <span className={
                                                    app.status === 'approved' ? 'text-emerald-500' :
                                                        app.status === 'pending' ? 'text-amber-500' :
                                                            'text-rose-500'
                                                }>{app.status}</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${isExpanded ? 'bg-white text-black rotate-180' : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'}`}>
                                    <ChevronUp className="w-5 h-5" />
                                </div>
                            </div>

                            {isExpanded && (
                                <div className="px-6 pb-8 pt-2 border-t border-white/5 animate-fade-in space-y-8">
                                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                        <div className="space-y-4">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Location Details</p>
                                            <div className="space-y-1">
                                                <p className="text-lg font-bold text-white">{app.hotel_address}</p>
                                                <p className="text-white/60 font-medium">{app.city}, {app.country}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Primary Contact</p>
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40"><User className="w-4 h-4" /></div>
                                                    <p className="text-sm font-bold text-white/80">{app.contact_person}</p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40"><Mail className="w-4 h-4" /></div>
                                                    <p className="text-sm font-bold text-white/80">{app.applicant_email}</p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40"><Phone className="w-4 h-4" /></div>
                                                    <p className="text-sm font-bold text-white/80">{app.contact_phone}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-4 border-l border-white/5 pl-8 sm:col-span-2 lg:col-span-1">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Application Memo</p>
                                            <p className="text-sm text-white/60 leading-relaxed font-medium">
                                                {app.property_description || "No additional property description provided."}
                                            </p>
                                        </div>
                                    </div>

                                    {app.status === 'pending' && (
                                        <div className="flex items-center gap-4 pt-8 border-t border-white/5">
                                            <form className="flex-1" action={async (formData) => { await updateApplicationStatus(app.id, "approved") }}>
                                                <button className="w-full h-12 bg-white text-black font-black text-xs uppercase tracking-widest rounded-xl hover:bg-white/90 transition-all">
                                                    Approve Partner
                                                </button>
                                            </form>
                                            <form className="flex-1" action={async (formData) => { await updateApplicationStatus(app.id, "rejected") }}>
                                                <button className="w-full h-12 bg-white/5 border border-white/10 text-white/60 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all">
                                                    Reject
                                                </button>
                                            </form>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )
                })}

                {sortedApplications.length === 0 && (
                    <div className="card-section py-32 text-center bg-white/[0.01] border-dashed border-white/10">
                        <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mx-auto mb-8">
                            <Building2 className="w-10 h-10 text-white/20" />
                        </div>
                        <h3 className="text-2xl font-black tracking-tight mb-2">No Applications Found</h3>
                        <p className="text-white/40 font-medium">New partnership requests will manifest here as they arrive.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
