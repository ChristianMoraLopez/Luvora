import type { Metadata, Viewport } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import { siteConfig } from "@/config/site";
import { SiteShell } from "@/components/layout/SiteShell";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — Bienestar íntimo premium`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "bienestar íntimo",
    "productos íntimos",
    "envío discreto",
    "Colombia",
    "LUVORA",
  ],
  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: siteConfig.name,
    title: `${siteConfig.name} — Bienestar íntimo premium`,
    description: siteConfig.description,
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#6B1E3A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CO" className={`${playfair.variable} ${montserrat.variable}`}>
      <body>
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-sm focus:bg-burgundy focus:px-4 focus:py-2 focus:text-ivory"
        >
          Saltar al contenido
        </a>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
