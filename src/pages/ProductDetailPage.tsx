import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { useProduct } from '../hooks';
import { useOrder } from '../context/OrderContext';
import { isBraceletProduct, isColoringPageProduct, isPortraitProduct } from '../types/product';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/shared/EmptyState';
import { ProductDetailSkeleton } from '../components/shared/SkeletonLoader';

export default function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { selectProduct } = useOrder();

  // Determine the product type from the URL path
  const pathSegment = location.pathname.split('/')[1];
  const backPath = `/${pathSegment}`;

  // Fetch product data using React Query
  const { data: product, isLoading, error } = useProduct(productId);

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        <Link
          to={backPath}
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary mb-4 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>
        <ProductDetailSkeleton />
      </div>
    );
  }

  // Error or not found
  if (error || !product) {
    return (
      <EmptyState
        icon="🔍"
        title="Product Not Found"
        description="We couldn't find that product. It might have been removed or sold out!"
        actionLabel="Browse Products"
        actionPath={backPath}
      />
    );
  }

  const isSoldOut = product.status === 'sold_out';

  const handleStartOrder = () => {
    selectProduct(product);
    navigate('/order/customize');
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back link */}
      <Link
        to={backPath}
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary mb-4 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to {pathSegment.replace('-', ' ')}
      </Link>

      {/* Product image */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-6">
        <img
          src={product.thumbnail_url}
          alt={product.title}
          className="w-full h-full object-cover"
        />
        {isSoldOut && (
          <div className="absolute top-4 right-4">
            <Badge variant="sold-out" className="text-base px-4 py-1">Sold Out</Badge>
          </div>
        )}
      </div>

      {/* Product info */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-display text-gray-800 mb-2">
          {product.title}
        </h1>
        <p className="text-gray-600 text-lg">
          {product.short_desc}
        </p>
      </div>

      {/* Type-specific details */}
      <div className="bg-gray-50 rounded-xl p-4 mb-6">
        {isBraceletProduct(product) && (
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-gray-500">Style:</span>
              <span className="ml-2 text-gray-800 capitalize">
                {product.bracelet.style.replace('_', ' ')}
              </span>
            </div>
            {product.bracelet.materials && (
              <div>
                <span className="text-sm font-medium text-gray-500">Materials:</span>
                <span className="ml-2 text-gray-800">{product.bracelet.materials}</span>
              </div>
            )}
            <div>
              <span className="text-sm font-medium text-gray-500">Available Colors:</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {product.bracelet.color_options.map((color) => (
                  <span
                    key={color}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-white rounded-full text-sm border"
                  >
                    {color}
                  </span>
                ))}
              </div>
            </div>
            {product.bracelet.max_colors && (
              <p className="text-sm text-gray-500">
                Pick up to {product.bracelet.max_colors} colors for your bracelet!
              </p>
            )}
          </div>
        )}

        {isPortraitProduct(product) && (
          <div className="space-y-3">
            {product.portrait.style_options && (
              <div>
                <span className="text-sm font-medium text-gray-500">Style Options:</span>
                <span className="ml-2 text-gray-800">
                  {product.portrait.style_options.join(', ')}
                </span>
              </div>
            )}
            {product.portrait.size_options && (
              <div>
                <span className="text-sm font-medium text-gray-500">Size Options:</span>
                <span className="ml-2 text-gray-800">
                  {product.portrait.size_options.join(', ')}
                </span>
              </div>
            )}
            {product.portrait.turnaround && (
              <div>
                <span className="text-sm font-medium text-gray-500">Turnaround Time:</span>
                <span className="ml-2 text-gray-800">{product.portrait.turnaround}</span>
              </div>
            )}
            {product.portrait.requires_upload && (
              <p className="text-sm text-amber-600 flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Reference photo required
              </p>
            )}
          </div>
        )}

        {isColoringPageProduct(product) && (
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-gray-500">Book:</span>
              <span className="ml-2 text-gray-800">{product.coloring_page.book_name}</span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Page:</span>
              <span className="ml-2 text-gray-800">{product.coloring_page.page_name}</span>
            </div>
            <p className="text-sm text-gray-500">
              Tell us how you'd like us to color this page!
            </p>
          </div>
        )}
      </div>

      {/* CTA Button */}
      {isSoldOut ? (
        <Button disabled className="w-full">
          Sold Out
        </Button>
      ) : (
        <Button onClick={handleStartOrder} className="w-full">
          Start Order
        </Button>
      )}
    </div>
  );
}
