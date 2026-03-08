"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
    { name: "Projets Pro", href: "/realisations-pro" },
    { name: "Académique", href: "/realisations-academiques" },
    { name: "Articles", href: "/articles" },
    { name: "Parcours", href: "/parcours" },
    { name: "Galerie", href: "/galerie" },
    { name: "Mes Échecs", href: "/echecs" },
];

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 w-full z-50 transition-all duration-300 border-b border-transparent ${isScrolled
                ? "bg-koudous-bg/80 backdrop-blur-md border-koudous-secondary/20 shadow-lg shadow-black/20 py-4"
                : "bg-transparent py-6"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
                {/* LOGO */}
                <Link
                    href="/"
                    className="font-display font-bold text-2xl tracking-tight text-white hover:text-koudous-primary transition-colors"
                >
                    KOUDOUS<span className="text-koudous-primary">.</span>
                </Link>

                {/* DESKTOP NAV */}
                <nav className="hidden md:flex items-center space-x-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-sm font-medium text-koudous-text/80 hover:text-white transition-colors relative group"
                        >
                            {link.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-koudous-primary transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                    ))}
                    <Link
                        href="/admin"
                        className="text-sm font-bold text-koudous-primary border border-koudous-primary/30 px-4 py-2 rounded hover:bg-koudous-primary/10 transition-colors"
                    >
                        Cockpit
                    </Link>
                </nav>

                {/* MOBILE MENU TOGGLE */}
                <button
                    className="md:hidden text-white"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* MOBILE NAV OVERLAY */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-full left-0 w-full bg-koudous-bg border-b border-koudous-secondary/20 shadow-2xl py-6 px-6 md:hidden flex flex-col space-y-6"
                    >
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-lg font-medium text-koudous-text hover:text-koudous-primary"
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Link
                            href="/admin"
                            onClick={() => setMobileMenuOpen(false)}
                            className="text-lg font-bold text-koudous-primary inline-block"
                        >
                            Cockpit Admin
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
