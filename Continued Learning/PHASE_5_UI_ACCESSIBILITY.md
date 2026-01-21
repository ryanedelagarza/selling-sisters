# Phase 5: UI/UX Polish & Accessibility

**Agent Assignment:** Agent 3  
**Estimated Effort:** Medium-High  
**Dependencies:** None (can run in parallel)  
**Prerequisites:** Local development environment, browser dev tools

---

## Objective

Polish the user interface, ensure WCAG 2.1 AA accessibility compliance, optimize for mobile devices, and add delightful micro-interactions. This phase focuses entirely on the frontend user experience.

---

## Background Context

### Design System

The app uses a pastel color palette designed to be kid-friendly:
- **Primary:** Soft purple `#A78BFA`
- **Secondary:** Soft pink `#F9A8D4`
- **Accent:** Soft green `#6EE7B7`
- **Fonts:** Fredoka One (headings), Nunito (body)

### Target Devices
- Primary: Mobile phones (iPhone, Android)
- Secondary: Tablets (iPad)
- Tertiary: Desktop browsers

### Accessibility Requirements
- WCAG 2.1 AA compliance
- Touch targets minimum 48x48px
- Color contrast minimum 4.5:1 for text
- Screen reader support
- Keyboard navigation

---

## Tasks

### Task 5.1: Mobile Responsiveness Audit

Test and fix layout issues on these screen sizes:

| Device | Width | Priority |
|--------|-------|----------|
| iPhone SE | 375px | High |
| iPhone 14 | 390px | High |
| iPhone 14 Pro Max | 430px | Medium |
| iPad Mini | 744px | Medium |
| iPad | 820px | Medium |
| Desktop | 1024px+ | Low |

**Testing Checklist:**

#### Home Page
- [ ] Category cards stack properly on mobile
- [ ] Text doesn't overflow
- [ ] Tap targets are large enough
- [ ] Spacing is comfortable

#### Product Listing Pages
- [ ] 2-column grid on mobile
- [ ] 3-column grid on tablet/desktop
- [ ] Images maintain aspect ratio
- [ ] Cards have consistent height

#### Product Detail Page
- [ ] Image is full-width on mobile
- [ ] Text is readable
- [ ] Button is sticky/visible
- [ ] Back link is accessible

#### Order Flow
- [ ] Stepper is readable on mobile
- [ ] Forms are easy to fill on mobile
- [ ] Color picker wraps nicely
- [ ] File upload works on mobile
- [ ] Review page is scrollable

---

### Task 5.2: Fix Common Mobile Issues

**File locations and fixes:**

#### 5.2.1: Prevent Horizontal Scroll

Add to `src/styles/globals.css`:

```css
/* Prevent horizontal overflow */
html, body {
  overflow-x: hidden;
  max-width: 100vw;
}

/* Ensure images don't overflow */
img {
  max-width: 100%;
  height: auto;
}
```

#### 5.2.2: Safe Area Insets (iPhone notch)

Update `src/components/layout/Layout.tsx`:

```tsx
export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-6 pb-safe">
        {children}
      </main>
      
      <Footer />
    </div>
  );
}
```

Add to `tailwind.config.js`:

```js
theme: {
  extend: {
    padding: {
      'safe': 'env(safe-area-inset-bottom, 0)',
    },
  },
}
```

#### 5.2.3: Sticky CTA Button on Product Detail

Update `src/pages/ProductDetailPage.tsx` - wrap the CTA button:

```tsx
{/* Sticky CTA on mobile */}
<div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 md:static md:border-0 md:p-0 md:bg-transparent safe-area-inset-bottom">
  {isSoldOut ? (
    <Button disabled className="w-full">
      Sold Out
    </Button>
  ) : (
    <Button onClick={handleStartOrder} className="w-full">
      Start Order
    </Button>
  )}
</div>

{/* Spacer for fixed button on mobile */}
<div className="h-20 md:hidden" />
```

---

### Task 5.3: Accessibility Audit

#### 5.3.1: Color Contrast Check

