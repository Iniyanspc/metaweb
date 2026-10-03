import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Poppins } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { JsonLd } from "@/components/seo/JsonLd";
import { site } from "@/data/site";
import { absoluteUrl, siteUrl } from "@/lib/seo";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
  variable: "--font-poppins",
});

const instrument = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-instrument",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/" },
  openGraph: { siteName: "metadatum", type: "website", url: "/" },
  twitter: { card: "summary_large_image" },
  title: {
    default: "metadatum — AI and data engineering company",
    template: "%s — metadatum",
  },
  description:
    "metadatum builds data platforms, AI systems and custom software for enterprises and governments, from the pipeline up.",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${poppins.variable} ${instrument.variable}`}>
      <body>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                name: "metadatum",
                url: siteUrl,
                logo: absoluteUrl("/brand/metadatum-mark-512.png"),
                // sameAs only from verified social links
                sameAs: site.social.flatMap((s) => (s.url.verified ? [s.url.value] : [])),
              },
              { "@type": "WebSite", name: "metadatum", url: siteUrl },
            ],
          }}
        />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Navbar />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
