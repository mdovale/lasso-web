import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Mono, Inter } from "next/font/google";
import { getNavigation, getSite } from "@/lib/content";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["opsz"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
});

export function generateMetadata(): Metadata {
  const site = getSite();
  return {
    metadataBase: new URL(site.url),
    title: {
      default: `${site.shortName} — ${site.name}`,
      template: `%s — ${site.shortName}`,
    },
    description: site.description,
    openGraph: {
      title: `${site.shortName} — ${site.name}`,
      description: site.description,
      url: site.url,
      siteName: site.shortName,
      type: "website",
      ...(site.ogImage ? { images: [{ url: site.ogImage }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const site = getSite();
  const navigation = getNavigation();

  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${plexMono.variable}`}
    >
      <body className="flex min-h-screen flex-col">
        <a
          href="#main"
          className="u-label sr-only z-[100] rounded-full bg-accent px-4 py-2 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <Header
          shortName={site.shortName}
          name={site.name}
          items={navigation.main}
          cta={navigation.cta}
        />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer site={site} navigation={navigation} />
      </body>
    </html>
  );
}
