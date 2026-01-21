# Selling Sisters - Phases 1 & 2 Completed Work

**Document Version:** 1.0  
**Last Updated:** January 20, 2026  
**Status:** Complete

---

## Executive Summary

Phases 1 and 2 of the Selling Sisters web application have been completed. This document provides a comprehensive overview of all work accomplished, the current state of the codebase, and technical decisions made.

---

## Project Overview

**Selling Sisters** is a mobile-first web application that enables customers to request handmade products (bracelets, portraits, coloring pages) created by two sisters, Dylan and Logan. The app collects structured requests and sends them via email to a parent-monitored inbox for fulfillment.

### Core Constraints (MVP)
- ❌ No payments or checkout
- ❌ No user accounts or authentication
- ❌ No shipping address collection
- ❌ No admin dashboard (Google Sheets IS the admin)
- ✅ Email-based order submission only
- ✅ Parent oversight via monitored inbox

---

## Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | React 18 + TypeScript | UI framework |
| Styling | Tailwind CSS | Utility-first CSS |
| Routing | React Router v6 | Client-side routing |
| State | React Context | Order flow state |
| Data Fetching | React Query (TanStack) | Server state management |
| Build | Vite | Fast development/build |
| Deployment | Vercel | Hosting + serverless functions |
| Storage | Vercel KV | Product data cache |
| File Storage | Vercel Blob | Image uploads |
| Email | Resend | Transactional email |
| CMS | Google Sheets | Product management |

---

## Repository Structure

```
selling-sisters/
├── api/                          # Vercel serverless functions
│   ├── content/
│   │   ├── products.ts           # GET /api/content/products
│   │   └── publish.ts            # POST /api/content/publish (webhook)
│   ├── orders/
│   │   └── submit.ts             # POST /api/orders/submit
│   └── upload/
│       └── image.ts              # POST /api/upload/image
│
├── public/
│   └── favicon.svg               # App favicon
│
├── src/
│   ├── components/
│   │   ├── layout/               # Header, Footer, Layout
│   │   ├── order/                # OrderStepper
│   │   ├── products/             # ProductCard, ProductGrid
│   │   ├── shared/               # ErrorBoundary, EmptyState, Skeletons
│   │   └── ui/                   # Button, Card, Input, ColorPicker, etc.
│   │
│   ├── context/
│   │   └── OrderContext.tsx      # Order state management
│   │
│   ├── hooks/
│   │   ├── index.ts
│   │   ├── useProducts.ts        # Product fetching hooks
│   │   ├── useOrderSubmit.ts     # Order submission mutation
│   │   └── useImageUpload.ts     # Image upload hook
│   │
│   ├── lib/
│   │   ├── api.ts                # API client functions
│   │   ├── constants.ts          # App constants
│   │   └── sampleData.ts         # Placeholder product data
│   │
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── BraceletsPage.tsx
│   │   ├── PortraitsPage.tsx
│   │   ├── ColoringPagesPage.tsx
│   │   ├── ProductDetailPage.tsx
│   │   ├── NotFoundPage.tsx
│   │   └── order/
│   │       ├── CustomizePage.tsx
│   │       ├── ContactPage.tsx
│   │       ├── ReviewPage.tsx
│   │       └── ConfirmationPage.tsx
│   │
│   ├── styles/
│   │   └── globals.css           # Tailwind imports + custom styles
│   │
│   ├── types/
│   │   ├── index.ts
│   │   ├── product.ts            # Product type definitions
│   │   ├── order.ts              # Order type definitions
│   │   └── api.ts                # API response types
│   │
│   ├── App.tsx                   # Root component with routing
│   ├── main.tsx                  # Entry point
│   └── vite-env.d.ts
│
├── .env.example                  # Environment variable template
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.node.json
├── vercel.json
├── vite.config.ts
└── README.md
```

---

## Phase 1: Foundation - COMPLETED

### 1.1 Project Initialization
- ✅ Created Vite + React + TypeScript project
- ✅ Configured TypeScript with strict mode
- ✅ Set up path aliases (`@/` → `src/`)

### 1.2 Tailwind CSS Configuration
- ✅ Custom color palette (pastel theme):
  - Primary: Soft purple (`#A78BFA`)
  - Secondary: Soft pink (`#F9A8D4`)
  - Accent: Soft green (`#6EE7B7`)
