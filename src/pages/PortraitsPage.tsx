import { Link } from 'react-router-dom';
import { usePortraits } from '../hooks';
import { ProductGrid } from '../components/products';

export default function PortraitsPage() {
  const { data, isLoading, error } = usePortraits();
  const products = data?.products || [];

  return (
    <div>
      {/* Back link */}
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary mb-4 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </Link>

      {/* Page header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl" role="img" aria-hidden="true">🖼️</span>
          <h1 className="text-2xl md:text-3xl font-display text-gray-800">
            Portraits
          </h1>
        </div>
        <p className="text-gray-600">
          Custom artwork created just for you - pets, family, and more!
        </p>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-6">
          <p className="text-error text-sm">
            Oops! We couldn't load the portraits. Please try again.
          </p>
        </div>
      )}

      {/* Products grid */}
      <ProductGrid
        products={products}
        basePath="/portraits"
        isLoading={isLoading}
        emptyMessage="We're working on new portrait options! Check back soon."
      />
    </div>
  );
}
