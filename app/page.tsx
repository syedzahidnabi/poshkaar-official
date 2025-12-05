import type { Metadata } from "next";
import HomePage from "./HomePage";

// ------------------------------------------------------
// ⭐ HOMEPAGE METADATA (SEO)
// ------------------------------------------------------
export const metadata: Metadata = {
  title: "Poshkaar – Luxury Kashmiri Tilla, Zari, Aari & Dabka Couture",
  description:
    "Handcrafted Kashmiri couture featuring Tilla, Zari, Aari and Dabka embroidery. Heritage-rich, artisan-made fashion inspired by generations of craftsmanship.",
  keywords: [
    "Kashmiri Tilla work",
    "Zari embroidery",
    "Aari embroidery",
    "Dabka work",
    "Kashmiri pheran",
    "handcrafted Kashmir fashion",
    "Kashmiri couture",
    "Poshkaar Kashmir",
  ],
  alternates: { canonical: "https://www.poshkaar.com" },

  openGraph: {
    title: "Poshkaar – Luxury Kashmiri Handcrafted Couture",
    description:
      "Explore artisan-made Tilla, Zari, Aari and Dabka couture from Kashmir. Heritage luxury woven by master craftsmen.",
    url: "https://www.poshkaar.com",
    siteName: "Poshkaar",
    type: "website",
    images: [
      {
        url: "/og-banner.jpg",
        width: 1200,
        height: 630,
        alt: "Poshkaar Luxury Couture",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Poshkaar – Luxury Kashmiri Couture",
    description:
      "Handcrafted Kashmiri Tilla, Zari, Aari & Dabka couture for timeless elegance.",
    images: ["/og-banner.jpg"],
  },

  robots: { index: true, follow: true },
};

// ------------------------------------------------------
// ⭐ STRUCTURED DATA (JSON-LD)
// ------------------------------------------------------
const jsonLdHome = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Poshkaar",
  url: "https://www.poshkaar.com",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://www.poshkaar.com/search?q={search_term}",
    "query-input": "required name=search_term",
  },
};

const jsonLdOrg = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Poshkaar Kashmir",
  url: "https://www.poshkaar.com",
  logo: "https://www.poshkaar.com/logo.png",
  sameAs: [
    "https://www.instagram.com/poshkaar",
    "https://www.facebook.com/poshkaar",
  ],
};

// ------------------------------------------------------
// ⭐ PAGE (SERVER COMPONENT)
// ------------------------------------------------------
export default function Page() {
  return (
    <>
      {/* JSON-LD injected on server */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdHome) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
      />

      <HomePage />
    </>
  );
}
