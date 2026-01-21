import { Routes, Route } from 'react-router-dom';
import { OrderProvider } from './context/OrderContext';
import Layout from './components/layout/Layout';
import ErrorBoundary from './components/shared/ErrorBoundary';

// Pages
import HomePage from './pages/HomePage';
import BraceletsPage from './pages/BraceletsPage';
import PortraitsPage from './pages/PortraitsPage';
import ColoringPagesPage from './pages/ColoringPagesPage';
import ProductDetailPage from './pages/ProductDetailPage';
import NotFoundPage from './pages/NotFoundPage';

// Order flow pages
import CustomizePage from './pages/order/CustomizePage';
import ContactPage from './pages/order/ContactPage';
import ReviewPage from './pages/order/ReviewPage';
import ConfirmationPage from './pages/order/ConfirmationPage';

function App() {
  return (
    <ErrorBoundary>
      <OrderProvider>
        <Layout>
          <Routes>
            {/* Home */}
            <Route path="/" element={<HomePage />} />
            
            {/* Product listings */}
            <Route path="/bracelets" element={<BraceletsPage />} />
            <Route path="/portraits" element={<PortraitsPage />} />
            <Route path="/coloring-pages" element={<ColoringPagesPage />} />
            
            {/* Product details */}
            <Route path="/bracelets/:productId" element={<ProductDetailPage />} />
            <Route path="/portraits/:productId" element={<ProductDetailPage />} />
            <Route path="/coloring-pages/:productId" element={<ProductDetailPage />} />
            
            {/* Order flow */}
            <Route path="/order/customize" element={<CustomizePage />} />
            <Route path="/order/contact" element={<ContactPage />} />
            <Route path="/order/review" element={<ReviewPage />} />
            <Route path="/order/confirmation" element={<ConfirmationPage />} />
            
            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </OrderProvider>
    </ErrorBoundary>
  );
}

export default App;
