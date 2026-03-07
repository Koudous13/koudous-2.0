"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { createClient } from "@/utils/supabase/client";

export default function NewArticlePage() {
    const router = useRouter();
    const supabase = createClient();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        excerpt: "",
        category: "IA/Data",
        cover_image: "",
        is_published: false,
        content_html: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const { error } = await supabase.from("articles").insert([
                {
                    title: formData.title,
                    slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                    excerpt: formData.excerpt,
                    content_html: formData.content_html,
                    category: formData.category,
                    cover_image: formData.cover_image,
                    is_published: formData.is_published,
                    published_at: formData.is_published ? new Date().toISOString() : null,
                }
            ]);

            if (error) throw error;

            router.push("/admin");
            router.refresh();

        } catch (error: any) {
            alert("Erreur lors de la création : " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl">
            <div className="mb-8">
                <h1 className="text-3xl font-display font-bold text-white">Nouveau Journal / Article</h1>
                <p className="text-koudous-text/60">Rédigez votre prochaine masterclass ou journal de bord.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-white">Titre de l'Article</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-koudous-primary"
                            placeholder="Ex: Architecture Agentique avec LangGraph"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-white">Slug (URL)</label>
                        <input
                            type="text"
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-koudous-primary"
                            placeholder="auto-genere-si-vide"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-white">Extrait (Excerpt)</label>
                    <textarea
                        value={formData.excerpt}
                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-koudous-primary h-24"
                        placeholder="Un résumé percutant pour l'aperçu..."
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-white">Catégorie</label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-koudous-primary"
                        >
                            <option value="IA/Data">IA / Data Science</option>
                            <option value="Automation">Automation (n8n/Python)</option>
                            <option value="Vibe Coding">Vibe Coding</option>
                            <option value="Logs">Journal de Bord (Projet)</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-white">Image de Couverture (URL Temporaire)</label>
                        <input
                            type="text"
                            value={formData.cover_image}
                            onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-koudous-primary"
                            placeholder="https://images.unsplash.com/..."
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-bold text-white">Contenu Riche (TipTap)</label>
                    </div>
                    <RichTextEditor
                        content={formData.content_html}
                        onChange={(html) => setFormData({ ...formData, content_html: html })}
                    />
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                    <input
                        type="checkbox"
                        id="published"
                        checked={formData.is_published}
                        onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                        className="w-5 h-5 accent-koudous-primary bg-black/40 border-white/10"
                    />
                    <label htmlFor="published" className="text-white cursor-pointer select-none">
                        Publier immédiatement (Visible publiquement)
                    </label>
                </div>

                <div className="pt-6 flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-3 border border-white/20 text-white rounded-lg hover:bg-white/5 transition-colors"
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-8 py-3 bg-koudous-primary text-black font-bold rounded-lg hover:shadow-[0_0_20px_var(--color-koudous-primary)] transition-all duration-300 disabled:opacity-50"
                    >
                        {isSubmitting ? "Sauvegarde..." : "Sauvegarder l'Article"}
                    </button>
                </div>
            </form>
        </div>
    );
}
