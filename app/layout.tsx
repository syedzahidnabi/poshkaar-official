// app/layout.tsx
import "./globals.css";

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { Analytics } from "@vercel/analytics/next";

export const metadata = {
  title: "Poshkaar – The Threads of Paradise",
  description:
    "Luxury handcrafted Tilla, Zari, Aari & Dabka fashion from Kashmir — slow-made, heritage-rich, & artisan-crafted.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth bg-cream-50">
      <body className="text-gray-900 antialiased fade-smooth">

        {/* Global Navigation */}
        <Nav />

        {/* Page Content */}
        <main className="pt-20 min-h-screen">
          {children}
        </main>

        {/* Global Footer */}
        <Footer />

        {/* Floating WhatsApp */}
        <FloatingWhatsApp />

        {/* Vercel Analytics */}
        <Analytics />
      </body>
    </html>
  );
}
