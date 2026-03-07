"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import RichTextEditor from "@/components/admin/RichTextEditor";

export default function NewFailurePage() {
    const router = useRouter();
    const supabase = createClient();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        period: "2024",
        context: "",
        lessons_learned: "",
        order_index: 0,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const { error } = await supabase.from("failures").insert([formData]);
            if (error) throw error;

            router.push("/admin/echecs");
            router.refresh();
        } catch (error: any) {
            alert("Erreur: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl">
            <div className="mb-8">
                <h1 className="text-3xl font-display font-bold text-white">Documenter un Échec</h1>
                <p className="text-koudous-text/60">Une analyse à froid d'une erreur système passée.</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 p-6 rounded-xl space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-white">Donnez un titre court à cet échec</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-koudous-secondary"
                            placeholder="Ex: Crash production API v1"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-white">Date / Période</label>
                        <input
                            type="text"
                            required
                            value={formData.period}
                            onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-koudous-secondary font-mono"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-white">Le Fait (Brut, sans émotion)</label>
                    <RichTextEditor
                        content={formData.context}
                        onChange={(html) => setFormData({ ...formData, context: html })}
                        placeholder="Que s'est-il passé de manière factuelle ?"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-white">La Leçon (La conclusion pour l'algorithme)</label>
                    <RichTextEditor
                        content={formData.lessons_learned}
                        onChange={(html) => setFormData({ ...formData, lessons_learned: html })}
                        placeholder="Qu'est ce que vous avez configuré pour que ça n'arrive plus ?"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-white">Ordre (L'index du plus petit au plus grand)</label>
                    <input
                        type="number"
                        value={formData.order_index}
                        onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
                        className="w-fit bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-koudous-secondary font-mono"
                    />
                </div>

                <div className="pt-6 flex justify-end gap-4">
                    <button type="button" onClick={() => router.back()} className="px-6 py-3 border border-white/20 text-white rounded-lg hover:bg-white/5 transition-colors">
                        Annuler
                    </button>
                    <button type="submit" disabled={isSubmitting} className="px-8 py-3 bg-koudous-secondary text-white font-bold rounded-lg hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-50">
                        {isSubmitting ? "Ajout..." : "Graver dans le marbre"}
                    </button>
                </div>
            </form>
        </div>
    );
}
