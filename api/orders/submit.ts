import type { VercelRequest, VercelResponse } from '@vercel/node';
import { kv } from '@vercel/kv';
import { Resend } from 'resend';

// Types
interface ContactInfo {
  name: string;
  email: string;
  phone: string;
}

interface BraceletOrderDetails {
  type: 'bracelet';
  product_id: string;
  product_title: string;
  style: string;
  colors: string[];
  notes?: string;
}

interface ColoringPageOrderDetails {
  type: 'coloring_page';
  product_id: string;
  product_title: string;
  book_name: string;
  page_name: string;
  coloring_instructions: string;
}

interface PortraitOrderDetails {
  type: 'portrait';
  product_id: string;
  product_title: string;
  subject_description: string;
  reference_image_url: string;
  size?: string;
  style?: string;
}

type OrderDetails = BraceletOrderDetails | ColoringPageOrderDetails | PortraitOrderDetails;

interface OrderPayload {
  contact: ContactInfo;
  details: OrderDetails;
  idempotency_key: string;
}

// Idempotency key storage prefix
const IDEMPOTENCY_PREFIX = 'selling-sisters:order:';

// Validation helpers
function validateContactInfo(contact: ContactInfo): string[] {
  const errors: string[] = [];

  if (!contact.name || contact.name.trim().length === 0) {
    errors.push('Name is required');
  } else if (contact.name.trim().length > 100) {
    errors.push('Name must be 100 characters or less');
  }

  const hasEmail = contact.email && contact.email.trim().length > 0;
  const hasPhone = contact.phone && contact.phone.replace(/\D/g, '').length > 0;

  if (!hasEmail && !hasPhone) {
    errors.push('Email or phone number is required');
  }

  if (hasEmail) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contact.email.trim())) {
      errors.push('Invalid email format');
    }
  }

  if (hasPhone) {
    const digits = contact.phone.replace(/\D/g, '');
    if (digits.length < 10) {
      errors.push('Phone number must have at least 10 digits');
    }
  }

  return errors;
}

function validateOrderDetails(details: OrderDetails): string[] {
  const errors: string[] = [];

  if (!details.type) {
    errors.push('Order type is required');
    return errors;
  }

  if (!details.product_id) {
    errors.push('Product ID is required');
  }

  if (!details.product_title) {
    errors.push('Product title is required');
  }

  switch (details.type) {
    case 'bracelet':
      if (!details.colors || details.colors.length === 0) {
        errors.push('At least one color must be selected');
      }
      break;

    case 'coloring_page':
      if (!details.coloring_instructions || details.coloring_instructions.trim().length === 0) {
        errors.push('Coloring instructions are required');
      }
      break;

    case 'portrait':
      if (!details.subject_description || details.subject_description.trim().length === 0) {
        errors.push('Subject description is required');
      }
      // Note: reference_image_url validation happens separately since it may need upload
      break;

    default:
      errors.push('Invalid order type');
  }

  return errors;
}

// Email template generators
function generateOrderId(): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD-${dateStr}-${random}`;
}

function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return phone;
}

function generateEmailSubject(contact: ContactInfo, details: OrderDetails): string {
  const typeLabels: Record<string, string> = {
    bracelet: 'Bracelet',
    coloring_page: 'Coloring Page',
    portrait: 'Portrait',
  };
  return `${contact.name} — ${typeLabels[details.type] || 'Product'} Order`;
}

function generateEmailHtml(contact: ContactInfo, details: OrderDetails, orderId: string): string {
  const timestamp = new Date().toLocaleString('en-US', {
    dateStyle: 'long',
    timeStyle: 'short',
  });

  let detailsHtml = '';

  if (details.type === 'bracelet') {
    detailsHtml = `
      <p><strong>Product:</strong> ${details.product_title}</p>
      <p><strong>Style:</strong> ${details.style.replace('_', ' ')}</p>
      <p><strong>Colors:</strong> ${details.colors.join(', ')}</p>
      ${details.notes ? `<p><strong>Notes:</strong><br/>"${details.notes}"</p>` : ''}
    `;
  } else if (details.type === 'coloring_page') {
    detailsHtml = `
      <p><strong>Product:</strong> ${details.product_title}</p>
      <p><strong>Book:</strong> ${details.book_name}</p>
      <p><strong>Page:</strong> ${details.page_name}</p>
      <p><strong>Instructions:</strong><br/>"${details.coloring_instructions}"</p>
    `;
  } else if (details.type === 'portrait') {
    detailsHtml = `
      <p><strong>Product:</strong> ${details.product_title}</p>
      ${details.style ? `<p><strong>Style:</strong> ${details.style}</p>` : ''}
      ${details.size ? `<p><strong>Size:</strong> ${details.size}</p>` : ''}
      <p><strong>Description:</strong><br/>"${details.subject_description}"</p>
      ${details.reference_image_url ? `
        <p><strong>Reference Photo:</strong></p>
        <p><a href="${details.reference_image_url}">View Reference Image</a></p>
        <img src="${details.reference_image_url}" alt="Reference" style="max-width: 300px; border-radius: 8px;" />
      ` : ''}
    `;
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Order from Selling Sisters</title>
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #374151; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #A78BFA 0%, #F472B6 100%); padding: 20px; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">🎨 New Order from Selling Sisters!</h1>
      </div>
      
      <div style="background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #1f2937; margin-top: 0; border-bottom: 2px solid #A78BFA; padding-bottom: 10px;">Customer Information</h2>
          <p><strong>Name:</strong> ${contact.name}</p>
          ${contact.email ? `<p><strong>Email:</strong> <a href="mailto:${contact.email}">${contact.email}</a></p>` : ''}
          ${contact.phone ? `<p><strong>Phone:</strong> <a href="tel:${contact.phone}">${formatPhone(contact.phone)}</a></p>` : ''}
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #1f2937; margin-top: 0; border-bottom: 2px solid #F472B6; padding-bottom: 10px;">Order Details</h2>
          ${detailsHtml}
        </div>
        
        <div style="text-align: center; color: #6b7280; font-size: 14px;">
          <p>Order ID: ${orderId}</p>
          <p>Received: ${timestamp}</p>
        </div>
      </div>
      
      <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
        <p>This order was submitted through the Selling Sisters website.</p>
      </div>
    </body>
    </html>
  `;
}

