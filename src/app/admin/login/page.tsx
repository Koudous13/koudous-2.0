import { login } from "./actions";
import { Lock } from "lucide-react";

export default async function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const errorMsg = (await searchParams).error;

    return (
        <div className="min-h-screen flex items-center justify-center bg-koudous-bg relative overflow-hidden px-4">
            {/* Background Effect */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--color-koudous-secondary)_0%,_transparent_25%)] opacity-5 pointer-events-none"></div>

            <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl z-10 relative">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-koudous-primary/10 rounded-full flex items-center justify-center mb-4 border border-koudous-primary/20">
                        <Lock className="text-koudous-primary" size={28} />
                    </div>
                    <h1 className="font-display text-3xl font-bold text-white text-center">Cockpit</h1>
                    <p className="text-koudous-text/60 mt-2 text-sm">Zone Réservée - KOUDOUS DAOUDA</p>
                </div>

                {errorMsg && (
                    <div className="mb-6 bg-red-500/10 border border-red-500/50 p-4 rounded-lg flex items-center justify-center">
                        <p className="text-red-400 text-sm font-medium text-center">
                            {errorMsg === "Invalid_Credentials"
                                ? "Identifiants invalides. Vérifiez votre email et mot de passe."
                                : "Une erreur d'authentification est survenue."}
                        </p>
                    </div>
                )}

                <form className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-koudous-text/80 mb-2">
                            Identifiant (Email)
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            placeholder="admin@koudous.com"
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-koudous-primary focus:border-transparent transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-koudous-text/80 mb-2">
                            Clé d'accès (Mot de passe)
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            placeholder="••••••••••••"
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-koudous-primary focus:border-transparent transition-all"
                        />
                    </div>

                    <button
                        formAction={login}
                        className="w-full bg-koudous-primary text-black font-bold text-lg py-4 rounded-lg hover:shadow-[0_0_20px_var(--color-koudous-primary)] transition-all duration-300 transform hover:-translate-y-1 mt-4"
                    >
                        S'authentifier
                    </button>
                </form>
            </div>
        </div>
    );
}
