import type { VercelRequest, VercelResponse } from '@vercel/node';
import { kv } from '@vercel/kv';

// Types
interface Product {
  product_id: string;
  type: 'bracelet' | 'coloring_page' | 'portrait';
  title: string;
  short_desc: string;
  status: 'draft' | 'published' | 'archived' | 'sold_out';
  thumbnail_url: string;
  gallery?: string[];
  sort_order?: number;
  bracelet?: {
    style: 'rubber_band' | 'beaded';
    color_options: string[];
    max_colors?: number;
    materials?: string;
  };
  coloring_page?: {
    book_name: string;
    page_name: string;
    blank_page_url: string;
    colored_example_url?: string;
  };
  portrait?: {
    size_options?: string[];
    style_options?: string[];
    turnaround?: string;
    requires_upload: boolean;
  };
}

interface ProductsData {
  products: Product[];
  last_updated: string;
  version: number;
}

// Storage key
const PRODUCTS_KEY = 'selling-sisters:products';

// Sample data for development/fallback
const SAMPLE_PRODUCTS: Product[] = [
  {
    product_id: 'BR-0001',
    type: 'bracelet',
    title: 'School Spirit Loom Bracelet',
    short_desc: "Pick your school colors and we'll loom it for you!",
    status: 'published',
    thumbnail_url: 'https://placehold.co/400x400/EDE9FE/A78BFA?text=Bracelet+1',
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
    thumbnail_url: 'https://placehold.co/400x400/FCE7F3/F472B6?text=Bracelet+2',
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
    thumbnail_url: 'https://placehold.co/400x400/D1FAE5/34D399?text=Bracelet+3',
    sort_order: 3,
    bracelet: {
      style: 'rubber_band',
      color_options: ['red', 'orange', 'yellow', 'green', 'blue', 'purple'],
      max_colors: 6,
      materials: 'Rainbow Loom rubber bands',
    },
  },
  {
    product_id: 'PT-0001',
    type: 'portrait',
    title: 'Pet Portrait',
    short_desc: "We'll draw your furry friend!",
    status: 'published',
    thumbnail_url: 'https://placehold.co/400x400/EDE9FE/A78BFA?text=Portrait+1',
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
    thumbnail_url: 'https://placehold.co/400x400/FCE7F3/F472B6?text=Portrait+2',
    sort_order: 2,
    portrait: {
      size_options: ['8x10', '11x14'],
      style_options: ['Cartoon', 'Watercolor'],
      turnaround: '2-3 weeks',
      requires_upload: true,
    },
  },
  {
    product_id: 'CP-0001',
    type: 'coloring_page',
    title: 'Sleepy Cat',
    short_desc: 'A cozy cat curled up for a nap',
    status: 'published',
    thumbnail_url: 'https://placehold.co/400x400/FEF3C7/F59E0B?text=Coloring+1',
    sort_order: 1,
    coloring_page: {
      book_name: 'Animal Friends',
      page_name: 'Sleepy Cat',
      blank_page_url: 'https://placehold.co/400x400/FEF3C7/F59E0B?text=Coloring+1',
      colored_example_url: 'https://placehold.co/400x400/FEF3C7/F59E0B?text=Colored+1',
    },
  },
  {
    product_id: 'CP-0002',
    type: 'coloring_page',
    title: 'Unicorn Dreams',
    short_desc: 'A magical unicorn with rainbow mane',
    status: 'published',
    thumbnail_url: 'https://placehold.co/400x400/DBEAFE/3B82F6?text=Coloring+2',
    sort_order: 2,
    coloring_page: {
      book_name: 'Magical Creatures',
      page_name: 'Unicorn Dreams',
      blank_page_url: 'https://placehold.co/400x400/DBEAFE/3B82F6?text=Coloring+2',
    },
  },
  {
    product_id: 'CP-0003',
    type: 'coloring_page',
    title: 'Flower Garden',
    short_desc: 'Beautiful flowers to color your way!',
    status: 'published',
    thumbnail_url: 'https://placehold.co/400x400/FCE7F3/EC4899?text=Coloring+3',
    sort_order: 3,
    coloring_page: {
      book_name: 'Nature Scenes',
      page_name: 'Flower Garden',
      blank_page_url: 'https://placehold.co/400x400/FCE7F3/EC4899?text=Coloring+3',
      colored_example_url: 'https://placehold.co/400x400/FCE7F3/EC4899?text=Colored+3',
    },
  },
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse query parameters
    const { type, id } = req.query;

    // Try to get products from KV storage
    let data: ProductsData | null = null;
    
    try {
      data = await kv.get<ProductsData>(PRODUCTS_KEY);
    } catch (kvError) {
      // KV not configured - use sample data
      console.log('KV not configured, using sample data');
    }

    // Use sample data if KV is empty or not configured
    const products = data?.products || SAMPLE_PRODUCTS;
    const lastUpdated = data?.last_updated || new Date().toISOString();

    // Filter by product ID if specified
    if (id && typeof id === 'string') {
      const product = products.find(p => p.product_id === id);
      
      if (!product) {
        return res.status(404).json({ 
          error: 'Product not found',
          product_id: id 
        });
      }

      return res.status(200).json({
        product,
        last_updated: lastUpdated,
      });
    }

    // Filter by type if specified
    let filteredProducts = products;
    
    if (type && typeof type === 'string') {
      const validTypes = ['bracelet', 'coloring_page', 'portrait'];
      
      if (!validTypes.includes(type)) {
        return res.status(400).json({ 
          error: 'Invalid product type',
          valid_types: validTypes 
        });
      }

      filteredProducts = products.filter(p => p.type === type);
    }

    // Filter to only published and sold_out (visible) products
    filteredProducts = filteredProducts.filter(
      p => p.status === 'published' || p.status === 'sold_out'
    );

    // Sort by sort_order
    filteredProducts.sort((a, b) => (a.sort_order || 999) - (b.sort_order || 999));

    // Return response
    return res.status(200).json({
      products: filteredProducts,
      last_updated: lastUpdated,
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch products',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
