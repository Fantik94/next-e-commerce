'use client';

import { useState, useEffect } from 'react';
import { ProductCardSkeleton } from '@/components/product/ProductCardSkeleton';
import { CategorySkeleton } from '@/components/ui/CategorySkeleton';

interface ProductsPageWithLoadingProps {
  children: React.ReactNode;
}

export function ProductsPageWithLoading({ children }: ProductsPageWithLoadingProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simule le temps de chargement d'une vraie page
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar skeleton */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className="space-y-6">
              <CategorySkeleton />
            </div>
          </aside>

          {/* Main content skeleton */}
          <main className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          </main>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
