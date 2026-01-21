# Phase 6: Testing & Quality Assurance

**Agent Assignment:** Agent 4  
**Estimated Effort:** Medium  
**Dependencies:** Phases 3-5 should be in progress (can test incrementally)  
**Prerequisites:** Deployed Vercel app, access to multiple devices/browsers

---

## Objective

Comprehensive testing of the Selling Sisters application to ensure reliability, security, and quality. This phase covers end-to-end testing, edge cases, performance, cross-browser compatibility, and security review.

---

## Background Context

### Application Overview
- **Type:** Mobile-first web application
- **Purpose:** Order requests for handmade products
- **Users:** Customers (general public), Shop owners (Dylan & Logan)
- **Critical Flows:** Browse products → Customize → Submit order → Email received

### Test Environments
| Environment | URL | Purpose |
|-------------|-----|---------|
| Production | https://selling-sisters.vercel.app | Live testing |
| Preview | Vercel preview deployments | PR testing |
| Local | http://localhost:3000 | Development testing |

---

## Tasks

### Task 6.1: End-to-End Test Scenarios

Complete each scenario and document results.

#### Scenario 1: Bracelet Order - Happy Path

| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Navigate to home page | Home loads with 3 category cards | | |
| 2 | Click "Bracelets" card | Bracelets listing page loads | | |
| 3 | Click any bracelet product | Product detail page loads | | |
| 4 | Click "Start Order" | Redirected to /order/customize | | |
| 5 | Select 2-3 colors | Colors highlighted with checkmarks | | |
| 6 | Add notes (optional) | Character counter updates | | |
| 7 | Click "Next: Contact Info" | Redirected to /order/contact | | |
| 8 | Enter name | Name accepted | | |
| 9 | Enter email | Email validated | | |
| 10 | Click "Review Order" | Redirected to /order/review | | |
| 11 | Verify order summary | All selections shown correctly | | |
| 12 | Click "Submit Order" | Loading state shown | | |
| 13 | Wait for confirmation | Success page displayed | | |
| 14 | Check email inbox | Order email received | | |

#### Scenario 2: Portrait Order with Image Upload

| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Navigate to Portraits | Listing loads | | |
| 2 | Select portrait product | Detail page loads | | |
| 3 | Click "Start Order" | Customize page loads | | |
| 4 | Select style option | Style saved | | |
| 5 | Select size option | Size saved | | |
| 6 | Enter description | Text accepted, counter updates | | |
| 7 | Upload JPG image | Preview shown | | |
| 8 | Continue to contact | Image URL preserved | | |
| 9 | Enter phone only | Phone formatted correctly | | |
| 10 | Submit order | Success, email has image link | | |

#### Scenario 3: Coloring Page Order

| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Navigate to Coloring Pages | Listing loads | | |
| 2 | Select page product | Detail shows book/page info | | |
| 3 | Click "Start Order" | Customize shows book/page | | |
| 4 | Enter coloring instructions | Text accepted | | |
| 5 | Complete order | Email shows instructions | | |

#### Scenario 4: Edit Order Before Submit

| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Start bracelet order | Get to review page | | |
| 2 | Click "Edit" on product | Returns to customize page | | |
| 3 | Change color selection | Previous selections preserved, can modify | | |
| 4 | Return to review | New selections shown | | |
| 5 | Click "Edit" on contact | Returns to contact page | | |
| 6 | Change email | Previous data preserved | | |
| 7 | Return to review | Updated email shown | | |
| 8 | Submit | Correct data in email | | |

#### Scenario 5: Session Persistence

| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Start order, get to contact page | Data entered | | |
| 2 | Refresh browser | Page reloads | | |
| 3 | Check data | Previous data still there | | |
| 4 | Close tab, reopen app | Navigate back to flow | | |
| 5 | Resume order | Can continue from where left off | | |

---

### Task 6.2: Edge Case Testing

Test these specific edge cases:

#### Input Validation

| Test Case | Input | Expected | Pass/Fail |
|-----------|-------|----------|-----------|
| Empty name | "" | Error: "We need your name..." | |
| Very long name | 150 characters | Truncated to 100 | |
| Special chars in name | "José O'Brien" | Accepted | |
| Invalid email | "not-an-email" | Error message shown | |
| Email with + | "user+test@gmail.com" | Accepted | |
| Short phone | "123" | Error: "10+ digits" | |
| International phone | "+1234567890" | Digits extracted, validated | |
| No contact method | Name only | Error: "email or phone required" | |
| Max chars in notes | 500+ characters | Stopped at 500 | |
| Max chars in description | 500+ characters | Stopped at 500 | |
| Empty color selection | No colors | Error: "Pick at least one" | |
| Max colors exceeded | Try to select 4 when max is 3 | 4th click disabled | |
| Empty instructions (coloring) | "" | Error shown | |

