import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Plus, Edit, Trash2, Eye, Server, Layers } from "lucide-react";

export default async function AdminProjectsPage() {
    const supabase = await createClient();

    // Récupérer tous les projets
    const { data: projects, error } = await supabase
        .from("projects")
        .select("*")
        .order("order_index", { ascending: true });

    if (error) {
        console.error("Erreur chargement projets:", error);
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white mb-2">Projets & Architectures</h1>
                    <p className="text-koudous-text/60">Gérez vos réalisations de classe mondiale.</p>
                </div>
                <Link
                    href="/admin/projets/new"
                    className="flex items-center gap-2 bg-koudous-primary text-black px-6 py-3 rounded-lg font-bold hover:shadow-[0_0_15px_var(--color-koudous-primary)] transition-all"
                >
                    <Plus size={20} />
                    <span>Déployer Projet</span>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {projects?.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-koudous-text/40 bg-white/5 rounded-xl border border-white/10">
                        Aucune architecture configurée.
                    </div>
                ) : (
                    projects?.map((project) => (
                        <div key={project.id} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden flex flex-col hover:border-koudous-secondary/50 transition-colors">
                            <div className="h-48 bg-black/50 relative">
                                {project.cover_image ? (
                                    <img src={project.cover_image} alt={project.title} className="w-full h-full object-cover opacity-60" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Layers size={48} className="text-koudous-secondary/20" />
                                    </div>
                                )}
                                <div className="absolute top-4 right-4 flex space-x-2">
                                    <span className={`px-3 py-1 text-xs rounded-full font-bold ${project.is_pro ? 'bg-koudous-primary text-black' : 'bg-koudous-secondary text-white'}`}>
                                        {project.is_pro ? "PRO" : "ACADEMIQUE"}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6 flex-1 flex flex-col">
                                <h3 className="font-display font-bold text-xl text-white mb-2">{project.title}</h3>
                                <p className="text-sm text-koudous-text/70 line-clamp-2 mb-4">
                                    {project.short_description}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-6">
                                    {project.stack_tags?.slice(0, 3).map((tag: string) => (
                                        <span key={tag} className="px-2 py-1 text-[10px] uppercase tracking-wider border border-white/20 rounded text-koudous-text/80">
                                            {tag}
                                        </span>
                                    ))}
                                    {project.stack_tags?.length > 3 && (
                                        <span className="px-2 py-1 text-[10px] border border-transparent text-koudous-text/50">+{project.stack_tags.length - 3}</span>
                                    )}
                                </div>

                                <div className="mt-auto pt-4 border-t border-white/10 flex justify-between items-center">
                                    <span className="text-xs font-mono text-koudous-text/40">/{project.slug}</span>
                                    <div className="flex gap-3">
                                        <Link href={`/projets/${project.slug}`} target="_blank" className="text-koudous-text/60 hover:text-white transition-colors" title="Aperçu">
                                            <Eye size={18} />
                                        </Link>
                                        <Link href={`/admin/projets/${project.id}/edit`} className="text-koudous-text/60 hover:text-koudous-primary transition-colors" title="Câbler (Éditer)">
                                            <Edit size={18} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
