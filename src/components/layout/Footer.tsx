import Link from "next/link";

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="w-full border-t border-koudous-secondary/10 bg-koudous-bg mt-24">
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="font-display font-bold text-3xl tracking-tight text-white">
                            KOUDOUS<span className="text-koudous-primary">.</span>
                        </Link>
                        <p className="mt-6 text-koudous-text/60 max-w-sm font-sans leading-relaxed">
                            Pionnier en Data Science et Architecture Systèmes (Python & n8n).
                            Construire l'intelligence de demain, aujourd'hui.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Navigation</h3>
                        <ul className="space-y-4">
                            <li><Link href="/realisations-pro" className="text-koudous-text/60 hover:text-koudous-primary transition-colors">Architecture Pro</Link></li>
                            <li><Link href="/articles" className="text-koudous-text/60 hover:text-koudous-primary transition-colors">Journal d'Ingénierie</Link></li>
                            <li><Link href="/parcours" className="text-koudous-text/60 hover:text-koudous-primary transition-colors">Ascension</Link></li>
                            <li><Link href="/echecs" className="text-koudous-text/60 hover:text-koudous-primary transition-colors">Leçons de Guerre</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Réseaux</h3>
                        <ul className="space-y-4">
                            <li>
                                <a href="#" target="_blank" rel="noopener noreferrer" className="text-koudous-text/60 hover:text-koudous-primary transition-colors">LinkedIn</a>
                            </li>
                            <li>
                                <a href="https://github.com/Koudous13" target="_blank" rel="noopener noreferrer" className="text-koudous-text/60 hover:text-koudous-primary transition-colors">GitHub</a>
                            </li>
                            <li>
                                <a href="mailto:Koudouspro13@gmail.com" className="text-koudous-text/60 hover:text-koudous-primary transition-colors">Email Direct</a>
                            </li>
                        </ul>
                    </div>

                </div>

                <div className="mt-16 pt-8 border-t border-koudous-secondary/10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-koudous-text/40 text-sm">
                        © {year} KOUDOUS DAOUDA. L'excellence n'est pas une option.
                    </p>
                    <div className="flex gap-4 items-center">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-koudous-text/60 text-sm font-mono">Systèmes Opérationnels</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
