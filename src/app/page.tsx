export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Texture/Grid (Placeholder before real texture) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--color-koudous-secondary)_0%,_transparent_25%)] opacity-5 pointer-events-none"></div>

      <div className="z-10 text-center px-4 max-w-5xl">
        {/* Placeholder Photo */}
        <div className="w-32 h-32 mx-auto rounded-full bg-koudous-secondary/20 border border-koudous-primary/30 mb-8 flex items-center justify-center">
          <span className="text-koudous-primary text-xs tracking-widest uppercase">Photo</span>
        </div>

        <h1 className="font-display font-extrabold text-6xl md:text-8xl lg:text-9xl text-koudous-text tracking-tighter mix-blend-difference mb-4">
          <span className="text-transparent bg-clip-text bg-gradient-to-br from-koudous-text to-koudous-secondary">KOUDOUS</span>
          <br />DAOUDA
        </h1>

        <div className="h-12 flex justify-center items-center mt-6">
          <p className="font-sans text-xl md:text-2xl text-koudous-primary font-medium tracking-wide">
            AI & Automation Pioneer.
          </p>
        </div>

        <p className="mt-8 text-lg md:text-xl text-koudous-text/70 max-w-2xl mx-auto font-sans leading-relaxed">
          Je construis des systèmes intelligents et des architectures d'automatisation de pointe. L'excellence technique pure, sans compromis.
        </p>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
          <a href="/realisations-pro" className="px-8 py-4 bg-koudous-primary text-koudous-bg font-bold rounded-lg hover:shadow-[0_0_20px_var(--color-koudous-primary)] transition-all duration-300 transform hover:-translate-y-1">
            Voir l'Architecture
          </a>
          <a href="#contact" className="px-8 py-4 text-koudous-text border-b border-koudous-secondary/50 hover:border-koudous-primary hover:text-koudous-primary transition-colors">
            Initier le Contact
          </a>
        </div>
      </div>
    </main>
  );
}
