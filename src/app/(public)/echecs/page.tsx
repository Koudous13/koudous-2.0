import { createClient } from "@/utils/supabase/server";
import { AlertTriangle, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { FadeUp } from "@/components/animations";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Mes Échecs — Le Registre",
    description: "Cicatrices d'architecte. Les erreurs monumentales, les systèmes effondrés et les leçons de guerre brutes de Koudous DAOUDA.",
};

export const revalidate = 60;

export default async function EchecsPage() {
    const supabase = await createClient();

    const { data: echecs } = await supabase
        .from("failures")
        .select("*")
        .order("created_at", { ascending: false });

    return (
        <div className="max-w-4xl mx-auto py-12">
            <FadeUp>
                <div className="mb-20 text-center">
                    <h1 className="text-5xl md:text-8xl font-display font-extrabold text-white mb-6">
                        Mes Échecs<span className="text-red-500">.</span>
                    </h1>
                    <p className="text-xl text-koudous-text/70 max-w-2xl mx-auto font-sans">
                        Cicatrices d'architecte. Les erreurs monumentales, les systèmes effondrés et les leçons de guerre brutes.
                    </p>
                </div>
            </FadeUp>

            <div className="space-y-12">
                {echecs?.map((echec) => (
                    <div key={echec.id} className="relative bg-[#0a0a0a] border border-red-500/20 p-8 md:p-12 rounded-2xl overflow-hidden group">

                        {/* Warning Glow Effect */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-[100px] rounded-full pointer-events-none group-hover:bg-red-500/10 transition-colors"></div>

                        <div className="flex items-start gap-6">
                            <div className="hidden sm:flex shrink-0 w-16 h-16 rounded-full border border-red-500/30 bg-red-500/10 items-center justify-center">
                                <AlertTriangle className="text-red-500/80" size={32} />
                            </div>

                            <div className="flex-1">
                                <div className="flex flex-wrap items-center justify-between gap-4 mb-4 border-b border-white/5 pb-4">
                                    <h2 className="text-2xl md:text-3xl font-display font-bold text-white group-hover:text-red-400 transition-colors">
                                        {echec.title}
                                    </h2>
                                    <time className="font-mono text-sm text-koudous-text/40">
                                        {format(new Date(echec.created_at), 'dd MMM yyyy', { locale: fr })}
                                    </time>
                                </div>

                                <div className="mb-8">
                                    <h3 className="font-mono tracking-widest uppercase text-xs text-koudous-text/40 mb-2">Le Contexte / Le Crash</h3>
                                    <div
                                        className="text-koudous-text/80 leading-relaxed bg-black/50 p-6 rounded-xl border border-white/5 prose prose-invert prose-sm max-w-none"
                                        dangerouslySetInnerHTML={{ __html: echec.context || "" }}
                                    />
                                </div>

                                <div>
                                    <h3 className="font-mono tracking-widest uppercase text-xs text-red-500/60 mb-2 flex items-center gap-2">
                                        <TrendingUp size={14} /> La Leçon Tirée
                                    </h3>
                                    <div className="prose prose-invert prose-p:text-white/90 prose-p:leading-relaxed border-l-2 border-red-500/50 pl-6 py-2">
                                        <div dangerouslySetInnerHTML={{ __html: echec.lessons_learned }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {echecs?.length === 0 && (
                    <div className="text-center py-20 border border-white/5 rounded-2xl bg-black/20">
                        <AlertTriangle size={48} className="mx-auto text-koudous-text/20 mb-4" />
                        <p className="text-koudous-text/60">Le registre des échecs est actuellement vide.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
