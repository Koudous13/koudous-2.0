import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Plus, Edit } from "lucide-react";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function AdminEchecsPage() {
    const supabase = await createClient();

    const { data: failures, error } = await supabase
        .from("failures")
        .select("*")
        .order("order_index", { ascending: true });

    if (error) {
        console.error("Erreur chargement échecs:", error);
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white mb-2">Les Leçons de Guerre (Échecs)</h1>
                    <p className="text-koudous-text/60">L'échec n'est qu'une donnée d'apprentissage du système.</p>
                </div>
                <Link
                    href="/admin/echecs/new"
                    className="flex items-center gap-2 bg-koudous-secondary text-white px-6 py-3 rounded-lg font-bold hover:bg-white hover:text-black transition-all"
                >
                    <Plus size={20} />
                    <span>Renseigner un Échec</span>
                </Link>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl overflow-x-auto">
                <table className="w-full text-left min-w-[800px]">
                    <thead className="bg-black/40 border-b border-white/10 text-xs uppercase text-koudous-text/60">
                        <tr>
                            <th className="px-6 py-4 font-medium">Le Fait Brut</th>
                            <th className="px-6 py-4 font-medium">La Leçon (Algorithme)</th>
                            <th className="px-6 py-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {failures?.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="px-6 py-8 text-center text-koudous-text/40">
                                    Aucun échec enregistré.
                                </td>
                            </tr>
                        ) : (
                            failures?.map((failure) => (
                                <tr key={failure.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 w-1/3">
                                        <div className="font-bold text-white mb-1">{failure.title}</div>
                                        <div className="text-xs font-mono text-koudous-secondary mb-2">{failure.period}</div>
                                        <p className="text-sm text-koudous-text/70 line-clamp-2">{failure.context}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-koudous-text italic border-l-2 border-koudous-primary/50 pl-4 py-1">
                                            "{failure.lessons_learned}"
                                        </p>
                                    </td>
                                    <td className="px-6 py-4 text-right align-top">
                                        <div className="flex items-center justify-end gap-3">
                                            <Link href={`/admin/echecs/${failure.id}/edit`} className="p-2 text-koudous-text/60 hover:text-koudous-primary transition-colors"><Edit size={18} /></Link>
                                            <DeleteButton table="failures" id={failure.id} redirectTo="/admin/echecs" />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
