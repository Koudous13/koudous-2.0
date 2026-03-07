import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { PenTool, ArrowRight } from "lucide-react";

export const revalidate = 60; // 1 minute cache

export default async function ArticlesPage() {
    const supabase = await createClient();

    // Fetch all published articles with valid slugs
    const { data: articles } = await supabase
        .from("articles")
        .select("*, projects(title, slug)")
        .eq("published", true)
        .neq("slug", "")
        .not("slug", "is", null)
        .order("created_at", { ascending: false });


    return (
        <div className="max-w-4xl mx-auto py-12">
            <div className="mb-20 text-center">
                <h1 className="text-5xl md:text-8xl font-display font-extrabold text-white mb-6">
                    Littérature<span className="text-koudous-primary">.</span>
                </h1>
                <p className="text-xl text-koudous-text/70 max-w-2xl mx-auto font-sans">
                    Codex technique, architecture logicielle et réflexions sur l'automatisation.
                </p>
            </div>

            <div className="space-y-12">
                {articles?.map((article) => (
                    <article key={article.id} className="group relative bg-black/40 border border-white/5 p-8 md:p-12 rounded-3xl hover:border-koudous-primary/20 transition-all duration-300">
                        {/* Tag/Date */}
                        <div className="flex flex-wrap items-center gap-4 mb-6">
                            <time className="font-mono text-sm text-koudous-text/50">
                                {format(new Date(article.created_at), 'dd MMMM yyyy', { locale: fr })}
                            </time>

                            {/* Linked project badge if it exists */}
                            {article.projects && (
                                <Link href={`/projets/${article.projects.slug}`} className="px-3 py-1 bg-koudous-secondary/10 border border-koudous-secondary/30 text-koudous-secondary font-mono text-[10px] uppercase tracking-widest rounded-full hover:bg-koudous-secondary hover:text-black transition-colors">
                                    Dans le cadre du projet : {article.projects.title}
                                </Link>
                            )}
                        </div>

                        <Link href={`/articles/${article.slug}`}>
                            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4 group-hover:text-koudous-primary transition-colors cursor-pointer">
                                {article.title}
                            </h2>
                        </Link>

                        <p className="text-koudous-text/80 text-lg leading-relaxed mb-8">
                            {article.excerpt || article.content.replace(/<[^>]*>?/gm, '').substring(0, 250) + "..."}
                        </p>

                        <Link href={`/articles/${article.slug}`} className="inline-flex items-center gap-2 font-bold font-mono uppercase tracking-widest text-koudous-primary border-b border-koudous-primary/30 pb-1 hover:border-koudous-primary transition-all group/link">
                            Lire l'entrée
                            <ArrowRight size={18} className="group-hover/link:translate-x-2 transition-transform" />
                        </Link>
                    </article>
                ))}

                {articles?.length === 0 && (
                    <div className="text-center py-24 bg-white/5 border border-white/10 rounded-3xl">
                        <PenTool size={48} className="mx-auto text-koudous-text/20 mb-4" />
                        <p className="text-koudous-text/60">Les archives sont en cours de rédaction.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