- ✅ Custom fonts: Fredoka One (display), Nunito (body)
- ✅ Custom shadows, spacing, and border radius
- ✅ Animation keyframes (bounce-gentle, fade-in, slide-up)

### 1.3 React Router Setup
- ✅ URL structure implemented:
  ```
  /                           → Home
  /bracelets                  → Bracelet listings
  /bracelets/:productId       → Bracelet detail
  /portraits                  → Portrait listings
  /portraits/:productId       → Portrait detail
  /coloring-pages             → Coloring page listings
  /coloring-pages/:productId  → Coloring page detail
  /order/customize            → Order customization
  /order/contact              → Contact information
  /order/review               → Order review
  /order/confirmation         → Success confirmation
  ```

### 1.4 TypeScript Type Definitions

**Product Types:**
```typescript
type ProductType = 'bracelet' | 'coloring_page' | 'portrait';
type ProductStatus = 'draft' | 'published' | 'archived' | 'sold_out';
type BraceletStyle = 'rubber_band' | 'beaded';

interface BaseProduct {
  product_id: string;
  type: ProductType;
  title: string;
  short_desc: string;
  status: ProductStatus;
  thumbnail_url: string;
  gallery?: string[];
  sort_order?: number;
}

// Extended interfaces for each product type
interface BraceletProduct extends BaseProduct { ... }
interface ColoringPageProduct extends BaseProduct { ... }
interface PortraitProduct extends BaseProduct { ... }
```

**Order Types:**
```typescript
interface ContactInfo {
  name: string;
  email: string;
  phone: string;
}

interface BraceletOrderDetails { ... }
interface ColoringPageOrderDetails { ... }
interface PortraitOrderDetails { ... }

type OrderDetails = BraceletOrderDetails | ColoringPageOrderDetails | PortraitOrderDetails;
```

### 1.5 UI Component Library

| Component | Props | Purpose |
|-----------|-------|---------|
| `Button` | variant, size, isLoading, leftIcon, rightIcon | Primary action button |
| `Card` | variant, padding | Content container |
| `Input` | label, error, hint | Text input with validation |
| `Textarea` | label, error, maxLength, showCounter | Multi-line input |
| `Select` | label, options, error | Dropdown selection |
| `Badge` | variant | Status indicators |
| `ColorPicker` | colors, selected, onChange, maxColors | Multi-select color chips |
| `FileUpload` | onFileSelect, onFileClear, accept, maxSizeMB | Drag-and-drop file upload |
| `LoadingSpinner` | size | Loading indicator |
| `CharacterCounter` | current, max | Text limit display |

### 1.6 Layout Components
- ✅ `Header` - Sticky header with logo, home link
- ✅ `Footer` - Tagline, copyright
- ✅ `Layout` - Wrapper with max-width container

### 1.7 Shared Components
- ✅ `ErrorBoundary` - Global error handling
- ✅ `EmptyState` - No content placeholder
- ✅ `Skeleton` / `ProductCardSkeleton` / `ProductGridSkeleton` - Loading states

