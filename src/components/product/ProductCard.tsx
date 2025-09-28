'use client';

import { useState, memo, useCallback } from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { useCart } from '@/hooks/useCart';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProductImage } from '@/components/ui/product-image';
import { useProductImages } from '@/hooks/useProductImages';
import { Star, Heart, ShoppingCart, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onToggleFavorite?: (productId: string) => void;
  isFavorite?: boolean;
}

function ProductCardComponent({ 
  product, 
  onAddToCart, 
  onToggleFavorite, 
  isFavorite = false 
}: ProductCardProps) {
  const { isInCart, getItemQuantity, addItem } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAdding, setIsAdding] = useState(false); // Protection contre double clic
  
  // Récupérer les images depuis Supabase Storage
  const { images: storageImages, featuredImage, loading: imagesLoading } = useProductImages(product.id);
  
  const inCart = isInCart(product.id);
  const cartQuantity = getItemQuantity(product.id);

  // Utiliser les images du storage ou les images de fallback
  const displayImages = storageImages.length > 0 ? storageImages : (product.images || []);
  const currentImage = displayImages[currentImageIndex] || featuredImage;

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Protection contre double clic
    if (isAdding) return;
    
    setIsAdding(true);
    try {
      // UN SEUL appel au panier
      addItem(product);
      
      // Petit délai pour éviter les clics multiples
      await new Promise(resolve => setTimeout(resolve, 300));
    } finally {
      setIsAdding(false);
    }
  }, [addItem, product, isAdding]);

  const handleToggleFavorite = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite?.(product.id);
  }, [onToggleFavorite, product.id]);

  return (
    <Card 
      className="group relative overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-0">
        
          {/* Image Container */}
        <div className="relative overflow-hidden bg-gray-50">
          <Link href={`/products/${product.id}`} prefetch={true}>
            <div className="relative h-64 w-full">
              <ProductImage
                src={currentImage}
                alt={product.name}
                width={400}
                height={256}
                className="w-full h-full transition-transform duration-500 group-hover:scale-110"
                options={{ size: 'medium' }}
              />
              
              {/* Image Navigation Dots */}
              {displayImages.length > 1 && (
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                  {displayImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentImageIndex(index);
                      }}
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        index === currentImageIndex 
                          ? 'bg-white shadow-lg' 
                          : 'bg-white/50 hover:bg-white/75'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </Link>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isNew && (
              <Badge className="bg-green-500 hover:bg-green-600 text-white shadow-lg">
                Nouveau
              </Badge>
            )}
            {discountPercentage > 0 && (
              <Badge variant="destructive" className="shadow-lg">
                -{discountPercentage}%
              </Badge>
            )}
            {product.stock < 10 && product.stock > 0 && (
              <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-200">
                Stock limité
              </Badge>
            )}
          </div>

          {/* Actions rapides */}
          <div className={`absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
          }`}>
            <Button
              size="icon"
              variant="secondary"
              className="h-9 w-9 rounded-full shadow-lg backdrop-blur-sm bg-white/90 hover:bg-white"
              onClick={handleToggleFavorite}
            >
              <Heart 
                className={`h-4 w-4 transition-colors ${
                  isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
                }`} 
              />
            </Button>
            <Link href={`/products/${product.id}`} prefetch={true}>
              <Button
                size="icon"
                variant="secondary"
                className="h-9 w-9 rounded-full shadow-lg backdrop-blur-sm bg-white/90 hover:bg-white"
              >
                <Eye className="h-4 w-4 text-gray-600" />
              </Button>
            </Link>
          </div>

          {/* Stock épuisé overlay */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="destructive" className="text-lg px-4 py-2">
                Rupture de stock
              </Badge>
            </div>
          )}
        </div>

        {/* Contenu */}
        <div className="p-4 space-y-3">
          
          {/* Marque et catégorie */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-primary font-medium">{product.brand}</span>
            <span className="text-gray-500">{product.category}</span>
          </div>

          {/* Nom du produit */}
          <Link href={`/products/${product.id}`} prefetch={true}>
            <h3 className="font-semibold text-lg line-clamp-2 hover:text-primary transition-colors leading-tight">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating) 
                      ? 'text-yellow-400 fill-current' 
                      : 'text-gray-300'
                  }`} 
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {product.rating} ({product.reviewCount})
            </span>
          </div>

          {/* Prix */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-gray-900">
                {product.price.toLocaleString('fr-FR')}€
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  {product.originalPrice.toLocaleString('fr-FR')}€
                </span>
              )}
            </div>
          </div>

          {/* Bouton d'ajout au panier */}
          <Button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || isAdding}
            className={`w-full transition-all duration-300 ${
              inCart 
                ? 'bg-green-600 hover:bg-green-700' 
                : isHovered 
                  ? 'bg-primary hover:bg-primary/90 scale-105' 
                  : 'bg-gray-900 hover:bg-gray-800'
            }`}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {product.stock === 0 
              ? 'Rupture de stock' 
              : isAdding
                ? 'Ajout...'
                : inCart 
                  ? `Dans le panier (${cartQuantity})`
                  : 'Ajouter au panier'
            }
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Memoization pour éviter les re-renders inutiles
export const ProductCard = memo(ProductCardComponent, (prevProps, nextProps) => {
  return (
    prevProps.product.id === nextProps.product.id &&
    prevProps.isFavorite === nextProps.isFavorite &&
    prevProps.onAddToCart === nextProps.onAddToCart &&
    prevProps.onToggleFavorite === nextProps.onToggleFavorite
  );
});
