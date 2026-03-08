"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { X, ChevronLeft, ChevronRight, ZoomIn, Image as ImgIcon } from "lucide-react";

interface GalleryItem {
    id: string;
    image_url: string;
    title: string | null;
    category: string | null;
    order_index: number;
}

export default function GaleriePage() {
    const [items, setItems] = useState<GalleryItem[]>([]);
    const [filtered, setFiltered] = useState<GalleryItem[]>([]);
    const [activeCategory, setActiveCategory] = useState("Tous");
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        supabase
            .from("gallery")
            .select("*")
            .order("created_at", { ascending: false })

            .then(({ data }) => {
                setItems(data || []);
                setFiltered(data || []);
                setLoading(false);
            });

        // Keyboard navigation for lightbox
        const handleKey = (e: KeyboardEvent) => {
            if (lightboxIndex === null) return;
            if (e.key === "Escape") setLightboxIndex(null);
            if (e.key === "ArrowRight") setLightboxIndex(prev => prev !== null ? Math.min(prev + 1, filtered.length - 1) : null);
            if (e.key === "ArrowLeft") setLightboxIndex(prev => prev !== null ? Math.max(prev - 1, 0) : null);
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [lightboxIndex, filtered.length]);

    // Derive unique categories
    const categories = ["Tous", ...Array.from(new Set(items.map(i => i.category).filter(Boolean))) as string[]];

    const filterByCategory = (cat: string) => {
        setActiveCategory(cat);
        setLightboxIndex(null);
        setFiltered(cat === "Tous" ? items : items.filter(i => i.category === cat));
    };

    const lightboxItem = lightboxIndex !== null ? filtered[lightboxIndex] : null;

    return (
        <div className="max-w-6xl mx-auto py-12 px-4 md:px-0">
            {/* Header */}
            <div className="mb-20 text-center">
                <h1 className="text-5xl md:text-8xl font-display font-extrabold text-white mb-6">
                    Galerie<span className="text-koudous-secondary">.</span>
                </h1>
                <p className="text-xl text-koudous-text/70 max-w-2xl mx-auto font-sans">
                    Mosaïque visuelle — instants capturés, chantiers ouverts.
                </p>
            </div>

            {/* Category filters */}
            {categories.length > 1 && (
                <div className="flex flex-wrap gap-2 mb-10 justify-center">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => filterByCategory(cat)}
                            className={`px-4 py-2 rounded-full font-mono text-xs uppercase tracking-widest transition-all border ${activeCategory === cat
                                ? "bg-koudous-primary text-black border-koudous-primary font-bold"
                                : "border-white/20 text-koudous-text/60 hover:border-white/40 hover:text-white"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            )}

            {/* Masonry grid */}
            {loading ? (
                <div className="flex justify-center py-24">
                    <div className="w-8 h-8 border-2 border-koudous-primary border-t-transparent rounded-full animate-spin" />
                </div>
            ) : filtered.length > 0 ? (
                <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
                    {filtered.map((item, index) => (
                        <div
                            key={item.id}
                            className="break-inside-avoid relative group rounded-2xl overflow-hidden bg-black/50 border border-white/5 cursor-zoom-in"
                            onClick={() => setLightboxIndex(index)}
                        >
                            <img
                                src={item.image_url}
                                alt={item.title || "Photo"}
                                className="w-full h-auto object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                                loading="lazy"
                            />
                            {/* Hover overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between items-end p-4">
                                <ZoomIn size={18} className="text-white/70" />
                                <div className="w-full">
                                    {item.category && (
                                        <span className="text-[10px] uppercase tracking-widest font-bold text-koudous-secondary bg-koudous-secondary/10 px-2 py-0.5 rounded mb-1 inline-block">
                                            {item.category}
                                        </span>
                                    )}
                                    {item.title && (
                                        <h3 className="text-white font-display font-bold text-base leading-tight">{item.title}</h3>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 border border-white/5 rounded-2xl bg-black/20">
                    <ImgIcon size={48} className="mx-auto text-koudous-text/20 mb-4" />
                    <p className="text-koudous-text/60">La galerie est vide.</p>
                </div>
            )}

            {/* Lightbox */}
            {lightboxItem && (
                <div
                    className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
                    onClick={() => setLightboxIndex(null)}
                >
                    {/* Close */}
                    <button
                        onClick={() => setLightboxIndex(null)}
                        className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
                    >
                        <X size={24} className="text-white" />
                    </button>

                    {/* Prev */}
                    {lightboxIndex! > 0 && (
                        <button
                            onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex! - 1); }}
                            className="absolute left-4 md:left-8 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
                        >
                            <ChevronLeft size={28} className="text-white" />
                        </button>
                    )}

                    {/* Image */}
                    <div
                        className="max-w-5xl max-h-[90vh] mx-16 flex flex-col items-center gap-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={lightboxItem.image_url}
                            alt={lightboxItem.title || "Photo"}
                            className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl"
                        />
                        <div className="text-center">
                            {lightboxItem.category && (
                                <span className="text-xs font-mono uppercase tracking-widest text-koudous-secondary mr-3">{lightboxItem.category}</span>
                            )}
                            {lightboxItem.title && (
                                <span className="text-white font-bold">{lightboxItem.title}</span>
                            )}
                            <p className="text-koudous-text/40 text-xs mt-1 font-mono">
                                {lightboxIndex! + 1} / {filtered.length} — ← → pour naviguer
                            </p>
                        </div>
                    </div>

                    {/* Next */}
                    {lightboxIndex! < filtered.length - 1 && (
                        <button
                            onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex! + 1); }}
                            className="absolute right-4 md:right-8 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
                        >
                            <ChevronRight size={28} className="text-white" />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
