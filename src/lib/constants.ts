/**
 * Application constants
 */

// API endpoints
export const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const API_ENDPOINTS = {
  products: `${API_BASE_URL}/api/content/products`,
  publish: `${API_BASE_URL}/api/content/publish`,
  submitOrder: `${API_BASE_URL}/api/orders/submit`,
  uploadImage: `${API_BASE_URL}/api/upload/image`,
} as const;

// Validation limits
export const VALIDATION = {
  name: {
    maxLength: 100,
  },
  notes: {
    maxLength: 500,
  },
  description: {
    maxLength: 500,
  },
  phone: {
    minDigits: 10,
  },
  image: {
    maxSizeMB: 10,
    allowedTypes: ['image/jpeg', 'image/png'],
  },
} as const;

// Order email recipient
export const ORDER_EMAIL_RECIPIENT = 'DylanKDelagarza@gmail.com';

// Session storage keys
export const STORAGE_KEYS = {
  order: 'selling-sisters-order',
} as const;

// Order steps for stepper UI
export const ORDER_STEPS = [
  { id: 'customize', label: 'Customize', number: 1 },
  { id: 'contact', label: 'Contact', number: 2 },
  { id: 'review', label: 'Review', number: 3 },
] as const;
