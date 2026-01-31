import { Header } from "@/components/layout/header"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { updateApplicationStatus } from "./actions"
import { ArrowLeft, FileText, User, Mail, Phone, Building2 } from "lucide-react"
import Link from "next/link"

export const dynamic = 'force-dynamic'

export default async function AdminApplicationsPage() {
    const applications = await prisma.hotelApplication.findMany({
        orderBy: { created_at: 'desc' }
    })

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="flex-1 container py-12 max-w-5xl pt-24">
                <div className="mb-8 animate-fade-in">
                    <Link
                        href="/admin/dashboard"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </Link>
                    <span className="section-title block">Review</span>
                    <h1 className="text-3xl font-bold">Partner Applications</h1>
                </div>

                <div className="space-y-4">
                    {applications?.map((app, index) => (
                        <div
                            key={app.id}
                            className={`card-section p-6 animate-fade-in-up stagger-${Math.min(index + 1, 6)}`}
                        >
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <Building2 className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold">{app.hotel_name}</h3>
                                        <p className="text-sm text-muted-foreground">{app.hotel_address}</p>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${app.status === 'pending' ? 'bg-primary/10 text-primary' :
                                        app.status === 'approved' ? 'bg-secondary/10 text-secondary' :
                                            'bg-destructive/10 text-destructive'
                                    }`}>
                                    {app.status.toUpperCase()}
                                </span>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4 py-4 border-t border-border">
                                <div className="flex items-center gap-3">
                                    <User className="w-4 h-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Contact Person</p>
                                        <p className="font-medium">{app.contact_person}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Mail className="w-4 h-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Email</p>
                                        <p className="font-medium">{app.applicant_email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone className="w-4 h-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Phone</p>
                                        <p className="font-medium">{app.contact_phone}</p>
                                    </div>
                                </div>
                            </div>

                            {app.description && (
                                <div className="py-4 border-t border-border">
                                    <p className="text-xs text-muted-foreground mb-2">Property Description</p>
                                    <p className="text-sm whitespace-pre-wrap">{app.description}</p>
                                </div>
                            )}

                            {app.status === 'pending' && (
                                <div className="flex gap-2 pt-4 border-t border-border">
                                    <form action={updateApplicationStatus.bind(null, app.id, "approved")}>
                                        <Button size="sm" type="submit">
                                            Approve
                                        </Button>
                                    </form>
                                    <form action={updateApplicationStatus.bind(null, app.id, "rejected")}>
                                        <Button size="sm" variant="outline" className="text-destructive hover:bg-destructive hover:text-white" type="submit">
                                            Reject
                                        </Button>
                                    </form>
                                </div>
                            )}
                        </div>
                    ))}

                    {(!applications || applications.length === 0) && (
                        <div className="card-section py-16 text-center animate-fade-in">
                            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                                <FileText className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <p className="text-muted-foreground">No partner applications found.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
