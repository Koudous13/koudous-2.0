import type { Metadata } from "next";
import { Inter, Syne } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://koudous-2-0.vercel.app"),
  title: {
    default: "Koudous DAOUDA — AI & Automation Pioneer",
    template: "%s | Koudous DAOUDA",
  },
  description: "Je conçois et déploie des systèmes intelligents et des architectures d'automatisation de pointe. Portfolio de Koudous DAOUDA.",
  keywords: ["AI", "Intelligence Artificielle", "Automatisation", "LangChain", "n8n", "Python", "Data Science", "Koudous DAOUDA"],
  authors: [{ name: "Koudous DAOUDA" }],
  creator: "Koudous DAOUDA",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://koudous-2-0.vercel.app",
    siteName: "KOUDOUS — AI & Automation",
    title: "Koudous DAOUDA — AI & Automation Pioneer",
    description: "Systèmes IA, automatisation et architectures souveraines. L'excellence technique sans compromis.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Koudous DAOUDA — AI & Automation Pioneer",
    description: "Systèmes IA & Automatisation. Portfolio technique de Koudous DAOUDA.",
    creator: "@koudous",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
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
        {children}
      </body>
    </html>
  );
}
