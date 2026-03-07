import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Layers, ArrowRight } from "lucide-react";

export const revalidate = 60; // ISR cache

export default async function RealisationsProPage() {
    const supabase = await createClient();

    // order by date or index
    const { data: projects } = await supabase
        .from("projects")
        .select("*")
        .eq("is_pro", true)
        .order("order_index", { ascending: true });

    return (
        <div className="max-w-6xl mx-auto py-12">
            <div className="mb-16">
                <h1 className="text-5xl md:text-8xl font-display font-extrabold text-white mb-6 tracking-tight leading-none mix-blend-difference">
                    Réalisations<br />
                    <span className="text-koudous-primary">Professionnelles.</span>
                </h1>
                <p className="text-xl md:text-2xl text-koudous-text/70 max-w-3xl font-sans leading-relaxed">
                    Le hub de la souveraineté architecturale. Systèmes distribués, pipelines RAG autonomes et infrastructures de pointe déployés en production.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {projects?.map((project) => (
                    <Link href={`/projets/${project.slug}`} key={project.id} className="group block bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-koudous-primary/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(255,127,17,0.1)]">
                        <div className="h-64 sm:h-80 bg-black/60 relative overflow-hidden">
                            {project.cover_image ? (
                                <img
                                    src={project.cover_image}
                                    alt={project.title}
                                    className="w-full h-full object-cover opacity-50 group-hover:scale-105 group-hover:opacity-70 transition-all duration-700"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-black to-koudous-secondary/20">
                                    <Layers size={64} className="text-white/10 group-hover:text-koudous-primary/20 transition-colors" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

                            <div className="absolute bottom-0 left-0 p-8 w-full">
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {project.stack_tags?.map((tag: string) => (
                                        <span key={tag} className="px-3 py-1 text-xs uppercase tracking-widest font-bold bg-white/10 text-white backdrop-blur-md border border-white/20 rounded-full">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <h2 className="text-3xl font-display font-bold text-white mb-2 group-hover:text-koudous-primary transition-colors">
                                    {project.title}
                                </h2>
                                <div className="flex items-center gap-2 text-koudous-text/60 group-hover:text-white transition-colors">
                                    <span className="font-mono text-sm">Lire l'Architecture</span>
                                    <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}

                {projects?.length === 0 && (
                    <div className="col-span-full py-20 text-center border border-white/10 rounded-2xl bg-white/5">
                        <Layers size={48} className="mx-auto text-koudous-text/20 mb-4" />
                        <p className="text-koudous-text/60 text-lg">Le déploiement des architectures pro est en cours de synchronisation.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
