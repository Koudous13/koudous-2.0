import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { ArrowRight, Layers, Activity, BrainCircuit } from "lucide-react";

export const revalidate = 60;

export default async function Home() {
  const supabase = await createClient();

  // Fetch some quick stats for the bento grid
  const [
    { count: proCount },
    { count: articleCount },
    { count: journalCount }
  ] = await Promise.all([
    supabase.from("projects").select("*", { count: "exact", head: true }).eq("is_pro", true),
    supabase.from("articles").select("*", { count: "exact", head: true }).eq("published", true),
    supabase.from("journal_entries").select("*", { count: "exact", head: true })
  ]);

  return (
    <main className="min-h-screen flex flex-col pt-12 md:pt-24 relative overflow-hidden">

      {/* BACKGROUND TEXTURE */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--color-koudous-secondary)_0%,_transparent_40%)] opacity-5 pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--color-koudous-primary)_0%,_transparent_30%)] opacity-5 pointer-events-none"></div>

      {/* HERO SECTION */}
      <section className="relative z-10 text-center px-4 max-w-5xl mx-auto mb-32">
        <h1 className="font-display font-extrabold text-7xl md:text-[9rem] lg:text-[11rem] text-koudous-text tracking-tighter mix-blend-difference mb-2 leading-none uppercase">
          KOUDOUS
        </h1>
        <h2 className="font-display font-extrabold text-5xl md:text-8xl lg:text-9xl tracking-tighter mix-blend-difference mb-8">
          <span className="text-transparent bg-clip-text bg-gradient-to-br from-koudous-primary to-koudous-secondary">DAOUDA</span>
        </h2>

        <div className="h-12 flex justify-center items-center mt-6">
          <p className="font-mono text-xl md:text-2xl text-koudous-text/80 font-bold tracking-widest uppercase">
            &lt;AI & Automation Pioneer /&gt;
          </p>
        </div>

        <p className="mt-8 text-xl md:text-2xl text-koudous-text/70 max-w-3xl mx-auto font-sans leading-relaxed">
          Je conçois et déploie des systèmes intelligents et des architectures d'automatisation de pointe.
          L'excellence technique souveraine, sans compromis.
        </p>

        <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link href="/realisations-pro" className="px-10 py-5 bg-koudous-primary text-black font-bold uppercase tracking-widest text-sm rounded-none hover:bg-white transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(255,127,17,0.3)]">
            Accéder aux Architectures Pro
          </Link>
          <Link href="/parcours" className="px-10 py-5 text-white font-bold uppercase tracking-widest text-sm border border-white/20 hover:border-koudous-primary hover:text-koudous-primary transition-colors">
            Étudier le Parcours
          </Link>
        </div>
      </section>

      {/* STATS & QUICK LINKS BENTO GRID */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 w-full mb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <Link href="/realisations-pro" className="group bg-black/40 border border-white/10 p-8 rounded-2xl hover:border-koudous-primary/50 transition-all">
            <Layers className="text-koudous-primary mb-6" size={32} />
            <p className="font-mono text-4xl text-white font-bold mb-2">{proCount || 0}</p>
            <h3 className="font-display text-xl text-koudous-text/80 group-hover:text-white transition-colors">Systèmes de Production</h3>
            <p className="text-sm text-koudous-text/50 mt-4 flex items-center gap-2 font-mono uppercase tracking-widest">
              Explorer <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </p>
          </Link>

          <Link href="/articles" className="group bg-black/40 border border-white/10 p-8 rounded-2xl hover:border-koudous-secondary/50 transition-all">
            <BrainCircuit className="text-koudous-secondary mb-6" size={32} />
            <p className="font-mono text-4xl text-white font-bold mb-2">{articleCount || 0}</p>
            <h3 className="font-display text-xl text-koudous-text/80 group-hover:text-white transition-colors">Rapports d'Ingénierie</h3>
            <p className="text-sm text-koudous-text/50 mt-4 flex items-center gap-2 font-mono uppercase tracking-widest">
              Lire les archives <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </p>
          </Link>

          <Link href="/journees" className="group bg-black/40 border border-white/10 p-8 rounded-2xl hover:border-white/50 transition-all">
            <Activity className="text-white/60 mb-6" size={32} />
            <p className="font-mono text-4xl text-white font-bold mb-2">{journalCount || 0}</p>
            <h3 className="font-display text-xl text-koudous-text/80 group-hover:text-white transition-colors">Logs Quotidiens</h3>
            <p className="text-sm text-koudous-text/50 mt-4 flex items-center gap-2 font-mono uppercase tracking-widest">
              Suivre le journal <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </p>
          </Link>

        </div>
      </section>

    </main>
  );
}
