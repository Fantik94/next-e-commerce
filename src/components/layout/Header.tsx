'use client';

import Link from 'next/link';
import { ShoppingCart, Search, User, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useCart } from '@/hooks/useCart';
import { CartSidebar } from '@/components/cart/CartSidebar';

export function Header() {
  const { cart } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
              E
            </div>
            <span className="font-bold text-xl">NextCommerce</span>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/products" 
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Produits
            </Link>
            <Link 
              href="/categories" 
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Catégories
            </Link>
            <Link 
              href="/deals" 
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Promotions
            </Link>
            <Link 
              href="/about" 
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              À propos
            </Link>
          </nav>

          {/* Barre de recherche */}
          <div className="hidden lg:flex items-center flex-1 max-w-sm mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher des produits..."
                className="pl-10"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            
            {/* Recherche mobile */}
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Search className="h-5 w-5" />
            </Button>

            {/* Compte utilisateur */}
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>

            {/* Panier */}
            <CartSidebar>
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cart.itemCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center animate-bounce-subtle"
                  >
                    {cart.itemCount}
                  </Badge>
                )}
              </Button>
            </CartSidebar>

            {/* Menu mobile */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <nav className="flex flex-col space-y-4 mt-8">
                  <Link 
                    href="/products" 
                    className="text-lg font-medium transition-colors hover:text-primary"
                  >
                    Produits
                  </Link>
                  <Link 
                    href="/categories" 
                    className="text-lg font-medium transition-colors hover:text-primary"
                  >
                    Catégories
                  </Link>
                  <Link 
                    href="/deals" 
                    className="text-lg font-medium transition-colors hover:text-primary"
                  >
                    Promotions
                  </Link>
                  <Link 
                    href="/about" 
                    className="text-lg font-medium transition-colors hover:text-primary"
                  >
                    À propos
                  </Link>
                  <hr className="my-4" />
                  <Link 
                    href="/account" 
                    className="text-lg font-medium transition-colors hover:text-primary"
                  >
                    Mon compte
                  </Link>
                  <Link 
                    href="/orders" 
                    className="text-lg font-medium transition-colors hover:text-primary"
                  >
                    Mes commandes
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

