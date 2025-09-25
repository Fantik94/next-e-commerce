import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function CategorySkeleton() {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6 text-center space-y-4">
        {/* Icon skeleton */}
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4">
          <Skeleton className="w-16 h-16 rounded-full" />
        </div>
        
        {/* Category name */}
        <Skeleton className="h-6 w-24 mx-auto" />
        
        {/* Description */}
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4 mx-auto" />
        
        {/* Product count badge */}
        <Skeleton className="h-5 w-20 mx-auto rounded-full" />
      </CardContent>
    </Card>
  );
}

export function CategorySkeletonGrid({ count = 5 }: { count?: number }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CategorySkeleton key={i} />
      ))}
    </div>
  );
}
