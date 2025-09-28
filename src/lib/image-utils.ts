import { supabase } from './supabase';

// Configuration des images
export const IMAGE_CONFIG = {
  // Tailles d'images prédéfinies
  sizes: {
    thumbnail: { width: 150, height: 150 },
    small: { width: 300, height: 300 },
    medium: { width: 600, height: 600 },
    large: { width: 1200, height: 1200 },
  },
  // Qualité par défaut
  quality: 80,
  // Format par défaut
  format: 'webp' as const,
} as const;

// Types pour les images
export interface ImageSize {
  width: number;
  height: number;
}

export interface ImageOptions {
  size?: keyof typeof IMAGE_CONFIG.sizes;
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
  fit?: 'cover' | 'contain' | 'fill';
}

/**
 * Récupère toutes les images d'un produit depuis Supabase Storage
 */
export async function getProductImagesFromStorage(productId: string): Promise<string[]> {
  try {
    const { data, error } = await supabase.storage
      .from('products')
      .list(productId, {
        limit: 100,
        sortBy: { column: 'name', order: 'asc' }
      });

    if (error) {
      console.error('Erreur lors de la récupération des images:', error);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Filtrer seulement les fichiers images et générer les URLs publiques
    const imageFiles = data.filter(file => 
      file.name && 
      /\.(jpg|jpeg|png|webp|gif|avif)$/i.test(file.name)
    );

    return imageFiles.map(file => 
      supabase.storage.from('products').getPublicUrl(`${productId}/${file.name}`).data.publicUrl
    );
  } catch (error) {
    console.error('Erreur lors de la récupération des images du produit:', error);
    return [];
  }
}

/**
 * Récupère l'image principale d'un produit (main.jpg ou première image)
 */
export async function getFeaturedImageFromStorage(productId: string): Promise<string | null> {
  try {
    const { data, error } = await supabase.storage
      .from('products')
      .list(productId, {
        limit: 100,
        sortBy: { column: 'name', order: 'asc' }
      });

    if (error || !data || data.length === 0) {
      return null;
    }

    // Chercher main.jpg en premier
    const mainImage = data.find(file => 
      file.name && file.name.toLowerCase() === 'main.jpg'
    );

    if (mainImage) {
      return supabase.storage.from('products').getPublicUrl(`${productId}/${mainImage.name}`).data.publicUrl;
    }

    // Sinon, prendre la première image
    const firstImage = data.find(file => 
      file.name && /\.(jpg|jpeg|png|webp|gif|avif)$/i.test(file.name)
    );

    if (firstImage) {
      return supabase.storage.from('products').getPublicUrl(`${productId}/${firstImage.name}`).data.publicUrl;
    }

    return null;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'image principale:', error);
    return null;
  }
}

/**
 * Génère l'URL publique d'une image depuis Supabase Storage
 */
export function getImageUrl(
  imagePath: string, 
  options: ImageOptions = {}
): string {
  if (!imagePath) {
    return '/images/placeholder-product.jpg';
  }

  // Si c'est déjà une URL complète, la retourner
  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  // URL de base Supabase Storage
  const baseUrl = supabase.storage.from('products').getPublicUrl(imagePath).data.publicUrl;
  return baseUrl;
}

/**
 * Génère les URLs pour toutes les images d'un produit
 */
export function getProductImages(
  images: string[] | null | undefined,
  options: ImageOptions = {}
): string[] {
  if (!images || images.length === 0) {
    return ['/images/placeholder-product.jpg'];
  }

  return images.map(imagePath => getImageUrl(imagePath, options));
}

/**
 * Génère l'URL de l'image principale d'un produit
 */
export function getFeaturedImage(
  featuredImage: string | null | undefined,
  images: string[] | null | undefined,
  options: ImageOptions = {}
): string {
  // Priorité : featured_image > première image > placeholder
  const imagePath = featuredImage || (images && images[0]) || null;
  return getImageUrl(imagePath, options);
}

/**
 * Génère l'URL de l'image de catégorie
 */
export function getCategoryImage(
  imageUrl: string | null | undefined,
  options: ImageOptions = {}
): string {
  if (!imageUrl) {
    return '/images/placeholder-category.jpg';
  }

  return getImageUrl(imageUrl, options);
}

/**
 * Vérifie si une image existe
 */
export async function checkImageExists(imagePath: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.storage
      .from('products')
      .list(imagePath.split('/').slice(0, -1).join('/'), {
        search: imagePath.split('/').pop()
      });

    return !error && data && data.length > 0;
  } catch {
    return false;
  }
}

/**
 * Upload d'une image (pour les admins)
 */
export async function uploadProductImage(
  productId: string,
  file: File,
  fileName: string = 'main.jpg'
): Promise<{ success: boolean; path?: string; error?: string }> {
  try {
    const filePath = `${productId}/${fileName}`;
    
    const { data, error } = await supabase.storage
      .from('products')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, path: filePath };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erreur inconnue' 
    };
  }
}

/**
 * Suppression d'une image (pour les admins)
 */
export async function deleteProductImage(imagePath: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.storage
      .from('products')
      .remove([imagePath]);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erreur inconnue' 
    };
  }
}

/**
 * Génère un placeholder d'image avec les dimensions spécifiées
 */
export function getPlaceholderImage(width: number, height: number): string {
  return `/images/placeholder-${width}x${height}.jpg`;
}