function generateEmailText(contact: ContactInfo, details: OrderDetails, orderId: string): string {
  const timestamp = new Date().toLocaleString('en-US', {
    dateStyle: 'long',
    timeStyle: 'short',
  });

  let detailsText = '';

  if (details.type === 'bracelet') {
    detailsText = `
Product: ${details.product_title}
Style: ${details.style.replace('_', ' ')}
Colors: ${details.colors.join(', ')}
${details.notes ? `Notes: "${details.notes}"` : ''}
    `;
  } else if (details.type === 'coloring_page') {
    detailsText = `
Product: ${details.product_title}
Book: ${details.book_name}
Page: ${details.page_name}
Instructions: "${details.coloring_instructions}"
    `;
  } else if (details.type === 'portrait') {
    detailsText = `
Product: ${details.product_title}
${details.style ? `Style: ${details.style}` : ''}
${details.size ? `Size: ${details.size}` : ''}
Description: "${details.subject_description}"
${details.reference_image_url ? `Reference Photo: ${details.reference_image_url}` : ''}
    `;
  }

  return `
New Order from Selling Sisters!
================================

CUSTOMER INFORMATION
--------------------
Name: ${contact.name}
${contact.email ? `Email: ${contact.email}` : ''}
${contact.phone ? `Phone: ${formatPhone(contact.phone)}` : ''}

ORDER DETAILS
-------------
${detailsText}

--------------------------------
Order ID: ${orderId}
Received: ${timestamp}
  `.trim();
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const payload = req.body as OrderPayload;

    // Validate idempotency key
    if (!payload.idempotency_key) {
      return res.status(400).json({
        success: false,
        error: 'Idempotency key is required',
      });
    }

    // Check for duplicate submission
    const idempotencyKey = `${IDEMPOTENCY_PREFIX}${payload.idempotency_key}`;
    
    try {
      const existing = await kv.get(idempotencyKey);
      if (existing) {
        return res.status(409).json({
          success: false,
          error: 'This order has already been submitted',
          order_id: existing,
        });
      }
    } catch (kvError) {
      // KV not configured - skip idempotency check in development
      console.log('KV not configured, skipping idempotency check');
    }

    // Validate contact info
    const contactErrors = validateContactInfo(payload.contact);
    if (contactErrors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: contactErrors,
      });
    }

    // Validate order details
    const detailsErrors = validateOrderDetails(payload.details);
    if (detailsErrors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: detailsErrors,
      });
    }

    // Generate order ID
    const orderId = generateOrderId();

    // Send email
    const resendApiKey = process.env.RESEND_API_KEY;
    const recipientEmail = process.env.ORDER_EMAIL_RECIPIENT || 'DylanKDelagarza@gmail.com';

    if (!resendApiKey) {
      console.log('RESEND_API_KEY not configured - simulating email send');
      console.log('Order would be sent to:', recipientEmail);
      console.log('Order ID:', orderId);
      console.log('Contact:', JSON.stringify(payload.contact, null, 2));
      console.log('Details:', JSON.stringify(payload.details, null, 2));
    } else {
      const resend = new Resend(resendApiKey);

      const { error: emailError } = await resend.emails.send({
        from: 'Selling Sisters <orders@resend.dev>',
        to: recipientEmail,
        subject: generateEmailSubject(payload.contact, payload.details),
        html: generateEmailHtml(payload.contact, payload.details, orderId),
        text: generateEmailText(payload.contact, payload.details, orderId),
      });

      if (emailError) {
        console.error('Email send error:', emailError);
        return res.status(500).json({
          success: false,
          error: "We couldn't send your order right now. Please try again.",
        });
      }
    }

    // Store idempotency key to prevent duplicates
    try {
      await kv.set(idempotencyKey, orderId, { ex: 86400 * 7 }); // Expire after 7 days
    } catch (kvError) {
      console.log('KV not configured, skipping idempotency storage');
    }

    console.log(`Order ${orderId} submitted successfully`);

    return res.status(200).json({
      success: true,
      order_id: orderId,
      message: 'Order submitted successfully',
    });

  } catch (error) {
    console.error('Error submitting order:', error);
    return res.status(500).json({
      success: false,
      error: 'Something went wrong sending your order. Please try again in a moment.',
    });
  }
}
