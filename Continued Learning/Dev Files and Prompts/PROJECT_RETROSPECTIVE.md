# Selling Sisters - Project Retrospective

**Project:** Selling Sisters Web Application  
**Date:** January 2026  
**Team:** Ryan (Lead) + AI-Assisted Development with Parallel Agents  
**Status:** MVP Development Complete, Initial Deployment

---

## 1. PROJECT OVERVIEW

### What We Built

Selling Sisters is a mobile-first web application that allows customers to request handmade products created by two young entrepreneurs, Dylan and Logan. The app handles order requests for three product types:

1. **Bracelets** - Rubber band and beaded friendship bracelets with color customization
2. **Portraits** - Custom artwork with reference image uploads
3. **Coloring Pages** - Pages from coloring books colored to customer specifications

The app collects structured order requests and sends them via email to a parent-monitored inbox for fulfillment. There are no payments, no user accounts, and no shipping - just simple order capture.

### Core Technologies & Services

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 18 + TypeScript | UI framework with type safety |
| **Styling** | Tailwind CSS | Utility-first styling |
| **Routing** | React Router v6 | Client-side navigation |
| **State** | React Context + React Query | Order flow + server state |
| **Build** | Vite | Fast development and bundling |
| **Deployment** | Vercel | Hosting + serverless functions |
| **Database** | Vercel KV | Product data cache |
| **File Storage** | Vercel Blob | Reference image uploads |
| **Email** | Resend | Transactional email delivery |
| **CMS** | Google Sheets + Apps Script | Product management |

### Key Features Delivered

- ✅ Home page with category navigation
- ✅ Product listing pages (3 types)
- ✅ Product detail pages with type-specific info
- ✅ Multi-step order flow with session persistence
- ✅ Color picker component for bracelets
- ✅ Image upload for portrait references
- ✅ Form validation with friendly error messages
- ✅ Email notifications to shop owners
- ✅ Customer confirmation emails
- ✅ Google Sheets CMS integration
- ✅ Accessibility improvements (WCAG 2.1 AA)
- ✅ Mobile-first responsive design

### Timeline & Major Milestones

| Phase | Focus | Key Deliverables |
|-------|-------|------------------|
| Phase 1 | Foundation | Project setup, design system, routing, type definitions |
| Phase 2 | Content Infrastructure | API endpoints, React Query hooks, order submission |
| Phase 3 | Google Sheets Integration | CMS setup, Apps Script, publish webhook |
| Phase 4 | Email Polish | Enhanced templates, customer confirmations |
| Phase 5 | UI/UX & Accessibility | Mobile optimization, keyboard nav, focus states |
| Phase 6 | Testing & QA | Manual testing, bug fixes, deployment |

---

## 2. DEVELOPMENT JOURNEY - STEP BY STEP

### Phase 1: Foundation & Architecture

#### What We Did
- Initialized Vite + React + TypeScript project
- Configured Tailwind CSS with custom design tokens (pastel color palette)
- Set up React Router with full URL structure
- Created comprehensive TypeScript type definitions
- Built reusable UI component library
- Implemented layout components (Header, Footer, Layout)
- Created OrderContext for multi-step order state management

#### Why We Did It
- **Vite over CRA**: Faster development server, better ESM support, smaller bundles
- **Tailwind CSS**: Rapid prototyping, consistent design, mobile-first utilities
- **Type definitions first**: Catch errors early, self-documenting code, better IDE support
- **Context for order flow**: Complex multi-step state that needs to persist across pages

#### What We Learned
1. **Define types before building UI** - Having `Product`, `OrderDetails`, and `ContactInfo` types defined upfront prevented countless bugs and made component props obvious.

2. **Discriminated unions are powerful but tricky** - Using `type` as a discriminant field (`'bracelet' | 'coloring_page' | 'portrait'`) enables great type narrowing but creates complexity when you need partial/building states.

3. **Design tokens in Tailwind config pay dividends** - Custom colors like `primary`, `secondary`, `accent` meant we could change the entire palette from one file.

#### What Worked Well
- Starting with a detailed PRD gave clear direction
- Component library built early was reused everywhere
- Session storage persistence saved the order flow from page refresh disasters

#### What We'd Do Differently
- **Create `PartialOrderDetails` type from the start** - We hit TypeScript errors during deployment because `Partial<DiscriminatedUnion>` doesn't work intuitively. Should have anticipated the "building up" vs "complete" order states.

---

### Phase 2: API Layer & Data Fetching

