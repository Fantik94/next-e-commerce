import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/hooks/useCart";
import { LoadingProvider } from "@/hooks/useLoading";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { debugPerformance } from "@/lib/performance";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "DigitalFada.shop - Votre destination tech et multimédia",
  description: "Découvrez DigitalFada.shop, votre boutique tech spécialisée : gaming, audio, ordinateurs, smartphones et TV. Livraison rapide et garantie qualité.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Activer le debug de performance en développement
  if (process.env.NODE_ENV === 'development') {
    debugPerformance();
  }

  return (
    <html lang="fr">
      <head>
        {/* Preconnect pour images externes seulement */}
        <link
          rel="preconnect"
          href="https://images.unsplash.com"
        />
        <link
          rel="dns-prefetch"
          href="https://images.unsplash.com"
        />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased min-h-screen flex flex-col`}
      >
        <LoadingProvider>
          <CartProvider>
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
            <LoadingOverlay />
          </CartProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}
