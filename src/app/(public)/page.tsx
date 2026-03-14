import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { ArrowRight, Layers, BrainCircuit, MapPin, ExternalLink, Image as ImgIcon, ChevronRight, Github, Code, MessageSquare, Briefcase } from "lucide-react";
import { FadeUp, FadeStagger, FadeItem, SlideIn, CountUp } from "@/components/animations";
import type { Metadata } from "next";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Image from "next/image";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Koudous DAOUDA — AI & Automation Pioneer",
  description: "Je conçois et déploie des systèmes intelligents et des architectures d'automatisation de pointe. Découvrez mes projets, articles et parcours.",
  verification: { google: "tTX2xPfdQdOttFP0z0aFmSX3dGGOBXSBMeGGBW3utRI" },
  openGraph: {
    title: "Koudous DAOUDA — AI & Automation Pioneer",
    description: "Systèmes IA, automatisation et architectures souveraines. L'excellence technique sans compromis.",
    url: "https://koudous-2-0.vercel.app",
    siteName: "KOUDOUS",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Koudous DAOUDA — AI & Automation Pioneer",
    description: "Systèmes IA & Automatisation. Portfolio de Koudous DAOUDA.",
  },
};

export default async function Home() {
  const supabase = await createClient();

  const [
    { data: settings },
    { count: proCount },
    { count: articleCount },
    { count: gallerieCount },
    { count: journalCount },
    { data: featuredProjects },
    { data: latestArticles },
    { data: timelineSteps },
    { data: galleryPreviews },
  ] = await Promise.all([
    supabase.from("site_settings").select("hero_text, total_projects, total_articles, total_workflows").limit(1).maybeSingle(),
    supabase.from("projects").select("*", { count: "exact", head: true }).eq("is_pro", true),
    supabase.from("articles").select("*", { count: "exact", head: true }).eq("published", true),
    supabase.from("gallery").select("*", { count: "exact", head: true }),
    supabase.from("journal_entries").select("*", { count: "exact", head: true }),
    supabase.from("projects").select("id, title, slug, short_description, cover_image, stack_tags, is_pro").order("created_at", { ascending: false }).limit(3),
    supabase.from("articles").select("id, title, slug, excerpt, category, created_at, cover_image").eq("published", true).neq("slug", "").not("slug", "is", null).order("created_at", { ascending: false }).limit(3),
    supabase.from("timeline_steps").select("id, title, period, category, location").order("order_index", { ascending: false }).limit(3),
    supabase.from("gallery").select("id, image_url, title, category").order("created_at", { ascending: false }).limit(3),
  ]);

  const heroText = settings?.hero_text || "Je conçois et déploie des systèmes intelligents et des architectures d'automatisation de pointe.";
  const statsProjects = Math.max(settings?.total_projects || 0, proCount || 0);
  const statsArticles = Math.max(settings?.total_articles || 0, articleCount || 0);

  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Koudous DAOUDA",
            "url": "https://koudous-2-0.vercel.app",
            "image": "https://avatars.githubusercontent.com/Koudous13",
            "jobTitle": "Data Scientist & Systems Architect",
            "sameAs": [
              "https://github.com/Koudous13",
              "mailto:Koudouspro13@gmail.com"
            ]
          })
        }}
      />

      {/* ─── BACKGROUND GLOW ─── */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--color-koudous-secondary)_0%,_transparent_60%)] opacity-[0.04] pointer-events-none z-0" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--color-koudous-primary)_0%,_transparent_50%)] opacity-[0.06] pointer-events-none z-0" />

      {/* ════════════════════════════════════════════
          SECTION 1 — HERO
      ════════════════════════════════════════════ */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20 pb-32">

        {/* Status badge */}
        <FadeUp>
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-10">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="font-mono text-xs text-koudous-text/60 uppercase tracking-widest">Disponible · Ouvert aux projets</span>
          </div>
        </FadeUp>

        {/* Profile photo */}
        <FadeUp delay={0.05}>
          <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-2 border-koudous-primary/40 shadow-[0_0_40px_rgba(255,127,17,0.15)] mb-8 mx-auto bg-gradient-to-br from-koudous-primary/30 to-koudous-secondary/30 flex items-center justify-center">
            <Image
              src="https://avatars.githubusercontent.com/Koudous13"
              alt="Koudous DAOUDA"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 112px, 144px"
              priority
            />
          </div>
        </FadeUp>

        {/* Name — taille réduite pour ne pas couper les lettres */}
        <FadeUp delay={0.1}>
          <h1 className="font-display font-extrabold leading-none tracking-tighter uppercase mb-0">
            <span className="block text-[12vw] md:text-[9vw] lg:text-[8vw] text-white opacity-95">KOUDOUS</span>
            <span className="block text-[10vw] md:text-[7.5vw] lg:text-[6.5vw] text-transparent bg-clip-text bg-gradient-to-br from-koudous-primary via-orange-400 to-koudous-secondary">DAOUDA</span>
          </h1>
        </FadeUp>

        {/* Tag */}
        <FadeUp delay={0.2}>
          <p className="font-mono text-sm md:text-base text-koudous-text/50 font-bold tracking-[0.3em] uppercase mt-6 mb-8">
            &lt; AI &amp; Automation Pioneer /&gt;
          </p>
        </FadeUp>

        {/* Hero text */}
        <FadeUp delay={0.3}>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-koudous-text/70 font-sans leading-relaxed mb-10">
            {heroText}
          </p>
        </FadeUp>

        {/* CTAs — GitHub au centre */}
        <FadeUp delay={0.45}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://github.com/Koudous13"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 px-8 py-4 bg-white text-black font-bold uppercase tracking-widest text-sm hover:bg-koudous-primary transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,127,17,0.4)] hover:-translate-y-0.5"
            >
              <Github size={18} />
              Mon GitHub
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <Link href="/realisations-pro" className="flex items-center gap-3 px-8 py-4 text-white font-bold uppercase tracking-widest text-sm border border-white/20 hover:border-koudous-primary hover:text-koudous-primary transition-all duration-300">
              Voir mes Projets
            </Link>
          </div>
        </FadeUp>

        {/* Scroll indicator */}
        <FadeUp delay={0.6}>
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
            <div className="w-px h-12 bg-gradient-to-b from-transparent to-koudous-primary/50" />
            <span className="font-mono text-[10px] text-koudous-text/30 uppercase tracking-widest">Scroll</span>
          </div>
        </FadeUp>
      </section>

      {/* ════════════════════════════════════════════
          SECTION 2 — STATS
      ════════════════════════════════════════════ */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 w-full py-24 border-t border-white/5">
        <FadeStagger className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 rounded-2xl overflow-hidden" staggerDelay={0.08}>
          {[
            { value: statsProjects, label: "Projets Pro", sub: "en production", href: "/realisations-pro" },
            { value: statsArticles, label: "Articles", sub: "publiés", href: "/articles" },
            { value: gallerieCount || 0, label: "Photos", sub: "dans la galerie", href: "/galerie" },
            { value: journalCount || 0, label: "Journées", sub: "documentées", href: "/journees" },
          ].map(({ value, label, sub, href }) => (
            <FadeItem key={label}>
              <Link href={href} className="group flex flex-col items-center justify-center py-12 px-6 bg-koudous-bg hover:bg-white/[0.03] transition-colors text-center">
                <span className="font-display text-5xl md:text-7xl font-extrabold text-white group-hover:text-koudous-primary transition-colors">{value}</span>
                <span className="font-bold text-koudous-text/80 mt-2 text-sm">{label}</span>
                <span className="font-mono text-xs text-koudous-text/30 uppercase tracking-widest">{sub}</span>
              </Link>
            </FadeItem>
          ))}
        </FadeStagger>
      </section>

      {/* ════════════════════════════════════════════
          SECTION 3 — FEATURED PROJECTS
      ════════════════════════════════════════════ */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 w-full py-24">
        <FadeUp>
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="font-mono text-xs text-koudous-primary uppercase tracking-widest mb-2">// Ce que je construis</p>
              <h2 className="text-3xl md:text-5xl font-display font-extrabold text-white">Récents Projets</h2>
            </div>
            <Link href="/realisations-pro" className="hidden md:flex items-center gap-2 text-koudous-text/50 hover:text-white transition-colors font-mono text-sm">
              Voir tout <ChevronRight size={16} />
            </Link>
          </div>
        </FadeUp>

        {featuredProjects && featuredProjects.length > 0 ? (
          <FadeStagger className="grid grid-cols-1 md:grid-cols-3 gap-6" staggerDelay={0.1}>
            {featuredProjects.map((project) => (
              <FadeItem key={project.id}>
                <Link href={`/projets/${project.slug}`} className="group flex flex-col bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden hover:border-koudous-primary/50 transition-all duration-300 hover:-translate-y-1 h-full">
                  {/* Cover */}
                  <div className="relative aspect-video bg-black/40 overflow-hidden">
                    {project.cover_image ? (
                      <Image
                        src={project.cover_image}
                        alt={project.title}
                        fill
                        className="object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-koudous-primary/10 to-koudous-secondary/10">
                        <Layers className="text-koudous-primary/40" size={48} />
                      </div>
                    )}
                    {project.is_pro && (
                      <span className="absolute top-3 left-3 bg-koudous-primary text-black text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">PRO</span>
                    )}
                  </div>
                  {/* Content */}
                  <div className="flex flex-col flex-1 p-6">
                    <h3 className="text-lg font-display font-bold text-white mb-2 group-hover:text-koudous-primary transition-colors">{project.title}</h3>
                    <p className="text-koudous-text/60 text-sm leading-relaxed mb-4 flex-1">{project.short_description}</p>
                    {project.stack_tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {project.stack_tags.slice(0, 4).map((tag: string) => (
                          <span key={tag} className="font-mono text-[10px] text-koudous-text/40 border border-white/10 px-2 py-0.5 rounded">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              </FadeItem>
            ))}
          </FadeStagger>
        ) : (
          <div className="text-center py-20 border border-white/5 rounded-2xl">
            <Layers size={40} className="mx-auto text-white/10 mb-4" />
            <p className="text-koudous-text/30 text-sm">Les projets sont en cours d'ajout.</p>
          </div>
        )}

        <FadeUp delay={0.3}>
          <div className="mt-8 text-center md:hidden">
            <Link href="/realisations-pro" className="inline-flex items-center gap-2 text-koudous-primary hover:text-white transition-colors font-mono text-sm">
              Voir tous les projets <ArrowRight size={14} />
            </Link>
          </div>
        </FadeUp>
      </section>

      {/* ════════════════════════════════════════════
          SECTION 4 — LATEST ARTICLES
      ════════════════════════════════════════════ */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 w-full py-24 border-t border-white/5">
        <FadeUp>
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="font-mono text-xs text-koudous-secondary uppercase tracking-widest mb-2">// Ce que je pense</p>
              <h2 className="text-3xl md:text-5xl font-display font-extrabold text-white">Derniers Articles</h2>
            </div>
            <Link href="/articles" className="hidden md:flex items-center gap-2 text-koudous-text/50 hover:text-white transition-colors font-mono text-sm">
              Voir tout <ChevronRight size={16} />
            </Link>
          </div>
        </FadeUp>

        {latestArticles && latestArticles.length > 0 ? (
          <div className="space-y-4">
            {latestArticles.map((article, i) => (
              <SlideIn key={article.id} from="left" delay={i * 0.08}>
                <Link href={`/articles/${article.slug}`} className="group flex flex-col md:flex-row items-start md:items-center gap-6 p-6 bg-white/[0.03] border border-white/10 rounded-2xl hover:border-koudous-secondary/50 hover:bg-white/5 transition-all duration-300">
                  {/* Cover */}
                  {article.cover_image && (
                    <div className="relative w-full md:w-32 h-20 rounded-xl overflow-hidden shrink-0 bg-black/40">
                      <Image
                        src={article.cover_image}
                        alt={article.title}
                        fill
                        className="object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                        sizes="(max-width: 768px) 100vw, 128px"
                      />
                    </div>
                  )}
                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-koudous-secondary bg-koudous-secondary/10 px-2 py-0.5 rounded">{article.category}</span>
                      <time className="font-mono text-xs text-koudous-text/30">
                        {format(new Date(article.created_at), "dd MMM yyyy", { locale: fr })}
                      </time>
                    </div>
                    <h3 className="text-lg font-display font-bold text-white group-hover:text-koudous-secondary transition-colors mb-1 truncate">{article.title}</h3>
                    {article.excerpt && (
                      <p className="text-koudous-text/50 text-sm leading-relaxed line-clamp-1">{article.excerpt}</p>
                    )}
                  </div>
                  <ArrowRight size={18} className="shrink-0 text-koudous-text/20 group-hover:text-koudous-secondary group-hover:translate-x-1 transition-all" />
                </Link>
              </SlideIn>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-white/5 rounded-2xl">
            <BrainCircuit size={40} className="mx-auto text-white/10 mb-4" />
            <p className="text-koudous-text/30 text-sm">Les articles arrivent bientôt.</p>
          </div>
        )}

        <FadeUp delay={0.2}>
          <div className="mt-8 text-center">
            <Link href="/articles" className="inline-flex items-center gap-2 text-koudous-secondary hover:text-white transition-colors font-mono text-sm">
              Lire tous les articles <ArrowRight size={14} />
            </Link>
          </div>
        </FadeUp>
      </section>

      {/* ════════════════════════════════════════════
          SECTION 5 — PARCOURS TEASER
      ════════════════════════════════════════════ */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 w-full py-24 border-t border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left — Bio */}
          <SlideIn from="left">
            <p className="font-mono text-xs text-koudous-primary uppercase tracking-widest mb-4">// Qui je suis</p>
            <h2 className="text-4xl md:text-5xl font-display font-extrabold text-white mb-6">L'Humain<br />derrière le code.</h2>
            <p className="text-koudous-text/60 leading-relaxed text-lg mb-6">
              Étudiant, builder, maker. Je ne construis pas des applications, je construis des <span className="text-white font-semibold">systèmes qui pensent</span>. Chaque projet est une expérience de terrain, chaque échec une leçon documentée.
            </p>
            <p className="text-koudous-text/40 leading-relaxed mb-8">
              Passionné d'IA, d'automatisation et d'architecture logicielle. Curieux, méthodique, obsédé par l'excellence technique — mais toujours humain.
            </p>
            <Link href="/parcours" className="group inline-flex items-center gap-3 px-6 py-3 border border-white/20 text-white font-mono text-sm uppercase tracking-widest hover:border-koudous-primary hover:text-koudous-primary transition-all">
              Voir le parcours complet
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </SlideIn>

          {/* Right — Timeline steps */}
          <SlideIn from="right" delay={0.1}>
            <div className="space-y-4">
              {timelineSteps && timelineSteps.length > 0 ? timelineSteps.map((step, i) => (
                <div key={step.id} className="flex gap-4 p-5 bg-white/[0.03] border border-white/10 rounded-xl hover:border-koudous-primary/30 transition-colors">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full border border-koudous-primary/50 flex items-center justify-center bg-koudous-primary/10">
                    <span className="font-mono text-xs text-koudous-primary font-bold">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-koudous-primary uppercase tracking-widest">{step.period}</span>
                    <h3 className="font-display font-bold text-white text-sm mt-0.5">{step.title}</h3>
                    {step.location && (
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin size={10} className="text-koudous-text/30" />
                        <span className="font-mono text-[10px] text-koudous-text/30">{step.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              )) : (
                <div className="text-koudous-text/30 text-sm text-center py-8 border border-white/5 rounded-xl">Timeline en cours de synchronisation.</div>
              )}
            </div>
          </SlideIn>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          SECTION 6 — GALLERY PREVIEW
      ════════════════════════════════════════════ */}
      {galleryPreviews && galleryPreviews.length > 0 && (
        <section className="relative z-10 max-w-6xl mx-auto px-4 w-full py-24 border-t border-white/5">
          <FadeUp>
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="font-mono text-xs text-koudous-text/40 uppercase tracking-widest mb-2">// Ce que je vis</p>
                <h2 className="text-3xl md:text-5xl font-display font-extrabold text-white">La Galerie</h2>
              </div>
              <Link href="/galerie" className="hidden md:flex items-center gap-2 text-koudous-text/50 hover:text-white transition-colors font-mono text-sm">
                Voir tout <ChevronRight size={16} />
              </Link>
            </div>
          </FadeUp>

          <FadeStagger className="grid grid-cols-2 md:grid-cols-3 gap-3" staggerDelay={0.06}>
            {galleryPreviews.map((photo) => (
              <FadeItem key={photo.id}>
                <Link href="/galerie" className="group relative block aspect-square rounded-xl overflow-hidden bg-white/5">
                  <Image
                    src={photo.image_url}
                    alt={photo.title || "Photo"}
                    fill
                    className="object-cover opacity-75 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                    {photo.title && <p className="text-white text-xs font-bold">{photo.title}</p>}
                  </div>
                </Link>
              </FadeItem>
            ))}
          </FadeStagger>

          <FadeUp delay={0.3}>
            <div className="mt-8 text-center">
              <Link href="/galerie" className="inline-flex items-center gap-2 text-koudous-text/50 hover:text-white transition-colors font-mono text-sm">
                <ImgIcon size={14} /> Ouvrir la galerie complète <ArrowRight size={14} />
              </Link>
            </div>
          </FadeUp>
        </section>
      )}

      {/* ════════════════════════════════════════════
          SECTION 7 — FOOTER NAV CTA
      ════════════════════════════════════════════ */}
      <section className="relative z-10 border-t border-white/5 mt-8">
        <div className="max-w-6xl mx-auto px-4 py-20">
          <FadeUp>
            <div className="text-center mb-10 md:mb-14">
              <h2 className="text-3xl md:text-4xl font-display font-extrabold text-white mb-3">Explorer l'écosystème</h2>
              <p className="text-koudous-text/50 font-mono text-sm">Naviguez vers l'expertise de votre choix.</p>
            </div>
          </FadeUp>

          <FadeStagger className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3" staggerDelay={0.06}>
            {[
              { href: "/realisations-pro", label: "Projets Pro" },
              { href: "/realisations-academiques", label: "Académique" },
              { href: "/articles", label: "Articles" },
              { href: "/parcours", label: "Parcours" },
              { href: "/galerie", label: "Galerie" },
              { href: "/echecs", label: "Mes Échecs" },
            ].map(({ href, label }) => (
              <FadeItem key={href}>
                <Link href={href} className="group flex items-center justify-center px-4 py-4 bg-white/[0.03] border border-white/10 rounded-xl hover:border-koudous-primary/50 hover:bg-koudous-primary/5 transition-all text-center">
                  <span className="text-sm text-koudous-text/60 group-hover:text-white transition-colors font-medium">{label}</span>
                </Link>
              </FadeItem>
            ))}
          </FadeStagger>
        </div>
      </section>

    </main>
  );
}
