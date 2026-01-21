/**
 * Order type definitions for Selling Sisters
 */

import type { BraceletStyle } from './product';

/**
 * Contact information for order
 */
export interface ContactInfo {
  name: string;
  email: string;
  phone: string;
}

/**
 * Bracelet order details
 */
export interface BraceletOrderDetails {
  type: 'bracelet';
  product_id: string;
  product_title: string;
  style: BraceletStyle;
  colors: string[];
  notes?: string;
}

/**
 * Coloring page order details
 */
export interface ColoringPageOrderDetails {
  type: 'coloring_page';
  product_id: string;
  product_title: string;
  book_name: string;
  page_name: string;
  coloring_instructions: string;
}

/**
 * Portrait order details
 */
export interface PortraitOrderDetails {
  type: 'portrait';
  product_id: string;
  product_title: string;
  subject_description: string;
  reference_image_url: string;
  size?: string;
  style?: string;
}

/**
 * Union type for all order details
 */
export type OrderDetails = 
  | BraceletOrderDetails 
  | ColoringPageOrderDetails 
  | PortraitOrderDetails;

/**
 * Complete order structure
 */
export interface Order {
  contact: ContactInfo;
  details: OrderDetails;
  submitted_at?: string;
  idempotency_key?: string;
}

/**
 * Order flow step
 */
export type OrderStep = 'product' | 'customize' | 'contact' | 'review' | 'confirmation';

/**
 * Order submission response
 */
export interface OrderSubmitResponse {
  success: boolean;
  order_id?: string;
  message: string;
  error?: string;
}

/**
 * Type guards for order details
 */
export function isBraceletOrder(details: OrderDetails): details is BraceletOrderDetails {
  return details.type === 'bracelet';
}

export function isColoringPageOrder(details: OrderDetails): details is ColoringPageOrderDetails {
  return details.type === 'coloring_page';
}

export function isPortraitOrder(details: OrderDetails): details is PortraitOrderDetails {
  return details.type === 'portrait';
}
