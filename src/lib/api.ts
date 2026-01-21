/**
 * API client for Selling Sisters
 */

import type { Product, ProductType } from '../types/product';
import type { ContactInfo, OrderDetails } from '../types/order';

// API base URL - empty for same-origin requests
const API_BASE = '';

/**
 * API response types
 */
export interface ProductsResponse {
  products: Product[];
  last_updated: string;
}

export interface SingleProductResponse {
  product: Product;
  last_updated: string;
}

export interface OrderSubmitResponse {
  success: boolean;
  order_id?: string;
  message: string;
  error?: string;
  details?: string[];
}

export interface ImageUploadResponse {
  success: boolean;
  url?: string;
  filename?: string;
  error?: string;
}

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: string[]
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Fetch all products, optionally filtered by type
 */
export async function fetchProducts(type?: ProductType): Promise<ProductsResponse> {
  const url = new URL(`${API_BASE}/api/content/products`, window.location.origin);
  
  if (type) {
    url.searchParams.set('type', type);
  }

  const response = await fetch(url.toString());
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new ApiError(error.error || 'Failed to fetch products', response.status);
  }

  return response.json();
}

/**
 * Fetch a single product by ID
 */
export async function fetchProductById(productId: string): Promise<SingleProductResponse> {
  const url = new URL(`${API_BASE}/api/content/products`, window.location.origin);
  url.searchParams.set('id', productId);

  const response = await fetch(url.toString());
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new ApiError(error.error || 'Product not found', response.status);
  }

  return response.json();
}

/**
 * Submit an order
 */
export async function submitOrder(
  contact: ContactInfo,
  details: OrderDetails,
  idempotencyKey: string
): Promise<OrderSubmitResponse> {
  const response = await fetch(`${API_BASE}/api/orders/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contact,
      details,
      idempotency_key: idempotencyKey,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(
      data.error || 'Failed to submit order',
      response.status,
      data.details
    );
  }

  return data;
}

/**
 * Upload an image file
 */
export async function uploadImage(file: File): Promise<ImageUploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE}/api/upload/image`, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(
      data.error || 'Failed to upload image',
      response.status
    );
  }

  return data;
}
