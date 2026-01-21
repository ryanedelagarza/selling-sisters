import { Link } from 'react-router-dom';
import { PRODUCT_CATEGORIES } from '../types/product';
import Card from '../components/ui/Card';

export default function HomePage() {
  return (
    <div className="max-w-2xl mx-auto">
      {/* Hero section */}
      <div className="text-center mb-8">
        {/* Logo/Brand */}
        <div className="mb-4">
          <span className="text-5xl" role="img" aria-label="Art palette">
            🎨
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-display text-primary mb-3">
          Selling Sisters
        </h1>

        <p className="text-lg text-gray-600 max-w-md mx-auto">
          We're Dylan and Logan—two sisters bringing handmade art to you!
          Pick something special below.
        </p>
      </div>

      {/* Category cards */}
      <div className="grid gap-4 md:gap-6">
        {PRODUCT_CATEGORIES.map((category) => (
          <Link
            key={category.type}
            to={category.path}
            className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-2xl"
          >
            <Card 
              variant="interactive" 
              padding="lg"
              className="flex items-center gap-4 md:gap-6"
            >
              {/* Icon */}
              <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 flex items-center justify-center bg-primary-light rounded-2xl">
                <span className="text-4xl md:text-5xl" role="img" aria-hidden="true">
                  {category.icon}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h2 className="text-xl md:text-2xl font-display text-gray-800 mb-1">
                  {category.label}
                </h2>
                <p className="text-gray-600">
                  {category.description}
                </p>
              </div>

              {/* Arrow */}
              <div className="flex-shrink-0 text-gray-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Footer note */}
      <p className="text-center text-sm text-gray-500 mt-8">
        No payment needed - just send us your order request!
      </p>
    </div>
  );
}
