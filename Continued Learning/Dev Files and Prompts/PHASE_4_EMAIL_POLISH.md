# Phase 4: Email & Order Submission Polish

**Agent Assignment:** Agent 2  
**Estimated Effort:** Medium  
**Dependencies:** None (can run in parallel)  
**Prerequisites:** Resend API key configured, Vercel deployed

---

## Objective

Refine the email templates, test the complete order submission flow, handle edge cases, and ensure reliable email delivery. This phase focuses on the backend order processing and email communication.

---

## Background Context

### Current State

The order submission endpoint exists at `api/orders/submit.ts`:
- Validates contact info and order details
- Generates order ID
- Sends email via Resend
- Stores idempotency key in Vercel KV
- Returns success/failure response

### Email Service: Resend

- API Documentation: https://resend.com/docs
- Dashboard: https://resend.com/dashboard
- Current sender: `orders@resend.dev` (Resend's test domain)

---

## Tasks

### Task 4.1: Verify Resend Configuration

**Steps:**

1. **Check API Key**
   - Log into Resend dashboard
   - Go to API Keys
   - Verify key is active
   - Confirm key is in Vercel environment variables as `RESEND_API_KEY`

2. **Test Email Delivery**
   - In Resend dashboard, go to "Emails" tab
   - Send a test email to verify your account works

3. **Check Domain (Optional but Recommended)**
   - For production, add a custom domain in Resend
   - This improves deliverability and looks more professional
   - Without custom domain, emails come from `orders@resend.dev`

---

### Task 4.2: Enhance Email Templates

The current email templates are functional but can be improved.

**File:** `api/orders/submit.ts`

**Improvements to make:**

#### 4.2.1: Update HTML Email Template

Find the `generateEmailHtml` function and enhance it:

```typescript
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

  let detailsHtml = '';

  if (details.type === 'bracelet') {
    const colorSwatches = details.colors.map(color => 
      `<span style="display: inline-block; padding: 4px 12px; margin: 2px; background: #f3f4f6; border-radius: 16px; font-size: 14px;">${color}</span>`
    ).join('');
    
    detailsHtml = `
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #6b7280; width: 120px;">Product:</td>
          <td style="padding: 8px 0; color: #1f2937; font-weight: 500;">${details.product_title}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280;">Style:</td>
          <td style="padding: 8px 0; color: #1f2937; text-transform: capitalize;">${details.style.replace('_', ' ')}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; vertical-align: top;">Colors:</td>
          <td style="padding: 8px 0;">${colorSwatches}</td>
        </tr>
        ${details.notes ? `
        <tr>
          <td style="padding: 8px 0; color: #6b7280; vertical-align: top;">Special Notes:</td>
          <td style="padding: 8px 0; color: #1f2937; font-style: italic; background: #f9fafb; padding: 12px; border-radius: 8px;">"${details.notes}"</td>
        </tr>
        ` : ''}
      </table>
    `;
  } else if (details.type === 'coloring_page') {
    detailsHtml = `
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #6b7280; width: 120px;">Product:</td>
          <td style="padding: 8px 0; color: #1f2937; font-weight: 500;">${details.product_title}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280;">Book:</td>
          <td style="padding: 8px 0; color: #1f2937;">${details.book_name}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280;">Page:</td>
          <td style="padding: 8px 0; color: #1f2937;">${details.page_name}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; vertical-align: top;">Coloring Instructions:</td>
          <td style="padding: 8px 0; color: #1f2937; font-style: italic; background: #f9fafb; padding: 12px; border-radius: 8px;">"${details.coloring_instructions}"</td>
        </tr>
      </table>
    `;
  } else if (details.type === 'portrait') {
    detailsHtml = `
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #6b7280; width: 120px;">Product:</td>
          <td style="padding: 8px 0; color: #1f2937; font-weight: 500;">${details.product_title}</td>
        </tr>
        ${details.style ? `
        <tr>
          <td style="padding: 8px 0; color: #6b7280;">Style:</td>
          <td style="padding: 8px 0; color: #1f2937;">${details.style}</td>
        </tr>
        ` : ''}
        ${details.size ? `
        <tr>
          <td style="padding: 8px 0; color: #6b7280;">Size:</td>
          <td style="padding: 8px 0; color: #1f2937;">${details.size}</td>
        </tr>
        ` : ''}
        <tr>
          <td style="padding: 8px 0; color: #6b7280; vertical-align: top;">Description:</td>
          <td style="padding: 8px 0; color: #1f2937; font-style: italic; background: #f9fafb; padding: 12px; border-radius: 8px;">"${details.subject_description}"</td>
        </tr>
        ${details.reference_image_url ? `
        <tr>
          <td style="padding: 8px 0; color: #6b7280; vertical-align: top;">Reference Photo:</td>
          <td style="padding: 8px 0;">
            <a href="${details.reference_image_url}" style="color: #A78BFA;">View Full Image</a>
            <br/>
            <img src="${details.reference_image_url}" alt="Reference photo" style="max-width: 200px; max-height: 200px; border-radius: 8px; margin-top: 8px; border: 1px solid #e5e7eb;" />
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
                      <td style="padding: 8px 0; color: #1f2937; font-weight: 500;">${contact.name}</td>
                    </tr>
                    ${contact.email ? `
                    <tr>
                      <td style="padding: 8px 0; color: #6b7280;">Email:</td>
                      <td style="padding: 8px 0;"><a href="mailto:${contact.email}" style="color: #A78BFA; text-decoration: none;">${contact.email}</a></td>
                    </tr>
                    ` : ''}
                    ${contact.phone ? `
                    <tr>
                      <td style="padding: 8px 0; color: #6b7280;">Phone:</td>
                      <td style="padding: 8px 0;"><a href="tel:${contact.phone}" style="color: #A78BFA; text-decoration: none;">${formatPhone(contact.phone)}</a></td>
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
```

---

### Task 4.3: Add Reply-To Header

Update the email sending code to include a reply-to header so responses go to the customer:

**In `api/orders/submit.ts`, find the Resend send call:**

```typescript
const { error: emailError } = await resend.emails.send({
  from: 'Selling Sisters <orders@resend.dev>',
  to: recipientEmail,
  replyTo: contact.email || undefined, // ADD THIS LINE
  subject: generateEmailSubject(contact, details),
  html: generateEmailHtml(contact, details, orderId),
  text: generateEmailText(contact, details, orderId),
});
```

---

### Task 4.4: Add Order Confirmation Email to Customer (Optional)

Consider sending a confirmation email to the customer as well.

**Add this after the main email send:**

```typescript
// Send confirmation to customer (if email provided)
if (contact.email) {
  try {
    await resend.emails.send({
      from: 'Selling Sisters <orders@resend.dev>',
      to: contact.email,
      subject: `Thanks for your order, ${contact.name.split(' ')[0]}! 🎨`,
      html: generateCustomerConfirmationHtml(contact, details, orderId),
      text: generateCustomerConfirmationText(contact, details, orderId),
    });
  } catch (confirmError) {
    // Log but don't fail the order if confirmation email fails
    console.error('Failed to send customer confirmation:', confirmError);
  }
}
```

**Add the customer confirmation template functions:**

```typescript
function generateCustomerConfirmationHtml(contact: ContactInfo, details: OrderDetails, orderId: string): string {
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
                    Hi ${contact.name.split(' ')[0]}!
                  </p>
                  <p style="margin: 0 0 24px; color: #6b7280;">
                    We got your order for <strong>${details.product_title}</strong> and we're so excited to make it for you!
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

function generateCustomerConfirmationText(contact: ContactInfo, details: OrderDetails, orderId: string): string {
  return `
Thanks for your order! 🎨

Hi ${contact.name.split(' ')[0]}!

We got your order for ${details.product_title} and we're so excited to make it for you!

We'll reach out soon to confirm the details.

Order ID: ${orderId}

💜 Dylan & Logan
Selling Sisters
  `.trim();
}
```

---

### Task 4.5: Test All Order Types

**Create a testing checklist:**

#### Bracelet Order Test
- [ ] Navigate to a bracelet product
- [ ] Click "Start Order"
- [ ] Select multiple colors (test max colors limit)
- [ ] Add notes
- [ ] Enter contact info (email only)
- [ ] Submit order
- [ ] Verify email received with:
  - [ ] Correct product title
  - [ ] Style displayed correctly
  - [ ] All colors listed
  - [ ] Notes included
  - [ ] Order ID present
  - [ ] Customer contact info correct

#### Coloring Page Order Test
- [ ] Navigate to a coloring page product
- [ ] Click "Start Order"
- [ ] Enter coloring instructions
- [ ] Enter contact info (phone only)
- [ ] Submit order
- [ ] Verify email received with:
  - [ ] Book and page name
  - [ ] Instructions displayed
  - [ ] Phone number clickable

#### Portrait Order Test
- [ ] Navigate to a portrait product
- [ ] Click "Start Order"
- [ ] Select style and size
- [ ] Enter description
- [ ] Upload reference image
- [ ] Enter contact info (both email and phone)
- [ ] Submit order
- [ ] Verify email received with:
  - [ ] Style and size selections
  - [ ] Description text
  - [ ] Reference image displayed/linked
  - [ ] Both contact methods shown

---

### Task 4.6: Handle Edge Cases

**Update validation in `api/orders/submit.ts`:**

#### 4.6.1: Sanitize Input Text

Add a sanitize function to prevent any potential issues:

```typescript
function sanitizeText(text: string): string {
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .trim()
    .slice(0, 1000); // Hard limit
}
```

Use it when generating email content:

```typescript
// In email template generation
const safeNotes = sanitizeText(details.notes || '');
const safeDescription = sanitizeText(details.subject_description || '');
```

#### 4.6.2: Handle Missing Image URL

```typescript
if (details.type === 'portrait') {
  // Validate image URL if required
  if (!details.reference_image_url && isUploadRequired) {
    // Could be a product that doesn't require upload
    console.log('Portrait order without image - checking if required');
  }
}
```

#### 4.6.3: Rate Limiting (Simple Version)

Add basic rate limiting using KV:

```typescript
// At the start of the handler
const clientIp = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown';
const rateLimitKey = `rate-limit:${clientIp}`;

try {
  const requestCount = await kv.incr(rateLimitKey);
  if (requestCount === 1) {
    await kv.expire(rateLimitKey, 60); // Reset after 1 minute
  }
  if (requestCount > 10) {
    return res.status(429).json({
      success: false,
      error: 'Too many requests. Please wait a moment and try again.',
    });
  }
} catch (kvError) {
  // Skip rate limiting if KV not available
  console.log('KV not available for rate limiting');
}
```

---

### Task 4.7: Add Logging for Debugging

Add structured logging to help debug issues:

```typescript
// At start of successful order
console.log(JSON.stringify({
  event: 'order_submitted',
  order_id: orderId,
  product_type: details.type,
  product_id: details.product_id,
  has_email: !!contact.email,
  has_phone: !!contact.phone,
  timestamp: new Date().toISOString(),
}));

// On email send success
console.log(JSON.stringify({
  event: 'email_sent',
  order_id: orderId,
  recipient: recipientEmail,
  timestamp: new Date().toISOString(),
}));

// On error
console.error(JSON.stringify({
  event: 'order_error',
  error: error.message,
  order_id: orderId || 'unknown',
  timestamp: new Date().toISOString(),
}));
```

---

## Acceptance Criteria

- [ ] Resend API key verified and working
- [ ] HTML email template enhanced with better styling
- [ ] Reply-to header added for customer email
- [ ] (Optional) Customer confirmation email implemented
- [ ] All three order types tested successfully
- [ ] Edge cases handled (sanitization, missing data)
- [ ] Rate limiting implemented
- [ ] Logging added for debugging
- [ ] No email delivery failures in testing

---

## Files to Modify

- `api/orders/submit.ts` - Main order submission endpoint

---

## Testing Checklist

### Manual Tests
- [ ] Submit bracelet order with all fields
- [ ] Submit bracelet order with minimal fields
- [ ] Submit coloring page order
- [ ] Submit portrait order with image
- [ ] Try to submit without required fields (should fail gracefully)
- [ ] Try to submit same order twice (idempotency check)
- [ ] Verify emails render correctly in:
  - [ ] Gmail (web)
  - [ ] Outlook (web)
  - [ ] iPhone Mail
  - [ ] Android Gmail

### Error Scenarios
- [ ] Invalid email format
- [ ] Empty required fields
- [ ] Very long text inputs
- [ ] Special characters in text
- [ ] Network timeout handling

---

## Handoff Notes

When complete, report:
1. All email templates updated
2. Test results for each order type
3. Any issues found and fixes applied
4. Logs location for monitoring
