'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { ProductImageGallery } from '@/components/ui/product-image';
import { useProductImages } from '@/hooks/useProductImages';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { useProduct, useProducts } from '@/hooks/useSupabaseData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ProductCard } from '@/components/product/ProductCard';
import { LoadingOverlay } from '@/components/ui/loading-overlay';
import { 
  Star, 
  Heart, 
  Share2, 
  ShoppingCart, 
  Truck, 
  Shield, 
  RotateCcw, 
  ChevronLeft,
  Plus,
  Minus,
  Check
} from 'lucide-react';

export default function ProductDetailPage() {
  const { addItem } = useCart();
  const params = useParams();
  const productId = params.id as string;
  
  // Récupération des données depuis Supabase
  const { product, loading: productLoading, error: productError } = useProduct(productId);
  const { products: allProducts } = useProducts(50, 0);
  
  // Récupération des images depuis Supabase Storage
  const { images: storageImages, featuredImage, loading: imagesLoading } = useProductImages(productId);
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  // Gestion des états de chargement et d'erreur
  if (productLoading || imagesLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingOverlay />
      </div>
    );
  }

  if (productError || !product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Produit non trouvé</h1>
        <p className="text-gray-600 mb-8">
          {productError || 'Le produit que vous recherchez n\'existe pas.'}
        </p>
        <Button asChild>
          <Link href="/products">Retour au catalogue</Link>
        </Button>
      </div>
    );
  }

  // Produits similaires (même catégorie, excluant le produit actuel)
  const similarProducts = allProducts
    ?.filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4) || [];

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addItem(product, quantity, selectedSize, selectedColor);
  };

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const colors = [
    { name: 'Noir', value: '#000000' },
    { name: 'Blanc', value: '#FFFFFF' },
    { name: 'Gris', value: '#6B7280' },
    { name: 'Bleu', value: '#3B82F6' },
    { name: 'Rouge', value: '#EF4444' }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
        <Link href="/" className="hover:text-primary">Accueil</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-primary">Produits</Link>
        <span>/</span>
        <Link href={`/products?category=${product.category}`} className="hover:text-primary">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-12 mb-16">
        
        {/* Galerie d'images */}
        <div className="space-y-4">
          <ProductImageGallery
            images={storageImages.length > 0 ? storageImages : (product.images || [])}
            featuredImage={featuredImage}
            alt={product.name}
            className="w-full"
            onImageClick={(index) => setSelectedImageIndex(index)}
          />
          
          {/* Badges */}
          <div className="flex gap-2">
            {product.isNew && (
              <Badge className="bg-green-500 hover:bg-green-600">
                Nouveau
              </Badge>
            )}
            {discountPercentage > 0 && (
              <Badge variant="destructive">
                -{discountPercentage}%
              </Badge>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full"
              onClick={() => setIsFavorite(!isFavorite)}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Informations produit */}
        <div className="space-y-6">
          
          {/* En-tête */}
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <span className="font-medium text-primary">{product.brand}</span>
              <span>•</span>
              <span>{product.category}</span>
              <span>•</span>
              <span>Réf: {product.id}</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
            
            {/* Rating */}
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating) 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-300'
                    }`} 
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {product.rating} ({product.reviewCount} avis)
              </span>
              <Button variant="link" className="text-sm p-0 h-auto">
                Voir les avis
              </Button>
            </div>
          </div>

          {/* Prix */}
          <div className="flex items-center space-x-4">
            <span className="text-3xl font-bold text-gray-900">
              {product.price.toLocaleString('fr-FR')}€
            </span>
            {product.originalPrice && (
              <span className="text-xl text-gray-500 line-through">
                {product.originalPrice.toLocaleString('fr-FR')}€
              </span>
            )}
            {discountPercentage > 0 && (
              <Badge variant="destructive" className="text-sm">
                Économisez {((product.originalPrice || 0) - product.price).toLocaleString('fr-FR')}€
              </Badge>
            )}
          </div>

          {/* Stock */}
          <div className="flex items-center space-x-2">
            {product.stock > 0 ? (
              <>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-green-700 font-medium">
                  En stock ({product.stock} disponible{product.stock > 1 ? 's' : ''})
                </span>
              </>
            ) : (
              <>
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-red-700 font-medium">Rupture de stock</span>
              </>
            )}
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Description</h3>
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>

          {/* Caractéristiques */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Caractéristiques principales</h3>
            <ul className="space-y-2">
              {product.features.map((feature, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Options (tailles, couleurs) - pour certains produits */}
          {product.category === 'Mode' && (
            <div className="space-y-4">
              {/* Tailles */}
              <div>
                <h4 className="font-medium mb-3">Taille</h4>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedSize(size)}
                      className="min-w-12"
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Couleurs */}
              <div>
                <h4 className="font-medium mb-3">Couleur: {selectedColor}</h4>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        selectedColor === color.name 
                          ? 'border-primary ring-2 ring-primary/20' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Quantité et ajout au panier */}
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-3">Quantité</h4>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="rounded-r-none"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 min-w-16 text-center">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className="rounded-l-none"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-sm text-gray-600">
                  Total: {(product.price * quantity).toLocaleString('fr-FR')}€
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 h-12 text-lg"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {product.stock === 0 ? 'Rupture de stock' : 'Ajouter au panier'}
              </Button>
              <Button variant="outline" className="h-12 px-8">
                Acheter maintenant
              </Button>
            </div>
          </div>

          {/* Avantages */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center space-x-3">
                <Truck className="h-5 w-5 text-green-600" />
                <span className="text-sm">Livraison gratuite dès 50€</span>
              </div>
              <div className="flex items-center space-x-3">
                <RotateCcw className="h-5 w-5 text-blue-600" />
                <span className="text-sm">Retours gratuits sous 30 jours</span>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-purple-600" />
                <span className="text-sm">Garantie 2 ans constructeur</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Produits similaires */}
      {similarProducts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Produits similaires</h2>
            <Button variant="outline" asChild>
              <Link href={`/products?category=${product.category}`}>
                Voir tout
              </Link>
            </Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarProducts.map((similarProduct) => (
              <ProductCard
                key={similarProduct.id}
                product={similarProduct}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
