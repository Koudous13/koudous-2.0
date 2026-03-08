import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import Image from "next/image";

export const revalidate = 60;

export default async function ArticleDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params;
    const supabase = await createClient();

    const { data: article } = await supabase
        .from("articles")
        .select("*, projects(title, slug)")
        .eq("slug", slug)
        .single();

    if (!article || !article.published) {
        notFound();
    }

    return (
        <article className="max-w-3xl mx-auto py-12 md:py-20 px-4 md:px-0">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "TechArticle",
                        "headline": article.title,
                        "image": article.cover_image ? [article.cover_image] : [],
                        "datePublished": article.created_at,
                        "dateModified": article.updated_at || article.created_at,
                        "author": {
                            "@type": "Person",
                            "name": "Koudous DAOUDA",
                            "url": "https://koudous-2-0.vercel.app"
                        }
                    })
                }}
            />
            {/* HEADER */}<Link href="/articles" className="inline-flex items-center gap-2 text-koudous-text/60 hover:text-white mb-12 font-mono text-sm transition-colors border-b border-white/10 pb-1">
                <ArrowLeft size={16} /> Retour à l'Index Littéraire
            </Link>

            <header className="mb-16">
                <div className="flex flex-wrap items-center gap-4 mb-8">
                    <time className="font-mono text-koudous-primary font-bold tracking-widest uppercase">
                        {format(new Date(article.created_at), 'dd LLLL yyyy', { locale: fr })}
                    </time>
                    {article.projects && (
                        <Link href={`/projets/${article.projects.slug}`} className="px-4 py-1.5 bg-koudous-secondary/20 border border-koudous-secondary/40 text-koudous-secondary font-mono text-[11px] uppercase tracking-widest rounded-full hover:bg-koudous-secondary hover:text-black transition-colors">
                            Journal de bord : {article.projects.title}
                        </Link>
                    )}
                </div>

                <h1 className="text-4xl md:text-6xl font-display font-extrabold text-white leading-tight mb-8">
                    {article.title}
                </h1>

                {article.cover_image && (
                    <div className="relative w-full aspect-[21/9] bg-white/5 border border-white/10 rounded-2xl overflow-hidden mb-16 shadow-2xl">
                        <Image
                            src={article.cover_image}
                            alt={article.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 768px"
                            priority
                        />
                    </div>
                )}
            </header>

            {/* ARTICLE CONTENT : using Prose from Tailwind Typography */}
            <div
                className="prose prose-invert prose-lg max-w-none 
                  prose-p:text-koudous-text/90 prose-p:leading-relaxed 
                  prose-headings:font-display prose-headings:text-white 
                  prose-a:text-koudous-primary prose-a:no-underline hover:prose-a:underline
                  prose-img:rounded-xl prose-img:border prose-img:border-white/10
                  prose-pre:bg-black/60 prose-pre:border prose-pre:border-white/10
                  prose-code:text-koudous-secondary prose-code:bg-koudous-secondary/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                  prose-blockquote:border-l-4 prose-blockquote:border-koudous-primary prose-blockquote:bg-koudous-primary/5 prose-blockquote:py-2 prose-blockquote:pl-6 prose-blockquote:italic"
                dangerouslySetInnerHTML={{ __html: article.content }}
            />

            <div className="mt-20 pt-10 border-t border-white/10 flex items-center gap-4">
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                    <BookOpen className="text-koudous-text/50" />
                </div>
                <p className="font-mono text-sm text-koudous-text/60 italic">
                    Fin de l'enregistrement.
                </p>
            </div>

        </article>
    );
}
