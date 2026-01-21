import { Link } from 'react-router-dom';
import { useBracelets } from '../hooks';
import { ProductGrid } from '../components/products';

export default function BraceletsPage() {
  const { data, isLoading, error } = useBracelets();
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
          <span className="text-3xl" role="img" aria-hidden="true">📿</span>
          <h1 className="text-2xl md:text-3xl font-display text-gray-800">
            Bracelets
          </h1>
        </div>
        <p className="text-gray-600">
          Handmade friendship bracelets - pick your style and colors!
        </p>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-6">
          <p className="text-error text-sm">
            Oops! We couldn't load the bracelets. Please try again.
          </p>
        </div>
      )}

      {/* Products grid */}
      <ProductGrid
        products={products}
        basePath="/bracelets"
        isLoading={isLoading}
        emptyMessage="We're making more bracelets! Check back soon."
      />
    </div>
  );
}
