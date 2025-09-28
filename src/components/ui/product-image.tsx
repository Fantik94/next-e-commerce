'use client';

import Image from 'next/image';
import { useState } from 'react';
import { getImageUrl, ImageOptions } from '@/lib/image-utils';
import { ImagePlaceholder } from './image-placeholder';
import { cn } from '@/lib/utils';

interface ProductImageProps {
  src: string | null | undefined;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  options?: ImageOptions;
  fallback?: string;
  onError?: () => void;
}

export function ProductImage({
  src,
  alt,
  width = 400,
  height = 400,
  className,
  priority = false,
  options = {},
  fallback,
  onError,
}: ProductImageProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    setImageError(true);
    setIsLoading(false);
    onError?.();
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  // Déterminer l'URL de l'image
  const getImageSrc = () => {
    if (imageError || !src) {
      return fallback || '/images/placeholder-product.jpg';
    }

    return getImageUrl(src, options);
  };

  // Si pas d'image ou erreur, afficher le placeholder SVG
  if (imageError || !src) {
    return (
      <ImagePlaceholder
        width={width}
        height={height}
        className={className}
        text="Image non disponible"
        type="product"
      />
    );
  }

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
        </div>
      )}
      
      <Image
        src={getImageSrc()}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        className={cn(
          'object-cover transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
          className
        )}
        onError={handleError}
        onLoad={handleLoad}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
}

interface ProductImageGalleryProps {
  images: string[] | null | undefined;
  featuredImage?: string | null;
  alt: string;
  className?: string;
  onImageClick?: (index: number) => void;
}

export function ProductImageGallery({
  images,
  featuredImage,
  alt,
  className,
  onImageClick,
}: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Déterminer les images à afficher
  const displayImages = images && images.length > 0 ? images : [];
  const currentImage = displayImages[selectedIndex] || featuredImage;

  const handleImageClick = (index: number) => {
    setSelectedIndex(index);
    onImageClick?.(index);
  };

  if (displayImages.length === 0) {
    return (
      <div className={cn('flex items-center justify-center bg-gray-100', className)}>
        <ProductImage
          src={null}
          alt={alt}
          width={400}
          height={400}
          className="w-full h-full"
        />
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Image principale */}
      <div className="relative aspect-square overflow-hidden rounded-lg">
        <ProductImage
          src={currentImage}
          alt={`${alt} - Image ${selectedIndex + 1}`}
          width={600}
          height={600}
          className="w-full h-full cursor-pointer hover:scale-105 transition-transform duration-300"
          options={{ size: 'large' }}
          onClick={() => onImageClick?.(selectedIndex)}
        />
      </div>

      {/* Miniatures */}
      {displayImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {displayImages.map((image, index) => (
            <button
              key={index}
              onClick={() => handleImageClick(index)}
              className={cn(
                'relative flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all',
                selectedIndex === index
                  ? 'border-primary ring-2 ring-primary/20'
                  : 'border-gray-200 hover:border-gray-300'
              )}
            >
              <ProductImage
                src={image}
                alt={`${alt} - Miniature ${index + 1}`}
                width={80}
                height={80}
                className="w-full h-full"
                options={{ size: 'thumbnail' }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
