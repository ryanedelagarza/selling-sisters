/**
 * API type definitions for Selling Sisters
 */

import type { Product } from './product';

/**
 * Products API response
 */
export interface ProductsResponse {
  products: Product[];
  last_updated: string;
}

/**
 * Single product API response
 */
export interface ProductResponse {
  product: Product;
}

/**
 * Content publish webhook payload (from Google Sheets)
 */
export interface PublishPayload {
  published_at: string;
  source: 'google_sheets';
  version: number;
  secret: string;
  products: Product[];
}

/**
 * Publish response
 */
export interface PublishResponse {
  success: boolean;
  products_received: number;
  products_published: number;
  version: number;
  error?: string;
}

/**
 * Image upload response
 */
export interface ImageUploadResponse {
  success: boolean;
  url?: string;
  filename?: string;
  error?: string;
}

/**
 * Generic API error response
 */
export interface ApiError {
  success: false;
  error: string;
  code?: string;
}

/**
 * API request state
 */
export interface ApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}
