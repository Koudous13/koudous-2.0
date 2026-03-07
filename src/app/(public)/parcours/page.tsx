import { createClient } from "@/utils/supabase/server";
import { Briefcase, GraduationCap, Sparkles } from "lucide-react";

export const revalidate = 60; // Revalidate every minute

export default async function ParcoursPage() {
    const supabase = await createClient();

    const { data: steps } = await supabase
        .from("timeline_steps")
        .select("*")
        .order("order_index", { ascending: false });

    return (
        <div className="max-w-4xl mx-auto py-12">
            <div className="mb-16 text-center">
                <h1 className="text-5xl md:text-7xl font-display font-extrabold text-white mb-6 tracking-tight">
                    L'Ascension.
                </h1>
                <p className="text-xl text-koudous-text/70 max-w-2xl mx-auto font-sans leading-relaxed">
                    Trajectoire algorithmique. De la théorie académique à la souveraineté architecturale en production.
                </p>
            </div>

            <div className="relative border-l-2 border-koudous-secondary/20 ml-4 md:ml-12 space-y-16 pb-12">
                {steps?.map((step, index) => (
                    <div key={step.id} className="relative pl-8 md:pl-16 group">
                        {/* Timeline Dot */}
                        <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-koudous-bg border-2 border-koudous-primary flex items-center justify-center group-hover:scale-125 transition-transform duration-300 shadow-[0_0_10px_var(--color-koudous-primary)]">
                            <div className="w-1.5 h-1.5 rounded-full bg-koudous-primary" />
                        </div>

                        <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-8">
                            {/* Context Column */}
                            <div className="md:w-1/4 pt-1 flex flex-col items-start">
                                <span className="font-mono text-lg text-koudous-primary font-bold mb-1">
                                    {step.period}
                                </span>
                                <span className="text-sm font-bold text-white bg-white/10 px-3 py-1 rounded-full mb-3 flex items-center gap-2">
                                    {step.category === 'Professionnel' && <Briefcase size={14} />}
                                    {step.category === 'Académique' && <GraduationCap size={14} />}
                                    {step.category === 'Personnel' && <Sparkles size={14} />}
                                    {step.category}
                                </span>
                                <span className="text-sm text-koudous-text/60 font-medium">
                                    {step.location}
                                </span>
                            </div>

                            {/* Content Column */}
                            <div className="md:w-3/4 bg-white/5 border border-white/10 p-6 md:p-8 rounded-2xl group-hover:border-koudous-secondary/50 transition-colors">
                                <h3 className="text-2xl font-display font-bold text-white mb-4">
                                    {step.title}
                                </h3>
                                <p className="text-koudous-text/80 leading-relaxed whitespace-pre-wrap">
                                    {step.description}
                                </p>

                                {step.image_url && (
                                    <div className="mt-6 rounded-lg overflow-hidden border border-white/10 opacity-80 group-hover:opacity-100 transition-opacity">
                                        <img src={step.image_url} alt={step.title} className="w-full h-auto object-cover max-h-64" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {steps?.length === 0 && (
                    <div className="pl-8 text-koudous-text/40 italic">
                        La timeline est en cours de synchronisation.
                    </div>
                )}
            </div>
        </div>
    );
}
