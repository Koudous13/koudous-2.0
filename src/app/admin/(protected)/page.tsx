import { createAdminClient } from "@/utils/supabase/server";
import Link from "next/link";
import {
    PenTool, Layers, Image, AlertTriangle, BookOpen,
    CalendarDays, Plus, ArrowRight, TrendingUp,
    Zap, Eye, Settings, Activity
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export const revalidate = 30;

export default async function AdminDashboardPage() {
    const supabase = await createAdminClient();

    const [
        { count: projectsCount },
        { count: articlesCount },
        { count: articlesPublished },
        { count: echecsCount },
        { count: parcoursCount },
        { count: gallerieCount },
        { count: journeesCount },
        { data: recentArticles },
        { data: recentProjects },
    ] = await Promise.all([
        supabase.from("projects").select("*", { count: "exact", head: true }),
        supabase.from("articles").select("*", { count: "exact", head: true }),
        supabase.from("articles").select("*", { count: "exact", head: true }).eq("published", true),
        supabase.from("failures").select("*", { count: "exact", head: true }),
        supabase.from("timeline_steps").select("*", { count: "exact", head: true }),
        supabase.from("gallery").select("*", { count: "exact", head: true }),
        supabase.from("journal_entries").select("*", { count: "exact", head: true }),
        supabase.from("articles").select("id, title, published, created_at, slug").order("created_at", { ascending: false }).limit(5),
        supabase.from("projects").select("id, title, created_at, slug").order("created_at", { ascending: false }).limit(3),
    ]);

    const now = new Date();
    const hour = now.getHours();
    const greeting = hour < 12 ? "Bonjour" : hour < 18 ? "Bonsoir" : "Bonsoir";

    const quickActions = [
        { href: "/admin/articles/new", icon: PenTool, label: "Nouvel Article", color: "koudous-primary" },
        { href: "/admin/projets/new", icon: Layers, label: "Nouveau Projet", color: "koudous-secondary" },
        { href: "/admin/journees/new", icon: CalendarDays, label: "Log du Jour", color: "white" },
        { href: "/admin/galerie/new", icon: Image, label: "Uploader des Photos", color: "koudous-primary" },
        { href: "/admin/parcours/new", icon: BookOpen, label: "Étape Timeline", color: "koudous-secondary" },
        { href: "/admin/echecs/new", icon: AlertTriangle, label: "Documenter un Échec", color: "red-400" },
    ];

    return (
        <div className="space-y-10">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <p className="text-koudous-text/40 font-mono text-sm uppercase tracking-widest mb-1">
                        {format(now, "EEEE dd MMMM yyyy", { locale: fr })}
                    </p>
                    <h1 className="text-4xl md:text-5xl font-display font-extrabold text-white">
                        {greeting},<span className="text-koudous-primary"> Koudous</span>
                    </h1>
                    <p className="text-koudous-text/50 mt-1 font-mono text-sm">
                        Votre écosystème tourne. Que souhaitez-vous construire aujourd'hui ?
                    </p>
                </div>
                <div className="flex gap-3">
                    <Link href="/" target="_blank" className="flex items-center gap-2 px-4 py-2 border border-white/20 text-white rounded-lg hover:bg-white/5 transition-colors text-sm">
                        <Eye size={15} /> Voir le site
                    </Link>
                    <Link href="/admin/settings" className="flex items-center gap-2 px-4 py-2 border border-white/20 text-white rounded-lg hover:bg-white/5 transition-colors text-sm">
                        <Settings size={15} /> Paramètres
                    </Link>
                </div>
            </div>

            {/* LIVE STATS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Projets", value: projectsCount || 0, icon: Layers, color: "text-koudous-secondary", href: "/admin/projets" },
                    { label: "Articles", value: `${articlesPublished || 0}/${articlesCount || 0}`, icon: PenTool, color: "text-koudous-primary", subtitle: "publiés", href: "/admin/articles" },
                    { label: "Galerie", value: gallerieCount || 0, icon: Image, color: "text-white/70", href: "/admin/galerie" },
                    { label: "Journées", value: journeesCount || 0, icon: Activity, color: "text-koudous-primary", href: "/admin/journees" },
                ].map(({ label, value, icon: Icon, color, href, subtitle }) => (
                    <Link key={label} href={href} className="group bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-koudous-primary/40 transition-all hover:-translate-y-0.5">
                        <div className="flex items-center justify-between mb-3">
                            <Icon size={18} className={`${color} opacity-70`} />
                            <ArrowRight size={14} className="text-koudous-text/30 group-hover:text-koudous-primary group-hover:translate-x-0.5 transition-all" />
                        </div>
                        <p className="text-3xl font-display font-bold text-white">{value}</p>
                        <p className="text-koudous-text/50 text-xs font-mono uppercase tracking-widest mt-1">{label} {subtitle && <span className="text-koudous-text/30">({subtitle})</span>}</p>
                    </Link>
                ))}
            </div>

            {/* SECONDARY STATS */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: "Étapes Parcours", value: parcoursCount || 0, href: "/admin/parcours" },
                    { label: "Échecs Documentés", value: echecsCount || 0, href: "/admin/echecs" },
                    { label: "Articles Brouillons", value: (articlesCount || 0) - (articlesPublished || 0), href: "/admin/articles" },
                ].map(({ label, value, href }) => (
                    <Link key={label} href={href} className="group bg-white/[0.03] border border-white/5 rounded-xl p-4 hover:border-white/20 transition-all">
                        <p className="text-2xl font-bold font-mono text-koudous-text">{value}</p>
                        <p className="text-koudous-text/40 text-xs uppercase tracking-widest mt-0.5">{label}</p>
                    </Link>
                ))}
            </div>

            {/* QUICK ACTIONS + RECENT ACTIVITY */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Quick Actions */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-5 border-b border-white/10 pb-4">
                        <Zap size={16} className="text-koudous-primary" />
                        <h3 className="font-bold text-white">Actions Rapides</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {quickActions.map(({ href, icon: Icon, label }) => (
                            <Link
                                key={href}
                                href={href}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-black/40 border border-white/5 hover:border-koudous-primary/40 hover:bg-koudous-primary/10 group transition-all"
                            >
                                <Icon size={16} className="text-koudous-text/50 group-hover:text-koudous-primary transition-colors shrink-0" />
                                <span className="text-sm text-koudous-text/70 group-hover:text-white transition-colors leading-tight">{label}</span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Recent Articles */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-5 border-b border-white/10 pb-4">
                        <div className="flex items-center gap-2">
                            <TrendingUp size={16} className="text-koudous-secondary" />
                            <h3 className="font-bold text-white">Articles Récents</h3>
                        </div>
                        <Link href="/admin/articles" className="text-xs text-koudous-text/40 hover:text-white transition-colors font-mono">
                            Voir tout →
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {recentArticles?.map((article) => (
                            <Link key={article.id} href={`/admin/articles/${article.id}/edit`} className="flex items-center justify-between group px-3 py-2 rounded-lg hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-3 min-w-0">
                                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${article.published ? "bg-green-400" : "bg-koudous-text/30"}`} />
                                    <span className="text-sm text-koudous-text/70 group-hover:text-white transition-colors truncate">{article.title}</span>
                                </div>
                                <span className="text-xs text-koudous-text/30 font-mono shrink-0 ml-2">
                                    {format(new Date(article.created_at), "dd/MM")}
                                </span>
                            </Link>
                        ))}
                        {!recentArticles?.length && (
                            <p className="text-koudous-text/30 text-sm text-center py-4">Aucun article encore.</p>
                        )}
                    </div>
                    <Link href="/admin/articles/new" className="mt-4 flex items-center gap-2 text-xs text-koudous-primary hover:text-koudous-primary/80 transition-colors pt-4 border-t border-white/5">
                        <Plus size={12} /> Rédiger un nouvel article
                    </Link>
                </div>
            </div>

            {/* SYSTEM STATUS */}
            <div className="bg-black/40 border border-white/5 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-xs font-mono text-koudous-text/60">Supabase: Opérationnel</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-xs font-mono text-koudous-text/60">Storage: Opérationnel</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-koudous-primary animate-pulse" />
                        <span className="text-xs font-mono text-koudous-text/60">Vercel: En ligne</span>
                    </div>
                </div>
                <p className="text-xs font-mono text-koudous-text/30">
                    Données rechargées à {format(now, "HH:mm:ss")}
                </p>
            </div>

        </div>
    );
}