#### File Upload

| Test Case | Input | Expected | Pass/Fail |
|-----------|-------|----------|-----------|
| JPG image | Valid .jpg | Accepted, preview shown | |
| PNG image | Valid .png | Accepted, preview shown | |
| GIF image | .gif file | Error: "JPG or PNG only" | |
| PDF file | .pdf | Error: "JPG or PNG only" | |
| Large file | 15MB image | Error: "Max 10MB" | |
| Corrupt image | Invalid file | Error handling | |
| Replace image | Upload new after first | Old replaced | |
| Remove image | Click remove | Preview cleared | |

#### Navigation

| Test Case | Action | Expected | Pass/Fail |
|-----------|--------|----------|-----------|
| Back from customize | Click back | Returns to product detail | |
| Back from contact | Click back | Returns to customize, data preserved | |
| Browser back button | Use browser back | Works same as app back | |
| Direct URL access | Go to /order/customize directly | Redirect to home (no product) | |
| 404 page | Go to /invalid-url | 404 page shown | |

---

### Task 6.3: Cross-Browser Testing

Test on these browsers:

#### Desktop Browsers

| Browser | Version | OS | Status | Issues |
|---------|---------|-----|--------|--------|
| Chrome | Latest | Windows | | |
| Chrome | Latest | Mac | | |
| Firefox | Latest | Windows | | |
| Firefox | Latest | Mac | | |
| Safari | Latest | Mac | | |
| Edge | Latest | Windows | | |

#### Mobile Browsers

| Browser | Device | OS | Status | Issues |
|---------|--------|-----|--------|--------|
| Safari | iPhone | iOS 17 | | |
| Safari | iPhone | iOS 16 | | |
| Chrome | iPhone | iOS | | |
| Chrome | Android | Android 13 | | |
| Chrome | Android | Android 12 | | |
| Samsung Internet | Samsung | Android | | |

#### Testing Checklist Per Browser
- [ ] Home page renders correctly
- [ ] Products load and display
- [ ] Order flow completes
- [ ] Forms work properly
- [ ] File upload works
- [ ] Animations are smooth
- [ ] No console errors

---

### Task 6.4: Performance Testing

#### Lighthouse Audit

Run Lighthouse in Chrome DevTools (Incognito mode) on:

| Page | Performance | Accessibility | Best Practices | SEO |
|------|-------------|---------------|----------------|-----|
| Home | Goal: 90+ | Goal: 90+ | Goal: 90+ | Goal: 90+ |
| Product Listing | | | | |
| Product Detail | | | | |
| Order Customize | | | | |
| Order Review | | | | |

**Common Issues to Fix:**
- Large images: Add width/height, use WebP
- Unused JavaScript: Check bundle size
- Render-blocking resources: Check font loading
- CLS: Ensure images have dimensions

#### Core Web Vitals

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| LCP (Largest Contentful Paint) | < 2.5s | | |
| FID (First Input Delay) | < 100ms | | |
| CLS (Cumulative Layout Shift) | < 0.1 | | |

#### Load Time Testing

| Scenario | Target | Actual | Status |
|----------|--------|--------|--------|
| Home page (3G) | < 3s | | |
| Product listing (3G) | < 3s | | |
| Product detail (3G) | < 3s | | |
| Order submission (4G) | < 5s | | |

---

### Task 6.5: Security Review

#### API Security (Code Review Results)

| Check | Status | Notes |
|-------|--------|-------|
| Webhook secret validated | ✅ Pass | Secret checked in publish endpoint |
| Input sanitization | ❌ FAIL | **BUG-001:** User input not sanitized in email HTML |
| Rate limiting | ❌ FAIL | **BUG-003:** Not implemented on any endpoint |
| HTTPS only | ✅ Pass | Vercel handles via automatic HTTPS |
| CORS configured | ⚠️ Check | Needs manual verification |
| Error messages don't leak info | ⚠️ Check | KV errors may leak details |
| Image type validation | ❌ FAIL | **BUG-002:** Relies on Content-Type header only |
| URL validation | ❌ FAIL | Image URLs not validated before email embedding |
| IP whitelist (webhook) | ❌ FAIL | **BUG-016:** Any IP can call webhook |

