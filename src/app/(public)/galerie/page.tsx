import { createClient } from "@/utils/supabase/server";
import { Image as ImageIcon } from "lucide-react";

export const revalidate = 60;

export default async function GaleriePage() {
    const supabase = await createClient();

    const { data: galleryItems } = await supabase
        .from("gallery")
        .select("*")
        .order("order_index", { ascending: true });

    // Separate categories if needed, or just display them all in a grid.
    // A CSS columns approach is great for simple masonry.
    return (
        <div className="max-w-6xl mx-auto py-12 px-4 md:px-0">
            <div className="mb-20 text-center">
                <h1 className="text-5xl md:text-8xl font-display font-extrabold text-white mb-6">
                    Galerie<span className="text-koudous-secondary">.</span>
                </h1>
                <p className="text-xl text-koudous-text/70 max-w-2xl mx-auto font-sans">
                    Mosaïque visuelle.
                </p>
            </div>

            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                {galleryItems?.map((item) => (
                    <div key={item.id} className="break-inside-avoid relative group rounded-2xl overflow-hidden bg-black/50 border border-white/5 cursor-zoom-in">
                        <img
                            src={item.image_url}
                            alt={item.title || "Photographie"}
                            className="w-full h-auto object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                            loading="lazy"
                        />
                        {/* Overlay Info */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                            {item.category && (
                                <span className="text-[10px] uppercase tracking-widest font-bold text-koudous-secondary bg-koudous-secondary/10 px-2 py-1 rounded w-fit mb-2">
                                    {item.category}
                                </span>
                            )}
                            {item.title && (
                                <h3 className="text-white font-display font-bold text-lg leading-tight">
                                    {item.title}
                                </h3>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {galleryItems?.length === 0 && (
                <div className="text-center py-20 border border-white/5 rounded-2xl bg-black/20 max-w-3xl mx-auto">
                    <ImageIcon size={48} className="mx-auto text-koudous-text/20 mb-4" />
                    <p className="text-koudous-text/60">La galerie est vide.</p>
                </div>
            )}
        </div>
    );
}
