import { supabase } from './supabase';
import { Product, Category } from '@/types';

// Types pour les données Supabase
export interface SupabaseProduct {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  price: number;
  compare_at_price: number | null;
  cost_price: number | null;
  sku: string | null;
  barcode: string | null;
  stock_quantity: number;
  track_inventory: boolean;
  allow_backorder: boolean;
  weight: number | null;
  dimensions: any | null;
  category_id: string | null;
  brand: string | null;
  tags: string[] | null;
  images: string[] | null;
  featured_image: string | null;
  is_active: boolean;
  is_featured: boolean;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
}

export interface SupabaseCategory {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  image_url: string | null;
  parent_id: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// Fonction pour transformer les données Supabase en format de l'application
export function transformSupabaseProduct(supabaseProduct: SupabaseProduct): Product {
  return {
    id: supabaseProduct.id,
    name: supabaseProduct.name,
    description: supabaseProduct.description || '',
    price: supabaseProduct.price,
    originalPrice: supabaseProduct.compare_at_price || undefined,
    category: '', // Sera rempli après récupération de la catégorie
    brand: supabaseProduct.brand || '',
    images: supabaseProduct.images || [],
    featuredImage: supabaseProduct.featured_image || undefined,
    stock: supabaseProduct.stock_quantity,
    rating: 0, // Pas de rating dans Supabase pour l'instant
    reviewCount: 0, // Pas de review count dans Supabase pour l'instant
    features: [], // Pas de features dans Supabase pour l'instant
    isNew: false, // Peut être calculé à partir de created_at
    isFeatured: supabaseProduct.is_featured,
    createdAt: new Date(supabaseProduct.created_at),
    updatedAt: new Date(supabaseProduct.updated_at)
  };
}

export function transformSupabaseCategory(supabaseCategory: SupabaseCategory): Category {
  return {
    id: supabaseCategory.id,
    name: supabaseCategory.name,
    slug: supabaseCategory.slug,
    description: supabaseCategory.description || undefined,
    image: supabaseCategory.image_url || undefined,
    productCount: 0 // Sera calculé après récupération des produits
  };
}

// Service pour récupérer les catégories
export async function getCategories(): Promise<Category[]> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
      throw error;
    }

    const categories = data?.map(transformSupabaseCategory) || [];
    
    // Calculer le nombre de produits par catégorie
    for (const category of categories) {
      const { count } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', category.id)
        .eq('is_active', true);
      
      category.productCount = count || 0;
    }

    return categories;
  } catch (error) {
    console.error('Erreur dans getCategories:', error);
    throw error;
  }
}

// Service pour récupérer une catégorie par slug
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Catégorie non trouvée
      }
      console.error('Erreur lors de la récupération de la catégorie:', error);
      throw error;
    }

    const category = transformSupabaseCategory(data);
    
    // Calculer le nombre de produits
    const { count } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('category_id', category.id)
      .eq('is_active', true);
    
    category.productCount = count || 0;

    return category;
  } catch (error) {
    console.error('Erreur dans getCategoryBySlug:', error);
    throw error;
  }
}

// Service pour récupérer les produits
export async function getProducts(limit: number = 50, offset: number = 0): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories!inner(name)
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Erreur lors de la récupération des produits:', error);
      throw error;
    }

    const products = data?.map((item) => {
      const product = transformSupabaseProduct(item);
      product.category = item.categories?.name || '';
      return product;
    }) || [];

    return products;
  } catch (error) {
    console.error('Erreur dans getProducts:', error);
    throw error;
  }
}

// Service pour récupérer un produit par ID
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories!inner(name)
      `)
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Produit non trouvé
      }
      console.error('Erreur lors de la récupération du produit:', error);
      throw error;
    }

    const product = transformSupabaseProduct(data);
    product.category = data.categories?.name || '';
    
    return product;
  } catch (error) {
    console.error('Erreur dans getProductById:', error);
    throw error;
  }
}

// Service pour récupérer un produit par slug
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories!inner(name)
      `)
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Produit non trouvé
      }
      console.error('Erreur lors de la récupération du produit:', error);
      throw error;
    }

    const product = transformSupabaseProduct(data);
    product.category = data.categories?.name || '';
    
    return product;
  } catch (error) {
    console.error('Erreur dans getProductBySlug:', error);
    throw error;
  }
}

// Service pour récupérer les produits par catégorie
export async function getProductsByCategory(categorySlug: string, limit: number = 50, offset: number = 0): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories!inner(slug, name)
      `)
      .eq('categories.slug', categorySlug)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Erreur lors de la récupération des produits par catégorie:', error);
      throw error;
    }

    const products = data?.map((item) => {
      const product = transformSupabaseProduct(item);
      product.category = item.categories?.name || '';
      return product;
    }) || [];

    return products;
  } catch (error) {
    console.error('Erreur dans getProductsByCategory:', error);
    throw error;
  }
}

// Service pour rechercher des produits
export async function searchProducts(query: string, limit: number = 50): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories!inner(name)
      `)
      .or(`name.ilike.%${query}%,description.ilike.%${query}%,brand.ilike.%${query}%`)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Erreur lors de la recherche de produits:', error);
      throw error;
    }

    const products = data?.map((item) => {
      const product = transformSupabaseProduct(item);
      product.category = item.categories?.name || '';
      return product;
    }) || [];

    return products;
  } catch (error) {
    console.error('Erreur dans searchProducts:', error);
    throw error;
  }
}

// Service pour récupérer les produits mis en avant
export async function getFeaturedProducts(limit: number = 10): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories!inner(name)
      `)
      .eq('is_featured', true)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Erreur lors de la récupération des produits mis en avant:', error);
      throw error;
    }

    const products = data?.map((item) => {
      const product = transformSupabaseProduct(item);
      product.category = item.categories?.name || '';
      return product;
    }) || [];

    return products;
  } catch (error) {
    console.error('Erreur dans getFeaturedProducts:', error);
    throw error;
  }
}
