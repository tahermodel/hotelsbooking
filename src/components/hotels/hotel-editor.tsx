"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Loader2, Save, Globe, X, Plus, Image as ImageIcon, Star, UploadCloud } from "lucide-react"
import { updateHotel, toggleHotelStatus } from "@/app/actions/hotel"
import { cn } from "@/lib/utils"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface HotelEditorProps {
    hotel: any
}

export function HotelEditor({ hotel }: HotelEditorProps) {
    const router = useRouter()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [loading, setLoading] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [formData, setFormData] = useState({
        name: hotel.name,
        description: hotel.description || "",
        address: hotel.address || "",
        city: hotel.city || "",
        country: hotel.country || "",
        star_rating: hotel.star_rating || 5,
        amenities: hotel.amenities || [],
        images: hotel.images || [],
        main_image: hotel.main_image || "",
        contact_email: hotel.contact_email || "",
        contact_phone: hotel.contact_phone || "",
    })
    const [amenityInput, setAmenityInput] = useState("")
    const [imageInput, setImageInput] = useState("")
    const [mainImageInput, setMainImageInput] = useState("")

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleSave = async () => {
        setLoading(true)
        try {
            await updateHotel(hotel.id, formData)
            router.refresh()
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
            setShowConfirm(false)
            router.refresh()
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files) return

        Array.from(files).forEach(file => {
            const reader = new FileReader()
            reader.onloadend = () => {
                const base64String = reader.result as string
                setFormData(prev => ({ ...prev, images: [...prev.images, base64String] }))
            }
            reader.readAsDataURL(file)
        })
    }

    const handleMainImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onloadend = () => {
            const base64String = reader.result as string
            handleChange("main_image", base64String)
        }
        reader.readAsDataURL(file)
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-6">
                <div>
                    <h1 className="text-3xl font-bold">Edit Property</h1>
                    <p className="text-muted-foreground">{hotel.name}</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg uppercase tracking-wider text-primary font-bold">Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
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

                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Star Rating</label>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => handleChange("star_rating", star)}
                                        className="transition-transform active:scale-95"
                                    >
                                        <Star
                                            className={cn(
                                                "w-8 h-8",
                                                star <= formData.star_rating
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : "text-muted border-muted"
                                            )}
                                        />
                                    </button>
                                ))}
                                <span className="ml-2 py-1 text-sm font-medium text-muted-foreground">
                                    {formData.star_rating} / 5 stars
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg uppercase tracking-wider text-primary font-bold">Location</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
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
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg uppercase tracking-wider text-primary font-bold">Contact info</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Contact Email</label>
                                <Input value={formData.contact_email} onChange={(e) => handleChange("contact_email", e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Contact Phone</label>
                                <Input value={formData.contact_phone} onChange={(e) => handleChange("contact_phone", e.target.value)} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg uppercase tracking-wider text-primary font-bold">Amenities</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
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
                                <Badge key={idx} variant="secondary" className="px-3 py-1.5 text-sm bg-secondary text-secondary-foreground border border-border/50">
                                    {item}
                                    <button onClick={() => handleChange("amenities", formData.amenities.filter((_: any, i: number) => i !== idx))} className="ml-2 hover:text-destructive transition-colors">
                                        <X className="w-3 h-3" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg uppercase tracking-wider text-primary font-bold">Main Image (Card Display)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex flex-col gap-4">
                            <div className="flex gap-2">
                                <Input
                                    value={mainImageInput}
                                    onChange={(e) => setMainImageInput(e.target.value)}
                                    placeholder="Paste Main Image URL..."
                                    className="flex-1"
                                />
                                <Button type="button" onClick={() => {
                                    if (mainImageInput) {
                                        handleChange("main_image", mainImageInput);
                                        setMainImageInput("");
                                    }
                                }}><Plus className="w-4 h-4 mr-2" /> Set URL</Button>
                            </div>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-border" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-card px-2 text-muted-foreground">Or upload main image</span>
                                </div>
                            </div>

                            <input
                                type="file"
                                onChange={handleMainImageUpload}
                                className="hidden"
                                id="main-image-upload"
                                accept="image/*"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full border-dashed border-2 py-8 h-auto flex-col gap-2"
                                onClick={() => document.getElementById('main-image-upload')?.click()}
                            >
                                <UploadCloud className="w-8 h-8 text-muted-foreground" />
                                <span>Click to upload main image</span>
                            </Button>

                            {formData.main_image && (
                                <div className="relative aspect-video rounded-lg overflow-hidden border border-border mt-4 group">
                                    <Image src={formData.main_image} alt="Main" fill className="object-cover" />
                                    <button
                                        onClick={() => handleChange("main_image", "")}
                                        className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-destructive"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg uppercase tracking-wider text-primary font-bold">Gallery Images (Hotel Page)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex flex-col gap-4">
                            <div className="flex gap-2">
                                <Input
                                    value={imageInput}
                                    onChange={(e) => setImageInput(e.target.value)}
                                    placeholder="Paste Image URL..."
                                    className="flex-1"
                                />
                                <Button type="button" onClick={() => {
                                    if (imageInput) {
                                        handleChange("images", [...formData.images, imageInput]);
                                        setImageInput("");
                                    }
                                }}><Plus className="w-4 h-4 mr-2" /> Add to Gallery</Button>
                            </div>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-border" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-card px-2 text-muted-foreground">Or upload to gallery</span>
                                </div>
                            </div>

                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                className="hidden"
                                accept="image/*"
                                multiple
                            />
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full border-dashed border-2 py-8 h-auto flex-col gap-2"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <UploadCloud className="w-8 h-8 text-muted-foreground" />
                                <span>Click to upload gallery images</span>
                            </Button>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
                            {formData.images.map((img: string, idx: number) => (
                                <div key={idx} className="relative aspect-video rounded-lg overflow-hidden group border border-border shadow-sm">
                                    <Image src={img} alt="Gallery" fill className="object-cover transition-transform group-hover:scale-105" />
                                    <button
                                        onClick={() => handleChange("images", formData.images.filter((_: any, i: number) => i !== idx))}
                                        className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-destructive"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Bottom Actions */}
            <div className="flex justify-end gap-3 pt-8 border-t border-border mt-12 bg-background-alt sticky bottom-0 py-6 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 z-10 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
                <Button variant="outline" size="lg" onClick={handleSave} disabled={loading}>
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Save Changes
                </Button>
                {!showConfirm ? (
                    <Button
                        size="lg"
                        variant={hotel.is_active ? "destructive" : "default"}
                        onClick={() => setShowConfirm(true)}
                        disabled={loading}
                    >
                        <Globe className="w-4 h-4 mr-2" />
                        {hotel.is_active ? "Unpublish" : "Publish Now"}
                    </Button>
                ) : (
                    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2">
                        <span className="text-sm font-medium text-muted-foreground mr-2">Are you sure?</span>
                        <Button size="lg" variant="ghost" onClick={() => setShowConfirm(false)}>Cancel</Button>
                        <Button
                            size="lg"
                            variant={hotel.is_active ? "destructive" : "default"}
                            onClick={handlePublishToggle}
                            disabled={loading}
                        >
                            Confirm
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
