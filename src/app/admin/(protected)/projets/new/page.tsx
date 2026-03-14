"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RichTextEditor from "@/components/admin/RichTextEditor";
import ImageUploader from "@/components/admin/ImageUploader";
import { createClient } from "@/utils/supabase/client";
import { Eye, PenTool, ArrowLeft, Loader2, Github, Activity } from "lucide-react";
import Link from "next/link";

export default function NewProjectPage() {
    const router = useRouter();
    const supabase = createClient();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        short_description: "",
        cover_image: "",
        github_link: "",
        stack_tags: "", // Sera converti en array
        metrics_json: "{\n  \"Inference\": \"12ms\",\n  \"Data Processed\": \"20M\"\n}",
        is_pro: true,
        description: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            let metricsParsed = null;
            try {
                if (formData.metrics_json.trim() !== '') {
                    metricsParsed = JSON.parse(formData.metrics_json);
                }
            } catch (err) {
                throw new Error("Format JSON invalide pour les métriques");
            }

            const tagsArray = formData.stack_tags.split(',').map(t => t.trim()).filter(t => t.length > 0);

            const { error } = await supabase.from("projects").insert([
                {
                    title: formData.title,
                    slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                    short_description: formData.short_description,
                    description: formData.description,
                    cover_image: formData.cover_image,
                    github_link: formData.github_link,
                    stack_tags: tagsArray,
                    metrics: metricsParsed,
                    is_pro: formData.is_pro,
                }
            ]);

            if (error) throw error;

            router.push("/admin/projets");
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
                    <Link href="/admin/projets" className="p-2 text-koudous-text/50 hover:text-white transition-colors"><ArrowLeft size={20} /></Link>
                    <div>
                        <h1 className="text-3xl font-display font-bold text-white">Déployer Nouvelle Architecture</h1>
                        <p className="text-koudous-text/60">Ajouter un nouveau chef d'oeuvre de votre portfolio KOUDOUS 2.0.</p>
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
                <div className="bg-white/5 border border-white/10 p-6 rounded-xl space-y-6">
                    <h3 className="font-bold text-xl border-b border-white/10 pb-2">Informations Générales</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-white">Nom du Projet</label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-koudous-primary"
                                placeholder="Ex: Système RAG Multi-Agents"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-white">Slug (URL)</label>
                            <input
                                type="text"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-koudous-primary"
                                placeholder="auto-calcule"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-white">Description Très Courte</label>
                        <textarea
                            required
                            value={formData.short_description}
                            onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-koudous-primary h-20"
                            placeholder="Ex: Déploiement souverain d'une structure LLM pour l'analyse de contrats..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-white">Mots Clés Stack (séparés par des virgules)</label>
                            <input
                                type="text"
                                value={formData.stack_tags}
                                onChange={(e) => setFormData({ ...formData, stack_tags: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-koudous-primary font-mono text-sm"
                                placeholder="Python, Supabase, n8n, Mistral"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-white">Image de Couverture</label>
                            <ImageUploader
                                onUpload={(url) => setFormData({ ...formData, cover_image: url })}
                                currentUrl={formData.cover_image}
                                folder="projects"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-white">Lien Code Source (Optionnel)</label>
                            <input
                                type="url"
                                value={formData.github_link}
                                onChange={(e) => setFormData({ ...formData, github_link: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-koudous-primary"
                                placeholder="https://github.com/..."
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-white">Classification</label>
                            <div className="flex gap-4 mt-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="project_type" className="accent-koudous-primary" checked={formData.is_pro} onChange={() => setFormData({ ...formData, is_pro: true })} />
                                    <span>Masterclass Professionnelle</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="project_type" className="accent-koudous-secondary" checked={!formData.is_pro} onChange={() => setFormData({ ...formData, is_pro: false })} />
                                    <span>Démonstration Académique</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white/5 border border-white/10 p-6 rounded-xl space-y-6">
                    <h3 className="font-bold text-xl border-b border-white/10 pb-2">Données de Force (Metrics JSON)</h3>
                    <p className="text-sm text-koudous-text/60 mb-2">Prouvez votre niveau avec des chiffres. Format JSON clé/valeur strict.</p>
                    <textarea
                        value={formData.metrics_json}
                        onChange={(e) => setFormData({ ...formData, metrics_json: e.target.value })}
                        className="w-full bg-black/60 border border-koudous-primary/30 rounded-lg px-4 py-3 text-green-400 font-mono text-sm focus:outline-none h-32"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-white">Description Complète (Architecture)</label>
                    <RichTextEditor
                        content={formData.description}
                        onChange={(html) => setFormData({ ...formData, description: html })}
                        placeholder="Détaillez chaque couche de votre architecture système ici..."
                    />
                </div>

                <div className="pt-6 flex justify-end gap-4 pb-12">
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
                        {isSubmitting ? "Déploiement en cours..." : "Déployer le Projet"}
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
                                {formData.github_link && (
                                    <div className="flex items-center gap-2 text-koudous-text/60 text-sm font-mono border border-white/10 px-4 py-1.5 rounded-full bg-white/5">
                                        <Github size={14} /> Repository Privé
                                    </div>
                                )}
                            </div>

                            <h1 className="text-5xl md:text-7xl font-display font-extrabold text-white mb-8 tracking-tighter leading-[1.1]">
                                {formData.title || "Titre du Projet"}
                            </h1>

                            <div className="flex flex-wrap gap-3 mb-12">
                                {formData.stack_tags.split(',').map(t => t.trim()).filter(t => t.length > 0).map((tag) => (
                                    <span key={tag} className="px-5 py-2 text-sm uppercase font-mono tracking-widest text-white border border-white/20 rounded-full bg-black">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </header>

                        {formData.cover_image && (
                            <div className="relative w-full aspect-video rounded-3xl overflow-hidden border border-white/10 mb-20 bg-black/50">
                                <img src={formData.cover_image} alt="Cover" className="w-full h-full object-cover" />
                            </div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
                            <div className="lg:col-span-4 space-y-8">
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
                                    <div className="flex items-center gap-3 text-koudous-primary mb-8 border-b border-white/10 pb-4">
                                        <Activity size={24} />
                                        <h3 className="font-display font-bold text-xl text-white tracking-widest uppercase">Metrics</h3>
                                    </div>
                                    <div className="space-y-6">
                                        {(() => {
                                            try {
                                                const m = JSON.parse(formData.metrics_json);
                                                return Object.entries(m).map(([k, v]) => (
                                                    <div key={k}>
                                                        <p className="text-koudous-text/50 font-mono text-xs uppercase tracking-widest mb-1">{k}</p>
                                                        <p className="font-display text-2xl font-bold text-white tracking-tight">{String(v)}</p>
                                                    </div>
                                                ));
                                            } catch (e) {
                                                return <p className="text-xs text-red-400 font-mono italic">JSON Metrics Invalide</p>
                                            }
                                        })()}
                                    </div>
                                </div>
                            </div>
                            <div className="lg:col-span-8">
                                <h2 className="text-3xl font-display font-bold text-white mb-6 border-l-4 border-koudous-secondary pl-4">Architecture Fundamentale</h2>
                                <div 
                                    className="prose prose-invert prose-lg max-w-none prose-p:text-koudous-text/80 prose-headings:font-display prose-headings:text-white prose-a:text-koudous-primary"
                                    dangerouslySetInnerHTML={{ __html: formData.description || "<p class='text-koudous-text/40 italic'>La description s'affichera ici...</p>" }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
