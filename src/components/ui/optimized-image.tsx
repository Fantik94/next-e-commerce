'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { getOptimalImageUrl } from '@/lib/dev-mode';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
  fallbackSrc?: string;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  priority = false,
  loading = 'lazy',
  fallbackSrc = '/images/placeholder-tech.svg',
}: OptimizedImageProps) {
  // Utiliser l'URL optimale selon l'environnement
  const optimalSrc = getOptimalImageUrl(src);
  const [imgSrc, setImgSrc] = useState(optimalSrc);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError && fallbackSrc) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Skeleton de loading */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      
      {fill ? (
        <Image
          src={imgSrc}
          alt={alt}
          fill
          className={cn(
            "object-cover transition-opacity duration-300",
            isLoading ? "opacity-0" : "opacity-100"
          )}
          sizes={sizes}
          priority={priority}
          loading={loading}
          onError={handleError}
          onLoad={handleLoad}
        />
      ) : (
        <Image
          src={imgSrc}
          alt={alt}
          width={width}
          height={height}
          className={cn(
            "object-cover transition-opacity duration-300",
            isLoading ? "opacity-0" : "opacity-100"
          )}
          sizes={sizes}
          priority={priority}
          loading={loading}
          onError={handleError}
          onLoad={handleLoad}
        />
      )}
      
      {/* Indicateur d'erreur (en dev seulement) */}
      {hasError && process.env.NODE_ENV === 'development' && (
        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
          Fallback
        </div>
      )}
    </div>
  );
}
