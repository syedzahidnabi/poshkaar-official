// app/layout.tsx
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import React from "react";

// --------------------------------------------------
// ⭐ GLOBAL METADATA (SEO PHASE 1–6)
// --------------------------------------------------
export const metadata = {
  metadataBase: new URL("https://www.poshkaarkashmir.com"),

  title: {
    default: "Poshkaar – The Threads of Paradise",
    template: "%s | Poshkaar",
  },

  description:
    "Luxury handcrafted Tilla, Zari, Aari & Dabka couture from Kashmir. Artisan-made, heritage-rich embroidery with custom measurements and worldwide shipping.",

  // ⭐ ALL KEYWORDS MERGED (Expanded Block)
  keywords: [
    // Brand
    "Poshkaar",
    "Poshkaar Kashmir",
    "Poshkaar clothing",
    // Main crafts
    "Kashmir embroidery",
    "Kashmiri embroidery",
    "Tilla work",
    "Zari designs",
    "Aari embroidery",
    "Dabka embroidery",
    "Dabka couture",
    "handcrafted embroidery Kashmir",
    // Products
    "Kashmiri pheran",
    "handcrafted pheran",
    "designer pheran",
    "Kashmiri kurta",
    "bridal shawl Kashmir",
    "Kashmiri shawls",
    "wedding couture Kashmir",
    // Fashion terms
    "Kashmir fashion",
    "Kashmiri traditional clothing",
    "luxury Kashmiri outfits",
    "artisan-made fashion",
    "slow fashion Kashmir",
  ],

  openGraph: {
    title: "Poshkaar – Luxury Handcrafted Tilla, Zari, Aari & Dabka Couture",
    description:
      "Explore premium Kashmiri couture crafted by artisans  Tilla, Zari, Aari & Dabka embroidery for timeless elegance.",
    url: "https://www.poshkaar.com",
    siteName: "Poshkaar",
    images: [
      {
        url: "https://www.poshkaarkashmir.com/og-banner.jpg",
        width: 1200,
        height: 630,
        alt: "Poshkaar Kashmiri Couture",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Poshkaar – Kashmiri Luxury Handcrafted Couture",
    description:
      "Handcrafted Tilla, Zari, Aari & Dabka pieces inspired by Kashmir’s heritage.",
    images: ["https://www.poshkaar.com/og-banner.jpg"],
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
  },

  alternates: {
    canonical: "https://www.poshkaarkashmir.com",
  },
};

// --------------------------------------------------
// ⭐ LAYOUT WRAPPER
// --------------------------------------------------
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // -----------------------------
  // BUSINESS / LOCATION DETAILS
  // -----------------------------
  const SITE_URL = "https://www.poshkaarkashmir.com";
  const ORG_NAME = "Poshkaar Kashmir";
  const PHONE = "+916006491824";
  const EMAIL = "hello@poshkaar.com";

  // Address
  const STREET = "Pachahara, Rajpora, Pulwama";
  const CITY = "Srinagar";
  const REGION = "Jammu & Kashmir";
  const POSTAL = "192301";
  const COUNTRY = "IN";

  // GPS Coordinates (Improves Google Maps ranking)
  const LAT = "34.083656";
  const LNG = "74.792550";

  // ------------------------------------------------------
  // ⭐ ORGANIZATION SCHEMA (Knowledge Graph)
  // ------------------------------------------------------
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: ORG_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description:
      "Luxury handcrafted Kashmiri couture featuring Tilla, Zari, Aari & Dabka embroidery.",
    telephone: PHONE,
    sameAs: [
      "https://www.instagram.com/poshkaar",
      "https://www.facebook.com/poshkaar",
    ],
  };

  // ------------------------------------------------------
  // ⭐ LOCAL BUSINESS SCHEMA (Boosts Local SEO + Google Maps)
  // ------------------------------------------------------
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    name: ORG_NAME,
    description:
      "Poshkaar: handcrafted Tilla, Zari, Aari & Dabka couture from Kashmir with custom sizing and global shipping.",
    url: SITE_URL,
    telephone: PHONE,
    email: EMAIL,
    image: `${SITE_URL}/og-banner.jpg`,
    logo: `${SITE_URL}/logo.png`,
    priceRange: "₹₹₹",

    address: {
      "@type": "PostalAddress",
      streetAddress: STREET,
      addressLocality: CITY,
      addressRegion: REGION,
      postalCode: POSTAL,
      addressCountry: COUNTRY,
    },

    geo: {
      "@type": "GeoCoordinates",
      latitude: LAT,
      longitude: LNG,
    },

    hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${STREET}, ${CITY}, ${REGION}`
    )}`,

    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "09:00",
        closes: "19:00",
      },
    ],

    sameAs: [
      "https://www.instagram.com/poshkaar",
      "https://www.facebook.com/poshkaar",
    ],
  };

  return (
    <html lang="en" className="scroll-smooth bg-cream-50">
      <head>
        {/* Preload fonts */}
        <link
          rel="preload"
          href="/fonts/serif.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />

        {/* Insert Structured Data (Knowledge Graph + Local SEO) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(orgSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema),
          }}
        />
      </head>

      <body className="text-gray-900 antialiased fade-smooth">
        <Nav />
        <main className="pt-20 min-h-screen">{children}</main>
        <Footer />

        {/* WhatsApp Floating Button */}
        <FloatingWhatsApp phone={PHONE} />

        {/* Analytics */}
        <Analytics />
      </body>
    </html>
  );
}
