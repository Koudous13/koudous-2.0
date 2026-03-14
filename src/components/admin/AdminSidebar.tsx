"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard, FileText, Briefcase, Image as ImageIcon,
    AlertTriangle, History, CalendarDays, Settings, LogOut, Menu, X
} from "lucide-react";
import { signout } from "@/app/admin/login/actions";

const navItems = [
    { label: "Cockpit", href: "/admin", icon: LayoutDashboard },
    { label: "Articles & Logs", href: "/admin/articles", icon: FileText },
    { label: "Projets & Archi", href: "/admin/projets", icon: Briefcase },
    { label: "Timeline (Parcours)", href: "/admin/parcours", icon: History },
    { label: "Mes Journées", href: "/admin/journees", icon: CalendarDays },
    { label: "Galerie", href: "/admin/galerie", icon: ImageIcon },
    { label: "Échecs Marquant", href: "/admin/echecs", icon: AlertTriangle },
    { label: "Réglages", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar({ userEmail }: { userEmail: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const SidebarContent = () => (
        <>
            <div className="p-4 md:p-6 border-b border-koudous-secondary/20 flex justify-between items-center shrink-0">
                <div>
                    <h2 className="font-display font-bold text-xl text-white">
                        KOUDOUS<span className="text-koudous-primary">.</span> ADMIN
                    </h2>
                    <p className="text-[10px] md:text-xs text-koudous-text/40 mt-1 font-mono truncate max-w-[180px]">{userEmail}</p>
                </div>
                {/* Mobile Close Button */}
                <button className="md:hidden text-white hover:text-red-400 p-2 -mr-2" onClick={() => setIsOpen(false)}>
                    <X size={24} />
                </button>
            </div>

            <nav className="flex-1 p-3 md:p-4 space-y-1.5 overflow-y-auto">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? "bg-koudous-primary/10 text-koudous-primary shadow-[inset_2px_0_0_var(--color-koudous-primary)]" : "text-koudous-text/70 hover:bg-white/5 hover:text-white"
                                }`}
                        >
                            <Icon size={18} className={isActive ? "text-koudous-primary" : "text-koudous-primary/70"} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-koudous-secondary/20 bg-black/20 shrink-0">
                <form action={signout}>
                    <button className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors">
                        <LogOut size={18} />
                        Déconnexion
                    </button>
                </form>
            </div>
        </>
    );

    return (
        <>
            {/* MOBILE TOP BAR */}
            <div className="md:hidden flex items-center justify-between p-4 bg-koudous-bg border-b border-koudous-secondary/20 sticky top-0 z-40">
                <h2 className="font-display font-bold text-lg text-white">
                    KOUDOUS<span className="text-koudous-primary">.</span> ADMIN
                </h2>
                <button onClick={() => setIsOpen(true)} className="text-white hover:text-koudous-primary transition-colors">
                    <Menu size={28} />
                </button>
            </div>

            {/* DESKTOP SIDEBAR */}
            <aside className="hidden md:flex flex-col w-64 bg-black/50 border-r border-koudous-secondary/20 h-full shrink-0">
                <SidebarContent />
            </aside>

            {/* MOBILE DRAWER */}
            <div className={`md:hidden fixed inset-0 z-50 flex transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
                <div className={`relative w-4/5 max-w-[300px] h-full bg-koudous-bg border-r border-koudous-secondary/20 flex flex-col shadow-2xl transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
                    <SidebarContent />
                </div>
            </div>
        </>
    );
}
