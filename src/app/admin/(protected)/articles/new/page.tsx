"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import RichTextEditor from "@/components/admin/RichTextEditor";
import ImageUploader from "@/components/admin/ImageUploader";
import { createClient } from "@/utils/supabase/client";
import { generateSlug } from "@/utils/slugify";
import { Loader2, ArrowLeft, Eye, PenTool } from "lucide-react";
import Link from "next/link";

export default function NewArticlePage() {
    const router = useRouter();
    const supabase = createClient();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [projects, setProjects] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        excerpt: "",
        category: "IA/Data",
        cover_image: "",
        published: false,
        content: "",
        project_id: "",
    });

    // Load projects list for the selector
    useEffect(() => {
        supabase.from("projects").select("id, title").order("title").then(({ data }) => {
            if (data) setProjects(data);
        });
    }, []);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        setFormData(prev => ({
            ...prev,
            title: newTitle,
            slug: prev.slug === "" ? generateSlug(newTitle) : prev.slug,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const { error } = await supabase.from("articles").insert([{
                title: formData.title,
                slug: formData.slug || generateSlug(formData.title),
                excerpt: formData.excerpt,
                content: formData.content,
                category: formData.category,
                cover_image: formData.cover_image,
                published: formData.published,
                project_id: formData.project_id || null,
                published_at: formData.published ? new Date().toISOString() : null,
            }]);
            if (error) throw error;
            router.push("/admin/articles");
            router.refresh();
        } catch (error: any) {
            alert("Erreur lors de la création : " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/admin/articles" className="p-2 text-koudous-text/50 hover:text-white transition-colors"><ArrowLeft size={20} /></Link>
                    <div>
                        <h1 className="text-3xl font-display font-bold text-white">Nouvel Article</h1>
                        <p className="text-koudous-text/60">Rédigez votre prochaine masterclass ou journal de bord.</p>
                    </div>
                </div>
                <div className="flex bg-white/5 border border-white/10 rounded-lg p-1">
                    <button 
                        onClick={() => setShowPreview(false)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${!showPreview ? "bg-koudous-primary text-black" : "text-koudous-text/60 hover:text-white"}`}
                    >
                        <PenTool size={16} /> Édition
                    </button>
                    <button 
                        onClick={() => setShowPreview(true)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${showPreview ? "bg-koudous-primary text-black" : "text-koudous-text/60 hover:text-white"}`}
                    >
                        <Eye size={16} /> Aperçu
                    </button>
                </div>
            </div>

            {!showPreview ? (
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Cover image */}
                <div className="bg-white/5 border border-white/10 p-6 rounded-xl space-y-4">
                    <h3 className="font-bold text-lg border-b border-white/10 pb-2">Image de Couverture</h3>
                    <ImageUploader
                        onUpload={(url) => setFormData({ ...formData, cover_image: url })}
                        currentUrl={formData.cover_image}
                        folder="articles"
                    />
                </div>

                {/* Core info */}
                <div className="bg-white/5 border border-white/10 p-6 rounded-xl space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-white">Titre de l'Article</label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={handleTitleChange}
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-koudous-primary"
                                placeholder="Ex: Architecture Agentique avec LangGraph"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-white">Slug <span className="text-koudous-text/40 font-normal">(auto-généré si vide)</span></label>
                            <input
                                type="text"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-koudous-primary"
                                placeholder="mon-super-article"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-white">Extrait (Aperçu sur la liste)</label>
                        <textarea
                            value={formData.excerpt}
                            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-koudous-primary h-20"
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
                            <label className="text-sm font-bold text-white">Lier à un Projet <span className="text-koudous-text/40 font-normal">(facultatif)</span></label>
                            <select
                                value={formData.project_id}
                                onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-koudous-primary"
                            >
                                <option value="">— Aucun projet lié —</option>
                                {projects.map(p => (
                                    <option key={p.id} value={p.id}>{p.title}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2 border-t border-white/10">
                        <input
                            type="checkbox"
                            id="published"
                            checked={formData.published}
                            onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                            className="w-5 h-5 accent-koudous-primary"
                        />
                        <label htmlFor="published" className="text-white cursor-pointer select-none">
                            Publier immédiatement (visible publiquement)
                        </label>
                    </div>
                </div>

                {/* Rich content */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-white">Contenu</label>
                    <RichTextEditor
                        content={formData.content}
                        onChange={(html) => setFormData({ ...formData, content: html })}
                        placeholder="Rédigez votre article ici. Cliquez sur 🖼️ pour insérer des images depuis votre PC."
                    />
                </div>

                <div className="pt-6 flex justify-end gap-4 pb-12">
                    <button type="button" onClick={() => router.back()} className="px-6 py-3 border border-white/20 text-white rounded-lg hover:bg-white/5 transition-colors">
                        Annuler
                    </button>
                    <button type="submit" disabled={isSubmitting} className="px-8 py-3 bg-koudous-primary text-black font-bold rounded-lg hover:shadow-[0_0_20px_var(--color-koudous-primary)] transition-all duration-300 disabled:opacity-50 flex items-center gap-2">
                        {isSubmitting ? <><Loader2 size={18} className="animate-spin" /> Sauvegarde...</> : "Sauvegarder l'Article"}
                    </button>
                </div>
            </form>
            ) : (
                <div className="bg-white/5 border border-white/10 p-8 md:p-12 rounded-xl">
                    <div className="max-w-3xl mx-auto">
                        <header className="mb-16">
                            <h1 className="text-4xl md:text-5xl font-display font-extrabold text-white leading-tight mb-8">
                                {formData.title || "Titre de l'article"}
                            </h1>
                            {formData.cover_image && (
                                <div className="relative w-full aspect-[21/9] bg-black/40 border border-white/10 rounded-2xl overflow-hidden mb-16 shadow-2xl">
                                    <img src={formData.cover_image} alt="Couverture" className="w-full h-full object-cover opacity-80" />
                                </div>
                            )}
                        </header>
                        <div
                            className="prose prose-invert prose-lg max-w-none 
                            prose-p:text-koudous-text/90 prose-p:leading-relaxed 
                            prose-headings:font-display prose-headings:text-white 
                            prose-a:text-koudous-primary prose-a:no-underline hover:prose-a:underline
                            prose-img:rounded-xl prose-img:border prose-img:border-white/10
                            prose-pre:bg-black/60 prose-pre:border prose-pre:border-white/10
                            prose-code:text-koudous-secondary prose-code:bg-koudous-secondary/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                            prose-blockquote:border-l-4 prose-blockquote:border-koudous-primary prose-blockquote:bg-koudous-primary/5 prose-blockquote:py-2 prose-blockquote:pl-6 prose-blockquote:italic"
                            dangerouslySetInnerHTML={{ __html: formData.content || "<p class='text-koudous-text/40 italic'>Le contenu de l'article s'affichera ici...</p>" }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
