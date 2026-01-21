import { Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';

export default function Header() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo / Brand */}
          <Link 
            to="/" 
            className={clsx(
              'flex items-center gap-2 transition-transform hover:scale-105',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg'
            )}
          >
            <span className="text-2xl" role="img" aria-label="Selling Sisters logo">
              🎨
            </span>
            <span className="font-display text-xl text-primary">
              Selling Sisters
            </span>
          </Link>

          {/* Navigation - only show when not on home */}
          {!isHome && (
            <nav aria-label="Main navigation">
              <Link
                to="/"
                className={clsx(
                  'flex items-center gap-1 text-sm font-medium text-gray-600',
                  'hover:text-primary transition-colors',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded'
                )}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>Home</span>
              </Link>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