### 1.8 Vercel Configuration
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "regions": ["iad1"],
  "functions": {
    "api/**/*.ts": {
      "maxDuration": 10
    }
  }
}
```

---

## Phase 2: Content Infrastructure - COMPLETED

### 2.1 API Endpoints

#### GET /api/content/products
- Fetches products from Vercel KV
- Falls back to sample data if KV not configured
- Query parameters:
  - `type` - Filter by product type
  - `id` - Fetch single product
- Filters to only `published` and `sold_out` statuses
- Sorts by `sort_order`

#### POST /api/content/publish
- Webhook endpoint for Google Sheets
- Validates `secret` against `CONTENT_PUBLISH_SECRET`
- Validates product data structure
- Stores products in Vercel KV
- Returns count of received/published products

#### POST /api/orders/submit
- Validates contact info (name required, email OR phone required)
- Validates order details based on product type
- Checks idempotency key to prevent duplicates
- Sends email via Resend with HTML + plain text templates
- Stores idempotency key in KV (expires after 7 days)
- Returns order ID on success

#### POST /api/upload/image
- Accepts multipart/form-data
- Validates file type (JPEG, PNG only)
- Validates file size (max 10MB)
- Uploads to Vercel Blob
- Returns public URL

### 2.2 React Query Integration

**Query Hooks:**
```typescript
useProducts(type?: ProductType)  // Fetch products
useBracelets()                   // Fetch bracelets only
usePortraits()                   // Fetch portraits only
useColoringPages()               // Fetch coloring pages only
useProduct(productId: string)    // Fetch single product
```

**Mutation Hooks:**
```typescript
useOrderSubmit()   // Submit order mutation
useImageUpload()   // Image upload with loading state
```

### 2.3 API Client (`src/lib/api.ts`)
- `fetchProducts(type?)` - GET products
- `fetchProductById(id)` - GET single product
- `submitOrder(contact, details, idempotencyKey)` - POST order
- `uploadImage(file)` - POST image upload
- `ApiError` class for error handling

### 2.4 Order Context
- Manages complete order flow state
- Actions: `selectProduct`, `updateOrderDetails`, `updateContactInfo`, `setStep`, `resetOrder`
- Persists to `sessionStorage` for page refresh recovery
- Generates idempotency key per order

### 2.5 Page Updates
- All listing pages now use React Query hooks
- Loading skeletons shown during fetch
- Error states displayed on failure
- Product detail page fetches by ID

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `RESEND_API_KEY` | Yes | Resend API key for sending emails |
| `ORDER_EMAIL_RECIPIENT` | No | Email recipient (default: DylanKDelagarza@gmail.com) |
| `CONTENT_PUBLISH_SECRET` | Yes | Webhook authentication secret |
| `KV_REST_API_URL` | Auto | Vercel KV URL (auto-configured) |
| `KV_REST_API_TOKEN` | Auto | Vercel KV token (auto-configured) |
| `BLOB_READ_WRITE_TOKEN` | Auto | Vercel Blob token (auto-configured) |

---

## Current Functionality

### Working Features
1. ✅ Home page with category navigation
2. ✅ Product listing pages (all 3 types)
3. ✅ Product detail pages with type-specific info
4. ✅ Complete order flow UI (4 steps)
5. ✅ Color picker for bracelets
6. ✅ File upload for portrait references
7. ✅ Form validation with friendly messages
8. ✅ Session persistence for orders
9. ✅ API endpoints ready for production
10. ✅ Email templates (HTML + plain text)

### Pending Integration
1. ⏳ Google Sheets → Publish webhook connection
2. ⏳ Vercel KV storage setup
3. ⏳ Vercel Blob storage setup
4. ⏳ Production email testing
5. ⏳ Mobile responsiveness polish
6. ⏳ Accessibility audit

---

## GitHub Repository

**URL:** https://github.com/ryanedelagarza/selling-sisters

**Branches:**
- `main` - Production-ready code

**Initial Commit:** 65 files, 5,441 lines of code

---

## Dependencies

### Production
```json
{
  "@tanstack/react-query": "^5.17.0",
  "@vercel/blob": "^0.23.0",
  "@vercel/kv": "^2.0.0",
  "clsx": "^2.1.0",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.21.0",
  "resend": "^3.2.0",
  "uuid": "^9.0.1"
}
```

### Development
```json
{
  "@types/react": "^18.2.43",
  "@types/react-dom": "^18.2.17",
  "@types/uuid": "^9.0.7",
  "@typescript-eslint/eslint-plugin": "^6.14.0",
  "@typescript-eslint/parser": "^6.14.0",
  "@vercel/node": "^3.0.0",
  "@vitejs/plugin-react": "^4.2.1",
  "autoprefixer": "^10.4.16",
  "eslint": "^8.55.0",
  "postcss": "^8.4.32",
  "tailwindcss": "^3.4.0",
  "typescript": "^5.3.3",
  "vite": "^5.0.8"
}
```

---

## Known Issues / Technical Debt

1. **Sample Data Fallback** - API falls back to hardcoded sample data when KV is not configured. This is intentional for development but should log a warning in production.

2. **Image Upload in Customize Page** - Image is uploaded when user clicks "Next" rather than immediately on selection. This could cause UX issues if upload is slow.

3. **No Rate Limiting** - API endpoints don't have rate limiting. Consider adding for production.

4. **No Analytics** - No tracking or analytics implemented yet.

---

## Next Steps

See the following documents for detailed plans:
- `PHASE_3_GOOGLE_SHEETS.md` - Google Sheets integration
- `PHASE_4_EMAIL_POLISH.md` - Email and order submission refinement
- `PHASE_5_UI_ACCESSIBILITY.md` - UI polish and accessibility
- `PHASE_6_TESTING_QA.md` - Testing and quality assurance
