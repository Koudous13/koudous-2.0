import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { GraduationCap, ArrowRight } from "lucide-react";

export const revalidate = 60;

export default async function RealisationsAcademicPage() {
    const supabase = await createClient();

    const { data: projects } = await supabase
        .from("projects")
        .select("*")
        .eq("is_pro", false)
        .order("order_index", { ascending: true });

    return (
        <div className="max-w-6xl mx-auto py-12">
            <div className="mb-16 border-l-4 border-koudous-secondary pl-6 md:pl-8">
                <h1 className="text-5xl md:text-7xl font-display font-extrabold text-white mb-4 tracking-tight leading-none mix-blend-difference uppercase">
                    Recherche &<br />
                    <span className="text-koudous-secondary">Démonstrations Académiques.</span>
                </h1>
                <p className="text-xl text-koudous-text/70 max-w-2xl font-sans mt-6">
                    La preuve de concept précède toujours l'industrie. Exploration théorique, algorithmique pure et implémentations d'état-de-l'art.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {projects?.map((project) => (
                    <Link href={`/projets/${project.slug}`} key={project.id} className="group flex flex-col bg-black/40 border border-white/5 hover:border-koudous-secondary/40 p-6 sm:p-8 rounded-xl transition-all duration-300 relative overflow-hidden">
                        {/* Hover Glow Background */}
                        <div className="absolute -inset-2 bg-gradient-to-r from-koudous-secondary/0 via-koudous-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none transform -translate-x-full group-hover:translate-x-0 duration-1000"></div>

                        <div className="flex justify-between items-start mb-6 z-10">
                            <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center border border-white/10 group-hover:bg-koudous-secondary/20 group-hover:border-koudous-secondary/40 transition-colors">
                                <GraduationCap className="text-koudous-secondary" size={24} />
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold font-display text-white mb-3 z-10 line-clamp-2">
                            {project.title}
                        </h2>

                        <p className="text-koudous-text/70 mb-8 flex-grow z-10 line-clamp-3">
                            {project.short_description}
                        </p>

                        <div className="mt-auto space-y-4 z-10">
                            <div className="flex flex-wrap gap-2">
                                {project.stack_tags?.slice(0, 3).map((tag: string) => (
                                    <span key={tag} className="px-2 py-1 text-[10px] uppercase font-mono tracking-widest text-koudous-secondary border border-koudous-secondary/30 rounded bg-black/50">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <div className="pt-4 border-t border-white/5 flex items-center text-sm font-bold text-white group-hover:text-koudous-secondary transition-colors">
                                Ouvrir le dossier <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </Link>
                ))}

                {projects?.length === 0 && (
                    <div className="col-span-full py-20 text-center border border-dashed border-white/20 rounded-2xl bg-black/20">
                        <GraduationCap size={48} className="mx-auto text-koudous-text/30 mb-4" />
                        <p className="text-koudous-text/60">Les démonstrations académiques seront bientôt publiées.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
