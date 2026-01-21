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

#### API Security

| Check | Status | Notes |
|-------|--------|-------|
| Webhook secret validated | | Check publish endpoint |
| Input sanitization | | XSS prevention |
| Rate limiting | | Check if implemented |
| HTTPS only | | Vercel handles |
| CORS configured | | Check headers |
| Error messages don't leak info | | No stack traces |

#### Client Security

| Check | Status | Notes |
|-------|--------|-------|
| No secrets in client code | | Check for API keys |
| No sensitive data in console | | Check console.log |
| localStorage/sessionStorage | | No PII stored |
| External scripts | | Only trusted sources |

#### Test Security Scenarios

| Test | Action | Expected | Pass/Fail |
|------|--------|----------|-----------|
| XSS in name | `<script>alert('xss')</script>` | Escaped, not executed | |
| XSS in notes | `<img onerror="alert('xss')">` | Escaped, not executed | |
| SQL injection | `'; DROP TABLE--` | Treated as text | |
| Invalid webhook secret | Wrong secret in publish | 401 Unauthorized | |
| Duplicate submission | Submit same order twice | Second blocked (409) | |

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
| Home | 0 | 0 | | |
| Bracelets | 0 | 0 | | |
| Product Detail | 0 | 0 | | |
| Order Customize | 0 | 0 | | |
| Order Contact | 0 | 0 | | |
| Order Review | 0 | 0 | | |
| Confirmation | 0 | 0 | | |

#### Manual Testing

| Test | Status | Notes |
|------|--------|-------|
| Keyboard-only navigation | | Tab through entire flow |
| Screen reader (VoiceOver/NVDA) | | Complete an order |
| Zoom 200% | | Content still usable |
| High contrast mode | | Content visible |
| Reduced motion | | Animations respect preference |

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
| E2E Tests | | | | |
| Edge Cases | | | | |
| Cross-Browser | | | | |
| Performance | | | | |
| Security | | | | |
| Accessibility | | | | |
| **Total** | | | | |

### Critical Issues Found

| ID | Description | Severity | Status |
|----|-------------|----------|--------|
| | | | |

### Recommendations

1. [Recommendation 1]
2. [Recommendation 2]
3. [Recommendation 3]

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