#### Client Security (Code Review Results)

| Check | Status | Notes |
|-------|--------|-------|
| No secrets in client code | ✅ Pass | No API keys in frontend |
| No sensitive data in console | ⚠️ Check | Some errors logged |
| localStorage/sessionStorage | ⚠️ Check | Order data stored - verify no PII exposure |
| External scripts | ✅ Pass | Only React/Tailwind dependencies |
| Object URL cleanup | ❌ FAIL | **BUG-004:** Memory leak risk |

#### Test Security Scenarios

| Test | Action | Expected | Pass/Fail |
|------|--------|----------|-----------|
| XSS in name | `<script>alert('xss')</script>` | Escaped, not executed | ⚠️ Likely FAIL (BUG-001) |
| XSS in notes | `<img onerror="alert('xss')">` | Escaped, not executed | ⚠️ Likely FAIL (BUG-001) |
| SQL injection | `'; DROP TABLE--` | Treated as text | ✅ N/A (No SQL) |
| Invalid webhook secret | Wrong secret in publish | 401 Unauthorized | -- Manual test needed |
| Duplicate submission | Submit same order twice | Second blocked (409) | -- Manual test needed |
| File type spoofing | Upload .php with image MIME | Should reject | ⚠️ Likely FAIL (BUG-002) |

---

### Task 6.6: Error Handling Testing

Test error scenarios:

| Scenario | How to Test | Expected Behavior | Pass/Fail |
|----------|-------------|-------------------|-----------|
| API timeout | Slow network simulation | Timeout error shown | |
| Network offline | Disable network | "Check your internet" message | |
| API 500 error | Backend error | Friendly error message | |
| Invalid product ID | Go to /bracelets/invalid | "Product not found" | |
| Session expired | Clear sessionStorage mid-flow | Graceful redirect/reset | |
| Email send failure | (Hard to test) | Error shown, can retry | |

---

### Task 6.7: Accessibility Testing

#### Automated Testing

Run axe DevTools on each page:

| Page | Critical | Serious | Moderate | Minor |
|------|----------|---------|----------|-------|
| Home | -- | -- | -- | -- |
| Bracelets | -- | -- | -- | -- |
| Product Detail | -- | -- | -- | -- |
| Order Customize | -- | -- | -- | -- |
| Order Contact | -- | -- | -- | -- |
| Order Review | -- | -- | -- | -- |
| Confirmation | -- | -- | -- | -- |

*Run axe DevTools to fill in actual values*

#### Code Review Accessibility Findings

| Issue | Component | Severity | Status |
|-------|-----------|----------|--------|
| **BUG-011:** Space key doesn't trigger file upload | FileUpload.tsx | High | Open |
| **BUG-012:** Disabled color buttons not announced | ColorPicker.tsx | High | Open |
| **BUG-013:** Duplicate IDs from same labels | Input.tsx, Textarea.tsx | High | Open |
| **BUG-025:** Mobile step labels hidden from screen readers | OrderStepper.tsx | Medium | Open |
| **BUG-031:** Emoji icon lacks text alternative | EmptyState.tsx | Low | Open |
| Missing ARIA label on file preview | FileUpload.tsx | Medium | Open |
| No arrow key navigation between colors | ColorPicker.tsx | Low | Open |

#### Manual Testing

| Test | Status | Notes |
|------|--------|-------|
| Keyboard-only navigation | ⚠️ Issues Found | BUG-011: Space key not handled in FileUpload |
| Screen reader (VoiceOver/NVDA) | -- | Manual test needed |
| Zoom 200% | -- | Manual test needed |
| High contrast mode | -- | Manual test needed |
| Reduced motion | -- | Manual test needed |
| Tab order | -- | Manual test needed |
| Focus indicators | -- | Manual test needed |

---

### Task 6.8: Create Bug Report Template

Create a standardized bug report format:

```markdown
## Bug Report

**Title:** [Brief description]

**Environment:**
- Device: [e.g., iPhone 14 Pro]
- OS: [e.g., iOS 17.2]
- Browser: [e.g., Safari 17]
- Screen size: [e.g., 393x852]

**Steps to Reproduce:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happens]

**Screenshots/Video:**
[Attach if applicable]

**Console Errors:**
[Any error messages]

**Severity:**
- [ ] Critical (app unusable)
- [ ] High (major feature broken)
- [ ] Medium (feature impaired)
- [ ] Low (minor issue)

**Frequency:**
- [ ] Always
- [ ] Sometimes
- [ ] Rarely
```

