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

// Constants
const IDEMPOTENCY_PREFIX = 'selling-sisters:order:';
const RATE_LIMIT_PREFIX = 'selling-sisters:rate-limit:';
const RATE_LIMIT_MAX_REQUESTS = 10; // Max requests per minute
const RATE_LIMIT_WINDOW_SECONDS = 60;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Sanitize text input to prevent XSS and limit length
 */
function sanitizeText(text: string, maxLength: number = 1000): string {
  if (!text) return '';
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .trim()
    .slice(0, maxLength);
}

/**
 * Sanitize URL to ensure it's safe
 */
function sanitizeUrl(url: string): string {
  if (!url) return '';
  // Only allow http/https URLs
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return '';
  }
  return url.trim().slice(0, 2000);
}

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

// ============================================================================
// EMAIL TEMPLATE GENERATORS
// ============================================================================

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
  if (digits.length === 11 && digits.startsWith('1')) {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  return phone;
}

function generateEmailSubject(contact: ContactInfo, details: OrderDetails): string {
  const typeLabels: Record<string, string> = {
    bracelet: 'Bracelet',
    coloring_page: 'Coloring Page',
    portrait: 'Portrait',
  };
  const emoji: Record<string, string> = {
    bracelet: '📿',
    coloring_page: '🎨',
    portrait: '🖼️',
  };
  return `${emoji[details.type] || '📦'} ${sanitizeText(contact.name, 50)} — ${typeLabels[details.type] || 'Product'} Order`;
}

/**
 * Enhanced HTML email template for shop owners
 */
