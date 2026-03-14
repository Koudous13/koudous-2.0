import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Plus, Edit, Eye } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function AdminArticlesPage() {
    const supabase = await createClient();

    // Récupérer tous les articles (Order by plus récent)
    const { data: articles, error } = await supabase
        .from("articles")
        .select("*, projects(title)")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Erreur chargement articles:", error);
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white mb-2">Articles & Logs</h1>
                    <p className="text-koudous-text/60">Gérez vos publications, journaux de bord et masterclass.</p>
                </div>
                <Link
                    href="/admin/articles/new"
                    className="flex items-center gap-2 bg-koudous-primary text-black px-6 py-3 rounded-lg font-bold hover:shadow-[0_0_15px_var(--color-koudous-primary)] transition-all"
                >
                    <Plus size={20} />
                    <span>Nouvel Article</span>
                </Link>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl overflow-x-auto">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[800px]">
                        <thead className="bg-black/40 border-b border-white/10 text-xs uppercase text-koudous-text/60">
                            <tr>
                                <th className="px-6 py-4 font-medium">Titre</th>
                                <th className="px-6 py-4 font-medium">Catégorie</th>
                                <th className="px-6 py-4 font-medium">Statut</th>
                                <th className="px-6 py-4 font-medium">Date</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {articles?.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-koudous-text/40">
                                        Aucun article trouvé. Il est temps de documenter l'excellence.
                                    </td>
                                </tr>
                            ) : (
                                articles?.map((article) => (
                                    <tr key={article.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-white mb-1">{article.title}</div>
                                            {article.projects?.title && (
                                                <div className="text-xs text-koudous-primary flex items-center gap-1">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-koudous-primary"></span>
                                                    Lié au projet : {article.projects.title}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-koudous-text/80">
                                                {article.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {article.published ? (
                                                <span className="flex items-center gap-2 text-green-400 text-sm">
                                                    <span className="w-2 h-2 rounded-full bg-green-400"></span>
                                                    Publié
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-2 text-yellow-400 text-sm">
                                                    <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                                                    Brouillon
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-koudous-text/60">
                                            {format(new Date(article.created_at), 'dd MMM yyyy', { locale: fr })}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                <Link href={`/articles/${article.slug}`} target="_blank" className="p-2 text-koudous-text/60 hover:text-white transition-colors" title="Voir (Publique)">
                                                    <Eye size={18} />
                                                </Link>
                                                <Link href={`/admin/articles/${article.id}/edit`} className="p-2 text-koudous-text/60 hover:text-koudous-primary transition-colors" title="Éditer">
                                                    <Edit size={18} />
                                                </Link>
                                                <DeleteButton table="articles" id={article.id} redirectTo="/admin/articles" />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
