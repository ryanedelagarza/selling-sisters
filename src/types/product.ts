/**
 * Product type definitions for Selling Sisters
 */

export type ProductType = 'bracelet' | 'coloring_page' | 'portrait';
export type ProductStatus = 'draft' | 'published' | 'archived' | 'sold_out';
export type BraceletStyle = 'rubber_band' | 'beaded';

/**
 * Base product interface with common fields
 */
export interface BaseProduct {
  product_id: string;
  type: ProductType;
  title: string;
  short_desc: string;
  status: ProductStatus;
  thumbnail_url: string;
  gallery?: string[];
  sort_order?: number;
  price_display?: string;
}

/**
 * Bracelet-specific product
 */
export interface BraceletProduct extends BaseProduct {
  type: 'bracelet';
  bracelet: {
    style: BraceletStyle;
    color_options: string[];
    max_colors?: number;
    materials?: string;
  };
}

/**
 * Coloring page-specific product
 */
export interface ColoringPageProduct extends BaseProduct {
  type: 'coloring_page';
  coloring_page: {
    book_name: string;
    page_name: string;
    blank_page_url: string;
    colored_example_url?: string;
  };
}

/**
 * Portrait-specific product
 */
export interface PortraitProduct extends BaseProduct {
  type: 'portrait';
  portrait: {
    size_options?: string[];
    style_options?: string[];
    turnaround?: string;
    requires_upload: boolean;
  };
}

/**
 * Union type for all product types
 */
export type Product = BraceletProduct | ColoringPageProduct | PortraitProduct;

/**
 * Type guards for product types
 */
export function isBraceletProduct(product: Product): product is BraceletProduct {
  return product.type === 'bracelet';
}

export function isColoringPageProduct(product: Product): product is ColoringPageProduct {
  return product.type === 'coloring_page';
}

export function isPortraitProduct(product: Product): product is PortraitProduct {
  return product.type === 'portrait';
}

/**
 * Product category info for navigation
 */
export interface ProductCategory {
  type: ProductType;
  label: string;
  description: string;
  icon: string;
  path: string;
}

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  {
    type: 'bracelet',
    label: 'Bracelets',
    description: 'Handmade friendship bracelets',
    icon: '📿',
    path: '/bracelets',
  },
  {
    type: 'portrait',
    label: 'Portraits',
    description: 'Custom artwork just for you',
    icon: '🖼️',
    path: '/portraits',
  },
  {
    type: 'coloring_page',
    label: 'Coloring Pages',
    description: 'We color it your way!',
    icon: '🎨',
    path: '/coloring-pages',
  },
];

/**
 * Helper to get category by type
 */
export function getCategoryByType(type: ProductType): ProductCategory | undefined {
  return PRODUCT_CATEGORIES.find(cat => cat.type === type);
}

/**
 * Helper to get category by path
 */
export function getCategoryByPath(path: string): ProductCategory | undefined {
  return PRODUCT_CATEGORIES.find(cat => cat.path === path);
}
