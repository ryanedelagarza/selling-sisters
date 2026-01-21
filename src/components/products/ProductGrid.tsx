import type { Product } from '../../types/product';
import ProductCard from './ProductCard';
import { ProductGridSkeleton } from '../shared/SkeletonLoader';
import EmptyState from '../shared/EmptyState';

interface ProductGridProps {
  products: Product[];
  basePath: string;
  isLoading?: boolean;
  emptyMessage?: string;
}

export default function ProductGrid({
  products,
  basePath,
  isLoading = false,
  emptyMessage = "We don't have any products here yet. Check back soon!",
}: ProductGridProps) {
  if (isLoading) {
    return <ProductGridSkeleton count={6} />;
  }

  if (products.length === 0) {
    return (
      <EmptyState
        icon="🎨"
        title="Coming Soon!"
        description={emptyMessage}
        actionLabel="Go Back Home"
        actionPath="/"
      />
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.product_id}
          product={product}
          basePath={basePath}
        />
      ))}
    </div>
  );
}
