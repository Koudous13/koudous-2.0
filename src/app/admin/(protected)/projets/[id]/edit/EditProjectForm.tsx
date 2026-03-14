"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RichTextEditor from "@/components/admin/RichTextEditor";
import ImageUploader from "@/components/admin/ImageUploader";
import { createClient } from "@/utils/supabase/client";
import { Loader2, ArrowLeft, Eye, PenTool, Activity } from "lucide-react";
import Link from "next/link";

export default function EditProjectForm({ project }: { project: any }) {
    const router = useRouter();
    const supabase = createClient();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    const [formData, setFormData] = useState({
        title: project.title || "",
        slug: project.slug || "",
        short_description: project.short_description || "",
        cover_image: project.cover_image || "",
        github_link: project.github_link || "",
        stack_tags: (project.stack_tags || []).join(", "),
        metrics_json: project.metrics ? JSON.stringify(project.metrics, null, 2) : "{}",
        is_pro: project.is_pro ?? true,
        description: project.description || "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            let metricsParsed = null;
            const trimmed = formData.metrics_json.trim();
            if (trimmed && trimmed !== "{}") {
                metricsParsed = JSON.parse(trimmed);
            }
            const tagsArray = formData.stack_tags.split(",").map((t: string) => t.trim()).filter((t: string) => t.length > 0);

            const { error } = await supabase.from("projects").update({
                title: formData.title,
                slug: formData.slug,
                short_description: formData.short_description,
                description: formData.description,
                cover_image: formData.cover_image,
                github_link: formData.github_link,
                stack_tags: tagsArray,
                metrics: metricsParsed,
                is_pro: formData.is_pro,
            }).eq("id", project.id);

            if (error) throw error;
            router.push("/admin/projets");
            router.refresh();
        } catch (err: any) {
            alert("Erreur: " + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/admin/projets" className="p-2 text-koudous-text/50 hover:text-white transition-colors"><ArrowLeft size={20} /></Link>
                    <div>
                        <h1 className="text-3xl font-display font-bold text-white">Modifier l'Architecture</h1>
                        <p className="text-koudous-text/60 font-mono text-xs mt-1">ID: {project.id}</p>
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
                    <h3 className="font-bold text-xl border-b border-white/10 pb-2">Image de Couverture</h3>
                    <ImageUploader onUpload={(url) => setFormData({ ...formData, cover_image: url })} currentUrl={formData.cover_image} folder="projects" />
                </div>

                <div className="bg-white/5 border border-white/10 p-6 rounded-xl space-y-6">
                    <h3 className="font-bold text-xl border-b border-white/10 pb-2">Informations Générales</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-white">Nom du Projet</label>
                            <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-koudous-primary" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-white">Slug</label>
                            <input type="text" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-koudous-primary" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-white">Description Courte</label>
                        <textarea value={formData.short_description} onChange={(e) => setFormData({ ...formData, short_description: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-koudous-primary h-20" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-white">Stack (virgules)</label>
                            <input type="text" value={formData.stack_tags} onChange={(e) => setFormData({ ...formData, stack_tags: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-koudous-primary" placeholder="Python, Supabase, n8n" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-white">GitHub / Démo</label>
                            <input type="url" value={formData.github_link} onChange={(e) => setFormData({ ...formData, github_link: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-koudous-primary" placeholder="https://github.com/..." />
                        </div>
                    </div>
                    <div className="flex gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="is_pro" checked={formData.is_pro} onChange={() => setFormData({ ...formData, is_pro: true })} className="accent-koudous-primary" />
                            <span>Masterclass Pro</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="is_pro" checked={!formData.is_pro} onChange={() => setFormData({ ...formData, is_pro: false })} className="accent-koudous-secondary" />
                            <span>Académique</span>
                        </label>
                    </div>
                </div>

                <div className="bg-white/5 border border-white/10 p-6 rounded-xl space-y-4">
                    <h3 className="font-bold text-xl border-b border-white/10 pb-2">Métriques (JSON)</h3>
                    <textarea value={formData.metrics_json} onChange={(e) => setFormData({ ...formData, metrics_json: e.target.value })} className="w-full bg-black/60 border border-koudous-primary/30 rounded-lg px-4 py-3 text-green-400 font-mono text-sm focus:outline-none h-28" />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-white">Description Complète (Architecture)</label>
                    <RichTextEditor content={formData.description} onChange={(html) => setFormData({ ...formData, description: html })} placeholder="Détaillez l'architecture..." />
                </div>

                <div className="pt-6 flex justify-end gap-4 pb-12">
                    <button type="button" onClick={() => router.back()} className="px-6 py-3 border border-white/20 text-white rounded-lg hover:bg-white/5 transition-colors">Annuler</button>
                    <button type="submit" disabled={isSubmitting} className="px-8 py-3 bg-koudous-primary text-black font-bold rounded-lg hover:shadow-[0_0_20px_var(--color-koudous-primary)] transition-all disabled:opacity-50">
                        {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : "Sauvegarder"}
                    </button>
                </div>
            </form>
            ) : (
                <div className="bg-white/5 border border-white/10 p-8 md:p-12 rounded-2xl">
                    <div className="max-w-5xl mx-auto">
                        <header className="mb-16">
                            <div className="flex flex-wrap items-center gap-4 mb-6">
                                <span className={`px-4 py-1.5 uppercase tracking-widest text-xs font-bold rounded-full border ${formData.is_pro ? 'bg-koudous-primary/20 text-koudous-primary border-koudous-primary/30' : 'bg-koudous-secondary/20 text-koudous-secondary border-koudous-secondary/30'}`}>
                                    {formData.is_pro ? "Souveraineté Pro" : "Recherche Académique"}
                                </span>
                            </div>

                            <h1 className="text-5xl md:text-7xl font-display font-extrabold text-white mb-8 tracking-tighter leading-[1.1]">
                                {formData.title || "Titre du Projet"}
                            </h1>
                        </header>

                        {formData.cover_image && (
                            <div className="relative w-full aspect-video rounded-3xl overflow-hidden border border-white/10 mb-20 bg-black/50">
                                <img src={formData.cover_image} alt="Cover" className="w-full h-full object-cover" />
                            </div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
                            <div className="lg:col-span-4">
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
                                    <h3 className="flex items-center gap-2 font-display font-bold text-lg text-white mb-6 uppercase tracking-widest border-b border-white/10 pb-2">
                                        <Activity size={18} className="text-koudous-primary" /> Metrics
                                    </h3>
                                    <p className="text-xs text-koudous-text/40 italic">Aperçu statique des données.</p>
                                </div>
                            </div>
                            <div className="lg:col-span-8">
                                <h2 className="text-3xl font-display font-bold text-white mb-6 border-l-4 border-koudous-secondary pl-4">Architecture</h2>
                                <div 
                                    className="prose prose-invert prose-lg max-w-none prose-p:text-koudous-text/80 prose-headings:font-display prose-headings:text-white prose-a:text-koudous-primary"
                                    dangerouslySetInnerHTML={{ __html: formData.content || formData.description || "" }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
