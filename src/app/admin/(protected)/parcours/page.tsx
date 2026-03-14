import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Plus, Edit } from "lucide-react";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function AdminParcoursPage() {
    const supabase = await createClient();

    // order par order_index ou par created_at
    const { data: steps, error } = await supabase
        .from("timeline_steps")
        .select("*")
        .order("order_index", { ascending: true });

    if (error) {
        console.error("Erreur chargement parcours:", error);
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white mb-2">Timeline (Parcours)</h1>
                    <p className="text-koudous-text/60">Tracez l'histoire de votre ascension.</p>
                </div>
                <Link
                    href="/admin/parcours/new"
                    className="flex items-center gap-2 bg-koudous-primary text-black px-6 py-3 rounded-lg font-bold hover:shadow-[0_0_15px_var(--color-koudous-primary)] transition-all"
                >
                    <Plus size={20} />
                    <span>Ajouter Étape</span>
                </Link>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl overflow-x-auto">
                <table className="w-full text-left min-w-[600px]">
                    <thead className="bg-black/40 border-b border-white/10 text-xs uppercase text-koudous-text/60">
                        <tr>
                            <th className="px-6 py-4 font-medium">Période</th>
                            <th className="px-6 py-4 font-medium">Titre</th>
                            <th className="px-6 py-4 font-medium">Catégorie</th>
                            <th className="px-6 py-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {steps?.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-koudous-text/40">
                                    Aucune étape n'a encore été documentée.
                                </td>
                            </tr>
                        ) : (
                            steps?.map((step) => (
                                <tr key={step.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-mono text-sm text-koudous-primary">
                                        {step.period}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-white">{step.title}</div>
                                        <div className="text-xs text-koudous-text/50">{step.location}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-koudous-text/80">
                                            {step.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <Link href={`/admin/parcours/${step.id}/edit`} className="p-2 text-koudous-text/60 hover:text-koudous-primary transition-colors"><Edit size={18} /></Link>
                                            <DeleteButton table="timeline_steps" id={step.id} redirectTo="/admin/parcours" />
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