#### What We Did
- Created Vercel serverless functions for:
  - `GET /api/content/products` - Fetch product listings
  - `POST /api/content/publish` - Google Sheets webhook
  - `POST /api/orders/submit` - Order submission with email
  - `POST /api/upload/image` - Portrait reference uploads
- Integrated React Query for data fetching
- Built API client utilities with error handling
- Implemented idempotency for order submission

#### Why We Did It
- **Serverless functions**: No server to manage, scales automatically, cold starts acceptable for this use case
- **React Query**: Automatic caching, loading/error states, background refetching
- **Idempotency keys**: Prevent duplicate orders from network retries or double-clicks

#### What We Learned
1. **Development fallbacks are essential** - API endpoints that gracefully degrade when services (KV, Blob, Resend) aren't configured meant development could proceed without full infrastructure.

```typescript
if (!resendApiKey) {
  console.log('RESEND_API_KEY not configured - simulating email send');
  // Still return success so UI flow works
}
```

2. **Vercel KV and Blob are auto-configured** - Environment variables are automatically injected when you create storage from the Vercel dashboard. Don't manually set them.

3. **Type guards with discriminated unions need care** - Our type guards initially accepted `Partial<OrderDetails>` but returned `details is BraceletOrderDetails`, which TypeScript rejected because the types weren't compatible.

#### What Worked Well
- React Query's `useQuery` and `useMutation` patterns are clean
- Separating API client (`src/lib/api.ts`) from hooks (`src/hooks/`) kept concerns clear
- Custom error classes (`ApiError`) enabled better error handling in UI

#### What We'd Do Differently
- **Test API endpoints locally with Vercel CLI** - We could have caught issues earlier by running `vercel dev` instead of deploying to find problems.

---

### Phase 3: Multi-Step Order Flow

#### What We Did
- Built 4-step order process: Customize → Contact → Review → Confirmation
- Created OrderContext with useReducer for complex state
- Implemented session storage persistence
- Added step validation before progression
- Built OrderStepper component for visual progress

#### Why We Did It
- **useReducer over useState**: Multiple related state updates, complex transitions, easier testing
- **Session storage**: Survives page refreshes, clears on browser close (appropriate for incomplete orders)
- **Context over props**: Order state needed in many components at different tree depths

#### What We Learned
1. **State machine thinking helps** - Even without a formal state machine library, thinking in terms of valid states and transitions prevented many bugs.

2. **Form state should live in forms** - The contact form manages its own input state, only pushing to context on "Continue". This separation prevented jank from context updates on every keystroke.

3. **Edit flows need careful navigation** - Allowing users to go back and edit required preserving existing data while allowing modifications. The spread pattern worked:

```typescript
orderDetails: { ...state.orderDetails, ...action.payload }
```

#### What Worked Well
- Clear separation between "in-progress" order building and "complete" order submission
- Idempotency key generation on product selection (not on submit) prevented issues
- Visual stepper gave users confidence in the process

#### What We'd Do Differently
- **Consider URL-based step state** - Currently steps are in context; URL params would enable direct linking and browser back button support.

---

### Phase 4: Email Integration

#### What We Did
- Integrated Resend for transactional email
- Built HTML email templates with inline styles
- Added plain text fallbacks
- Implemented customer confirmation emails
- Added reply-to headers for easy response

#### Why We Did It
- **Resend over alternatives**: Simple API, good deliverability, generous free tier
- **HTML + plain text**: Email client compatibility
- **Reply-to header**: Shop owners can reply directly to customers from their email client

#### What We Learned
1. **Email HTML is 1999 web development** - Tables for layout, inline styles only, no modern CSS. Test in multiple clients.

2. **Sanitize all user input in emails** - XSS in email is real. We added sanitization:

```typescript
function sanitizeText(text: string): string {
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .trim();
}
```

3. **Customer confirmation emails reduce anxiety** - Even though our app shows a confirmation screen, an email gives customers something tangible.

#### What Worked Well
- Emoji in subject lines (📿, 🎨, 🖼️) make emails scannable
- Structured layout with clear sections (Customer Info, Order Details)
- Including order ID in both owner and customer emails

#### What We'd Do Differently
- **Use an email template library** - Writing raw HTML tables is error-prone. Libraries like `react-email` would help.

---

### Phase 5: Deployment & TypeScript Issues

