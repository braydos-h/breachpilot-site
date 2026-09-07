import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { VERSION } from "@/lib/meta";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "BreachPilot — Autonomous Security Assessment",
    template: "%s · BreachPilot",
  },
  description: SITE.description,
  keywords: [
    "BreachPilot",
    "autonomous security assessment",
    "penetration testing",
    "open source security",
    "agentic security",
    "attack graph",
    "MCP tools",
    "authorized testing",
  ],
  authors: [{ name: "BreachPilot", url: SITE.repo }],
  creator: "BreachPilot",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE.url,
    siteName: "BreachPilot",
    title: "BreachPilot — Autonomous Security Assessment",
    description: SITE.description,
    images: [{ url: "/og.svg", width: 1200, height: 630, alt: "BreachPilot — Plan · Recon · Exploit · Verify · Report" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "BreachPilot — Autonomous Security Assessment",
    description: SITE.description,
    images: ["/og.svg"],
  },
  icons: { icon: "/favicon.svg", apple: "/favicon.svg" },
  manifest: "/manifest.webmanifest",
  alternates: { canonical: SITE.url },
  category: "technology",
};

const THEME_INIT = `(function(){try{var t=localStorage.getItem("breachpilot-theme");if(t==="dark"||t==="light"){document.documentElement.classList.toggle("dark",t==="dark")}else if(window.matchMedia("(prefers-color-scheme: dark)").matches){document.documentElement.classList.add("dark")}}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "BreachPilot",
              applicationCategory: "SecurityApplication",
              operatingSystem: "Linux, Windows",
              url: SITE.url,
              downloadUrl: SITE.installSh,
              softwareVersion: VERSION,
              license: "https://www.apache.org/licenses/LICENSE-2.0",
              offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
              description: SITE.description,
            }),
          }}
        />
      </head>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
