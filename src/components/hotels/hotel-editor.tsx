"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Loader2, Save, Globe, X, Plus, Image as ImageIcon } from "lucide-react"
import { updateHotel, toggleHotelStatus } from "@/app/actions/hotel"

interface HotelEditorProps {
    hotel: any
}

export function HotelEditor({ hotel }: HotelEditorProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: hotel.name,
        description: hotel.description || "",
        address: hotel.address || "",
        city: hotel.city || "",
        country: hotel.country || "",
        star_rating: hotel.star_rating || 5,
        amenities: hotel.amenities || [],
        images: hotel.images || [],
        contact_email: hotel.contact_email || "",
        contact_phone: hotel.contact_phone || "",
        check_in_time: hotel.check_in_time || "14:00",
        check_out_time: hotel.check_out_time || "11:00",
    })
    const [amenityInput, setAmenityInput] = useState("")
    const [imageInput, setImageInput] = useState("")

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleSave = async () => {
        setLoading(true)
        try {
            await updateHotel(hotel.id, formData)
            // Show toast success (mocking)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handlePublishToggle = async () => {
        setLoading(true)
        try {
            await toggleHotelStatus(hotel.id, !hotel.is_active)
            router.refresh()
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-6">
                <div>
                    <h1 className="text-3xl font-bold">Edit Property</h1>
                    <p className="text-muted-foreground">{hotel.name}</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={handleSave} disabled={loading}>
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                        Save Changes
                    </Button>
                    <Button
                        variant={hotel.is_active ? "destructive" : "default"}
                        onClick={handlePublishToggle}
                        disabled={loading}
                    >
                        <Globe className="w-4 h-4 mr-2" />
                        {hotel.is_active ? "Unpublish" : "Publish Now"}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="card-section p-6 space-y-6">
                        <h3 className="section-title text-lg border-b border-border pb-2">Basic Information</h3>

                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Hotel Name</label>
                            <Input value={formData.name} onChange={(e) => handleChange("name", e.target.value)} />
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Description</label>
                            <Textarea
                                className="min-h-[150px]"
                                value={formData.description}
                                onChange={(e) => handleChange("description", e.target.value)}
                                placeholder="Tell us about your property..."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Star Rating</label>
                                <Input
                                    type="number" min="1" max="5"
                                    value={formData.star_rating}
                                    onChange={(e) => handleChange("star_rating", parseFloat(e.target.value))}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="card-section p-6 space-y-6">
                        <h3 className="section-title text-lg border-b border-border pb-2">Location</h3>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Address</label>
                                <Input value={formData.address} onChange={(e) => handleChange("address", e.target.value)} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">City</label>
                                    <Input value={formData.city} onChange={(e) => handleChange("city", e.target.value)} />
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">Country</label>
                                    <Input value={formData.country} onChange={(e) => handleChange("country", e.target.value)} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card-section p-6 space-y-6">
                        <h3 className="section-title text-lg border-b border-border pb-2">Amenities</h3>
                        <div className="flex gap-2">
                            <Input
                                value={amenityInput}
                                onChange={(e) => setAmenityInput(e.target.value)}
                                placeholder="Add amenity (e.g. WiFi, Pool)..."
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        if (amenityInput) {
                                            handleChange("amenities", [...formData.amenities, amenityInput]);
                                            setAmenityInput("");
                                        }
                                    }
                                }}
                            />
                            <Button type="button" onClick={() => {
                                if (amenityInput) {
                                    handleChange("amenities", [...formData.amenities, amenityInput]);
                                    setAmenityInput("");
                                }
                            }}><Plus className="w-4 h-4" /></Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.amenities.map((item: string, idx: number) => (
                                <Badge key={idx} variant="secondary" className="px-3 py-1 text-sm bg-secondary/20">
                                    {item}
                                    <button onClick={() => handleChange("amenities", formData.amenities.filter((_: any, i: number) => i !== idx))} className="ml-2 hover:text-destructive">
                                        <X className="w-3 h-3" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <div className="card-section p-6 space-y-6">
                        <h3 className="section-title text-lg border-b border-border pb-2">Images</h3>
                        <div className="flex gap-2">
                            <Input
                                value={imageInput}
                                onChange={(e) => setImageInput(e.target.value)}
                                placeholder="Image URL..."
                            />
                            <Button type="button" onClick={() => {
                                if (imageInput) {
                                    handleChange("images", [...formData.images, imageInput]);
                                    setImageInput("");
                                }
                            }}><ImageIcon className="w-4 h-4" /></Button>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {formData.images.map((img: string, idx: number) => (
                                <div key={idx} className="relative aspect-video rounded-lg overflow-hidden group border border-border">
                                    <img src={img} alt="Hotel" className="object-cover w-full h-full" />
                                    <button
                                        onClick={() => handleChange("images", formData.images.filter((_: any, i: number) => i !== idx))}
                                        className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="card-section p-6 space-y-6 sticky top-24">
                        <h3 className="section-title text-lg border-b border-border pb-2">Policies</h3>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Contact Email</label>
                                <Input value={formData.contact_email} onChange={(e) => handleChange("contact_email", e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Contact Phone</label>
                                <Input value={formData.contact_phone} onChange={(e) => handleChange("contact_phone", e.target.value)} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">Check-in</label>
                                    <Input value={formData.check_in_time} onChange={(e) => handleChange("check_in_time", e.target.value)} />
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">Check-out</label>
                                    <Input value={formData.check_out_time} onChange={(e) => handleChange("check_out_time", e.target.value)} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
