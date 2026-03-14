"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { Loader2, ArrowLeft, Eye, PenTool, AlertTriangle, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function EditEchecForm({ failure }: { failure: any }) {
    const router = useRouter();
    const supabase = createClient();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

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
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/admin/echecs" className="p-2 text-koudous-text/50 hover:text-white transition-colors"><ArrowLeft size={20} /></Link>
                    <div>
                        <h1 className="text-3xl font-display font-bold text-white">Modifier l'Échec</h1>
                        <p className="text-koudous-text/60 font-mono text-xs mt-1">ID: {failure.id}</p>
                    </div>
                </div>
                <div className="flex bg-white/5 border border-white/10 rounded-lg p-1">
                    <button 
                        type="button"
                        onClick={() => setShowPreview(false)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${!showPreview ? "bg-koudous-secondary text-white" : "text-koudous-text/60 hover:text-white"}`}
                    >
                        <PenTool size={16} /> Édition
                    </button>
                    <button 
                        type="button"
                        onClick={() => setShowPreview(true)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${showPreview ? "bg-koudous-secondary text-white" : "text-koudous-text/60 hover:text-white"}`}
                    >
                        <Eye size={16} /> Aperçu
                    </button>
                </div>
            </div>

            {!showPreview ? (
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
                    <RichTextEditor
                        content={formData.context}
                        onChange={(html) => setFormData({ ...formData, context: html })}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-white">La Leçon</label>
                    <RichTextEditor
                        content={formData.lessons_learned}
                        onChange={(html) => setFormData({ ...formData, lessons_learned: html })}
                    />
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
            ) : (
                <div className="bg-[#0a0a0a] border border-red-500/20 p-8 md:p-12 rounded-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-[100px] rounded-full pointer-events-none"></div>
                    <div className="flex items-start gap-6">
                        <div className="hidden sm:flex shrink-0 w-16 h-16 rounded-full border border-red-500/30 bg-red-500/10 items-center justify-center">
                            <AlertTriangle className="text-red-500/80" size={32} />
                        </div>
                        <div className="flex-1">
                            <div className="flex flex-wrap items-center justify-between gap-4 mb-4 border-b border-white/5 pb-4">
                                <h2 className="text-2xl md:text-3xl font-display font-bold text-white uppercase tracking-tight">
                                    {formData.title || "Titre de l'échec"}
                                </h2>
                                <time className="font-mono text-sm text-koudous-text/40">
                                    {formData.period}
                                </time>
                            </div>

                            <div className="mb-8">
                                <h3 className="font-mono tracking-widest uppercase text-xs text-koudous-text/40 mb-2">Le Contexte / Le Crash</h3>
                                <div
                                    className="text-koudous-text/80 leading-relaxed bg-black/50 p-6 rounded-xl border border-white/5 prose prose-invert prose-sm max-w-none"
                                    dangerouslySetInnerHTML={{ __html: formData.context || "<p class='italic opacity-40'>Analyse du crash...</p>" }}
                                />
                            </div>

                            <div>
                                <h3 className="font-mono tracking-widest uppercase text-xs text-red-500/60 mb-2 flex items-center gap-2">
                                    <TrendingUp size={14} /> La Leçon Tirée
                                </h3>
                                <div className="prose prose-invert prose-p:text-white/90 prose-p:leading-relaxed border-l-2 border-red-500/50 pl-6 py-2">
                                    <div dangerouslySetInnerHTML={{ __html: formData.lessons_learned || "<p class='italic opacity-40'>Leçon à graver...</p>" }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
