'use client';

import { useState, useEffect } from 'react';
import { Product, Category } from '@/types';
import {
  getCategories,
  getCategoryBySlug,
  getProducts,
  getProductById,
  getProductBySlug,
  getProductsByCategory,
  searchProducts,
  getFeaturedProducts
} from '@/lib/supabase-data';

// Hook pour les catégories
export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement des catégories');
        console.error('Erreur dans useCategories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error, refetch: () => fetchCategories() };
}

// Hook pour une catégorie spécifique
export function useCategory(slug: string) {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchCategory = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getCategoryBySlug(slug);
        setCategory(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement de la catégorie');
        console.error('Erreur dans useCategory:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [slug]);

  return { category, loading, error, refetch: () => fetchCategory() };
}

// Hook pour les produits
export function useProducts(limit: number = 50, offset: number = 0) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getProducts(limit, offset);
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement des produits');
        console.error('Erreur dans useProducts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [limit, offset]);

  return { products, loading, error, refetch: () => fetchProducts() };
}

// Hook pour un produit spécifique par ID
export function useProduct(id: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement du produit');
        console.error('Erreur dans useProduct:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return { product, loading, error, refetch: () => fetchProduct() };
}

// Hook pour un produit spécifique par slug
export function useProductBySlug(slug: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getProductBySlug(slug);
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement du produit');
        console.error('Erreur dans useProductBySlug:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  return { product, loading, error, refetch: () => fetchProduct() };
}

// Hook pour les produits par catégorie
export function useProductsByCategory(categorySlug: string, limit: number = 50, offset: number = 0) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!categorySlug) return;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getProductsByCategory(categorySlug, limit, offset);
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement des produits');
        console.error('Erreur dans useProductsByCategory:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categorySlug, limit, offset]);

  return { products, loading, error, refetch: () => fetchProducts() };
}

// Hook pour la recherche de produits
export function useSearchProducts(query: string, limit: number = 50) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setProducts([]);
      return;
    }

    const searchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await searchProducts(query, limit);
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors de la recherche');
        console.error('Erreur dans useSearchProducts:', err);
      } finally {
        setLoading(false);
      }
    };

    // Debounce la recherche
    const timeoutId = setTimeout(searchProducts, 300);
    return () => clearTimeout(timeoutId);
  }, [query, limit]);

  return { products, loading, error };
}

// Hook pour les produits mis en avant
export function useFeaturedProducts(limit: number = 10) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getFeaturedProducts(limit);
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement des produits mis en avant');
        console.error('Erreur dans useFeaturedProducts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [limit]);

  return { products, loading, error, refetch: () => fetchProducts() };
}
