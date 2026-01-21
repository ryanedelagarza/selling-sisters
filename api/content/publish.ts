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

interface PublishPayload {
  published_at: string;
  source: 'google_sheets';
  version: number;
  secret: string;
  products: Product[];
}

interface ProductsData {
  products: Product[];
  last_updated: string;
  version: number;
}

// Storage key
const PRODUCTS_KEY = 'selling-sisters:products';

// Validate product data
function validateProduct(product: unknown, index: number): string[] {
  const errors: string[] = [];
  const p = product as Record<string, unknown>;

  if (!p.product_id || typeof p.product_id !== 'string') {
    errors.push(`Product ${index}: missing or invalid product_id`);
  }

  if (!p.type || !['bracelet', 'coloring_page', 'portrait'].includes(p.type as string)) {
    errors.push(`Product ${index}: invalid type (must be bracelet, coloring_page, or portrait)`);
  }

  if (!p.title || typeof p.title !== 'string') {
    errors.push(`Product ${index}: missing or invalid title`);
  }

  if (!p.status || !['draft', 'published', 'archived', 'sold_out'].includes(p.status as string)) {
    errors.push(`Product ${index}: invalid status`);
  }

  return errors;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const payload = req.body as PublishPayload;

    // Validate secret
    const expectedSecret = process.env.CONTENT_PUBLISH_SECRET;
    
    if (!expectedSecret) {
      console.error('CONTENT_PUBLISH_SECRET not configured');
      return res.status(500).json({ 
        success: false,
        error: 'Server configuration error' 
      });
    }

    if (payload.secret !== expectedSecret) {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid secret' 
      });
    }

    // Validate payload structure
    if (!payload.products || !Array.isArray(payload.products)) {
      return res.status(400).json({ 
        success: false,
        error: 'Missing or invalid products array' 
      });
    }

    if (payload.products.length === 0) {
      return res.status(400).json({ 
        success: false,
        error: 'Products array cannot be empty' 
      });
    }

    // Validate each product
    const validationErrors: string[] = [];
    payload.products.forEach((product, index) => {
      const errors = validateProduct(product, index);
      validationErrors.push(...errors);
    });

    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        success: false,
        error: 'Validation failed',
        details: validationErrors 
      });
    }

    // Count published products
    const publishedProducts = payload.products.filter(
      p => p.status === 'published' || p.status === 'sold_out'
    );

    // Store in KV
    const data: ProductsData = {
      products: payload.products,
      last_updated: payload.published_at || new Date().toISOString(),
      version: payload.version || 1,
    };

    await kv.set(PRODUCTS_KEY, data);

    console.log(`Published ${publishedProducts.length} products (version ${data.version})`);

    return res.status(200).json({
      success: true,
      products_received: payload.products.length,
      products_published: publishedProducts.length,
      version: data.version,
    });

  } catch (error) {
    console.error('Error publishing content:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Failed to publish content',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
