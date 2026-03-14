"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import ImageUploader from "@/components/admin/ImageUploader";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { Eye, PenTool, ArrowLeft, Briefcase, GraduationCap, Sparkles } from "lucide-react";
import Link from "next/link";

export default function NewTimelineStepPage() {
    const router = useRouter();
    const supabase = createClient();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        period: "2024 - Présent",
        description: "",
        location: "France",
        category: "Professionnel",
        image_url: "",
        order_index: 0,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const { error } = await supabase.from("timeline_steps").insert([formData]);

            if (error) throw error;

            router.push("/admin/parcours");
            router.refresh();

        } catch (error: any) {
            alert("Erreur: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/admin/parcours" className="p-2 text-koudous-text/50 hover:text-white transition-colors"><ArrowLeft size={20} /></Link>
                    <div>
                        <h1 className="text-3xl font-display font-bold text-white">Nouvelle Étape de Parcours</h1>
                        <p className="text-koudous-text/60">Ajouter une nouvelle brique à la timeline.</p>
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
            <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 p-6 rounded-xl space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-white">Titre du Rôle / Événement</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-koudous-primary"
                            placeholder="Ex: Architecte IA & Domotique"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-white">Période</label>
                        <input
                            type="text"
                            required
                            value={formData.period}
                            onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-koudous-primary font-mono"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-white">Lieu / Entreprise</label>
                        <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-koudous-primary"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-white">Catégorie</label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-koudous-primary"
                        >
                            <option value="Professionnel">Professionnel</option>
                            <option value="Académique">Académique (Diplôme, Formation)</option>
                            <option value="Personnel">Personnel / Hobby</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-white">Description (Souveraineté et accomplissements)</label>
                    <RichTextEditor
                        content={formData.description}
                        onChange={(html) => setFormData({ ...formData, description: html })}
                        placeholder="Qu'avez-vous accompli ici ? Détaillez vos actions."
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-white">Image / Logo (Upload depuis votre PC)</label>
                    <ImageUploader
                        onUpload={(url) => setFormData({ ...formData, image_url: url })}
                        currentUrl={formData.image_url}
                        folder="parcours"
                    />
                </div>

                <div className="pt-6 flex justify-end gap-4">
                    <button type="button" onClick={() => router.back()} className="px-6 py-3 border border-white/20 text-white rounded-lg hover:bg-white/5 transition-colors">
                        Annuler
                    </button>
                    <button type="submit" disabled={isSubmitting} className="px-8 py-3 bg-koudous-primary text-black font-bold rounded-lg transition-all duration-300 disabled:opacity-50">
                        {isSubmitting ? "Ajout..." : "Ajouter Étape"}
                    </button>
                </div>
            </form>
            ) : (
                <div className="bg-white/5 border border-white/10 p-8 md:p-12 rounded-2xl">
                    <div className="relative border-l-2 border-koudous-secondary/20 ml-4 space-y-16">
                        <div className="relative pl-8 md:pl-16">
                            <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-koudous-bg border-2 border-koudous-primary flex items-center justify-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-koudous-primary" />
                            </div>

                            <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-8">
                                <div className="md:w-1/3 pt-1 flex flex-col items-start">
                                    <span className="font-mono text-lg text-koudous-primary font-bold mb-1">
                                        {formData.period || "2000 - 2024"}
                                    </span>
                                    <span className="text-sm font-bold text-white bg-white/10 px-3 py-1 rounded-full mb-3 flex items-center gap-2">
                                        {formData.category === 'Professionnel' && <Briefcase size={14} />}
                                        {formData.category === 'Académique' && <GraduationCap size={14} />}
                                        {formData.category === 'Personnel' && <Sparkles size={14} />}
                                        {formData.category}
                                    </span>
                                    <span className="text-sm text-koudous-text/60 font-medium">
                                        {formData.location}
                                    </span>
                                </div>

                                <div className="md:w-2/3">
                                    <h3 className="text-2xl font-display font-bold text-white mb-4">
                                        {formData.title || "Titre de l'événement"}
                                    </h3>
                                    <div
                                        className="text-koudous-text/80 leading-relaxed prose prose-invert prose-sm max-w-none"
                                        dangerouslySetInnerHTML={{ __html: formData.description || "<p class='text-koudous-text/40 italic'>La description s'affichera ici...</p>" }}
                                    />

                                    {formData.image_url && (
                                        <div className="relative w-full h-48 mt-6 rounded-xl overflow-hidden border border-white/10">
                                            <img src={formData.image_url} alt="Step preview" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
