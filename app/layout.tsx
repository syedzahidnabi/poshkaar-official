// app/layout.tsx
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

export const metadata = {
  metadataBase: new URL("https://www.poshkaar.com"),
  title: {
    default: "Poshkaar – The Threads of Paradise",
    template: "%s | Poshkaar",
  },

  description:
    "Luxury handcrafted Tilla, Zari, Aari & Dabka couture from Kashmir. Artisan-made, heritage-rich embroidery with custom measurements available.",

  keywords: [
    "Poshkaar",
    "Kashmir embroidery",
    "Tilla work",
    "Zari designs",
    "Aari embroidery",
    "Dabka couture",
    "Kashmiri pheran",
    "handcrafted pheran",
    "Kashmir fashion",
    "Kashmiri traditional clothing",
  ],

  openGraph: {
    title: "Poshkaar – Luxury Handcrafted Tilla, Zari, Aari & Dabka Couture",
    description:
      "Explore premium Kashmiri couture crafted by artisans — Tilla, Zari, Aari & Dabka embroidery for timeless elegance.",
    url: "https://www.poshkaar.com",
    siteName: "Poshkaar",
    images: [
      {
        url: "https://www.poshkaar.com/og-banner.jpg",
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
    canonical: "https://www.poshkaar.com",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // JSON-LD Schema.org (Organization)
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Poshkaar",
    url: "https://www.poshkaar.com",
    logo: "https://www.poshkaar.com/logo.png",
    description:
      "Luxury handcrafted Kashmiri couture featuring Tilla, Zari, Aari & Dabka embroidery.",
    sameAs: [
      "https://www.instagram.com/poshkaar",
      "https://www.facebook.com/poshkaar",
    ],
  };

  return (
    <html lang="en" className="scroll-smooth bg-cream-50">
      <head>
        {/* Preload custom fonts for performance */}
        <link
          rel="preload"
          href="/fonts/serif.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />

        {/* Structured Data for Google Knowledge Graph */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </head>

      <body className="text-gray-900 antialiased fade-smooth">
        {/* Navigation */}
        <Nav />

        {/* Page Content */}
        <main className="pt-20 min-h-screen">{children}</main>

        {/* Footer */}
        <Footer />

        {/* Floating WhatsApp Button */}
        <FloatingWhatsApp />

        {/* Analytics */}
        <Analytics />
      </body>
    </html>
  );
}
