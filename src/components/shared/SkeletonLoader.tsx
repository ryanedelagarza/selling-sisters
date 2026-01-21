import { clsx } from 'clsx';

interface SkeletonProps {
  className?: string;
}

/**
 * Basic skeleton element with shimmer animation
 */
export function Skeleton({ className }: SkeletonProps) {
  return <div className={clsx('skeleton-shimmer rounded', className)} />;
}

/**
 * Skeleton for product card - matches ProductCard dimensions
 */
export function ProductCardSkeleton() {
  return (
    <div 
      className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-card"
      aria-hidden="true"
    >
      {/* Image skeleton - square aspect ratio */}
      <Skeleton className="aspect-square w-full" />
      
      {/* Content skeleton - matches ProductCard padding */}
      <div className="p-3 md:p-4 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}

/**
 * Skeleton grid for product listing
 */
export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Skeleton for category card on home page
 */
export function CategoryCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center">
      <Skeleton className="w-16 h-16 rounded-full mx-auto mb-4" />
      <Skeleton className="h-6 w-24 mx-auto mb-2" />
      <Skeleton className="h-4 w-32 mx-auto" />
    </div>
  );
}

/**
 * Skeleton for product detail page
 */
export function ProductDetailSkeleton() {
  return (
    <div className="max-w-2xl mx-auto">
      {/* Image skeleton */}
      <Skeleton className="aspect-square w-full rounded-xl mb-6" />
      
      {/* Title */}
      <Skeleton className="h-8 w-3/4 mb-3" />
      
      {/* Description */}
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-2/3 mb-6" />
      
      {/* Details */}
      <div className="space-y-3">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-48" />
      </div>
      
      {/* Button */}
      <Skeleton className="h-12 w-full mt-8 rounded-lg" />
    </div>
  );
}

export default Skeleton;
