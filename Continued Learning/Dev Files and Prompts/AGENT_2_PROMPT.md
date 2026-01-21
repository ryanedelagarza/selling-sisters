# Agent 2 Prompt: Email & Order Submission Polish

Copy and paste this prompt to Agent 2:

---

## Your Assignment

You are **Agent 2** working on the **Selling Sisters** project. Your task is to enhance the email templates and ensure the order submission flow is polished, secure, and handles edge cases properly.

## Project Context

**Selling Sisters** is a mobile-first React/TypeScript web application for ordering handmade products (bracelets, portraits, coloring pages). When a customer submits an order, an email is sent to the shop owners. Your job is to make these emails beautiful and reliable.

**Repository:** https://github.com/ryanedelagarza/selling-sisters

**Tech Stack:**
- Frontend: React 18 + TypeScript + Vite
- Backend: Vercel serverless functions
- Email: Resend (API-based email service)
- Storage: Vercel KV (for idempotency)

## Your Documents

Read these files in order to understand your tasks:

1. **Start here:** `Continued Learning/PHASE_1_2_COMPLETED.md`
   - Understand what's already built
   - Review the order submission flow

2. **Your main guide:** `Continued Learning/PHASE_4_EMAIL_POLISH.md`
   - Complete all tasks (4.1 through 4.7)
   - Implement the enhanced email templates

3. **Reference:** `Continued Learning/AGENT_COORDINATION.md`
   - Understand file ownership rules
   - Know what files you can/cannot modify

## Your Deliverables

1. **Enhanced HTML email template** with better styling and layout
2. **Reply-to header** so shop owners can reply directly to customers
3. **Customer confirmation email** (optional but recommended)
4. **Tested all three order types** (bracelet, coloring page, portrait)
5. **Edge case handling** (input sanitization, rate limiting, logging)

## Key Files You Will Modify

```
api/orders/submit.ts      - Main file you'll be editing
```

## Key Files to Reference (don't modify unless necessary)

```
src/lib/api.ts            - API client (submitOrder function)
src/hooks/useOrderSubmit.ts - React hook for submission
src/types/order.ts        - Order type definitions
```

## Important Notes

- The Resend API key should already be configured in Vercel
- Without a custom domain, emails come from `orders@resend.dev`
- Test emails by actually submitting orders through the UI
- Check the email in multiple clients (Gmail, Outlook, mobile)

## Testing Your Changes

1. Run the app locally: `npm run dev`
2. Submit test orders for each product type
3. Verify emails are received and render correctly
4. Test edge cases (long text, special characters, etc.)

## When You're Done

Report back with:
1. List of template improvements made
2. Test results for each order type
3. Screenshots of email renders in different clients
4. Any edge cases found and fixes applied

---

Begin by cloning the repository and reading `Continued Learning/PHASE_4_EMAIL_POLISH.md`.
