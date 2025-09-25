'use client';

import Link from 'next/link';
import { ShoppingCart, Search, User, Menu, Zap, Package, Grid3X3, Gamepad2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useCart } from '@/hooks/useCart';
import { CartSidebar } from '@/components/cart/CartSidebar';

export function Header() {
  const { cart } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2" prefetch={true}>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Zap className="h-5 w-5" />
            </div>
            <div className="text-xl">
              <span className="font-bold text-gray-900">DigitalFada</span>
              <span className="font-light text-primary italic">.shop</span>
            </div>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/products"
              className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
              prefetch={true}
            >
              <Package className="h-4 w-4" />
              Produits
            </Link>
            <Link 
              href="/categories"
              className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
              prefetch={true}
            >
              <Grid3X3 className="h-4 w-4" />
              Catégories
            </Link>
            <Link 
              href="/deals" 
              className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
              prefetch={true}
            >
              <Gamepad2 className="h-4 w-4" />
              Gaming
            </Link>
            <Link 
              href="/about"
              className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
              prefetch={true}
            >
              <Info className="h-4 w-4" />
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
                <SheetHeader className="p-6 pb-4 border-b">
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col space-y-4 mt-8 px-6">
                  <Link 
                    href="/products"
                    className="flex items-center gap-3 text-lg font-medium transition-colors hover:text-primary"
                  >
                    <Package className="h-5 w-5" />
                    Produits
                  </Link>
                  <Link 
                    href="/categories"
                    className="flex items-center gap-3 text-lg font-medium transition-colors hover:text-primary"
                  >
                    <Grid3X3 className="h-5 w-5" />
                    Catégories
                  </Link>
                  <Link 
                    href="/deals" 
                    className="flex items-center gap-3 text-lg font-medium transition-colors hover:text-primary"
                  >
                    <Gamepad2 className="h-5 w-5" />
                    Gaming
                  </Link>
                  <Link 
                    href="/about" 
                    className="flex items-center gap-3 text-lg font-medium transition-colors hover:text-primary"
                  >
                    <Info className="h-5 w-5" />
                    À propos
                  </Link>
                  <hr className="my-4" />
                  <Link 
                    href="/account" 
                    className="flex items-center gap-3 text-lg font-medium transition-colors hover:text-primary"
                  >
                    <User className="h-5 w-5" />
                    Mon compte
                  </Link>
                  <Link 
                    href="/orders" 
                    className="flex items-center gap-3 text-lg font-medium transition-colors hover:text-primary"
                  >
                    <ShoppingCart className="h-5 w-5" />
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

