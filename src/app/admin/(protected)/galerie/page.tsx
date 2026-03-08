import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Plus, ImageIcon } from "lucide-react";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function AdminGaleriePage() {
    const supabase = await createClient();

    const { data: items } = await supabase
        .from("gallery")
        .select("*")
        .order("created_at", { ascending: false });

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white">Galerie</h1>
                    <p className="text-koudous-text/60 mt-1">{items?.length || 0} photos</p>
                </div>
                <Link
                    href="/admin/galerie/new"
                    className="flex items-center gap-2 px-5 py-2.5 bg-koudous-primary text-black font-bold rounded-lg hover:shadow-[0_0_20px_var(--color-koudous-primary)] transition-all"
                >
                    <Plus size={18} />
                    Ajouter des photos
                </Link>
            </div>

            {items && items.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
                    {items.map((item) => (
                        <div key={item.id} className="group relative aspect-square rounded-xl overflow-hidden bg-white/5 border border-white/10">
                            <img
                                src={item.image_url}
                                alt={item.title || "Photo"}
                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                            />
                            {/* Overlay on hover */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-3">
                                <div className="flex justify-end">
                                    <DeleteButton table="gallery" id={item.id} redirectTo="/admin/galerie" />
                                </div>
                                <div>
                                    {item.category && (
                                        <span className="block text-[10px] font-mono uppercase tracking-widest text-koudous-secondary mb-1">{item.category}</span>
                                    )}
                                    {item.title && (
                                        <p className="text-white text-xs font-bold truncate">{item.title}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-24 border border-white/5 rounded-2xl bg-black/20">
                    <ImageIcon size={48} className="mx-auto text-koudous-text/20 mb-4" />
                    <p className="text-koudous-text/60">La galerie est vide. Ajoutez vos premières photos.</p>
                </div>
            )}
        </div>
    );
}