#### What We Did
- Configured Vercel deployment via GitHub
- Fixed multiple TypeScript errors during CI build
- Resolved discriminated union type issues
- Created `PartialOrderDetails` type for order building
- Added empty commit workaround when Vercel built wrong commit

#### Why We Did It
- **GitHub integration**: Automatic deploys on push, preview deployments for PRs
- **TypeScript in CI**: Catches errors that might slip through local development

#### What We Learned
1. **Local builds ≠ CI builds** - TypeScript's `noEmit` in tsconfig meant errors weren't caught during local dev. The CI build with `tsc && vite build` surfaced them.

2. **`Partial<DiscriminatedUnion>` is a trap** - When you have:
```typescript
type OrderDetails = BraceletOrder | PortraitOrder;
```
And try:
```typescript
Partial<OrderDetails>
```
You get a weird union of partials that doesn't narrow properly. Solution: define an explicit partial type.

3. **Vercel builds can race with pushes** - We pushed a fix but Vercel built the previous commit. An empty commit (`--allow-empty`) forced a new build.

4. **Different property types in union members cause issues** - `BraceletOrderDetails.style: BraceletStyle` vs `PortraitOrderDetails.style: string` caused type guard problems. Solution: `style?: BraceletStyle | string` in the partial type.

#### What Worked Well
- Vercel's build logs are clear and show exact TypeScript errors
- Environment variables UI in Vercel is straightforward

#### What We'd Do Differently
- **Run `tsc --noEmit` locally before pushing** - Add to pre-commit hook or npm script
- **Define partial/builder types upfront** - Anticipate the difference between "building" and "complete" data structures

---

### Phase 6: Parallel Agent Development

#### What We Did
- Created detailed phase documentation for 4 parallel agents
- Each agent received specific focus area:
  - Agent 1: Google Sheets CMS
  - Agent 2: Email polish
  - Agent 3: UI/UX & accessibility
  - Agent 4: Testing & QA
- Defined file ownership to prevent merge conflicts
- Established communication protocols and deliverables

#### Why We Did It
- **Parallelize independent work**: Agents could work on non-overlapping areas simultaneously
- **Clear documentation**: Each agent needed full context to work autonomously
- **Reduce coordination overhead**: Clear ownership meant fewer conflicts

#### What We Learned
1. **Documentation-first enables parallelism** - The time spent writing detailed phase docs paid off in autonomous agent work.

2. **File ownership boundaries matter** - Defining "Agent 3 owns `src/components/`" prevented conflicting edits.

3. **Integration still needs sequencing** - Even with parallel work, final integration and testing must be sequential.

#### What Worked Well
- Agent prompts with clear deliverables
- Phase documents served as both instructions and acceptance criteria
- Coordination document explained dependencies

#### What We'd Do Differently
- **Establish branch strategy upfront** - Each agent on their own branch, merge via PRs
- **Add integration checkpoints** - Scheduled sync points to catch issues early

---

## 3. TECHNICAL DEEP DIVES

### React Patterns That Proved Valuable

#### 1. Custom Hooks for Data Fetching
```typescript
export function useProducts(type?: ProductType) {
  return useQuery({
    queryKey: ['products', type],
    queryFn: () => fetchProducts(type),
    staleTime: 5 * 60 * 1000,
  });
}

// Usage
const { data: products, isLoading, error } = useProducts('bracelet');
```

**Why it works**: Encapsulates fetching logic, query keys, and caching config. Components stay clean.

#### 2. Compound Components for Forms
```typescript
<Input
  id="name"
  label="Your Name"
  error={errors.name}
  hint="So we know who to make this for!"
  {...register('name')}
/>
```

**Why it works**: Label, input, error, and hint are always together. One component, consistent styling.

#### 3. Type Guards for Conditional Rendering
```typescript
{isBraceletOrder(orderDetails) && (
  <ColorDisplay colors={orderDetails.colors} />
)}
```

**Why it works**: TypeScript knows `orderDetails.colors` exists inside the block. No optional chaining needed.

### TypeScript Typing Strategies

#### 1. Discriminated Unions for Product/Order Types
```typescript
type OrderDetails = 
  | BraceletOrderDetails 
  | ColoringPageOrderDetails 
  | PortraitOrderDetails;
```

**Lesson**: Great for complete data, but you need a separate "partial" or "builder" type for in-progress states.

#### 2. Const Assertions for Configs
```typescript
export const PRODUCT_CATEGORIES = [
  { type: 'bracelet', label: 'Bracelets', ... },
  { type: 'portrait', label: 'Portraits', ... },
] as const;
```

