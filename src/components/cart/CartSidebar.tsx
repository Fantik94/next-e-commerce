'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  X,
  ArrowRight 
} from 'lucide-react';

interface CartSidebarProps {
  children: React.ReactNode;
}

export function CartSidebar({ children }: CartSidebarProps) {
  const { cart, updateQuantity, removeItem } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-96 p-0">
        <div className="flex flex-col h-full">
          
          {/* Header */}
          <SheetHeader className="p-6 pb-4 border-b">
            <div className="flex items-center justify-between">
              <SheetTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Mon panier
                {cart.itemCount > 0 && (
                  <Badge variant="secondary">
                    {cart.itemCount}
                  </Badge>
                )}
              </SheetTitle>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </SheetHeader>

          {cart.items.length === 0 ? (
            
            /* Panier vide */
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100">
                <ShoppingCart className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold">Votre panier est vide</h3>
              <p className="text-gray-600 text-sm">
                Découvrez nos produits et ajoutez vos favoris !
              </p>
              <Button onClick={() => setIsOpen(false)} asChild>
                <Link href="/products">
                  Découvrir nos produits
                </Link>
              </Button>
            </div>
          ) : (
            <>
              
              {/* Liste des articles */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.items.map((item) => (
                  <div 
                    key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                    className="flex gap-3 group"
                  >
                    
                    {/* Image */}
                    <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Infos */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <h4 className="font-medium text-sm line-clamp-2 leading-tight">
                        {item.product.name}
                      </h4>
                      <p className="text-xs text-gray-600">{item.product.brand}</p>
                      
                      {/* Options */}
                      {(item.selectedSize || item.selectedColor) && (
                        <div className="flex gap-1">
                          {item.selectedSize && (
                            <Badge variant="outline" className="text-xs px-1 py-0">
                              {item.selectedSize}
                            </Badge>
                          )}
                          {item.selectedColor && (
                            <Badge variant="outline" className="text-xs px-1 py-0">
                              {item.selectedColor}
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Prix et contrôles */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm min-w-[1.5rem] text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                            className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">
                            {(item.product.price * item.quantity).toLocaleString('fr-FR')}€
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.product.id)}
                            className="h-6 w-6 p-0 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Footer avec total et actions */}
              <div className="p-6 space-y-4 border-t bg-gray-50">
                
                {/* Total */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Sous-total</span>
                    <span>{cart.total.toLocaleString('fr-FR')}€</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Livraison</span>
                    <span className={cart.total >= 50 ? 'text-green-600' : ''}>
                      {cart.total >= 50 ? 'Gratuite' : '4,90€'}
                    </span>
                  </div>
                  {cart.total < 50 && (
                    <p className="text-xs text-gray-600">
                      Livraison gratuite dès 50€ ({(50 - cart.total).toFixed(2)}€ manquants)
                    </p>
                  )}
                  <Separator className="my-2" />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>
                      {(cart.total + (cart.total >= 50 ? 0 : 4.9)).toLocaleString('fr-FR')}€
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <Button 
                    className="w-full" 
                    onClick={() => setIsOpen(false)}
                    asChild
                  >
                    <Link href="/cart">
                      Voir le panier complet
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setIsOpen(false)}
                    asChild
                  >
                    <Link href="/products">
                      Continuer mes achats
                    </Link>
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