function generateEmailHtml(contact: ContactInfo, details: OrderDetails, orderId: string): string {
  const timestamp = new Date().toLocaleString('en-US', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'America/Chicago', // Central time for Texas
  });

  // Product type label and emoji
  const typeInfo: Record<string, { label: string; emoji: string }> = {
    bracelet: { label: 'Bracelet', emoji: '📿' },
    coloring_page: { label: 'Coloring Page', emoji: '🎨' },
    portrait: { label: 'Portrait', emoji: '🖼️' },
  };

  const { label: typeLabel, emoji: typeEmoji } = typeInfo[details.type] || { label: 'Product', emoji: '📦' };

  // Sanitize all user inputs
  const safeName = sanitizeText(contact.name, 100);
  const safeEmail = sanitizeText(contact.email, 254);
  const safePhone = sanitizeText(contact.phone, 20);
  const safeProductTitle = sanitizeText(details.product_title, 200);

  let detailsHtml = '';

  if (details.type === 'bracelet') {
    const safeNotes = sanitizeText(details.notes || '', 500);
    const safeStyle = sanitizeText(details.style || '', 50);
    const safeColors = details.colors.map(c => sanitizeText(c, 50));
    
    const colorSwatches = safeColors.map(color => 
      `<span style="display: inline-block; padding: 4px 12px; margin: 2px; background: #f3f4f6; border-radius: 16px; font-size: 14px;">${color}</span>`
    ).join('');
    
    detailsHtml = `
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #6b7280; width: 120px;">Product:</td>
          <td style="padding: 8px 0; color: #1f2937; font-weight: 500;">${safeProductTitle}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280;">Style:</td>
          <td style="padding: 8px 0; color: #1f2937; text-transform: capitalize;">${safeStyle.replace('_', ' ')}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; vertical-align: top;">Colors:</td>
          <td style="padding: 8px 0;">${colorSwatches}</td>
        </tr>
        ${safeNotes ? `
        <tr>
          <td style="padding: 8px 0; color: #6b7280; vertical-align: top;">Special Notes:</td>
          <td style="padding: 8px 0; color: #1f2937; font-style: italic; background: #f9fafb; padding: 12px; border-radius: 8px;">"${safeNotes}"</td>
        </tr>
        ` : ''}
      </table>
    `;
  } else if (details.type === 'coloring_page') {
    const safeBookName = sanitizeText(details.book_name, 200);
    const safePageName = sanitizeText(details.page_name, 200);
    const safeInstructions = sanitizeText(details.coloring_instructions, 1000);
    
    detailsHtml = `
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #6b7280; width: 120px;">Product:</td>
          <td style="padding: 8px 0; color: #1f2937; font-weight: 500;">${safeProductTitle}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280;">Book:</td>
          <td style="padding: 8px 0; color: #1f2937;">${safeBookName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280;">Page:</td>
          <td style="padding: 8px 0; color: #1f2937;">${safePageName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; vertical-align: top;">Coloring Instructions:</td>
          <td style="padding: 8px 0; color: #1f2937; font-style: italic; background: #f9fafb; padding: 12px; border-radius: 8px;">"${safeInstructions}"</td>
        </tr>
      </table>
    `;
  } else if (details.type === 'portrait') {
    const safeDescription = sanitizeText(details.subject_description, 1000);
    const safeStyle = sanitizeText(details.style || '', 100);
    const safeSize = sanitizeText(details.size || '', 50);
    const safeImageUrl = sanitizeUrl(details.reference_image_url);
    
    detailsHtml = `
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #6b7280; width: 120px;">Product:</td>
          <td style="padding: 8px 0; color: #1f2937; font-weight: 500;">${safeProductTitle}</td>
        </tr>
        ${safeStyle ? `
        <tr>
          <td style="padding: 8px 0; color: #6b7280;">Style:</td>
          <td style="padding: 8px 0; color: #1f2937;">${safeStyle}</td>
        </tr>
        ` : ''}
        ${safeSize ? `
        <tr>
          <td style="padding: 8px 0; color: #6b7280;">Size:</td>
          <td style="padding: 8px 0; color: #1f2937;">${safeSize}</td>
        </tr>
        ` : ''}
        <tr>
          <td style="padding: 8px 0; color: #6b7280; vertical-align: top;">Description:</td>
          <td style="padding: 8px 0; color: #1f2937; font-style: italic; background: #f9fafb; padding: 12px; border-radius: 8px;">"${safeDescription}"</td>
        </tr>
        ${safeImageUrl ? `
        <tr>
          <td style="padding: 8px 0; color: #6b7280; vertical-align: top;">Reference Photo:</td>
          <td style="padding: 8px 0;">
            <a href="${safeImageUrl}" style="color: #A78BFA; text-decoration: none;">View Full Image</a>
            <br/>
            <img src="${safeImageUrl}" alt="Reference photo" style="max-width: 200px; max-height: 200px; border-radius: 8px; margin-top: 8px; border: 1px solid #e5e7eb;" />
          </td>
        </tr>
        ` : ''}
      </table>
    `;
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New ${typeLabel} Order</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #374151; background-color: #f3f4f6;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 40px 20px;">
            <table role="presentation" style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #A78BFA 0%, #F472B6 100%); padding: 32px; text-align: center;">
                  <h1 style="margin: 0; color: white; font-size: 24px; font-weight: 600;">
                    ${typeEmoji} New ${typeLabel} Order!
                  </h1>
                </td>
              </tr>
              
              <!-- Customer Info -->
              <tr>
                <td style="padding: 32px 32px 16px;">
                  <h2 style="margin: 0 0 16px; color: #1f2937; font-size: 18px; border-bottom: 2px solid #A78BFA; padding-bottom: 8px;">
                    👤 Customer Information
                  </h2>
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 8px 0; color: #6b7280; width: 80px;">Name:</td>
                      <td style="padding: 8px 0; color: #1f2937; font-weight: 500;">${safeName}</td>
                    </tr>
                    ${safeEmail ? `
                    <tr>
                      <td style="padding: 8px 0; color: #6b7280;">Email:</td>
                      <td style="padding: 8px 0;"><a href="mailto:${safeEmail}" style="color: #A78BFA; text-decoration: none;">${safeEmail}</a></td>
                    </tr>
                    ` : ''}
                    ${safePhone ? `
                    <tr>
                      <td style="padding: 8px 0; color: #6b7280;">Phone:</td>
                      <td style="padding: 8px 0;"><a href="tel:${contact.phone}" style="color: #A78BFA; text-decoration: none;">${formatPhone(safePhone)}</a></td>
                    </tr>
                    ` : ''}
                  </table>
                </td>
              </tr>
              
              <!-- Order Details -->
              <tr>
                <td style="padding: 16px 32px 32px;">
                  <h2 style="margin: 0 0 16px; color: #1f2937; font-size: 18px; border-bottom: 2px solid #F472B6; padding-bottom: 8px;">
                    📋 Order Details
                  </h2>
                  ${detailsHtml}
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background: #f9fafb; padding: 24px 32px; text-align: center; border-top: 1px solid #e5e7eb;">
                  <p style="margin: 0 0 8px; color: #6b7280; font-size: 14px;">
                    <strong>Order ID:</strong> ${orderId}
                  </p>
                  <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                    Received on ${timestamp}
                  </p>
                </td>
              </tr>
              
            </table>
            
            <!-- Bottom Note -->
            <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 24px;">
              This order was submitted through the Selling Sisters website.
            </p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

/**
 * Plain text email template for shop owners
 */
function generateEmailText(contact: ContactInfo, details: OrderDetails, orderId: string): string {
  const timestamp = new Date().toLocaleString('en-US', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'America/Chicago',
  });

  const typeLabels: Record<string, string> = {
    bracelet: 'Bracelet',
    coloring_page: 'Coloring Page',
    portrait: 'Portrait',
  };

  let detailsText = '';

  if (details.type === 'bracelet') {
    detailsText = `
Product: ${details.product_title}
Style: ${(details.style || '').replace('_', ' ')}
Colors: ${details.colors.join(', ')}
${details.notes ? `Special Notes: "${details.notes}"` : ''}
    `.trim();
  } else if (details.type === 'coloring_page') {
    detailsText = `
Product: ${details.product_title}
Book: ${details.book_name}
Page: ${details.page_name}
Coloring Instructions: "${details.coloring_instructions}"
    `.trim();
  } else if (details.type === 'portrait') {
    detailsText = `
Product: ${details.product_title}
${details.style ? `Style: ${details.style}` : ''}
${details.size ? `Size: ${details.size}` : ''}
Description: "${details.subject_description}"
${details.reference_image_url ? `Reference Photo: ${details.reference_image_url}` : ''}
    `.trim();
  }

  return `
New ${typeLabels[details.type] || 'Product'} Order from Selling Sisters!
${'='.repeat(50)}

CUSTOMER INFORMATION
--------------------
Name: ${contact.name}
${contact.email ? `Email: ${contact.email}` : ''}
${contact.phone ? `Phone: ${formatPhone(contact.phone)}` : ''}

ORDER DETAILS
-------------
${detailsText}

${'─'.repeat(50)}
Order ID: ${orderId}
Received: ${timestamp}

This order was submitted through the Selling Sisters website.
  `.trim();
}

