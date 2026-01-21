import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useOrder } from '../../context/OrderContext';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

export default function ConfirmationPage() {
  const navigate = useNavigate();
  const { state, resetOrder } = useOrder();
  const { selectedProduct, contactInfo, currentStep } = state;

  // If not coming from a completed order, redirect home
  useEffect(() => {
    if (currentStep !== 'confirmation' || !selectedProduct) {
      navigate('/');
    }
  }, [currentStep, selectedProduct, navigate]);

  const handleOrderAnother = () => {
    resetOrder();
    navigate('/');
  };

  if (!selectedProduct) {
    return null;
  }

  return (
    <div className="max-w-xl mx-auto text-center">
      {/* Success icon */}
      <div className="mb-6">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-accent-light rounded-full mb-4">
          <svg className="w-10 h-10 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl md:text-3xl font-display text-gray-800 mb-2">
          Order Sent!
        </h1>
        <p className="text-gray-600">
          Thanks for your order, {contactInfo.name?.split(' ')[0]}!
        </p>
      </div>

      {/* Order summary */}
      <Card className="text-left mb-6">
        <h2 className="font-semibold text-gray-800 mb-4">What happens next?</h2>
        
        <ol className="space-y-4">
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-primary-light text-primary rounded-full flex items-center justify-center text-sm font-medium">
              1
            </span>
            <div>
              <p className="font-medium text-gray-800">We received your order</p>
              <p className="text-sm text-gray-500">
                Dylan & Logan got your request for {selectedProduct.title}
              </p>
            </div>
          </li>
          
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-primary-light text-primary rounded-full flex items-center justify-center text-sm font-medium">
              2
            </span>
            <div>
              <p className="font-medium text-gray-800">We'll reach out</p>
              <p className="text-sm text-gray-500">
                We'll contact you at {contactInfo.email || contactInfo.phone} to confirm details
              </p>
            </div>
          </li>
          
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-primary-light text-primary rounded-full flex items-center justify-center text-sm font-medium">
              3
            </span>
            <div>
              <p className="font-medium text-gray-800">We get to work!</p>
              <p className="text-sm text-gray-500">
                We'll start making your custom order with care
              </p>
            </div>
          </li>
        </ol>
      </Card>

      {/* Actions */}
      <div className="space-y-3">
        <Button onClick={handleOrderAnother} className="w-full">
          Order Something Else
        </Button>
        
        <Link to="/" onClick={() => resetOrder()}>
          <Button variant="ghost" className="w-full">
            Back to Home
          </Button>
        </Link>
      </div>

      {/* Thank you note */}
      <p className="text-sm text-gray-500 mt-8">
        Thank you for supporting our small business!{' '}
        <span role="img" aria-label="heart">❤️</span>
      </p>
    </div>
  );
}
