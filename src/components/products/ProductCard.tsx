import { Link } from 'react-router-dom';
import type { Product } from '../../types/product';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

interface ProductCardProps {
  product: Product;
  basePath: string;
}

export default function ProductCard({ product, basePath }: ProductCardProps) {
  const isSoldOut = product.status === 'sold_out';

  const cardContent = (
    <Card
      variant={isSoldOut ? 'default' : 'interactive'}
      padding="none"
      className={isSoldOut ? 'opacity-75' : ''}
    >
      {/* Image container */}
      <div className="relative aspect-square overflow-hidden rounded-t-xl bg-gray-100">
        <img
          src={product.thumbnail_url}
          alt={product.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        
        {/* Sold out badge */}
        {isSoldOut && (
          <div className="absolute top-2 right-2">
            <Badge variant="sold-out">Sold Out</Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 md:p-4">
        <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1">
          {product.title}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-2">
          {product.short_desc}
        </p>
      </div>
    </Card>
  );

  if (isSoldOut) {
    return <div className="cursor-not-allowed">{cardContent}</div>;
  }

  return (
    <Link
      to={`${basePath}/${product.product_id}`}
      className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-xl"
    >
      {cardContent}
    </Link>
  );
}
