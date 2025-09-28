import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimisations de performance
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },

  // Configuration Turbopack (nouvelle syntaxe)
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },

  // Optimisations de compilation
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Configuration des images optimisée
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'kjtftrukcdfthfvrzlju.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
    ],
    // Optimisations d'images
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Cache agressif en développement
    minimumCacheTTL: process.env.NODE_ENV === 'development' ? 31536000 : 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Optimisations webpack
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Accélération en mode développement
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },

};

export default nextConfig;
