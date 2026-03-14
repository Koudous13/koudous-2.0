"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import RichTextEditor from "@/components/admin/RichTextEditor";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, Eye, PenTool, Clock } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

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
    const [showPreview, setShowPreview] = useState(false);
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
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/admin/journees" className="p-2 text-koudous-text/50 hover:text-white transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-display font-bold text-white">Modifier le Log</h1>
                        <p className="text-koudous-text/60 mt-1 text-sm">Entrée du {new Date(entry.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</p>
                    </div>
                </div>
                <div className="flex bg-white/5 border border-white/10 rounded-lg p-1">
                    <button 
                        type="button"
                        onClick={() => setShowPreview(false)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${!showPreview ? "bg-koudous-primary text-black" : "text-koudous-text/60 hover:text-white"}`}
                    >
                        <PenTool size={16} /> Édition
                    </button>
                    <button 
                        type="button"
                        onClick={() => setShowPreview(true)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${showPreview ? "bg-koudous-primary text-black" : "text-koudous-text/60 hover:text-white"}`}
                    >
                        <Eye size={16} /> Aperçu
                    </button>
                </div>
            </div>

            {!showPreview ? (
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
            ) : (
                <div className="bg-white/5 border border-white/10 p-8 rounded-2xl">
                    <div className="group relative pl-8 md:pl-12 border-l border-white/10">
                        <div className="absolute left-[-5px] top-6 w-2.5 h-2.5 rounded-full bg-koudous-primary shadow-[0_0_10px_var(--color-koudous-primary)]"></div>
                        <div className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-2xl">
                            <header className="flex flex-wrap items-center justify-between gap-4 mb-4">
                                <div className="flex items-center gap-2 text-koudous-primary font-mono text-sm tracking-widest font-bold">
                                    <Clock size={16} />
                                    <time>
                                        {format(new Date(entry.created_at), "dd MMM yyyy '::' HH:mm", { locale: fr })}
                                    </time>
                                </div>
                                <div className="flex gap-2">
                                    {tagsInput.split(",").map(t => t.trim()).filter(t => t.length > 0).map((tag) => (
                                        <span key={tag} className="px-2 py-0.5 bg-black/50 border border-white/20 text-koudous-text/60 text-xs rounded uppercase font-mono tracking-wider">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </header>
                            <div
                                className="prose prose-invert prose-p:text-koudous-text/90 prose-p:leading-relaxed prose-a:text-koudous-secondary"
                                dangerouslySetInnerHTML={{ __html: content }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