// ============================================================================
// CUSTOMER CONFIRMATION EMAIL TEMPLATES
// ============================================================================

/**
 * HTML confirmation email for customers
 */
function generateCustomerConfirmationHtml(contact: ContactInfo, details: OrderDetails, orderId: string): string {
  const firstName = sanitizeText(contact.name.split(' ')[0], 50);
  const safeProductTitle = sanitizeText(details.product_title, 200);

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; line-height: 1.6; color: #374151; background-color: #f3f4f6;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 40px 20px;">
            <table role="presentation" style="max-width: 500px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              
              <tr>
                <td style="background: linear-gradient(135deg, #A78BFA 0%, #F472B6 100%); padding: 32px; text-align: center;">
                  <h1 style="margin: 0; color: white; font-size: 24px;">Thanks for your order! 🎨</h1>
                </td>
              </tr>
              
              <tr>
                <td style="padding: 32px; text-align: center;">
                  <p style="font-size: 18px; margin: 0 0 16px;">
                    Hi ${firstName}!
                  </p>
                  <p style="margin: 0 0 24px; color: #6b7280;">
                    We got your order for <strong>${safeProductTitle}</strong> and we're so excited to make it for you!
                  </p>
                  <p style="margin: 0 0 24px; color: #6b7280;">
                    We'll reach out soon to confirm the details.
                  </p>
                  <p style="margin: 0; padding: 16px; background: #f9fafb; border-radius: 8px; font-size: 14px;">
                    <strong>Order ID:</strong> ${orderId}
                  </p>
                </td>
              </tr>
              
              <tr>
                <td style="padding: 24px 32px; text-align: center; border-top: 1px solid #e5e7eb;">
                  <p style="margin: 0; color: #9ca3af; font-size: 14px;">
                    💜 Dylan & Logan<br/>
                    Selling Sisters
                  </p>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

/**
 * Plain text confirmation email for customers
 */
function generateCustomerConfirmationText(contact: ContactInfo, details: OrderDetails, orderId: string): string {
  const firstName = contact.name.split(' ')[0];

  return `
Thanks for your order! 🎨

Hi ${firstName}!

We got your order for ${details.product_title} and we're so excited to make it for you!

We'll reach out soon to confirm the details.

Order ID: ${orderId}

💜 Dylan & Logan
Selling Sisters
  `.trim();
}

// ============================================================================
// STRUCTURED LOGGING
// ============================================================================

interface LogEvent {
  event: string;
  order_id?: string;
  product_type?: string;
  product_id?: string;
  recipient?: string;
  has_email?: boolean;
  has_phone?: boolean;
  error?: string;
  timestamp: string;
}

function logEvent(eventData: Omit<LogEvent, 'timestamp'>): void {
  const log: LogEvent = {
    ...eventData,
    timestamp: new Date().toISOString(),
  };
  console.log(JSON.stringify(log));
}

function logError(eventData: Omit<LogEvent, 'timestamp'>): void {
  const log: LogEvent = {
    ...eventData,
    timestamp: new Date().toISOString(),
  };
  console.error(JSON.stringify(log));
}

// ============================================================================
// RATE LIMITING
// ============================================================================

async function checkRateLimit(req: VercelRequest): Promise<{ allowed: boolean; remaining?: number }> {
  // Get client IP from various headers (Vercel uses x-forwarded-for)
  const forwardedFor = req.headers['x-forwarded-for'];
  const clientIp = Array.isArray(forwardedFor) 
    ? forwardedFor[0] 
    : forwardedFor?.split(',')[0]?.trim() || req.headers['x-real-ip'] || 'unknown';
  
  const rateLimitKey = `${RATE_LIMIT_PREFIX}${clientIp}`;

  try {
    const requestCount = await kv.incr(rateLimitKey);
    
    // Set expiry on first request
    if (requestCount === 1) {
      await kv.expire(rateLimitKey, RATE_LIMIT_WINDOW_SECONDS);
    }
    
    const remaining = Math.max(0, RATE_LIMIT_MAX_REQUESTS - requestCount);
    
    if (requestCount > RATE_LIMIT_MAX_REQUESTS) {
      return { allowed: false, remaining: 0 };
    }
    
    return { allowed: true, remaining };
  } catch (kvError) {
    // KV not available - allow request but log warning
    console.log('KV not available for rate limiting, skipping check');
    return { allowed: true };
  }
}

// ============================================================================
// MAIN HANDLER
// ============================================================================

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let orderId: string | undefined;

  try {
    // Check rate limit first
    const rateLimitResult = await checkRateLimit(req);
    if (!rateLimitResult.allowed) {
      logEvent({
        event: 'rate_limit_exceeded',
      });
      return res.status(429).json({
        success: false,
        error: 'Too many requests. Please wait a moment and try again.',
      });
    }

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
        logEvent({
          event: 'duplicate_order_blocked',
          order_id: existing as string,
        });
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
      logEvent({
        event: 'validation_failed',
        error: contactErrors.join(', '),
      });
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: contactErrors,
      });
    }

    // Validate order details
    const detailsErrors = validateOrderDetails(payload.details);
    if (detailsErrors.length > 0) {
      logEvent({
        event: 'validation_failed',
        error: detailsErrors.join(', '),
      });
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: detailsErrors,
      });
    }

    // Generate order ID
    orderId = generateOrderId();

    // Log order submission start
    logEvent({
      event: 'order_submitted',
      order_id: orderId,
      product_type: payload.details.type,
      product_id: payload.details.product_id,
      has_email: !!payload.contact.email,
      has_phone: !!payload.contact.phone,
    });

    // Send email
    const resendApiKey = process.env.RESEND_API_KEY;
    const recipientEmail = process.env.ORDER_EMAIL_RECIPIENT || 'DylanKDelagarza@gmail.com';

    if (!resendApiKey) {
      // Development mode - simulate email send
      console.log('RESEND_API_KEY not configured - simulating email send');
      console.log('Order would be sent to:', recipientEmail);
      console.log('Order ID:', orderId);
      console.log('Contact:', JSON.stringify(payload.contact, null, 2));
      console.log('Details:', JSON.stringify(payload.details, null, 2));
    } else {
      const resend = new Resend(resendApiKey);

      // Send email to shop owners with reply-to for easy response
      const { error: emailError } = await resend.emails.send({
        from: 'Selling Sisters <orders@resend.dev>',
        to: recipientEmail,
        replyTo: payload.contact.email || undefined, // Allow shop owners to reply directly to customer
        subject: generateEmailSubject(payload.contact, payload.details),
        html: generateEmailHtml(payload.contact, payload.details, orderId),
        text: generateEmailText(payload.contact, payload.details, orderId),
      });

      if (emailError) {
        logError({
          event: 'email_send_failed',
          order_id: orderId,
          recipient: recipientEmail,
          error: JSON.stringify(emailError),
        });
        return res.status(500).json({
          success: false,
          error: "We couldn't send your order right now. Please try again.",
        });
      }

      logEvent({
        event: 'email_sent',
        order_id: orderId,
        recipient: recipientEmail,
      });

      // Send confirmation email to customer (if they provided email)
      if (payload.contact.email) {
        try {
          await resend.emails.send({
            from: 'Selling Sisters <orders@resend.dev>',
            to: payload.contact.email,
            subject: `Thanks for your order, ${sanitizeText(payload.contact.name.split(' ')[0], 30)}! 🎨`,
            html: generateCustomerConfirmationHtml(payload.contact, payload.details, orderId),
            text: generateCustomerConfirmationText(payload.contact, payload.details, orderId),
          });

          logEvent({
            event: 'confirmation_email_sent',
            order_id: orderId,
            recipient: payload.contact.email,
          });
        } catch (confirmError) {
          // Log but don't fail the order if confirmation email fails
          logError({
            event: 'confirmation_email_failed',
            order_id: orderId,
            recipient: payload.contact.email,
            error: confirmError instanceof Error ? confirmError.message : 'Unknown error',
          });
        }
      }
    }

    // Store idempotency key to prevent duplicates
    try {
      await kv.set(idempotencyKey, orderId, { ex: 86400 * 7 }); // Expire after 7 days
    } catch (kvError) {
      console.log('KV not configured, skipping idempotency storage');
    }

    logEvent({
      event: 'order_completed',
      order_id: orderId,
      product_type: payload.details.type,
    });

    return res.status(200).json({
      success: true,
      order_id: orderId,
      message: 'Order submitted successfully',
    });

  } catch (error) {
    logError({
      event: 'order_error',
      order_id: orderId || 'unknown',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return res.status(500).json({
      success: false,
      error: 'Something went wrong sending your order. Please try again in a moment.',
    });
  }
}
