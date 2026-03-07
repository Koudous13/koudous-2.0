"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import RichTextEditor from "@/components/admin/RichTextEditor";
import ImageUploader from "@/components/admin/ImageUploader";
import { createClient } from "@/utils/supabase/client";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditProjectPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const supabase = createClient();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        short_description: "",
        cover_image: "",
        github_link: "",
        stack_tags: "",
        metrics_json: "{}",
        is_pro: true,
        description: "",
    });

    useEffect(() => {
        const fetchProject = async () => {
            const { data, error } = await supabase
                .from("projects")
                .select("*")
                .eq("id", params.id)
                .single();

            if (error || !data) {
                alert("Projet introuvable");
                router.push("/admin/projets");
                return;
            }

            setFormData({
                title: data.title || "",
                slug: data.slug || "",
                short_description: data.short_description || "",
                cover_image: data.cover_image || "",
                github_link: data.github_link || "",
                stack_tags: (data.stack_tags || []).join(", "),
                metrics_json: data.metrics ? JSON.stringify(data.metrics, null, 2) : "{}",
                is_pro: data.is_pro ?? true,
                description: data.description || "",
            });
            setIsLoading(false);
        };
        fetchProject();
    }, [params.id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            let metricsParsed = null;
            if (formData.metrics_json.trim() !== "" && formData.metrics_json.trim() !== "{}") {
                metricsParsed = JSON.parse(formData.metrics_json);
            }
            const tagsArray = formData.stack_tags.split(",").map((t) => t.trim()).filter((t) => t.length > 0);

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
                updated_at: new Date().toISOString(),
            }).eq("id", params.id);

            if (error) throw error;
            router.push("/admin/projets");
            router.refresh();
        } catch (error: any) {
            alert("Erreur: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin text-koudous-primary" size={40} />
            </div>
        );
    }

    return (
        <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/projets" className="p-2 text-koudous-text/50 hover:text-white transition-colors">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-3xl font-display font-bold text-white">Modifier le Projet</h1>
                    <p className="text-koudous-text/60">Mise à jour sauvegardée dans Supabase.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white/5 border border-white/10 p-6 rounded-xl space-y-6">
                    <h3 className="font-bold text-xl border-b border-white/10 pb-2">Image de Couverture</h3>
                    <ImageUploader
                        onUpload={(url) => setFormData({ ...formData, cover_image: url })}
                        currentUrl={formData.cover_image}
                        folder="projects"
                    />
                </div>

                <div className="bg-white/5 border border-white/10 p-6 rounded-xl space-y-6">
                    <h3 className="font-bold text-xl border-b border-white/10 pb-2">Informations Générales</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-white">Nom du Projet</label>
                            <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-koudous-primary" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-white">Slug (URL)</label>
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
                            <label className="text-sm font-bold text-white">Lien Code Source</label>
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
                            <span>Démonstration Académique</span>
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
                        {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : "Sauvegarder les Modifications"}
                    </button>
                </div>
            </form>
        </div>
    );
}
