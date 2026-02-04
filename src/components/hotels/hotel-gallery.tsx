"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HotelGalleryProps {
    images: string[]
    hotelName: string
}

export function HotelGallery({ images, hotelName }: HotelGalleryProps) {
    const [selectedImage, setSelectedImage] = useState<number | null>(null)

    const openLightbox = (index: number) => setSelectedImage(index)
    const closeLightbox = () => setSelectedImage(null)

    const nextImage = (e?: React.MouseEvent) => {
        e?.stopPropagation()
        if (selectedImage !== null) {
            setSelectedImage((selectedImage + 1) % images.length)
        }
    }

    const prevImage = (e?: React.MouseEvent) => {
        e?.stopPropagation()
        if (selectedImage !== null) {
            setSelectedImage((selectedImage - 1 + images.length) % images.length)
        }
    }

    return (
        <div className="relative pt-24 pb-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[600px]">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="md:col-span-2 relative rounded-3xl overflow-hidden group border border-white/10 cursor-pointer"
                        onClick={() => openLightbox(0)}
                    >
                        <Image
                            src={images[0] || "/placeholder.jpg"}
                            alt={hotelName}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-1000"
                            priority
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500" />
                        <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-2xl">
                                <Maximize2 className="w-5 h-5" />
                            </div>
                        </div>
                    </motion.div>

                    <div className="hidden md:grid grid-cols-1 gap-4 h-full">
                        {images.slice(1, 3).map((img, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.1 * (i + 1), ease: [0.22, 1, 0.36, 1] }}
                                className="relative h-full rounded-2xl overflow-hidden group border border-white/10 cursor-pointer"
                                onClick={() => openLightbox(i + 1)}
                            >
                                <Image
                                    src={img}
                                    alt={`${hotelName} ${i + 1}`}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-1000"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500" />
                            </motion.div>
                        ))}
                    </div>

                    <div className="hidden md:grid grid-cols-1 gap-4 h-full">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            className="relative h-full rounded-2xl overflow-hidden group border border-white/10 cursor-pointer"
                            onClick={() => openLightbox(3)}
                        >
                            <Image
                                src={images[3] || images[0]}
                                alt="Gallery Preview"
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-1000"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500" />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            className="relative h-full rounded-2xl overflow-hidden group border border-white/10 bg-white/5 flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors"
                            onClick={() => openLightbox(0)}
                        >
                            <div className="text-center p-4">
                                <p className="text-3xl font-black">{images.length}</p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/40">View All Images</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {selectedImage !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center"
                        onClick={closeLightbox}
                    >
                        <div className="absolute top-8 right-8 z-[110] flex gap-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/10 h-12 w-12"
                                onClick={closeLightbox}
                            >
                                <X className="w-6 h-6" />
                            </Button>
                        </div>

                        <div className="absolute top-1/2 left-8 -translate-y-1/2 z-[110]">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/10 h-16 w-16"
                                onClick={prevImage}
                            >
                                <ChevronLeft className="w-8 h-8" />
                            </Button>
                        </div>

                        <div className="absolute top-1/2 right-8 -translate-y-1/2 z-[110]">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/10 h-16 w-16"
                                onClick={nextImage}
                            >
                                <ChevronRight className="w-8 h-8" />
                            </Button>
                        </div>

                        <div className="relative w-full h-full max-w-6xl max-h-[80vh] mx-4" onClick={(e) => e.stopPropagation()}>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={selectedImage}
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, y: -20 }}
                                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                    className="relative w-full h-full rounded-4xl overflow-hidden shadow-2xl border border-white/10"
                                >
                                    <Image
                                        src={images[selectedImage]}
                                        alt={`${hotelName} - ${selectedImage + 1}`}
                                        fill
                                        className="object-contain"
                                        quality={100}
                                        priority
                                    />

                                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 px-6 py-3 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 text-white/60 font-medium tracking-tight">
                                        <span className="text-white font-bold">{selectedImage + 1}</span>
                                        <div className="w-1 h-1 rounded-full bg-white/20" />
                                        <span>{images.length} Images</span>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
