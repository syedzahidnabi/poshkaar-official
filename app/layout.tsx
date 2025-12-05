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
    "Luxury handcrafted Tilla, Zari, Aari & Dabka fashion from Kashmir — slow-made, heritage-rich, artisan-crafted pieces for modern wardrobes.",
  keywords: [
    "Poshkaar",
    "Kashmir embroidery",
    "Tilla work",
    "Zari designs",
    "Aari embroidery",
    "Dabka couture",
    "Kashmiri pheran",
    "handcrafted fashion",
    "traditional Kashmiri clothing",
  ],
  openGraph: {
    title: "Poshkaar – Luxury Handcrafted Tilla, Zari, Aari & Dabka Couture",
    description:
      "Explore handcrafted Kashmiri couture — Tilla, Zari, Aari & Dabka masterpieces designed for timeless elegance.",
    url: "https://www.poshkaar.com",
    siteName: "Poshkaar",
    images: [
      {
        url: "/og-banner.jpg",
        width: 1200,
        height: 630,
        alt: "Poshkaar Luxury Kashmiri Couture",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Poshkaar – Kashmiri Luxury Handcrafted Couture",
    description:
      "Handcrafted Tilla, Zari, Aari & Dabka fashion inspired by Kashmir’s heritage.",
    images: ["/og-banner.jpg"],
  },
  robots: {
    index: true,
    follow: true,
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
        {/* Preload Fonts for Performance */}
        <link
          rel="preload"
          href="/fonts/serif.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />

        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </head>

      <body className="text-gray-900 antialiased fade-smooth">
        {/* Navbar */}
        <Nav />

        {/* Main Page Content */}
        <main className="pt-20 min-h-screen">{children}</main>

        {/* Footer */}
        <Footer />

        {/* Floating WhatsApp Button */}
        <FloatingWhatsApp />

        {/* Vercel Analytics */}
        <Analytics />
      </body>
    </html>
  );
}
