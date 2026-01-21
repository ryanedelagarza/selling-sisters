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
 * Partial order details - used during order building process
 * This is a more permissive type that allows building up the order incrementally
 */
export type PartialOrderDetails = {
  type?: 'bracelet' | 'coloring_page' | 'portrait';
  product_id?: string;
  product_title?: string;
  // Bracelet fields (style is BraceletStyle for bracelets, string for portraits)
  style?: BraceletStyle | string;
  colors?: string[];
  notes?: string;
  // Coloring page fields
  book_name?: string;
  page_name?: string;
  coloring_instructions?: string;
  // Portrait fields
  subject_description?: string;
  reference_image_url?: string;
  size?: string;
};

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
 * These accept PartialOrderDetails for use during order building
 */
export function isBraceletOrder(details: PartialOrderDetails): details is BraceletOrderDetails {
  return details.type === 'bracelet';
}

export function isColoringPageOrder(details: PartialOrderDetails): details is ColoringPageOrderDetails {
  return details.type === 'coloring_page';
}

export function isPortraitOrder(details: PartialOrderDetails): details is PortraitOrderDetails {
  return details.type === 'portrait';
}

/**
 * Check if partial order details are complete enough to submit
 */
export function isCompleteOrderDetails(details: PartialOrderDetails): details is OrderDetails {
  if (!details.type || !details.product_id || !details.product_title) {
    return false;
  }
  
  switch (details.type) {
    case 'bracelet':
      return !!details.style && Array.isArray(details.colors) && details.colors.length > 0;
    case 'coloring_page':
      return !!details.book_name && !!details.page_name && !!details.coloring_instructions;
    case 'portrait':
      return !!details.subject_description;
    default:
      return false;
  }
}
