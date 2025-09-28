'use client';

import { useState, useEffect } from 'react';
import { getProductImagesFromStorage, getFeaturedImageFromStorage } from '@/lib/image-utils';

interface UseProductImagesResult {
  images: string[];
  featuredImage: string | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useProductImages(productId: string): UseProductImagesResult {
  const [images, setImages] = useState<string[]>([]);
  const [featuredImage, setFeaturedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchImages = async () => {
    if (!productId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Récupérer toutes les images et l'image principale en parallèle
      const [allImages, mainImage] = await Promise.all([
        getProductImagesFromStorage(productId),
        getFeaturedImageFromStorage(productId)
      ]);

      setImages(allImages);
      setFeaturedImage(mainImage);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des images');
      console.error('Erreur dans useProductImages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [productId]);

  return {
    images,
    featuredImage,
    loading,
    error,
    refetch: fetchImages
  };
}
