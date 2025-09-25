'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowLeft, 
  Truck, 
  Shield, 
  CreditCard,
  Heart 
} from 'lucide-react';

export default function CartPage() {
  const { cart, updateQuantity, removeItem, clearCart } = useCart();

  if (cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-lg mx-auto text-center space-y-6">
          <div className="flex items-center justify-center w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100">
            <ShoppingCart className="h-12 w-12 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Votre panier est vide</h1>
          <p className="text-gray-600">
            Découvrez notre sélection de produits et ajoutez vos coups de cœur à votre panier !
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/products">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Découvrir nos produits
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/">Retour à l'accueil</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mon panier</h1>
          <p className="text-gray-600 mt-1">
            {cart.itemCount} article{cart.itemCount > 1 ? 's' : ''} dans votre panier
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/products">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continuer mes achats
          </Link>
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Liste des articles */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Articles ({cart.itemCount})</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Vider le panier
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.items.map((item, index) => (
                <div key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}>
                  <div className="flex gap-4">
                    
                    {/* Image produit */}
                    <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Informations produit */}
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <Link 
                            href={`/products/${item.product.id}`}
                            className="font-semibold text-gray-900 hover:text-primary line-clamp-2"
                          >
                            {item.product.name}
                          </Link>
                          <p className="text-sm text-gray-600">{item.product.brand}</p>
                          
                          {/* Options sélectionnées */}
                          {(item.selectedSize || item.selectedColor) && (
                            <div className="flex gap-2 mt-1">
                              {item.selectedSize && (
                                <Badge variant="outline" className="text-xs">
                                  Taille: {item.selectedSize}
                                </Badge>
                              )}
                              {item.selectedColor && (
                                <Badge variant="outline" className="text-xs">
                                  Couleur: {item.selectedColor}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                        
                        {/* Prix */}
                        <div className="text-right">
                          <p className="font-bold text-lg">
                            {(item.product.price * item.quantity).toLocaleString('fr-FR')}€
                          </p>
                          {item.product.originalPrice && (
                            <p className="text-sm text-gray-500 line-through">
                              {(item.product.originalPrice * item.quantity).toLocaleString('fr-FR')}€
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Contrôles quantité */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center border rounded-lg">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="h-8 w-8 p-0 rounded-r-none"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="px-3 py-1 text-sm min-w-[2rem] text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              disabled={item.quantity >= item.product.stock}
                              className="h-8 w-8 p-0 rounded-l-none"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <span className="text-sm text-gray-600">
                            Prix unitaire: {item.product.price.toLocaleString('fr-FR')}€
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-600">
                            <Heart className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeItem(item.product.id)}
                            className="text-gray-500 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {index < cart.items.length - 1 && <Separator className="my-4" />}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Résumé de commande */}
        <div className="space-y-6">
          
          {/* Total */}
          <Card>
            <CardHeader>
              <CardTitle>Résumé de la commande</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Sous-total ({cart.itemCount} article{cart.itemCount > 1 ? 's' : ''})</span>
                  <span>{cart.total.toLocaleString('fr-FR')}€</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Livraison</span>
                  <span className="text-green-600">
                    {cart.total >= 50 ? 'Gratuite' : '4,90€'}
                  </span>
                </div>
                {cart.total < 50 && (
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Livraison gratuite dès 50€</span>
                    <span>Il vous manque {(50 - cart.total).toFixed(2)}€</span>
                  </div>
                )}
              </div>
              
              <Separator />
              
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>
                  {(cart.total + (cart.total >= 50 ? 0 : 4.9)).toLocaleString('fr-FR')}€
                </span>
              </div>

              <Button className="w-full h-12 text-lg" size="lg">
                <CreditCard className="h-5 w-5 mr-2" />
                Passer la commande
              </Button>
              
              <p className="text-xs text-gray-600 text-center">
                Paiement sécurisé par cryptage SSL
              </p>
            </CardContent>
          </Card>

          {/* Avantages */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center space-x-3">
                <Truck className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Livraison gratuite</p>
                  <p className="text-xs text-gray-600">Dès 50€ d'achat</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">Paiement sécurisé</p>
                  <p className="text-xs text-gray-600">Vos données protégées</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <ArrowLeft className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium">Retours gratuits</p>
                  <p className="text-xs text-gray-600">Sous 30 jours</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Code promo */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Code promotionnel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Entrez votre code"
                  className="flex-1 px-3 py-2 border rounded-md text-sm"
                />
                <Button variant="outline" size="sm">
                  Appliquer
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
