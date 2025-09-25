'use client';

import { useState, useMemo } from 'react';
import { products } from '@/data/products';
import { ProductFilters, SearchParams } from '@/types';
import { useCart } from '@/hooks/useCart';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductFilters as FiltersComponent } from '@/components/product/ProductFilters';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Grid, List, SlidersHorizontal } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

export default function ProductsPage() {
  const { addItem } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchParams, setSearchParams] = useState<SearchParams>({
    query: '',
    filters: {},
    sortBy: 'name',
    sortOrder: 'asc',
    page: 1,
    limit: 12
  });

  // Filtrage et tri des produits
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    // Recherche textuelle
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    }

    // Application des filtres
    const { filters } = searchParams;
    
    if (filters.category) {
      filtered = filtered.filter(product => product.category === filters.category);
    }
    
    if (filters.brand) {
      filtered = filtered.filter(product => product.brand === filters.brand);
    }
    
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      filtered = filtered.filter(product => {
        const price = product.price;
        const minOk = filters.minPrice === undefined || price >= filters.minPrice;
        const maxOk = filters.maxPrice === undefined || price <= filters.maxPrice;
        return minOk && maxOk;
      });
    }
    
    if (filters.rating) {
      filtered = filtered.filter(product => product.rating >= filters.rating!);
    }
    
    if (filters.inStock) {
      filtered = filtered.filter(product => product.stock > 0);
    }
    
    if (filters.isNew) {
      filtered = filtered.filter(product => product.isNew);
    }
    
    if (filters.isFeatured) {
      filtered = filtered.filter(product => product.isFeatured);
    }

    // Tri
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (searchParams.sortBy) {
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'rating':
          comparison = a.rating - b.rating;
          break;
        case 'newest':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'popular':
          comparison = a.reviewCount - b.reviewCount;
          break;
        case 'name':
        default:
          comparison = a.name.localeCompare(b.name);
          break;
      }
      
      return searchParams.sortOrder === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [searchQuery, searchParams]);

  const handleFiltersChange = (newFilters: ProductFilters) => {
    setSearchParams(prev => ({
      ...prev,
      filters: newFilters,
      page: 1 // Reset page when filters change
    }));
  };

  const handleClearFilters = () => {
    setSearchParams(prev => ({
      ...prev,
      filters: {},
      page: 1
    }));
    setSearchQuery('');
  };

  const handleSortChange = (sortValue: string) => {
    const [sortBy, sortOrder] = sortValue.split('-');
    setSearchParams(prev => ({
      ...prev,
      sortBy: sortBy as any,
      sortOrder: sortOrder as 'asc' | 'desc'
    }));
  };

  const handleAddToCart = (product: any) => {
    addItem(product, 1);
  };

  const activeFiltersCount = Object.values(searchParams.filters).filter(value => 
    value !== undefined && value !== false
  ).length;

  return (
    <div className="container mx-auto px-4 py-8">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Catalogue produits</h1>
        <p className="text-gray-600">Découvrez notre sélection de produits de qualité</p>
      </div>

      {/* Barre de recherche et contrôles */}
      <div className="mb-8 space-y-4">
        
        {/* Recherche */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher des produits..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12"
          />
        </div>

        {/* Contrôles */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          
          {/* Tri et vue */}
          <div className="flex items-center gap-4">
            <Select value={`${searchParams.sortBy}-${searchParams.sortOrder}`} onValueChange={handleSortChange}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name-asc">Nom (A-Z)</SelectItem>
                <SelectItem value="name-desc">Nom (Z-A)</SelectItem>
                <SelectItem value="price-asc">Prix croissant</SelectItem>
                <SelectItem value="price-desc">Prix décroissant</SelectItem>
                <SelectItem value="rating-desc">Mieux notés</SelectItem>
                <SelectItem value="newest-desc">Plus récents</SelectItem>
                <SelectItem value="popular-desc">Plus populaires</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center border rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Filtres mobile */}
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filtres
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0">
                <SheetHeader className="p-6 pb-4 border-b">
                  <SheetTitle>Filtres</SheetTitle>
                </SheetHeader>
                <div className="p-6">
                  <FiltersComponent
                    filters={searchParams.filters}
                    onFiltersChange={handleFiltersChange}
                    onClearFilters={handleClearFilters}
                    productCount={filteredAndSortedProducts.length}
                  />
                </div>
              </SheetContent>
            </Sheet>

            <div className="text-sm text-gray-600">
              {filteredAndSortedProducts.length} produit{filteredAndSortedProducts.length > 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        
        {/* Filtres desktop */}
        <aside className="hidden lg:block w-80 flex-shrink-0">
          <FiltersComponent
            filters={searchParams.filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
            productCount={filteredAndSortedProducts.length}
          />
        </aside>

        {/* Grille de produits */}
        <main className="flex-1">
          {filteredAndSortedProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Aucun produit trouvé
              </h3>
              <p className="text-gray-600 mb-6">
                Essayez de modifier vos critères de recherche ou filtres
              </p>
              <Button onClick={handleClearFilters} variant="outline">
                Effacer les filtres
              </Button>
            </div>
          ) : (
            <div className={`
              ${viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6' 
                : 'space-y-4'
              }
            `}>
              {filteredAndSortedProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-in"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: 'both'
                  }}
                >
                  <ProductCard
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
