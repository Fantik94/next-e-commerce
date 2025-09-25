// Optimisations de performance pour DigitalFada.shop

// Configuration pour le preloading agressif
export const linkPreloadConfig = {
  // Précharger les pages critiques immédiatement
  criticalPages: ['/products', '/cart', '/'],
  
  // Précharger au hover pour les autres
  hoverPages: ['/categories', '/deals', '/about'],
};

// Optimisations d'images
export const imageOptimization = {
  // Formats modernes en priorité
  formats: ['image/avif', 'image/webp'],
  
  // Sizes pour différents breakpoints
  sizes: {
    mobile: '100vw',
    tablet: '50vw', 
    desktop: '33vw'
  },
  
  // Lazy loading intelligent
  loading: 'lazy' as const,
  priority: false,
};

// Configuration de bundle splitting
export const bundleOptimization = {
  // Modules à précharger
  preloadModules: [
    '@/components/ui/button',
    '@/components/ui/card', 
    '@/hooks/useCart',
    'lucide-react'
  ],
  
  // Modules à charger à la demande
  lazyModules: [
    '@/components/cart/CartSidebar',
    '@/components/product/ProductFilters'
  ]
};

// Métriques de performance
export const performanceConfig = {
  // Seuils acceptables (en ms)
  thresholds: {
    FCP: 1800,  // First Contentful Paint
    LCP: 2500,  // Largest Contentful Paint  
    FID: 100,   // First Input Delay
    CLS: 0.1,   // Cumulative Layout Shift
  },
  
  // Monitoring
  enableMetrics: process.env.NODE_ENV === 'production',
};

// Utilitaire pour débogage des performances
export const debugPerformance = () => {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    // Observer les métriques Web Vitals
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        console.log(`🚀 ${entry.name}:`, entry.duration.toFixed(2), 'ms');
      });
    });
    
    observer.observe({ entryTypes: ['measure', 'navigation'] });
    
    // Log du temps de navigation
    window.addEventListener('beforeunload', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      console.log('📊 Navigation Timing:', {
        DNS: navigation.domainLookupEnd - navigation.domainLookupStart,
        Connect: navigation.connectEnd - navigation.connectStart,
        Response: navigation.responseEnd - navigation.responseStart,
        DOM: navigation.domContentLoadedEventEnd - navigation.responseEnd,
        Load: navigation.loadEventEnd - navigation.loadEventStart,
      });
    });
  }
};
