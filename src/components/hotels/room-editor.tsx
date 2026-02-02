"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Loader2, Save, X, Plus, Image as ImageIcon, Trash2, UploadCloud, ArrowLeft } from "lucide-react"
import { createRoom, updateRoom, deleteRoom } from "@/app/actions/room"
import { LiquidGlass } from "@/components/ui/liquid-glass"
import { cn } from "@/lib/utils"

interface RoomEditorProps {
    room?: any
    hotelId?: string
}

export function RoomEditor({ room, hotelId }: RoomEditorProps) {
    const router = useRouter()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [loading, setLoading] = useState(false)
    const isEditing = !!room

    const initialData = room ? {
        name: room.name,
        description: room.description || "",
        max_guests: room.max_guests || 2,
        bed_configuration: room.bed_configuration || "",
        size_sqm: room.size_sqm || 0,
        amenities: room.amenities || [],
        images: room.images || [],
        main_image: room.main_image || "",
        base_price: room.base_price || 0,
        available_from: room.available_from ? new Date(room.available_from).toISOString().split('T')[0] : "",
        available_until: room.available_until ? new Date(room.available_until).toISOString().split('T')[0] : "",
    } : {
        name: "",
        description: "",
        max_guests: 2,
        bed_configuration: "",
        size_sqm: 0,
        amenities: [],
        images: [],
        main_image: "",
        base_price: 0,
        available_from: "",
        available_until: "",
    }

    const [formData, setFormData] = useState(initialData)
    const [amenityInput, setAmenityInput] = useState("")
    const [imageInput, setImageInput] = useState("")
    const [mainImageInput, setMainImageInput] = useState("")

    const isDirty = isEditing && (
        formData.name !== (room.name || "") ||
        formData.description !== (room.description || "") ||
        formData.max_guests !== (room.max_guests || 2) ||
        formData.bed_configuration !== (room.bed_configuration || "") ||
        formData.size_sqm !== (room.size_sqm || 0) ||
        formData.base_price !== (room.base_price || 0) ||
        formData.available_from !== (room.available_from ? new Date(room.available_from).toISOString().split('T')[0] : "") ||
        formData.available_until !== (room.available_until ? new Date(room.available_until).toISOString().split('T')[0] : "") ||
        JSON.stringify(formData.amenities) !== JSON.stringify(room.amenities || []) ||
        JSON.stringify(formData.images) !== JSON.stringify(room.images || []) ||
        formData.main_image !== (room.main_image || "")
    )

    const canSubmit = !loading && (!isEditing || isDirty) && formData.name.length > 0;

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleSave = async () => {
        if (!hotelId && !room.hotel_id) return
        setLoading(true)
        try {
            if (isEditing) {
                await updateRoom(room.id, formData)
            } else {
                await createRoom({ ...formData, hotel_id: hotelId! })
                router.push('/partner/dashboard/rooms')
            }
            router.refresh()
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this room?")) return
        setLoading(true)
        try {
            await deleteRoom(room.id)
            router.push('/partner/dashboard/rooms')
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
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="flex items-center gap-6 border-b border-black/5 pb-8">
                <div className="flex items-center gap-6">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push('/partner/dashboard/rooms')}
                        className="rounded-full h-12 w-12 hover:bg-black/10 border border-black/5 transition-all active:scale-90 bg-white/50 backdrop-blur-sm shadow-sm text-black"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{isEditing ? "Edit Room" : "Add New Room"}</h1>
                        <p className="text-muted-foreground/80 font-medium">{isEditing ? room.name : "Create a new room type"}</p>
                    </div>
                </div>
                {isEditing && (
                    <div className="ml-auto">
                        <Button variant="ghost" size="icon" onClick={handleDelete} disabled={loading} className="text-destructive hover:bg-destructive/10 rounded-full h-10 w-10">
                            <Trash2 className="w-5 h-5" />
                        </Button>
                    </div>
                )}
            </div>

            <div className="grid gap-8">
                <div className="card-section p-6 space-y-6">
                    <h3 className="section-title text-lg border-b border-border pb-2">Room Details</h3>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Room Name</label>
                            <Input value={formData.name} onChange={(e) => handleChange("name", e.target.value)} placeholder="e.g. Deluxe Suite" />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Description</label>
                            <Textarea
                                value={formData.description}
                                onChange={(e) => handleChange("description", e.target.value)}
                                placeholder="Describe the room..."
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Base Price ($)</label>
                                <Input type="number" min="0" value={formData.base_price} onChange={(e) => handleChange("base_price", parseFloat(e.target.value))} />
                            </div>
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Max Guests</label>
                                <Input type="number" min="1" value={formData.max_guests} onChange={(e) => handleChange("max_guests", parseInt(e.target.value))} />
                            </div>
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Bed Config</label>
                                <Input value={formData.bed_configuration} onChange={(e) => handleChange("bed_configuration", e.target.value)} placeholder="e.g. 1 King Bed" />
                            </div>
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Size (sqm)</label>
                                <Input type="number" min="0" value={formData.size_sqm} onChange={(e) => handleChange("size_sqm", parseFloat(e.target.value))} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card-section p-6 space-y-6">
                    <h3 className="section-title text-lg border-b border-border pb-2">Availability Range</h3>
                    <p className="text-sm text-muted-foreground">Define when this room is available for booking. Leave empty if always available.</p>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Available From</label>
                            <Input
                                type="date"
                                value={formData.available_from}
                                onChange={(e) => handleChange("available_from", e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Available Until</label>
                            <Input
                                type="date"
                                value={formData.available_until}
                                onChange={(e) => handleChange("available_until", e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="card-section p-6 space-y-6">
                    <h3 className="section-title text-lg border-b border-border pb-2">Amenities</h3>
                    <div className="flex gap-2">
                        <Input
                            value={amenityInput}
                            onChange={(e) => setAmenityInput(e.target.value)}
                            placeholder="Add amenity (e.g. Mini Bar, Ocean View)..."
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
                </div>

                <div className="card-section p-6 space-y-6">
                    <h3 className="section-title text-lg border-b border-border pb-2">Main Image</h3>
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
                            id="room-main-image-upload"
                            accept="image/*"
                        />
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full border-dashed border-2 py-8 h-auto flex-col gap-2"
                            onClick={() => document.getElementById('room-main-image-upload')?.click()}
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
                </div>

                <div className="card-section p-6 space-y-6">
                    <h3 className="section-title text-lg border-b border-border pb-2">Gallery Images</h3>
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
                </div>
            </div>

            {/* Bottom Actions - Styled exactly like Hotel Publish */}
            <div className="sticky bottom-8 z-50 flex justify-center mt-12 px-4 pointer-events-none">
                <button
                    disabled={!canSubmit}
                    onClick={() => { if (canSubmit) handleSave() }}
                    className="pointer-events-auto group"
                >
                    <LiquidGlass
                        animate={!loading && canSubmit}
                        className={cn(
                            "flex h-16 items-center gap-4 px-12 rounded-full shadow-2xl transition-all duration-300",
                            "border-white/60 bg-white/20 backdrop-blur-md",
                            canSubmit ? "hover:bg-white/30 cursor-pointer" : "opacity-50 cursor-not-allowed grayscale-[0.5]"
                        )}
                    >
                        <div className="flex items-center justify-center gap-3 text-primary font-bold tracking-wide min-w-[160px]">
                            {loading ? (
                                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                            ) : (
                                <>
                                    {isEditing ? <Save className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                    <span className="text-lg">
                                        {isEditing ? "Save Changes" : "Create Room"}
                                    </span>
                                </>
                            )}
                        </div>
                    </LiquidGlass>
                </button>
            </div>
        </div>
    )
}
