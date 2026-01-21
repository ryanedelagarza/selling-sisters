import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../../context/OrderContext';
import { VALIDATION } from '../../lib/constants';
import OrderStepper from '../../components/order/OrderStepper';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import EmptyState from '../../components/shared/EmptyState';

export default function ContactPage() {
  const navigate = useNavigate();
  const { state, updateContactInfo, setStep } = useOrder();
  const { selectedProduct, contactInfo } = state;

  // Local state for form fields
  const [name, setName] = useState(contactInfo.name || '');
  const [email, setEmail] = useState(contactInfo.email || '');
  const [phone, setPhone] = useState(contactInfo.phone || '');

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Redirect if no product selected
  useEffect(() => {
    if (!selectedProduct) {
      navigate('/');
    }
  }, [selectedProduct, navigate]);

  if (!selectedProduct) {
    return (
      <EmptyState
        icon="🛒"
        title="No Product Selected"
        description="Please select a product first!"
        actionLabel="Browse Products"
        actionPath="/"
      />
    );
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Name validation
    if (!name.trim()) {
      newErrors.name = "We need your name so we know who the order is for!";
    } else if (name.trim().length > VALIDATION.name.maxLength) {
      newErrors.name = `Name must be ${VALIDATION.name.maxLength} characters or less.`;
    }

    // Contact method validation - need either email or phone
    const hasEmail = email.trim().length > 0;
    const hasPhone = phone.replace(/\D/g, '').length > 0;

    if (!hasEmail && !hasPhone) {
      newErrors.contact = "Please add an email or phone number so we can contact you.";
    }

    // Email format validation
    if (hasEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        newErrors.email = "That email doesn't look quite right. Can you check it?";
      }
    }

    // Phone validation
    if (hasPhone) {
      const digits = phone.replace(/\D/g, '');
      if (digits.length < VALIDATION.phone.minDigits) {
        newErrors.phone = `Please enter a valid phone number (${VALIDATION.phone.minDigits}+ digits).`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateForm()) return;

    updateContactInfo({
      name: name.trim(),
      email: email.trim(),
      phone: phone.replace(/\D/g, ''), // Store only digits
    });

    setStep('review');
    navigate('/order/review');
  };

  const handleBack = () => {
    // Save current values before going back
    updateContactInfo({
      name: name.trim(),
      email: email.trim(),
      phone: phone.replace(/\D/g, ''),
    });
    navigate('/order/customize');
  };

  // Format phone number for display
  const formatPhoneDisplay = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  };

  return (
    <div className="max-w-xl mx-auto">
      <OrderStepper currentStep="contact" />

      <h1 className="text-2xl font-display text-gray-800 mb-2">
        Contact Information
      </h1>
      <p className="text-gray-600 mb-6">
        How can we reach you about your order?
      </p>

      <div className="space-y-6">
        <Input
          label="Your Name"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setErrors((prev) => ({ ...prev, name: '' }));
          }}
          error={errors.name}
          maxLength={VALIDATION.name.maxLength}
          autoComplete="name"
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="your.email@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setErrors((prev) => ({ ...prev, email: '', contact: '' }));
          }}
          error={errors.email}
          hint="We'll email you about your order"
          autoComplete="email"
        />

        <Input
          label="Phone Number"
          type="tel"
          placeholder="(555) 123-4567"
          value={formatPhoneDisplay(phone)}
          onChange={(e) => {
            // Only allow digits
            const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
            setPhone(digits);
            setErrors((prev) => ({ ...prev, phone: '', contact: '' }));
          }}
          error={errors.phone}
          hint="Or we can text/call you"
          autoComplete="tel"
        />

        {/* Contact method error */}
        {errors.contact && (
          <div className="bg-red-50 border border-red-100 rounded-lg p-4">
            <p className="text-error text-sm flex items-center gap-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.contact}
            </p>
          </div>
        )}

        <p className="text-sm text-gray-500">
          We need at least one way to contact you (email or phone).
        </p>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex gap-4">
        <Button
          variant="secondary"
          onClick={handleBack}
          className="flex-1"
        >
          Back
        </Button>
        <Button onClick={handleNext} className="flex-1">
          Review Order
        </Button>
      </div>
    </div>
  );
}
