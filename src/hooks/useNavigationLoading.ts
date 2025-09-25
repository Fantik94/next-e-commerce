'use client';

import { useRouter } from 'next/navigation';
import { useLoading } from './useLoading';

export function useNavigationLoading() {
  const router = useRouter();
  const { showLoading, hideLoading } = useLoading();

  const navigateWithLoading = (href: string) => {
    showLoading();
    
    // Délai court pour montrer le loading puis naviguer
    setTimeout(() => {
      router.push(href);
      // Cacher le loading après un délai pour permettre à la page de se charger
      setTimeout(() => {
        hideLoading();
      }, 300);
    }, 100);
  };

  const navigateToProducts = () => navigateWithLoading('/products');
  const navigateToCart = () => navigateWithLoading('/cart');
  const navigateToHome = () => navigateWithLoading('/');
  const navigateToCategories = () => navigateWithLoading('/categories');
  const navigateToProduct = (id: string) => navigateWithLoading(`/products/${id}`);

  return {
    navigateWithLoading,
    navigateToProducts,
    navigateToCart,
    navigateToHome,
    navigateToCategories,
    navigateToProduct,
  };
}
