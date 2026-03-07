"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import RichTextEditor from "@/components/admin/RichTextEditor";
import ImageUploader from "@/components/admin/ImageUploader";
import { createClient } from "@/utils/supabase/client";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditArticlePage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const supabase = createClient();
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
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

    useEffect(() => {
        const load = async () => {
            const [{ data: article }, { data: projs }] = await Promise.all([
                supabase.from("articles").select("*").eq("id", params.id).single(),
                supabase.from("projects").select("id, title").order("title"),
            ]);

            if (!article) { alert("Article introuvable"); router.push("/admin/articles"); return; }

            setProjects(projs || []);
            setFormData({
                title: article.title || "",
                slug: article.slug || "",
                excerpt: article.excerpt || "",
                category: article.category || "IA/Data",
                cover_image: article.cover_image || "",
                published: article.published || false,
                content: article.content || "",
                project_id: article.project_id || "",
            });
            setIsLoading(false);
        };
        load();
    }, [params.id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const { error } = await supabase.from("articles").update({
                title: formData.title,
                slug: formData.slug,
                excerpt: formData.excerpt,
                category: formData.category,
                cover_image: formData.cover_image,
                published: formData.published,
                content: formData.content,
                project_id: formData.project_id || null,
                published_at: formData.published ? new Date().toISOString() : null,
                updated_at: new Date().toISOString(),
            }).eq("id", params.id);

            if (error) throw error;
            router.push("/admin/articles");
            router.refresh();
        } catch (err: any) {
            alert("Erreur: " + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <div className="flex justify-center h-64 items-center"><Loader2 className="animate-spin text-koudous-primary" size={40} /></div>;

    return (
        <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/articles" className="p-2 text-koudous-text/50 hover:text-white transition-colors"><ArrowLeft size={20} /></Link>
                <div>
                    <h1 className="text-3xl font-display font-bold text-white">Modifier l'Article</h1>
                    <p className="text-koudous-text/60">Les modifications sont sauvegardées dans Supabase.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white/5 border border-white/10 p-6 rounded-xl space-y-4">
                    <h3 className="font-bold text-xl border-b border-white/10 pb-2">Image de Couverture</h3>
                    <ImageUploader onUpload={(url) => setFormData({ ...formData, cover_image: url })} currentUrl={formData.cover_image} folder="articles" />
                </div>

                <div className="bg-white/5 border border-white/10 p-6 rounded-xl space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-white">Titre</label>
                            <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-koudous-primary" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-white">Slug</label>
                            <input type="text" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-koudous-primary" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-white">Extrait</label>
                        <textarea value={formData.excerpt} onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-koudous-primary h-20" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-white">Catégorie</label>
                            <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-koudous-primary">
                                <option value="IA/Data">IA / Data Science</option>
                                <option value="Automation">Automation (n8n/Python)</option>
                                <option value="Vibe Coding">Vibe Coding</option>
                                <option value="Logs">Journal de Bord</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-white">Lier à un Projet (optionnel)</label>
                            <select value={formData.project_id} onChange={(e) => setFormData({ ...formData, project_id: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-koudous-primary">
                                <option value="">Aucun projet lié</option>
                                {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 pt-2">
                        <input type="checkbox" id="published_edit" checked={formData.published} onChange={(e) => setFormData({ ...formData, published: e.target.checked })} className="w-5 h-5 accent-koudous-primary" />
                        <label htmlFor="published_edit" className="text-white cursor-pointer">Publié (visible publiquement)</label>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-white">Contenu</label>
                    <RichTextEditor content={formData.content} onChange={(html) => setFormData({ ...formData, content: html })} />
                </div>

                <div className="pt-6 flex justify-end gap-4 pb-12">
                    <button type="button" onClick={() => router.back()} className="px-6 py-3 border border-white/20 text-white rounded-lg hover:bg-white/5 transition-colors">Annuler</button>
                    <button type="submit" disabled={isSubmitting} className="px-8 py-3 bg-koudous-primary text-black font-bold rounded-lg hover:shadow-[0_0_20px_var(--color-koudous-primary)] transition-all disabled:opacity-50">
                        {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : "Sauvegarder"}
                    </button>
                </div>
            </form>
        </div>
    );
}
