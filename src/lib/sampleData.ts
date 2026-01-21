/**
 * Sample/placeholder data for development and testing
 * This data will be replaced by the Google Sheets API in production
 * 
 * To update: Replace these values with your real product data,
 * or connect the Google Sheets API to serve live data.
 */

import type { Product, BraceletProduct, ColoringPageProduct, PortraitProduct } from '../types/product';

// Placeholder image URLs - replace with your actual images
// You can use services like imgur.com, cloudinary.com, or host them yourself
const PLACEHOLDER_IMAGES = {
  bracelet1: 'https://placehold.co/400x400/EDE9FE/A78BFA?text=Bracelet+1',
  bracelet2: 'https://placehold.co/400x400/FCE7F3/F472B6?text=Bracelet+2',
  bracelet3: 'https://placehold.co/400x400/D1FAE5/34D399?text=Bracelet+3',
  portrait1: 'https://placehold.co/400x400/EDE9FE/A78BFA?text=Portrait+1',
  portrait2: 'https://placehold.co/400x400/FCE7F3/F472B6?text=Portrait+2',
  coloringPage1: 'https://placehold.co/400x400/FEF3C7/F59E0B?text=Coloring+Page+1',
  coloringPage2: 'https://placehold.co/400x400/DBEAFE/3B82F6?text=Coloring+Page+2',
  coloringPage3: 'https://placehold.co/400x400/FCE7F3/EC4899?text=Coloring+Page+3',
};

/**
 * Sample bracelet products
 */
export const sampleBracelets: BraceletProduct[] = [
  {
    product_id: 'BR-0001',
    type: 'bracelet',
    title: 'School Spirit Loom Bracelet',
    short_desc: 'Pick your school colors and we\'ll loom it for you!',
    status: 'published',
    thumbnail_url: PLACEHOLDER_IMAGES.bracelet1,
    sort_order: 1,
    bracelet: {
      style: 'rubber_band',
      color_options: ['red', 'blue', 'green', 'white', 'black', 'yellow', 'orange', 'purple', 'pink', 'gold', 'silver'],
      max_colors: 3,
      materials: 'Rainbow Loom rubber bands',
    },
  },
  {
    product_id: 'BR-0002',
    type: 'bracelet',
    title: 'Friendship Bead Bracelet',
    short_desc: 'Classic beaded bracelet - perfect for sharing with friends!',
    status: 'published',
    thumbnail_url: PLACEHOLDER_IMAGES.bracelet2,
    sort_order: 2,
    bracelet: {
      style: 'beaded',
      color_options: ['red', 'blue', 'green', 'white', 'black', 'yellow', 'pink', 'purple', 'turquoise', 'coral'],
      max_colors: 5,
      materials: 'Plastic pony beads on stretchy cord',
    },
  },
  {
    product_id: 'BR-0003',
    type: 'bracelet',
    title: 'Rainbow Loom Bracelet',
    short_desc: 'All the colors of the rainbow in one bracelet!',
    status: 'published',
    thumbnail_url: PLACEHOLDER_IMAGES.bracelet3,
    sort_order: 3,
    bracelet: {
      style: 'rubber_band',
      color_options: ['red', 'orange', 'yellow', 'green', 'blue', 'purple'],
      max_colors: 6,
      materials: 'Rainbow Loom rubber bands',
    },
  },
];

/**
 * Sample portrait products
 */
export const samplePortraits: PortraitProduct[] = [
  {
    product_id: 'PT-0001',
    type: 'portrait',
    title: 'Pet Portrait',
    short_desc: 'We\'ll draw your furry friend!',
    status: 'published',
    thumbnail_url: PLACEHOLDER_IMAGES.portrait1,
    sort_order: 1,
    portrait: {
      size_options: ['5x7', '8x10'],
      style_options: ['Realistic', 'Cartoon'],
      turnaround: '1-2 weeks',
      requires_upload: true,
    },
  },
  {
    product_id: 'PT-0002',
    type: 'portrait',
    title: 'Family Portrait',
    short_desc: 'A custom portrait of your family!',
    status: 'published',
    thumbnail_url: PLACEHOLDER_IMAGES.portrait2,
    sort_order: 2,
    portrait: {
      size_options: ['8x10', '11x14'],
      style_options: ['Cartoon', 'Watercolor'],
      turnaround: '2-3 weeks',
      requires_upload: true,
    },
  },
];

/**
 * Sample coloring page products
 */
export const sampleColoringPages: ColoringPageProduct[] = [
  {
    product_id: 'CP-0001',
    type: 'coloring_page',
    title: 'Sleepy Cat',
    short_desc: 'A cozy cat curled up for a nap',
    status: 'published',
    thumbnail_url: PLACEHOLDER_IMAGES.coloringPage1,
    sort_order: 1,
    coloring_page: {
      book_name: 'Animal Friends',
      page_name: 'Sleepy Cat',
      blank_page_url: PLACEHOLDER_IMAGES.coloringPage1,
      colored_example_url: PLACEHOLDER_IMAGES.coloringPage1,
    },
  },
  {
    product_id: 'CP-0002',
    type: 'coloring_page',
    title: 'Unicorn Dreams',
    short_desc: 'A magical unicorn with rainbow mane',
    status: 'published',
    thumbnail_url: PLACEHOLDER_IMAGES.coloringPage2,
    sort_order: 2,
    coloring_page: {
      book_name: 'Magical Creatures',
      page_name: 'Unicorn Dreams',
      blank_page_url: PLACEHOLDER_IMAGES.coloringPage2,
    },
  },
  {
    product_id: 'CP-0003',
    type: 'coloring_page',
    title: 'Flower Garden',
    short_desc: 'Beautiful flowers to color your way!',
    status: 'published',
    thumbnail_url: PLACEHOLDER_IMAGES.coloringPage3,
    sort_order: 3,
    coloring_page: {
      book_name: 'Nature Scenes',
      page_name: 'Flower Garden',
      blank_page_url: PLACEHOLDER_IMAGES.coloringPage3,
      colored_example_url: PLACEHOLDER_IMAGES.coloringPage3,
    },
  },
];

/**
 * All sample products combined
 */
export const sampleProducts: Product[] = [
  ...sampleBracelets,
  ...samplePortraits,
  ...sampleColoringPages,
];

/**
 * Get products by type
 */
export function getProductsByType(type: 'bracelet' | 'coloring_page' | 'portrait'): Product[] {
  return sampleProducts
    .filter((p) => p.type === type && p.status === 'published')
    .sort((a, b) => (a.sort_order || 999) - (b.sort_order || 999));
}

/**
 * Get a single product by ID
 */
export function getProductById(productId: string): Product | undefined {
  return sampleProducts.find((p) => p.product_id === productId);
}

/**
 * Get all published products
 */
export function getAllPublishedProducts(): Product[] {
  return sampleProducts
    .filter((p) => p.status === 'published')
    .sort((a, b) => (a.sort_order || 999) - (b.sort_order || 999));
}
