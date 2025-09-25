import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function ProductCardSkeleton() {
  return (
    <Card className="group relative overflow-hidden border-0 shadow-sm">
      <CardContent className="p-0">
        {/* Image skeleton */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Skeleton className="absolute inset-0" />
          
          {/* Action buttons skeleton */}
          <div className="absolute top-3 right-3 flex flex-col space-y-2">
            <Skeleton className="h-9 w-9 rounded-full" />
            <Skeleton className="h-9 w-9 rounded-full" />
          </div>
        </div>

        {/* Content skeleton */}
        <div className="p-4 space-y-3">
          
          {/* Brand and category */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>

          {/* Product name */}
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-4 w-3/4" />

          {/* Rating */}
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-4 rounded-sm" />
              ))}
            </div>
            <Skeleton className="h-4 w-16" />
          </div>

          {/* Price */}
          <div className="flex items-center space-x-2">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>

          {/* Badges */}
          <div className="flex space-x-2">
            <Skeleton className="h-5 w-12 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>

          {/* Add to cart button */}
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
}

export function ProductCardSkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
