"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditEchecForm({ failure }: { failure: any }) {
    const router = useRouter();
    const supabase = createClient();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        title: failure.title || "",
        period: failure.period || "",
        context: failure.context || "",
        lessons_learned: failure.lessons_learned || "",
        order_index: failure.order_index || 0,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const { error } = await supabase.from("failures").update(formData).eq("id", failure.id);
            if (error) throw error;
            router.push("/admin/echecs");
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
                <Link href="/admin/echecs" className="p-2 text-koudous-text/50 hover:text-white transition-colors"><ArrowLeft size={20} /></Link>
                <div>
                    <h1 className="text-3xl font-display font-bold text-white">Modifier l'Échec</h1>
                    <p className="text-koudous-text/60 font-mono text-xs mt-1">ID: {failure.id}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 p-6 rounded-xl space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-white">Titre</label>
                        <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-koudous-secondary" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-white">Période</label>
                        <input type="text" value={formData.period} onChange={(e) => setFormData({ ...formData, period: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-koudous-secondary font-mono" />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-white">Le Contexte (Le Fait Brut)</label>
                    <textarea required value={formData.context} onChange={(e) => setFormData({ ...formData, context: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-koudous-secondary h-28" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-white">La Leçon</label>
                    <textarea required value={formData.lessons_learned} onChange={(e) => setFormData({ ...formData, lessons_learned: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-koudous-secondary h-28 italic" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-white">Ordre</label>
                    <input type="number" value={formData.order_index} onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })} className="w-24 bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none" />
                </div>
                <div className="flex justify-end gap-4 pt-4">
                    <button type="button" onClick={() => router.back()} className="px-6 py-3 border border-white/20 text-white rounded-lg hover:bg-white/5 transition-colors">Annuler</button>
                    <button type="submit" disabled={isSubmitting} className="px-8 py-3 bg-koudous-secondary text-white font-bold rounded-lg hover:bg-white hover:text-black transition-all disabled:opacity-50">
                        {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : "Sauvegarder"}
                    </button>
                </div>
            </form>
        </div>
    );
}