**Lesson**: `as const` preserves literal types, enabling better type inference.

#### 3. Type Predicates for Narrowing
```typescript
export function isBraceletOrder(
  details: PartialOrderDetails
): details is BraceletOrderDetails {
  return details.type === 'bracelet';
}
```

**Lesson**: The return type must be assignable to the parameter type. If property types differ between union members, the predicate can fail.

### API Integration Learnings

#### 1. Graceful Degradation
```typescript
try {
  const existing = await kv.get(idempotencyKey);
  // ... use KV
} catch (kvError) {
  console.log('KV not configured, skipping');
  // Continue without KV
}
```

**Principle**: External services fail. Always have a fallback, even if it's just logging.

#### 2. Structured Logging
```typescript
console.log(JSON.stringify({
  event: 'order_submitted',
  order_id: orderId,
  product_type: details.type,
  timestamp: new Date().toISOString(),
}));
```

**Principle**: JSON logs are searchable and parseable. Include event name, IDs, and timestamp.

#### 3. Input Validation Layers
- Client-side: Immediate feedback, better UX
- Server-side: Security, never trust client

**Principle**: Validate twice. Client for UX, server for security.

### State Management Patterns

#### 1. Context for Cross-Cutting State
Order flow state (selected product, details, contact info, current step) lives in context because:
- Multiple pages need it
- It persists across navigation
- It has complex update logic

#### 2. Local State for Form Inputs
```typescript
const [name, setName] = useState(contactInfo.name || '');
// Only push to context on "Continue"
```

**Principle**: Keep ephemeral UI state local. Only promote to context when it becomes "real".

#### 3. React Query for Server State
```typescript
const { data, isLoading, error } = useProducts();
```

**Principle**: Server state is different from UI state. React Query handles caching, refetching, and synchronization.

---

## 4. CHALLENGES & SOLUTIONS

### Challenge 1: TypeScript Errors with Partial Discriminated Unions

**Problem**: Build failed with errors like:
```
Type 'Partial<BraceletOrderDetails>' is not assignable to type 'OrderDetails'
```

**Root Cause**: `Partial<DiscriminatedUnion>` creates a union of partials, not a partial of a union. TypeScript can't narrow it properly.

**Solution**: Created explicit `PartialOrderDetails` type with all possible fields optional:
```typescript
export type PartialOrderDetails = {
  type?: 'bracelet' | 'coloring_page' | 'portrait';
  product_id?: string;
  // ... all fields from all order types
  style?: BraceletStyle | string; // Union for different uses
};
```

**Alternative Considered**: Using generics with conditional types. Rejected as overly complex.

### Challenge 2: Different Property Types Across Union Members

**Problem**: `BraceletOrderDetails.style` is `BraceletStyle` (enum), but `PortraitOrderDetails.style` is `string`.

**Root Cause**: Same property name, different types in different union members.

**Solution**: In `PartialOrderDetails`, use union: `style?: BraceletStyle | string`

**Lesson**: When designing types, consider if property names will collide with different types.

### Challenge 3: Vercel Building Wrong Commit

**Problem**: Pushed fix, but Vercel built the previous commit.

**Root Cause**: Build was queued before push completed.

**Solution**: Empty commit to force new build:
```bash
git commit --allow-empty -m "Trigger rebuild"
git push
```

**Better Solution**: Redeploy from Vercel dashboard with cache disabled.

### Challenge 4: Session Storage and SSR

**Problem**: Accessing `sessionStorage` during SSR/hydration causes errors.

**Solution**: Only access in `useEffect` (client-side only):
```typescript
useEffect(() => {
  const stored = sessionStorage.getItem(STORAGE_KEY);
  // ...
}, []);
```

---

## 5. DESIGN PRINCIPLES & GUIDELINES

### Architecture Principles

#### Principle 1: Separate Data Types for Different Lifecycles

**Statement**: Define distinct types for data in different states (building vs. complete, client vs. server).

**Why It Matters**: A form being filled out has different requirements than submitted data. Trying to use one type for both creates friction.

**Example**: `PartialOrderDetails` (building) vs `OrderDetails` (complete)

**How to Apply**: Ask "What states can this data be in?" at design time. Create types for each state.

---

#### Principle 2: API Endpoints Should Degrade Gracefully

**Statement**: Every external service call should have a fallback behavior.

**Why It Matters**: Services fail, configs get missed, local dev differs from production.

