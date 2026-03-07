import { createClient } from "@/utils/supabase/server";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Fingerprint, Clock } from "lucide-react";

export const revalidate = 60;

export default async function JourneesPage() {
    const supabase = await createClient();

    const { data: journees } = await supabase
        .from("journal_entries")
        .select("*")
        .order("created_at", { ascending: false });

    return (
        <div className="max-w-3xl mx-auto py-12">
            <div className="mb-20">
                <h1 className="text-5xl md:text-8xl font-display font-extrabold text-white mb-6 tracking-tighter mix-blend-difference">
                    Mes <span className="text-transparent bg-clip-text bg-gradient-to-r from-koudous-primary to-koudous-secondary">Journées.</span>
                </h1>
                <p className="text-xl text-koudous-text/70 font-sans border-l-4 border-koudous-primary pl-4">
                    Micro-blogging constant. Le fil de pensée, des trouvailles brutes aux notes d'évolution quotidienne.
                </p>
            </div>

            <div className="space-y-12">
                {journees?.map((journee) => (
                    <div key={journee.id} className="group relative pl-8 md:pl-12 border-l border-white/10">

                        {/* Timeline Indicator */}
                        <div className="absolute left-[-5px] top-6 w-2.5 h-2.5 rounded-full bg-koudous-primary shadow-[0_0_10px_var(--color-koudous-primary)] group-hover:scale-150 transition-transform"></div>

                        <div className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-2xl hover:bg-white/10 transition-colors">
                            <header className="flex flex-wrap items-center justify-between gap-4 mb-4">
                                <div className="flex items-center gap-2 text-koudous-primary font-mono text-sm tracking-widest font-bold">
                                    <Clock size={16} />
                                    <time>
                                        {format(new Date(journee.created_at), "dd MMM yyyy '::' HH:mm", { locale: fr })}
                                    </time>
                                </div>

                                <div className="flex gap-2">
                                    {journee.mood_tags?.map((tag: string) => (
                                        <span key={tag} className="px-2 py-0.5 bg-black/50 border border-white/20 text-koudous-text/60 text-xs rounded uppercase font-mono tracking-wider">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </header>

                            <div
                                className="prose prose-invert prose-p:text-koudous-text/90 prose-p:leading-relaxed prose-a:text-koudous-secondary"
                                dangerouslySetInnerHTML={{ __html: journee.content }}
                            />
                        </div>

                    </div>
                ))}

                {journees?.length === 0 && (
                    <div className="text-center py-20 border border-white/5 rounded-2xl bg-black/20">
                        <Fingerprint size={48} className="mx-auto text-koudous-text/20 mb-4" />
                        <p className="text-koudous-text/60">Le journal est actuellement vide.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
