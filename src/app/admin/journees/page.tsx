import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Plus, Trash2, CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default async function AdminJourneesPage() {
    const supabase = await createClient();

    const { data: entries, error } = await supabase
        .from("journal_entries")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Erreur chargement journées:", error);
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white mb-2">Micro-Blogging (Mes Journées)</h1>
                    <p className="text-koudous-text/60">Histoires brutes, pensées algorithmiques et Vibe Coding.</p>
                </div>
                <Link
                    href="/admin/journees/new"
                    className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-lg font-bold hover:bg-koudous-text transition-all"
                >
                    <Plus size={20} />
                    <span>Nouvelle Pensée</span>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {entries?.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-koudous-text/40 bg-white/5 rounded-xl border border-white/10">
                        Le journal est vide. Initialisez le premier log.
                    </div>
                ) : (
                    entries?.map((entry) => (
                        <div key={entry.id} className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col hover:border-koudous-primary/30 transition-colors">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-2 text-koudous-primary text-sm font-mono">
                                    <CalendarDays size={16} />
                                    {format(new Date(entry.created_at), "dd MMM yyyy • HH:mm", { locale: fr })}
                                </div>
                                <button className="text-koudous-text/40 hover:text-red-400 transition-colors">
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <p className="text-white text-base leading-relaxed mb-6 whitespace-pre-wrap flex-1">
                                {entry.content}
                            </p>

                            <div className="mt-auto pt-4 border-t border-white/10 text-right">
                                <span className="text-xs font-mono text-koudous-text/50">
                                    {entry.mood_tag || "#Journal"}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
