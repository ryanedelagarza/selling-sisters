export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto py-6 border-t border-gray-100">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex flex-col items-center gap-2 text-center">
          {/* Tagline */}
          <p className="text-sm text-gray-500">
            Handmade with{' '}
            <span role="img" aria-label="love">❤️</span>
            {' '}by Dylan & Logan
          </p>

          {/* Copyright */}
          <p className="text-xs text-gray-400">
            © {currentYear} Selling Sisters
          </p>
        </div>
      </div>
    </footer>
  );
}
