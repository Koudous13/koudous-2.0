import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { Github, Activity, CalendarDays, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Image from "next/image";

export const revalidate = 60;

export default async function ProjectDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params;
    const supabase = await createClient();

    // Fetch project
    const { data: project } = await supabase
        .from("projects")
        .select("*")
        .eq("slug", slug)
        .single();

    if (!project) {
        notFound();
    }

    // Fetch linked articles (Journal de bord)
    const { data: articles } = await supabase
        .from("articles")
        .select("*")
        .eq("project_id", project.id)
        .eq("published", true)
        .order("created_at", { ascending: true }); // Chronological order for a journal

    // Parse Metrics if they exist
    let metrics = null;
    if (project.metrics) {
        try {
            metrics = typeof project.metrics === 'string' ? JSON.parse(project.metrics) : project.metrics;
        } catch (e) {
            console.error("Error parsing metrics JSON", e);
        }
    }

    return (
        <article className="max-w-5xl mx-auto py-12 md:py-20 px-4 md:px-0">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "SoftwareApplication",
                        "name": project.title,
                        "operatingSystem": "Web",
                        "applicationCategory": "WebApplication",
                        "description": project.short_description || project.title,
                        "author": {
                            "@type": "Person",
                            "name": "Koudous DAOUDA",
                            "url": "https://koudous-2-0.vercel.app"
                        }
                    })
                }}
            />

            {/* HEADER SECTION */}
            <header className="mb-16">
                <div className="flex flex-wrap items-center gap-4 mb-6">
                    <span className={`px-4 py-1.5 uppercase tracking-widest text-xs font-bold rounded-full border ${project.is_pro ? 'bg-koudous-primary/20 text-koudous-primary border-koudous-primary/30' : 'bg-koudous-secondary/20 text-koudous-secondary border-koudous-secondary/30'}`}>
                        {project.is_pro ? "Souveraineté Pro" : "Recherche Académique"}
                    </span>
                    {project.github_link && (
                        <a href={project.github_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-koudous-text/60 hover:text-white transition-colors text-sm font-mono border border-white/10 px-4 py-1.5 rounded-full bg-white/5">
                            <Github size={14} /> Repository Privé / Code Source
                        </a>
                    )}
                </div>

                <h1 className="text-5xl md:text-8xl font-display font-extrabold text-white mb-8 tracking-tighter leading-[1.1] mix-blend-difference">
                    {project.title}
                </h1>

                <div className="flex flex-wrap gap-3 mb-12">
                    {project.stack_tags?.map((tag: string) => (
                        <span key={tag} className="px-5 py-2 text-sm uppercase font-mono tracking-widest text-white border border-white/20 rounded-full bg-black shadow-[inset_0_0_20px_rgba(255,255,255,0.05)]">
                            {tag}
                        </span>
                    ))}
                </div>
            </header>

            {/* BIG COVER IMAGE */}
            {project.cover_image && (
                <div className="relative w-full aspect-video rounded-3xl overflow-hidden border border-white/10 mb-20 bg-black/50 shadow-2xl group">
                    <div className="absolute inset-0 bg-koudous-primary/10 mix-blend-overlay z-10 group-hover:opacity-0 transition-opacity duration-1000"></div>
                    <Image
                        src={project.cover_image}
                        alt={`Cover - ${project.title}`}
                        fill
                        className="object-cover filter grayscale-[20%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                        sizes="(max-width: 1024px) 100vw, 1024px"
                        priority
                    />
                </div>
            )}

            {/* TWO COLUMNS LAYOUT : METRICS & DESCRIPTION */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 mb-24">

                {/* LEFTSIDE : METRICS (Sticky via flex if wanted, or just standard grid) */}
                <div className="lg:col-span-4 space-y-8">
                    {metrics && Object.keys(metrics).length > 0 && (
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm sticky top-32">
                            <div className="flex items-center gap-3 text-koudous-primary mb-8 border-b border-white/10 pb-4">
                                <Activity size={24} />
                                <h3 className="font-display font-bold text-xl text-white tracking-widest uppercase">Metrics</h3>
                            </div>
                            <div className="space-y-6">
                                {Object.entries(metrics).map(([key, value]) => (
                                    <div key={key}>
                                        <p className="text-koudous-text/50 font-mono text-xs uppercase tracking-widest mb-1">{key}</p>
                                        <p className="font-display text-2xl md:text-3xl font-bold text-white tracking-tight">{String(value)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* RIGHTSIDE : DESCRIPTION FOUNDATION */}
                <div className="lg:col-span-8">
                    <h2 className="text-3xl font-display font-bold text-white mb-6 border-l-4 border-koudous-secondary pl-4">Architecture Fundamentale</h2>
                    <div className="prose prose-invert prose-lg max-w-none prose-p:text-koudous-text/80 prose-headings:font-display prose-headings:text-white prose-a:text-koudous-primary">
                        {/* If description is pure text, render it. If it's HTML from TipTap, use dangerouslySetInnerHTML */}
                        <div dangerouslySetInnerHTML={{ __html: project.description }} />
                    </div>
                </div>
            </div>

            {/* JOURNAL DE BORD SECTION (ARTICLES LINKED) */}
            {articles && articles.length > 0 && (
                <div className="bg-black/40 border border-white/10 rounded-3xl p-8 md:p-12 mb-20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-koudous-secondary/10 blur-[100px] rounded-full pointer-events-none"></div>

                    <div className="flex items-center gap-4 mb-12">
                        <div className="w-12 h-12 rounded-xl bg-koudous-secondary/20 flex items-center justify-center border border-koudous-secondary/30">
                            <CalendarDays className="text-koudous-secondary" size={24} />
                        </div>
                        <div>
                            <h2 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight">Journal de Production</h2>
                            <p className="text-koudous-text/60 font-mono text-sm mt-1">Évolution & Ingénierie au jour le jour</p>
                        </div>
                    </div>

                    <div className="space-y-12 pl-6 md:pl-8 border-l-2 border-white/10 relative pb-4">
                        {articles.map((article, idx) => (
                            <div key={article.id} className="relative">
                                {/* Timeline Node */}
                                <div className="absolute -left-[35px] md:-left-[43px] w-4 h-4 rounded-full bg-black border-2 border-koudous-secondary flex items-center justify-center top-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-koudous-secondary" />
                                </div>

                                <span className="font-mono text-xs text-koudous-secondary uppercase tracking-widest font-bold mb-2 block">
                                    Jour {idx + 1} • {format(new Date(article.created_at), 'dd MMM yyyy', { locale: fr })}
                                </span>

                                <h3 className="text-2xl font-bold text-white mb-4 hover:text-koudous-primary transition-colors inline-flex items-center gap-3">
                                    <a href={`/articles/${article.slug}`}>{article.title} <ExternalLink size={18} className="opacity-50" /></a>
                                </h3>

                                <p className="text-koudous-text/70 line-clamp-3 mb-4 leading-relaxed">
                                    {/* Extract text from HTML excerpt if necessary, or just display raw if it's plain text */}
                                    {article.excerpt || article.content.replace(/<[^>]*>?/gm, '').substring(0, 200) + '...'}
                                </p>

                                <a href={`/articles/${article.slug}`} className="text-sm font-bold text-koudous-primary border-b border-koudous-primary/30 pb-1 hover:border-koudous-primary transition-colors">
                                    Lire le rapport complet
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </article>
    );
}
