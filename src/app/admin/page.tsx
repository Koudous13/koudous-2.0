import { createAdminClient } from "@/utils/supabase/server";

export default async function AdminDashboardPage() {
    const supabase = await createAdminClient();

    // Récupération des statistiques globales (Mock ou réelles via site_settings)
    const { data: settings } = await supabase.from("site_settings").select("*").single();

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-display font-bold text-white mb-2">Cockpit Principal</h1>
                <p className="text-koudous-text/60">Vue globale de l'écosystème KOUDOUS 2.0.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* STAT CARDS */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-koudous-secondary/50 transition-colors">
                    <h3 className="text-koudous-text/60 text-sm font-medium mb-1 uppercase tracking-wider">Projets d'Architecture</h3>
                    <p className="text-4xl font-display font-bold text-white">{settings?.total_projects || 0}</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-koudous-secondary/50 transition-colors">
                    <h3 className="text-koudous-text/60 text-sm font-medium mb-1 uppercase tracking-wider">Articles & Logs</h3>
                    <p className="text-4xl font-display font-bold text-white">{settings?.total_articles || 0}</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-koudous-secondary/50 transition-colors">
                    <h3 className="text-koudous-text/60 text-sm font-medium mb-1 uppercase tracking-wider">Workflows (n8n/Python)</h3>
                    <p className="text-4xl font-display font-bold text-white">{settings?.total_workflows || 0}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                    <h3 className="font-bold text-lg text-white mb-4">Actions Rapides</h3>
                    <div className="space-y-3">
                        <a href="/admin/articles/new" className="block w-full text-left px-4 py-3 rounded-lg bg-black/40 hover:bg-koudous-primary/20 hover:text-koudous-primary transition-colors border border-transparent hover:border-koudous-primary/30">
                            + Nouveau Journal / Article
                        </a>
                        <a href="/admin/projets/new" className="block w-full text-left px-4 py-3 rounded-lg bg-black/40 hover:bg-koudous-primary/20 hover:text-koudous-primary transition-colors border border-transparent hover:border-koudous-primary/30">
                            + Déployer un Nouveau Projet
                        </a>
                        <a href="/admin/journees/new" className="block w-full text-left px-4 py-3 rounded-lg bg-black/40 hover:bg-koudous-primary/20 hover:text-koudous-primary transition-colors border border-transparent hover:border-koudous-primary/30">
                            + Ajouter une pensée (Micro-blog)
                        </a>
                    </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                    <h3 className="font-bold text-lg text-white mb-4">État du Système</h3>
                    <div className="flex items-center space-x-3 mb-2">
                        <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-koudous-text/80 text-sm font-mono">Backend: Opérationnel</span>
                    </div>
                    <div className="flex items-center space-x-3 mb-2">
                        <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-koudous-text/80 text-sm font-mono">Storage: Opérationnel</span>
                    </div>
                    <p className="text-xs text-koudous-text/40 mt-6 mt-auto">Dernière synchronisation : À l'instant</p>
                </div>
            </div>
        </div>
    );
}