**Example**:
```typescript
if (!resendApiKey) {
  console.log('Simulating email send');
  return res.status(200).json({ success: true, order_id: orderId });
}
```

**How to Apply**: Wrap external calls in try/catch. Define what "success" means when the service is unavailable.

---

#### Principle 3: Type First, Build Second

**Statement**: Define TypeScript interfaces before building components that use them.

**Why It Matters**: Types become documentation. They catch mismatches before runtime. IDEs provide better autocomplete.

**Example**: We defined `Product`, `OrderDetails`, `ContactInfo` before building any forms.

**How to Apply**: Start new features by writing types in a `.ts` file. Then build to those types.

---

### Component Design Guidelines

#### Guideline 1: Colocate Related Elements

**Statement**: If elements always appear together, put them in one component.

**Why It Matters**: Reduces prop drilling, ensures consistency, simplifies usage.

**Example**: `Input` component includes label, input field, error message, and hint.

**How to Apply**: Look for patterns in your UI. If you always render A next to B, create a component that renders both.

---

#### Guideline 2: Use Composition Over Configuration

**Statement**: Prefer composing small components over configuring large ones.

**Why It Matters**: Flexible, testable, easier to understand.

**Example**:
```tsx
// Good: Composition
<Card>
  <ProductImage src={...} />
  <ProductInfo title={...} />
</Card>

// Avoid: Configuration
<ProductCard 
  showImage={true}
  showInfo={true}
  imagePosition="top"
  infoLayout="stacked"
/>
```

**How to Apply**: When a component gains many boolean props, consider splitting it.

---

#### Guideline 3: Lift State Only When Necessary

**Statement**: Start with local state. Lift to context only when multiple components need it.

**Why It Matters**: Local state is simpler, doesn't cause unnecessary re-renders, easier to reason about.

**Example**: Form input values stay local until "Continue" is clicked, then save to context.

**How to Apply**: Ask "Who else needs this?" If the answer is "just this component", keep it local.

---

### API Integration Best Practices

#### Practice 1: Validate on Both Ends

**Statement**: Validate input on client (for UX) and server (for security).

**Why It Matters**: Client validation can be bypassed. Server is the source of truth.

**Example**:
- Client: Form shows "Email required" error
- Server: Returns 400 if email missing

**How to Apply**: Never trust client data. Re-validate everything server-side.

---

#### Practice 2: Use Idempotency Keys for Mutations

**Statement**: Every state-changing operation should support idempotency.

**Why It Matters**: Network retries, double-clicks, and race conditions cause duplicate operations.

**Example**: Order submission checks KV for existing idempotency key before processing.

**How to Apply**: Generate a unique key client-side. Check it server-side before processing.

---

#### Practice 3: Return Actionable Errors

**Statement**: Error responses should tell the user what to do, not what went wrong technically.

**Why It Matters**: Users can't fix "TypeError: undefined is not a function".

**Example**:
```typescript
// Bad
{ error: 'Database connection failed' }

// Good
{ error: "We couldn't process your order right now. Please try again in a moment." }
```

**How to Apply**: Catch technical errors, log them, return user-friendly messages.

---

### User Experience Priorities

#### Priority 1: Mobile First, Always

**Statement**: Design for the smallest screen first, then enhance for larger screens.

**Why It Matters**: Most users are on mobile. It's easier to scale up than scale down.

**Example**: Our product grid is 2 columns on mobile, 3 on tablet, 4 on desktop.

**How to Apply**: Start with `max-width: 375px` in Chrome DevTools. Add `md:` and `lg:` utilities after.

---

#### Priority 2: Perceived Performance Over Actual

**Statement**: Make the app feel fast, even if operations take time.

**Why It Matters**: Perceived performance affects user satisfaction more than benchmarks.

**Example**: Skeleton loaders during data fetch, optimistic updates, loading spinners with labels.

**How to Apply**: Show immediate feedback. Use skeletons that match content layout.

---

#### Priority 3: Fail Gracefully, Communicate Clearly

**Statement**: When something fails, tell users what happened and what they can do.

**Why It Matters**: Silent failures are worse than visible ones.

**Example**: Network error shows "Check your connection and try again" with retry button.

**How to Apply**: Every error state needs a message and an action.

---

### Code Organization Standards

#### Standard 1: Feature-Based Organization for Complex Features

```
src/
  pages/
    order/
      CustomizePage.tsx
      ContactPage.tsx
      ReviewPage.tsx
  components/
    order/
      OrderStepper.tsx
    products/
      ProductCard.tsx
  hooks/
    useProducts.ts
    useOrderSubmit.ts
```

