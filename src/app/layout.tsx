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
  title: "💻 DigitalFADA.shop - Votre destination tech et multimédia",
  description: "Découvrez DigitalFADA.shop, votre boutique tech spécialisée : gaming, audio, ordinateurs, smartphones et TV. Livraison rapide et garantie qualité.",
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
    other: [
      { rel: 'android-chrome-192x192', url: '/android-chrome-192x192.png' },
      { rel: 'android-chrome-512x512', url: '/android-chrome-512x512.png' },
    ],
  },
  manifest: '/site.webmanifest',
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
        
        {/* Meta tags supplémentaires pour PWA */}
        <meta name="theme-color" content="#3b82f6" />
        <meta name="application-name" content="DigitalFADA" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="DigitalFADA" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-tap-highlight" content="no" />
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
