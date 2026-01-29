import { Header } from "@/components/layout/header"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"

export const dynamic = 'force-dynamic'

export default async function AdminApplicationsPage() {
    const applications = await prisma.hotelApplication.findMany({
        orderBy: { created_at: 'desc' }
    })

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 container py-12">
                <h1 className="text-3xl font-bold mb-8">Partner Applications</h1>

                <div className="space-y-6">
                    {applications?.map((app) => (
                        <div key={app.id} className="p-6 border rounded-xl bg-card space-y-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-bold">{app.hotel_name}</h3>
                                    <p className="text-muted-foreground">{app.hotel_address}</p>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${app.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                    app.status === 'approved' ? 'bg-green-100 text-green-700' :
                                        'bg-red-100 text-red-700'
                                    }`}>
                                    {app.status.toUpperCase()}
                                </span>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t">
                                <div>
                                    <p className="text-sm font-medium">Contact Person</p>
                                    <p className="text-muted-foreground">{app.contact_person}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Contact Details</p>
                                    <p className="text-muted-foreground">{app.applicant_email} | {app.contact_phone}</p>
                                </div>
                            </div>

                            {app.status === 'pending' && (
                                <div className="flex gap-2 pt-4">
                                    <Button size="sm">Approve Application</Button>
                                    <Button size="sm" variant="ghost" className="text-destructive">Reject</Button>
                                </div>
                            )}
                        </div>
                    ))}

                    {(!applications || applications.length === 0) && (
                        <div className="py-20 text-center border rounded-xl bg-muted/20">
                            <p className="text-muted-foreground">No partner applications found.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