---

### Task 6.9: Final QA Checklist

Complete before launch:

#### Functionality
- [ ] All product types display correctly
- [ ] All order flows complete successfully
- [ ] Emails are received with correct content
- [ ] Images display and load properly
- [ ] Forms validate correctly
- [ ] Error messages are helpful

#### User Experience
- [ ] Page loads are fast
- [ ] Navigation is intuitive
- [ ] Mobile experience is smooth
- [ ] No layout issues
- [ ] Animations are smooth

#### Technical
- [ ] No console errors
- [ ] No broken links
- [ ] No 404 pages (except intentional)
- [ ] API responses are quick
- [ ] No memory leaks

#### Security
- [ ] No exposed secrets
- [ ] Input is sanitized
- [ ] Errors don't expose internals

#### Accessibility
- [ ] Screen reader compatible
- [ ] Keyboard navigable
- [ ] Sufficient color contrast
- [ ] Touch targets are large enough

---

## Test Results Summary

### Overall Status

| Category | Pass | Fail | Blocked | Total |
|----------|------|------|---------|-------|
| E2E Tests | -- | -- | -- | 5 scenarios |
| Edge Cases | -- | -- | -- | 28 cases |
| Cross-Browser | -- | -- | -- | 12 browsers |
| Performance | -- | -- | -- | 5 pages |
| Security | 0 | 5 | 0 | 5 (Code Review) |
| Accessibility | 0 | 7 | 0 | 7 (Code Review) |
| **Total** | -- | -- | -- | Manual testing needed |

### Code Review Complete ✅

See `TEST_RESULTS_CODE_REVIEW.md` for detailed findings. **31 issues identified.**

### Critical Issues Found (Code Review)

| ID | Description | Severity | Status |
|----|-------------|----------|--------|
| BUG-001 | XSS vulnerability in email HTML generation | Critical | Open |
| BUG-002 | Content-Type spoofing in image upload | Critical | Open |
| BUG-003 | No rate limiting on any API endpoint | Critical | Open |
| BUG-004 | Memory leak in FileUpload (object URLs not revoked) | Critical | Open |
| BUG-005 | File validation errors not displayed to users | Critical | Open |
| BUG-006 | Query parameter array handling bug | High | Open |
| BUG-007 | ContactInfo type mismatch (empty strings) | High | Open |
| BUG-008 | Image upload error doesn't block navigation | High | Open |
| BUG-009 | Missing idempotency key regeneration | High | Open |
| BUG-010 | Session persistence conditional issue | High | Open |
| BUG-011 | FileUpload keyboard navigation incomplete | High | Open |
| BUG-012 | ColorPicker disabled state not announced | High | Open |
| BUG-013 | Input/Textarea ID collision risk | High | Open |
| BUG-014 | ProductCard image error handling missing | High | Open |
| BUG-015 | ColorPicker invalid color validation | High | Open |

### Recommendations

1. **BLOCK LAUNCH** until 5 critical issues are fixed (BUG-001 through BUG-005)
2. Fix high-priority issues before launch or shortly after
3. Implement rate limiting on all API endpoints
4. Add comprehensive input sanitization for email HTML
5. Add magic byte validation for image uploads
6. Fix accessibility issues for keyboard and screen reader users
7. Add proper error display for file upload validation
8. Clean up object URLs to prevent memory leaks
9. Complete manual testing after fixes are deployed
10. Run Lighthouse audits and document scores

---

## Handoff Notes

When complete, deliver:
1. This document with all test results filled in
2. List of bugs found (use bug report template)
3. Screenshots of any visual issues
4. Lighthouse reports (export as JSON/HTML)
5. Recommendations for improvements
6. Sign-off on launch readiness

---

## Tools & Resources

- **Lighthouse:** Built into Chrome DevTools
- **axe DevTools:** Browser extension for accessibility
- **BrowserStack:** Cross-browser testing (optional)
- **WebPageTest:** Performance testing
- **WAVE:** Accessibility testing
- **Network throttling:** Chrome DevTools Network tab
- **Device simulation:** Chrome DevTools Device Mode
