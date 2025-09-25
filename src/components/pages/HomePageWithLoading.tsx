'use client';

import { useState, useEffect } from 'react';
import { ProductCardSkeleton } from '@/components/product/ProductCardSkeleton';
import { CategorySkeleton } from '@/components/ui/CategorySkeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface HomePageWithLoadingProps {
  children: React.ReactNode;
}

export function HomePageWithLoading({ children }: HomePageWithLoadingProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simule le temps de chargement d'une vraie page
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-16">
        {/* Hero Section skeleton */}
        <section className="relative bg-gradient-to-r from-blue-50 to-indigo-100 py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-6 w-3/4" />
                <div className="flex flex-col sm:flex-row gap-4">
                  <Skeleton className="h-12 w-48" />
                  <Skeleton className="h-12 w-48" />
                </div>
              </div>
              <div className="relative">
                <Skeleton className="h-80 w-full rounded-2xl" />
              </div>
            </div>
          </div>
        </section>

        {/* Avantages skeleton */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="text-center space-y-4">
                  <Skeleton className="w-16 h-16 rounded-full mx-auto" />
                  <Skeleton className="h-6 w-32 mx-auto" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Catégories skeleton */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-12">
              <Skeleton className="h-8 w-48 mx-auto" />
              <Skeleton className="h-6 w-64 mx-auto" />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <CategorySkeleton key={i} />
              ))}
            </div>
          </div>
        </section>

        {/* Produits mis en avant skeleton */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <div>
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-6 w-36 mt-2" />
              </div>
              <Skeleton className="h-10 w-24" />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </section>

        {/* Nouveaux produits skeleton */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <div>
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-6 w-40 mt-2" />
              </div>
              <Skeleton className="h-10 w-24" />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  return <>{children}</>;
}
