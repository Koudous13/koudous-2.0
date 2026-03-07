"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function NewJournalEntryPage() {
    const router = useRouter();
    const supabase = createClient();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        content: "",
        mood_tag: "#VibeCoding",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const { error } = await supabase.from("journal_entries").insert([formData]);
            if (error) throw error;

            router.push("/admin/journees");
            router.refresh();
        } catch (error: any) {
            alert("Erreur: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl">
            <div className="mb-8">
                <h1 className="text-3xl font-display font-bold text-white">Log Système (Nouvelle Pensée)</h1>
                <p className="text-koudous-text/60">Micro-blogging : Rapide, concis, direct.</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 p-6 rounded-xl space-y-6">

                <div className="space-y-2">
                    <label className="text-sm font-bold text-white">Le Log (Qu'est-ce qui se passe ?)</label>
                    <textarea
                        required
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white h-40"
                        placeholder="Ex: Refactoring de l'orchestrateur n8n terminé à 3h du matin. Le système tourne 4x plus vite."
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-white">Tag (#Mood)</label>
                    <input
                        type="text"
                        required
                        value={formData.mood_tag}
                        onChange={(e) => setFormData({ ...formData, mood_tag: e.target.value })}
                        className="w-full sm:w-1/2 bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white font-mono"
                        placeholder="#VibeCoding"
                    />
                </div>

                <div className="pt-6 flex justify-end gap-4">
                    <button type="button" onClick={() => router.back()} className="px-6 py-3 border border-white/20 text-white rounded-lg hover:bg-white/5 transition-colors">
                        Annuler
                    </button>
                    <button type="submit" disabled={isSubmitting} className="px-8 py-3 bg-white text-black font-bold rounded-lg hover:bg-koudous-text transition-all duration-300 disabled:opacity-50">
                        {isSubmitting ? "Envoi..." : "Pousser le Log"}
                    </button>
                </div>
            </form>
        </div>
    );
}
