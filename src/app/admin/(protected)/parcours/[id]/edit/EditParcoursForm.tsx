"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import ImageUploader from "@/components/admin/ImageUploader";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditParcoursForm({ step }: { step: any }) {
    const router = useRouter();
    const supabase = createClient();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        title: step.title || "",
        period: step.period || "",
        description: step.description || "",
        location: step.location || "",
        category: step.category || "Professionnel",
        image_url: step.image_url || "",
        order_index: step.order_index || 0,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const { error } = await supabase.from("timeline_steps").update(formData).eq("id", step.id);
            if (error) throw error;
            router.push("/admin/parcours");
            router.refresh();
        } catch (err: any) {
            alert("Erreur: " + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/parcours" className="p-2 text-koudous-text/50 hover:text-white transition-colors"><ArrowLeft size={20} /></Link>
                <div>
                    <h1 className="text-3xl font-display font-bold text-white">Modifier l'Étape</h1>
                    <p className="text-koudous-text/60 font-mono text-xs mt-1">ID: {step.id}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white/5 border border-white/10 p-6 rounded-xl space-y-4">
                    <h3 className="font-bold border-b border-white/10 pb-2">Image / Logo</h3>
                    <ImageUploader onUpload={(url) => setFormData({ ...formData, image_url: url })} currentUrl={formData.image_url} folder="parcours" />
                </div>

                <div className="bg-white/5 border border-white/10 p-6 rounded-xl space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-white">Titre du Rôle</label>
                            <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-koudous-primary" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-white">Période</label>
                            <input type="text" required value={formData.period} onChange={(e) => setFormData({ ...formData, period: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-koudous-primary font-mono" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-white">Lieu / Entreprise</label>
                            <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-koudous-primary" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-white">Catégorie</label>
                            <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-koudous-primary">
                                <option value="Professionnel">Professionnel</option>
                                <option value="Académique">Académique</option>
                                <option value="Personnel">Personnel / Hobby</option>
                            </select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-white">Description</label>
                        <RichTextEditor
                            content={formData.description}
                            onChange={(html) => setFormData({ ...formData, description: html })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-white">Ordre</label>
                        <input type="number" value={formData.order_index} onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })} className="w-24 bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none" />
                    </div>
                </div>

                <div className="flex justify-end gap-4 pb-12">
                    <button type="button" onClick={() => router.back()} className="px-6 py-3 border border-white/20 text-white rounded-lg hover:bg-white/5 transition-colors">Annuler</button>
                    <button type="submit" disabled={isSubmitting} className="px-8 py-3 bg-koudous-primary text-black font-bold rounded-lg hover:shadow-[0_0_20px_var(--color-koudous-primary)] transition-all disabled:opacity-50">
                        {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : "Sauvegarder"}
                    </button>
                </div>
            </form>
        </div>
    );
}
