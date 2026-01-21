import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md px-4">
        {/* Illustration */}
        <div className="text-6xl mb-6">🤔</div>

        <h1 className="text-2xl font-display text-gray-800 mb-3">
          Page Not Found
        </h1>

        <p className="text-gray-600 mb-6">
          Oops! We couldn't find that page. Let's get you back to something fun!
        </p>

        <Link to="/">
          <Button>Go Home</Button>
        </Link>
      </div>
    </div>
  );
}
