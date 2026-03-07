"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import ImageUploader from "@/components/admin/ImageUploader";

export default function NewTimelineStepPage() {
    const router = useRouter();
    const supabase = createClient();
    const [isSubmitting, setIsSubmitting] = useState(false);

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
            <div className="mb-8">
                <h1 className="text-3xl font-display font-bold text-white">Nouvelle Étape de Parcours</h1>
                <p className="text-koudous-text/60">Ajouter une nouvelle brique à la timeline.</p>
            </div>

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
                    <textarea
                        required
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-koudous-primary h-32"
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
        </div>
    );
}