Use a contrast checker tool (https://webaim.org/resources/contrastchecker/)

**Check these combinations:**
| Foreground | Background | Ratio Needed | Location |
|------------|------------|--------------|----------|
| `#A78BFA` (primary) | `#FFFFFF` | 4.5:1 | Buttons text |
| `#374151` (text) | `#FFFFFF` | 4.5:1 | Body text |
| `#6B7280` (light text) | `#FFFFFF` | 4.5:1 | Hints, labels |
| `#FFFFFF` | `#A78BFA` | 4.5:1 | Button text on primary |

**If contrast fails, update `tailwind.config.js` colors:**

```js
// Example: darken the primary color for better contrast
primary: {
  DEFAULT: '#8B5CF6', // Darker purple
  // ...
}
```

#### 5.3.2: Focus Indicators

Ensure all interactive elements have visible focus states.

Update `src/styles/globals.css`:

```css
/* High contrast focus ring */
:focus-visible {
  outline: 3px solid #8B5CF6;
  outline-offset: 2px;
}

/* Remove default outline, use ring instead */
button:focus:not(:focus-visible),
a:focus:not(:focus-visible),
input:focus:not(:focus-visible) {
  outline: none;
}
```

#### 5.3.3: Screen Reader Labels

**Add aria-labels to icon-only buttons:**

In `src/components/layout/Header.tsx`:

```tsx
<Link
  to="/"
  aria-label="Go to home page"
  className="..."
>
```

**Add alt text to all images:**

Check all `<img>` tags have meaningful `alt` attributes.

**Add live regions for dynamic content:**

In `src/components/ui/LoadingSpinner.tsx`:

```tsx
<div aria-live="polite" aria-busy="true">
  <LoadingSpinner />
  <span className="sr-only">Loading...</span>
</div>
```

Add `sr-only` class to `globals.css`:

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

#### 5.3.4: Form Labels and Errors

Verify all inputs have proper labels:

```tsx
<Input
  id="email" // Explicit ID
  label="Email Address" // Label displayed
  aria-describedby="email-hint email-error" // Links to hint and error
  aria-invalid={!!errors.email} // Indicates error state
/>
```

Errors should be announced:

```tsx
{errors.email && (
  <p id="email-error" role="alert" className="error-message">
    {errors.email}
  </p>
)}
```

---

### Task 5.4: Keyboard Navigation

#### 5.4.1: Tab Order

Test that Tab key navigates in logical order:
1. Header links
2. Main content (top to bottom)
3. Form fields (in order)
4. Buttons
5. Footer

#### 5.4.2: Enter/Space Activation

Verify all clickable elements work with Enter and Space keys:
- [ ] Category cards on home
- [ ] Product cards
- [ ] Color picker chips
- [ ] File upload area
- [ ] All buttons

**For the ColorPicker, buttons are already used. Verify:**

```tsx
<button
  type="button"
  onClick={() => toggleColor(color)}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleColor(color);
    }
  }}
  aria-pressed={isSelected}
  aria-label={`${color}${isSelected ? ' (selected)' : ''}`}
>
```

#### 5.4.3: Skip Links

Add skip link for keyboard users.

In `src/components/layout/Layout.tsx`:

```tsx
export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Skip link - only visible on focus */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-primary focus:text-white focus:px-4 focus:py-2 focus:rounded-lg"
      >
        Skip to main content
      </a>
      
      <Header />
      
      <main id="main-content" className="flex-1 ...">
        {children}
      </main>
      
      <Footer />
    </div>
  );
}
```

---

### Task 5.5: Loading States & Feedback

#### 5.5.1: Skeleton Improvements

Ensure skeletons match actual content layout.

Check `src/components/shared/SkeletonLoader.tsx`:

```tsx
// Product card skeleton should match ProductCard dimensions
export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse">
      {/* Image - square aspect ratio */}
      <div className="aspect-square bg-gray-200" />
      
      {/* Content - match padding */}
      <div className="p-3 md:p-4 space-y-2">
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />
      </div>
    </div>
  );
}
```

#### 5.5.2: Button Loading States

Verify all async buttons show loading:

```tsx
<Button
  isLoading={isSubmitting}
  disabled={isSubmitting}
>
  {isSubmitting ? 'Processing...' : 'Submit'}
</Button>
```

#### 5.5.3: Success/Error Feedback

Add toast-like feedback for actions.

Create `src/components/ui/Toast.tsx`:

```tsx
import { useEffect, useState } from 'react';
import { clsx } from 'clsx';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onClose: () => void;
}

export default function Toast({ 
  message, 
  type = 'info', 
  duration = 3000, 
  onClose 
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for exit animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-primary',
  };

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
  };

  return (
    <div
      role="alert"
      className={clsx(
        'fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-auto md:min-w-[300px]',
        'p-4 rounded-lg shadow-lg text-white',
        'flex items-center gap-3',
        'transition-all duration-300',
        bgColors[type],
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      )}
    >
      <span className="text-xl">{icons[type]}</span>
      <span>{message}</span>
    </div>
  );
}
```

---

### Task 5.6: Micro-Interactions & Animations

#### 5.6.1: Button Press Effect

Update `src/components/ui/Button.tsx`:

```tsx
const variantStyles = {
  primary: `
    bg-primary text-white 
    hover:bg-primary-hover 
    active:scale-[0.97] active:bg-primary-700
    transition-all duration-150
  `,
  // ...
};
```

#### 5.6.2: Card Hover Effect

Update `src/components/ui/Card.tsx`:

```tsx
const variantStyles = {
  interactive: `
    shadow-card 
    hover:shadow-card-hover hover:-translate-y-0.5
    active:translate-y-0 active:shadow-card
    cursor-pointer 
    transition-all duration-200
  `,
};
```

#### 5.6.3: Page Transitions

Add fade-in animation to page content.

Create `src/components/shared/PageTransition.tsx`:

```tsx
import { ReactNode, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function PageTransition({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(false);
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div
      className={`transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {children}
    </div>
  );
}
```

Wrap content in `App.tsx`:

```tsx
<Layout>
  <PageTransition>
    <Routes>
      {/* ... */}
    </Routes>
  </PageTransition>
