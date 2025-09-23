'use client';

import { useState } from 'react';
import { ProductFilters as Filters } from '@/types';
import { categories } from '@/data/products';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { X, Filter, Star } from 'lucide-react';

interface ProductFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  onClearFilters: () => void;
  productCount: number;
}

const brands = ['Apple', 'Samsung', 'Nike', 'Adidas', 'Sony', 'LG', 'Urban Style', 'SportTech', 'LightCo'];

export function ProductFilters({ 
  filters, 
  onFiltersChange, 
  onClearFilters, 
  productCount 
}: ProductFiltersProps) {
  const [priceRange, setPriceRange] = useState([filters.minPrice || 0, filters.maxPrice || 2000]);

  const handleCategoryChange = (category: string, checked: boolean) => {
    onFiltersChange({
      ...filters,
      category: checked ? category : undefined
    });
  };

  const handleBrandChange = (brand: string, checked: boolean) => {
    onFiltersChange({
      ...filters,
      brand: checked ? brand : undefined
    });
  };

  const handlePriceChange = (values: number[]) => {
    setPriceRange(values);
    onFiltersChange({
      ...filters,
      minPrice: values[0],
      maxPrice: values[1]
    });
  };

  const handleRatingChange = (rating: number, checked: boolean) => {
    onFiltersChange({
      ...filters,
      rating: checked ? rating : undefined
    });
  };

  const handleStockChange = (checked: boolean) => {
    onFiltersChange({
      ...filters,
      inStock: checked ? true : undefined
    });
  };

  const handleNewChange = (checked: boolean) => {
    onFiltersChange({
      ...filters,
      isNew: checked ? true : undefined
    });
  };

  const handleFeaturedChange = (checked: boolean) => {
    onFiltersChange({
      ...filters,
      isFeatured: checked ? true : undefined
    });
  };

  const activeFiltersCount = Object.values(filters).filter(value => 
    value !== undefined && value !== false
  ).length;

  return (
    <Card className="sticky top-24">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </CardTitle>
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4 mr-1" />
              Effacer
            </Button>
          )}
        </div>
        <p className="text-sm text-gray-600">
          {productCount} produit{productCount > 1 ? 's' : ''} trouvé{productCount > 1 ? 's' : ''}
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        
        {/* Catégories */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-gray-900">Catégories</h4>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category.id}`}
                  checked={filters.category === category.name}
                  onCheckedChange={(checked) => 
                    handleCategoryChange(category.name, checked as boolean)
                  }
                />
                <label
                  htmlFor={`category-${category.id}`}
                  className="text-sm text-gray-700 cursor-pointer flex-1"
                >
                  {category.name}
                </label>
                <Badge variant="outline" className="text-xs">
                  {category.productCount}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Prix */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-gray-900">Prix</h4>
          <div className="px-2">
            <Slider
              value={priceRange}
              onValueChange={handlePriceChange}
              max={2000}
              min={0}
              step={10}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>{priceRange[0]}€</span>
              <span>{priceRange[1]}€</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Marques */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-gray-900">Marques</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {brands.map((brand) => (
              <div key={brand} className="flex items-center space-x-2">
                <Checkbox
                  id={`brand-${brand}`}
                  checked={filters.brand === brand}
                  onCheckedChange={(checked) => 
                    handleBrandChange(brand, checked as boolean)
                  }
                />
                <label
                  htmlFor={`brand-${brand}`}
                  className="text-sm text-gray-700 cursor-pointer"
                >
                  {brand}
                </label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Note minimum */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-gray-900">Note minimum</h4>
          <div className="space-y-2">
            {[4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center space-x-2">
                <Checkbox
                  id={`rating-${rating}`}
                  checked={filters.rating === rating}
                  onCheckedChange={(checked) => 
                    handleRatingChange(rating, checked as boolean)
                  }
                />
                <label
                  htmlFor={`rating-${rating}`}
                  className="text-sm text-gray-700 cursor-pointer flex items-center"
                >
                  <div className="flex mr-2">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-3 w-3 ${
                          i < rating 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-300'
                        }`} 
                      />
                    ))}
                  </div>
                  et plus
                </label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Options spéciales */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-gray-900">Options</h4>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="in-stock"
                checked={filters.inStock || false}
                onCheckedChange={handleStockChange}
              />
              <label
                htmlFor="in-stock"
                className="text-sm text-gray-700 cursor-pointer"
              >
                En stock uniquement
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is-new"
                checked={filters.isNew || false}
                onCheckedChange={handleNewChange}
              />
              <label
                htmlFor="is-new"
                className="text-sm text-gray-700 cursor-pointer"
              >
                Nouveautés
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is-featured"
                checked={filters.isFeatured || false}
                onCheckedChange={handleFeaturedChange}
              />
              <label
                htmlFor="is-featured"
                className="text-sm text-gray-700 cursor-pointer"
              >
                Produits populaires
              </label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
