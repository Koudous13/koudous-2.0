import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { signout } from "../login/actions";
import {
    LayoutDashboard,
    FileText,
    Briefcase,
    Image as ImageIcon,
    AlertTriangle,
    History,
    Settings,
    LogOut
} from "lucide-react";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    // Redirection immédiate si non authentifié
    if (error || !user) {
        redirect("/admin/login");
    }

    const navItems = [
        { label: "Cockpit", href: "/admin", icon: LayoutDashboard },
        { label: "Articles & Logs", href: "/admin/articles", icon: FileText },
        { label: "Projets & Archi", href: "/admin/projets", icon: Briefcase },
        { label: "Timeline (Parcours)", href: "/admin/parcours", icon: History },
        { label: "Galerie", href: "/admin/galerie", icon: ImageIcon },
        { label: "Échecs Marquant", href: "/admin/echecs", icon: AlertTriangle },
        { label: "Réglages", href: "/admin/settings", icon: Settings },
    ];

    return (
        <div className="flex h-screen bg-koudous-bg text-koudous-text font-sans">
            {/* SIDEBAR */}
            <aside className="w-64 bg-black/50 border-r border-koudous-secondary/20 flex flex-col">
                <div className="p-6 border-b border-koudous-secondary/20">
                    <h2 className="font-display font-bold text-xl text-white">
                        KOUDOUS<span className="text-koudous-primary">.</span> ADMIN
                    </h2>
                    <p className="text-xs text-koudous-text/40 mt-1 font-mono">{user.email}</p>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-koudous-text/70 hover:bg-white/5 hover:text-white transition-colors"
                            >
                                <Icon size={18} className="text-koudous-primary/70" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-koudous-secondary/20">
                    <form action={signout}>
                        <button className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors">
                            <LogOut size={18} />
                            Déconnexion
                        </button>
                    </form>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 overflow-y-auto relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--color-koudous-secondary)_0%,_transparent_40%)] opacity-5 pointer-events-none"></div>
                <div className="p-8 relative z-10 w-full max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
