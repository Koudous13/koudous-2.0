"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import RichTextEditor from "@/components/admin/RichTextEditor";
import Link from "next/link";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

interface Props {
    entry: {
        id: string;
        content: string;
        mood_tags: string[];
        created_at: string;
    };
}

export default function EditJournalForm({ entry }: Props) {
    const router = useRouter();
    const supabase = createClient();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [content, setContent] = useState(entry.content || "");
    const [tagsInput, setTagsInput] = useState((entry.mood_tags || []).join(", "));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const tagsArray = tagsInput.split(",").map(t => t.trim()).filter(t => t.length > 0);
            const { error } = await supabase.from("journal_entries").update({
                content,
                mood_tags: tagsArray,
            }).eq("id", entry.id);
            if (error) throw error;
            router.push("/admin/journees");
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
                <Link href="/admin/journees" className="p-2 text-koudous-text/50 hover:text-white transition-colors">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-3xl font-display font-bold text-white">Modifier le Log</h1>
                    <p className="text-koudous-text/60 mt-1 text-sm">Entrée du {new Date(entry.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white/5 border border-white/10 p-6 rounded-xl space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-white">Contenu du Log</label>
                        <RichTextEditor
                            content={content}
                            onChange={setContent}
                            placeholder="Qu'est-ce qui se passe ?"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-white">Tags (séparés par des virgules)</label>
                        <input
                            type="text"
                            value={tagsInput}
                            onChange={(e) => setTagsInput(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-koudous-primary font-mono"
                            placeholder="#VibeCoding, #Build, #IA"
                        />
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    <Link href="/admin/journees" className="text-koudous-text/50 hover:text-white text-sm transition-colors">
                        ← Annuler
                    </Link>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-8 py-3 bg-koudous-primary text-black font-bold rounded-lg hover:shadow-[0_0_20px_var(--color-koudous-primary)] transition-all disabled:opacity-50"
                    >
                        {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        Sauvegarder
                    </button>
                </div>
            </form>
        </div>
    );
}
