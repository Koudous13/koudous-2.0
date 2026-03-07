"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditEchecPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const supabase = createClient();
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        period: "",
        context: "",
        lessons_learned: "",
        order_index: 0,
    });

    useEffect(() => {
        const load = async () => {
            const { data, error } = await supabase.from("failures").select("*").eq("id", params.id).single();
            if (error || !data) { alert("Échec introuvable"); router.push("/admin/echecs"); return; }
            setFormData({
                title: data.title || "",
                period: data.period || "",
                context: data.context || "",
                lessons_learned: data.lessons_learned || "",
                order_index: data.order_index || 0,
            });
            setIsLoading(false);
        };
        load();
    }, [params.id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const { error } = await supabase.from("failures").update(formData).eq("id", params.id);
            if (error) throw error;
            router.push("/admin/echecs");
            router.refresh();
        } catch (err: any) {
            alert("Erreur: " + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <div className="flex justify-center h-64 items-center"><Loader2 className="animate-spin text-koudous-secondary" size={40} /></div>;

    return (
        <div className="max-w-3xl">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/echecs" className="p-2 text-koudous-text/50 hover:text-white transition-colors"><ArrowLeft size={20} /></Link>
                <h1 className="text-3xl font-display font-bold text-white">Modifier l'Échec</h1>
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
                    <label className="text-sm font-bold text-white">Le Contexte / Le Fait Brut</label>
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
