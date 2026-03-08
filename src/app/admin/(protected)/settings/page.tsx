"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Loader2, Save, RefreshCw, Settings, BarChart2, Globe } from "lucide-react";

export default function AdminSettingsPage() {
    const supabase = createClient();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [settingsId, setSettingsId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        hero_text: "",
        total_projects: 0,
        total_articles: 0,
        total_workflows: 0,
    });

    const [socials, setSocials] = useState({
        github: "",
        linkedin: "",
        twitter: "",
        email: "",
    });

    useEffect(() => {
        supabase.from("site_settings").select("*").limit(1).single().then(({ data }) => {
            if (data) {
                setSettingsId(data.id);
                setFormData({
                    hero_text: data.hero_text || "",
                    total_projects: data.total_projects || 0,
                    total_articles: data.total_articles || 0,
                    total_workflows: data.total_workflows || 0,
                });
            }
        });
    }, []);

    const handleSave = async () => {
        if (!settingsId) return;
        setIsSubmitting(true);
        try {
            const { error } = await supabase.from("site_settings").update({
                ...formData,
                updated_at: new Date().toISOString(),
            }).eq("id", settingsId);
            if (error) throw error;
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 3000);
        } catch (err: any) {
            alert("Erreur: " + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const autoCountStats = async () => {
        try {
            const [{ count: projects }, { count: articles }, { count: journals }] = await Promise.all([
                supabase.from("projects").select("*", { count: "exact", head: true }),
                supabase.from("articles").select("*", { count: "exact", head: true }).eq("published", true),
                supabase.from("journal_entries").select("*", { count: "exact", head: true }),
            ]);
            setFormData(prev => ({
                ...prev,
                total_projects: projects || 0,
                total_articles: articles || 0,
                total_workflows: journals || 0,
            }));
        } catch (err: any) {
            alert("Erreur: " + err.message);
        }
    };

    return (
        <div className="max-w-3xl space-y-8">
            <div>
                <h1 className="text-3xl font-display font-bold text-white flex items-center gap-3">
                    <Settings size={28} className="text-koudous-primary" />
                    Paramètres du Site
                </h1>
                <p className="text-koudous-text/60 mt-1">Contrôlez le contenu de la page d'accueil depuis ici.</p>
            </div>

            {/* Hero Text */}
            <div className="bg-white/5 border border-white/10 p-6 rounded-xl space-y-4">
                <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                    <Globe size={18} className="text-koudous-primary" />
                    <h2 className="font-bold text-white">Texte d'Accroche (Hero)</h2>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-white">Phrase principale sous le nom</label>
                    <textarea
                        value={formData.hero_text}
                        onChange={(e) => setFormData({ ...formData, hero_text: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-koudous-primary h-28 resize-none"
                        placeholder="Je conçois et déploie des systèmes intelligents..."
                    />
                </div>
            </div>

            {/* Stats */}
            <div className="bg-white/5 border border-white/10 p-6 rounded-xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                        <BarChart2 size={18} className="text-koudous-primary" />
                        <h2 className="font-bold text-white">Statistiques Affichées</h2>
                    </div>
                    <button
                        type="button"
                        onClick={autoCountStats}
                        className="flex items-center gap-1.5 text-xs text-koudous-text/60 hover:text-white border border-white/20 px-3 py-1.5 rounded-lg transition-colors"
                    >
                        <RefreshCw size={12} />
                        Auto-compter depuis la BDD
                    </button>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    {[
                        { key: "total_projects", label: "Projets Pro" },
                        { key: "total_articles", label: "Articles" },
                        { key: "total_workflows", label: "Journées / Workflows" },
                    ].map(({ key, label }) => (
                        <div key={key} className="space-y-2">
                            <label className="text-sm font-bold text-white">{label}</label>
                            <input
                                type="number"
                                value={formData[key as keyof typeof formData]}
                                onChange={(e) => setFormData({ ...formData, [key]: parseInt(e.target.value) || 0 })}
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white font-mono text-center text-xl focus:outline-none focus:border-koudous-primary"
                            />
                        </div>
                    ))}
                </div>
                <p className="text-koudous-text/40 text-xs">Ces chiffres s'affichent sur la page d'accueil publique.</p>
            </div>

            {/* Liens Sociaux - côté code pour l'instant */}
            <div className="bg-white/5 border border-white/10 p-6 rounded-xl space-y-4 opacity-50">
                <div className="border-b border-white/10 pb-3">
                    <h2 className="font-bold text-white">Liens Sociaux <span className="text-xs text-koudous-text/40 font-normal ml-2">(dans le footer — modifiables dans le code)</span></h2>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {["GitHub", "LinkedIn", "Twitter/X", "Email"].map(platform => (
                        <div key={platform} className="space-y-1">
                            <label className="text-xs font-bold text-koudous-text/60">{platform}</label>
                            <input type="text" disabled className="w-full bg-black/20 border border-white/5 rounded-lg px-3 py-2 text-koudous-text/30 text-sm" placeholder="Bientôt modifiable ici..." />
                        </div>
                    ))}
                </div>
            </div>

            {/* Save */}
            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={isSubmitting}
                    className={`flex items-center gap-2 px-8 py-3 font-bold rounded-lg transition-all ${isSaved
                            ? "bg-green-500 text-black"
                            : "bg-koudous-primary text-black hover:shadow-[0_0_20px_var(--color-koudous-primary)]"
                        } disabled:opacity-50`}
                >
                    {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    {isSaved ? "Sauvegardé !" : "Sauvegarder"}
                </button>
            </div>
        </div>
    );
}