</Layout>
```

#### 5.6.4: Color Picker Selection Animation

Update `src/components/ui/ColorPicker.tsx`:

```tsx
<button
  className={clsx(
    'relative w-10 h-10 rounded-full border-2',
    'transition-all duration-200 ease-out',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
    isSelected
      ? 'border-primary ring-2 ring-primary ring-offset-2 scale-110'
      : 'border-gray-200 hover:border-gray-400 hover:scale-105',
    isDisabled && 'opacity-40 cursor-not-allowed hover:scale-100'
  )}
>
```

---

### Task 5.7: Image Optimization

#### 5.7.1: Lazy Loading

All images should use lazy loading:

```tsx
<img
  src={product.thumbnail_url}
  alt={product.title}
  loading="lazy" // Add this
  className="..."
/>
```

#### 5.7.2: Placeholder/Blur

Add a placeholder while images load.

Update `src/components/products/ProductCard.tsx`:

```tsx
const [imageLoaded, setImageLoaded] = useState(false);

return (
  <div className="relative aspect-square overflow-hidden rounded-t-xl bg-gray-100">
    {/* Placeholder */}
    {!imageLoaded && (
      <div className="absolute inset-0 bg-gray-200 animate-pulse" />
    )}
    
    <img
      src={product.thumbnail_url}
      alt={product.title}
      loading="lazy"
      onLoad={() => setImageLoaded(true)}
      className={clsx(
        'w-full h-full object-cover transition-opacity duration-300',
        imageLoaded ? 'opacity-100' : 'opacity-0'
      )}
    />
  </div>
);
```

---

### Task 5.8: Error States

#### 5.8.1: Friendly Error Messages

Ensure all error states are kid-friendly.

Create `src/lib/errorMessages.ts`:

```typescript
export const ERROR_MESSAGES = {
  network: "Oops! We're having trouble connecting. Please check your internet and try again.",
  notFound: "We couldn't find that. It might have been removed or sold out!",
  validation: "Something doesn't look right. Please check your info and try again.",
  server: "Something went wrong on our end. Please try again in a moment.",
  upload: "We couldn't upload your photo. Please try a different image or try again.",
  timeout: "This is taking too long. Please try again.",
};
```

#### 5.8.2: Error Illustrations

Add friendly error illustrations.

Update `src/components/shared/EmptyState.tsx`:

```tsx
// Add more emoji options for different states
const ILLUSTRATIONS: Record<string, string> = {
  empty: '🎨',
  notFound: '🔍',
  error: '😅',
  noProducts: '📦',
  comingSoon: '🚧',
  offline: '📡',
};
```

---

## Acceptance Criteria

- [ ] All pages render correctly on mobile (375px - 430px)
- [ ] All pages render correctly on tablet (744px - 820px)
- [ ] No horizontal scroll on any page
- [ ] All touch targets are at least 48x48px
- [ ] Color contrast passes WCAG AA (4.5:1 minimum)
- [ ] All interactive elements have visible focus states
- [ ] Screen reader can navigate all pages
- [ ] Keyboard can complete full order flow
- [ ] Skip link implemented
- [ ] Loading states show skeletons
- [ ] Buttons show loading state during async operations
- [ ] Animations are smooth and not distracting
- [ ] Images lazy load with placeholders

---

## Testing Tools

1. **Chrome DevTools** - Device simulation, Lighthouse audit
2. **WAVE Browser Extension** - Accessibility checker
3. **axe DevTools** - Accessibility testing
4. **Color Contrast Analyzer** - https://webaim.org/resources/contrastchecker/
5. **VoiceOver (Mac)** / **NVDA (Windows)** - Screen reader testing

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/styles/globals.css` | Add utility classes, focus styles |
| `tailwind.config.js` | Update colors if needed |
| `src/components/layout/Layout.tsx` | Skip link, safe areas |
| `src/components/ui/Button.tsx` | Loading states, animations |
| `src/components/ui/Card.tsx` | Hover animations |
| `src/components/ui/ColorPicker.tsx` | Selection animations |
| `src/components/products/ProductCard.tsx` | Image loading |
| `src/components/shared/SkeletonLoader.tsx` | Match layouts |
| `src/pages/ProductDetailPage.tsx` | Sticky CTA |
| All form pages | Aria labels, error handling |

---

## Handoff Notes

When complete, report:
1. Lighthouse accessibility score (aim for 90+)
2. Any color changes made
3. List of animation/interaction additions
4. Known issues on specific devices
5. Screen reader testing results
