import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../../context/OrderContext';
import { useOrderSubmit, isApiError } from '../../hooks';
import { isBraceletOrder, isColoringPageOrder, isPortraitOrder } from '../../types/order';
import type { ContactInfo, OrderDetails } from '../../types/order';
import OrderStepper from '../../components/order/OrderStepper';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import EmptyState from '../../components/shared/EmptyState';

export default function ReviewPage() {
  const navigate = useNavigate();
  const { state, setStep, setSubmitting, setSubmitError } = useOrder();
  const { selectedProduct, orderDetails, contactInfo, isSubmitting, submitError, idempotencyKey } = state;
  
  // Use the order submission hook
  const submitMutation = useOrderSubmit();

  // Redirect if no product selected
  useEffect(() => {
    if (!selectedProduct) {
      navigate('/');
    }
  }, [selectedProduct, navigate]);

  if (!selectedProduct || !orderDetails.type) {
    return (
      <EmptyState
        icon="🛒"
        title="No Order in Progress"
        description="Please select a product first!"
        actionLabel="Browse Products"
        actionPath="/"
      />
    );
  }

  const handleSubmit = async () => {
    if (!idempotencyKey || !orderDetails.type) {
      setSubmitError('Order data is incomplete. Please start over.');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      await submitMutation.mutateAsync({
        contact: contactInfo as ContactInfo,
        details: orderDetails as OrderDetails,
        idempotencyKey,
      });

      // Navigate to confirmation
      setStep('confirmation');
      navigate('/order/confirmation');
    } catch (error) {
      const message = isApiError(error) 
        ? error.message 
        : 'Something went wrong sending your order. Please try again in a moment.';
      setSubmitError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const formatPhone = (phone: string) => {
    if (!phone || phone.length < 10) return phone;
    return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`;
  };

  return (
    <div className="max-w-xl mx-auto">
      <OrderStepper currentStep="review" />

      <h1 className="text-2xl font-display text-gray-800 mb-6">
        Review Your Order
      </h1>

      {/* Product details section */}
      <Card className="mb-4">
        <div className="flex justify-between items-start mb-4">
          <h2 className="font-semibold text-gray-800">Product</h2>
          <button
            onClick={() => navigate('/order/customize')}
            className="text-sm text-primary hover:text-primary-hover font-medium"
          >
            Edit
          </button>
        </div>

        <div className="flex gap-4 mb-4">
          <img
            src={selectedProduct.thumbnail_url}
            alt={selectedProduct.title}
            className="w-16 h-16 rounded-lg object-cover"
          />
          <div>
            <p className="font-medium text-gray-800">{selectedProduct.title}</p>
            <p className="text-sm text-gray-500">{selectedProduct.short_desc}</p>
          </div>
        </div>

        {/* Order details by type */}
        <div className="border-t border-gray-100 pt-4 space-y-2">
          {isBraceletOrder(orderDetails) && (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Style:</span>
                <span className="text-gray-800 capitalize">
                  {orderDetails.style.replace('_', ' ')}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Colors:</span>
                <span className="text-gray-800">{orderDetails.colors.join(', ')}</span>
              </div>
              {orderDetails.notes && (
                <div className="text-sm">
                  <span className="text-gray-500">Notes:</span>
                  <p className="text-gray-800 mt-1 italic">"{orderDetails.notes}"</p>
                </div>
              )}
            </>
          )}

          {isColoringPageOrder(orderDetails) && (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Book:</span>
                <span className="text-gray-800">{orderDetails.book_name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Page:</span>
                <span className="text-gray-800">{orderDetails.page_name}</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-500">Instructions:</span>
                <p className="text-gray-800 mt-1 italic">"{orderDetails.coloring_instructions}"</p>
              </div>
            </>
          )}

          {isPortraitOrder(orderDetails) && (
            <>
              {orderDetails.style && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Style:</span>
                  <span className="text-gray-800">{orderDetails.style}</span>
                </div>
              )}
              {orderDetails.size && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Size:</span>
                  <span className="text-gray-800">{orderDetails.size}</span>
                </div>
              )}
              <div className="text-sm">
                <span className="text-gray-500">Description:</span>
                <p className="text-gray-800 mt-1 italic">"{orderDetails.subject_description}"</p>
              </div>
              {orderDetails.reference_image_url && (
                <div className="mt-3">
                  <span className="text-sm text-gray-500">Reference Photo:</span>
                  <img
                    src={orderDetails.reference_image_url}
                    alt="Reference"
                    className="mt-2 w-24 h-24 rounded-lg object-cover"
                  />
                </div>
              )}
            </>
          )}
        </div>
      </Card>

      {/* Contact info section */}
      <Card className="mb-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="font-semibold text-gray-800">Contact Info</h2>
          <button
            onClick={() => navigate('/order/contact')}
            className="text-sm text-primary hover:text-primary-hover font-medium"
          >
            Edit
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Name:</span>
            <span className="text-gray-800">{contactInfo.name}</span>
          </div>
          {contactInfo.email && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Email:</span>
              <span className="text-gray-800">{contactInfo.email}</span>
            </div>
          )}
          {contactInfo.phone && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Phone:</span>
              <span className="text-gray-800">{formatPhone(contactInfo.phone)}</span>
            </div>
          )}
        </div>
      </Card>

      {/* Submit error */}
      {submitError && (
        <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-6">
          <p className="text-error text-sm flex items-center gap-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {submitError}
          </p>
        </div>
      )}

      {/* Submit button */}
      <Button
        onClick={handleSubmit}
        isLoading={isSubmitting}
        disabled={isSubmitting}
        className="w-full"
        size="lg"
      >
        {isSubmitting ? 'Sending Your Order...' : 'Submit Order'}
      </Button>

      <p className="text-center text-sm text-gray-500 mt-4">
        We'll send your order request to Dylan & Logan!
      </p>
    </div>
  );
}
