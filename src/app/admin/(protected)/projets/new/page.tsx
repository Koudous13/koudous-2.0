"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RichTextEditor from "@/components/admin/RichTextEditor";
import ImageUploader from "@/components/admin/ImageUploader";
import { createClient } from "@/utils/supabase/client";

export default function NewProjectPage() {
    const router = useRouter();
    const supabase = createClient();
    const [isSubmitting, setIsSubmitting] = useState(false);

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
            <div className="mb-8">
                <h1 className="text-3xl font-display font-bold text-white">Déployer Nouvelle Architecture</h1>
                <p className="text-koudous-text/60">Ajouter un nouveau chef d'oeuvre de votre portfolio KOUDOUS 2.0.</p>
            </div>

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
                            <label className="text-sm font-bold text-white">Image Cover (URL URL Temporaire)</label>
                            <input
                                type="url"
                                value={formData.cover_image}
                                onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-koudous-primary"
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
        </div>
    );
}
