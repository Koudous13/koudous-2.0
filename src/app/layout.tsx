import type { Metadata } from "next";
import { Inter, Syne } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Koudous DAOUDA - AI & Automation Pioneer",
  description: "Systèmes d'Intelligence Artificielle et d'Automatisation construits par Koudous DAOUDA.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body
        className={`${inter.variable} ${syne.variable} antialiased bg-koudous-bg text-koudous-text min-h-screen flex flex-col selection:bg-koudous-primary selection:text-white`}
      >
        <Navbar />
        <main className="flex-grow pt-24 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
