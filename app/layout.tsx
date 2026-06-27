import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { CartProvider } from "@/components/CartProvider";
import { siteUrl } from "@/data/commerce";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Poshkaar Kashmir | Luxury Kashmiri Couture",
    template: "%s | Poshkaar Kashmir",
  },
  description:
    "Shop handcrafted Kashmiri Tilla, Zari, Aari and Dabka fashion from Poshkaar.",
  openGraph: {
    title: "Poshkaar Kashmir | Luxury Handcrafted Couture",
    description:
      "Handcrafted Tilla, Zari, Aari and Dabka pieces designed for modern occasionwear.",
    url: siteUrl,
    siteName: "Poshkaar Kashmir",
    images: [{ url: "/images/main-banner.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  alternates: { canonical: siteUrl },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-[#f7f4ef] text-[#171412] antialiased">
        <CartProvider>
          <Nav />
          <div className="min-h-screen pt-20">{children}</div>
          <Footer />
          <FloatingWhatsApp />
        </CartProvider>
        <Analytics />
      </body>
    </html>
  );
}