**Why**: Related files are near each other. Easy to find what you need.

---

#### Standard 2: Barrel Exports for Public APIs

```typescript
// src/components/ui/index.ts
export { default as Button } from './Button';
export { default as Card } from './Card';
export { default as Input } from './Input';
```

**Why**: Clean imports, easy to refactor internals.

---

#### Standard 3: Types in Dedicated Files

```
src/types/
  product.ts
  order.ts
  api.ts
  index.ts
```

**Why**: Types are reused across the app. Central location prevents duplication.

---

## 6. TECHNICAL DEBT & FUTURE CONSIDERATIONS

### Known Limitations

1. **No automated tests** - MVP decision. Manual testing only.
2. **No analytics** - Can't track user behavior.
3. **Sample data fallback** - API returns hardcoded data if KV is empty.
4. **Email from shared domain** - `orders@resend.dev` instead of custom domain.

### Areas Needing Refactoring

1. **Order type handling** - The `PartialOrderDetails` solution works but is verbose.
2. **Form validation** - Could use a library like `react-hook-form` with `zod`.
3. **Error boundary granularity** - Currently one at root, could be more targeted.

### Future Improvements to Consider

1. **Order history page** - Let users see past orders (requires accounts or email lookup)
2. **Product image gallery** - Multiple images per product with lightbox
3. **Admin dashboard** - Replace Google Sheets for power users
4. **Push notifications** - Order status updates
5. **Internationalization** - Support multiple languages

### Accepted Technical Debt

| Debt | Reason Accepted | Risk |
|------|-----------------|------|
| No tests | MVP speed | Medium - will need before major changes |
| Manual KV setup | Vercel handles it | Low |
| No rate limiting on public endpoints | Low traffic expected | Medium - add if traffic grows |

---

## 7. KEY TAKEAWAYS

### Top 7 Lessons Learned

1. **Define types before building** - Upfront type design prevents entire categories of bugs and improves DX.

2. **Discriminated unions need partial counterparts** - If you have a union type, you probably need a "builder" version.

3. **Local build ≠ CI build** - Run `tsc --noEmit` locally. TypeScript errors that don't block Vite will block CI.

4. **Graceful degradation is essential** - Every external service call needs a fallback path for development and failures.

5. **Mobile-first isn't optional** - Start at 375px. Scale up. Never the reverse.

6. **Document before parallelizing** - Clear ownership and context enables autonomous parallel work.

7. **Session storage for ephemeral state** - Perfect for multi-step flows that shouldn't persist forever.

### What Surprised Us Most

- **TypeScript strictness varies by config** - `noEmit: true` in tsconfig meant local dev didn't catch errors that CI did.
- **Vercel build timing** - Builds can queue and execute in unexpected order relative to pushes.
- **Email HTML is ancient** - Table layouts and inline styles in 2026.

### What We'd Start Immediately on Next Project

1. Run `tsc --noEmit` in pre-commit hook
2. Define "partial" types alongside complete types from day one
3. Set up Vercel CLI for local function testing
4. Create API error handling utilities immediately
5. Build skeleton loaders that match actual content layout

### What We'd Avoid

1. Using `Partial<DiscriminatedUnion>` directly
2. Assuming local dev catches all TypeScript errors
3. Writing email HTML without a component library
4. Deploying without testing the full order flow end-to-end
5. Defining types after building components

---

## Appendix: Quick Reference

### Commands

```bash
# Development
npm run dev

# Build (matches CI)
npm run build

# Type check only
npx tsc --noEmit

# Lint
npm run lint
```

### Key Files

| Purpose | Location |
|---------|----------|
| Types | `src/types/` |
| API Client | `src/lib/api.ts` |
| Order Context | `src/context/OrderContext.tsx` |
| API Endpoints | `api/` |
| Design Tokens | `tailwind.config.js` |
| Global Styles | `src/styles/globals.css` |

### Environment Variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `RESEND_API_KEY` | Yes | Email sending |
| `ORDER_EMAIL_RECIPIENT` | No | Override default recipient |
| `CONTENT_PUBLISH_SECRET` | Yes | Webhook authentication |
| `KV_*` | Auto | Vercel KV (auto-configured) |
| `BLOB_*` | Auto | Vercel Blob (auto-configured) |

---

*This retrospective was written to capture learnings for future projects. Refer back to it before starting new work.*
