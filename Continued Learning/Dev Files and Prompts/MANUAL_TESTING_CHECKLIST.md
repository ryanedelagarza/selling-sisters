# Manual Testing Checklist

**For:** Selling Sisters Application  
**Purpose:** Tests that require human execution  
**Created:** January 20, 2026  
**Status:** Ready for Execution

---

## Prerequisites

Before testing, ensure you have:

- [ ] Node.js installed (v18+)
- [ ] Project dependencies installed (`npm install` in `selling-sisters` folder)
- [ ] Local dev server running (`npm run dev`)
- [ ] Chrome browser with DevTools
- [ ] axe DevTools extension installed (for accessibility)
- [ ] Multiple browsers installed (Firefox, Edge, Safari if on Mac)

### Environment Variables Needed

Create a `.env` file in the `selling-sisters` folder with:

```env
# Required for email sending (get from Resend.com)
RESEND_API_KEY=re_xxxxxxxxxxxx

# Required for webhook authentication (create a random string)
CONTENT_PUBLISH_SECRET=your-secret-here

# Optional (defaults to DylanKDelagarza@gmail.com)
ORDER_EMAIL_RECIPIENT=your-test-email@example.com
```

**Note:** If you don't have these yet, the app will still work locally but won't send emails or store data to Vercel KV/Blob.

---

## Quick Test Checklist (15-20 minutes)

### 1. Basic Functionality Check

Run through these quickly to ensure the app is working:

- [ ] Home page loads at http://localhost:3000
- [ ] Three category cards visible (Bracelets, Portraits, Coloring Pages)
- [ ] Click Bracelets → Products list loads
- [ ] Click any product → Detail page loads
- [ ] Click "Start Order" → Customize page loads
- [ ] Select colors → Checkmarks appear
- [ ] Click Next → Contact page loads
- [ ] Enter name and email → Validation works
- [ ] Click Review → Summary shows correctly
- [ ] Click Submit → Confirmation page shows

### 2. Quick Security Check

- [ ] Open DevTools Console → No errors on page load
- [ ] Check Network tab → No failed requests
- [ ] Inspect sessionStorage → Order data visible (but no sensitive API keys)

---

## Full Test Execution

### Test 1: Bracelet Order - Complete Flow

| Step | Action | Expected | ✓/✗ | Notes |
|------|--------|----------|-----|-------|
| 1 | Go to http://localhost:3000 | Home page loads | | |
| 2 | Click "Bracelets" card | Bracelets listing appears | | |
| 3 | Click any bracelet | Product detail page | | |
| 4 | Click "Start Order" | Customize page | | |
| 5 | Select 2 colors | Colors highlighted | | |
| 6 | Add notes: "Test order please ignore" | Text appears, counter shows | | |
| 7 | Click "Next: Contact Info" | Contact page loads | | |
| 8 | Enter: Name = "Test User" | Accepted | | |
| 9 | Enter: Email = "test@example.com" | Accepted | | |
| 10 | Click "Review Order" | Review page shows all info | | |
| 11 | Verify colors show | Correct colors displayed | | |
| 12 | Click "Submit Order" | Loading state, then success | | |
| 13 | Check email (if configured) | Email received | | |

---

### Test 2: Portrait Order with Image

| Step | Action | Expected | ✓/✗ | Notes |
|------|--------|----------|-----|-------|
| 1 | Navigate to Portraits | Listing loads | | |
| 2 | Click any portrait product | Detail page | | |
| 3 | Click "Start Order" | Customize page | | |
| 4 | Enter description: "Test portrait" | Text accepted | | |
| 5 | Upload a JPG image (< 10MB) | Preview shown | | |
| 6 | Continue to contact | Image preserved | | |
| 7 | Enter only phone: "5551234567" | Phone formatted | | |
| 8 | Submit order | Success page | | |
| 9 | Check email | Image link included | | |

---

### Test 3: File Upload Validation

| Test | Action | Expected | ✓/✗ |
|------|--------|----------|-----|
| Valid JPG | Upload .jpg file | Preview shown | |
| Valid PNG | Upload .png file | Preview shown | |
| Invalid GIF | Upload .gif file | Error shown (or blocked) | |
| Invalid PDF | Upload .pdf file | Error shown (or blocked) | |
| Large file (>10MB) | Upload large image | Error shown | |
| Replace image | Upload new after first | Old replaced | |
| Remove image | Click clear/remove | Preview cleared | |

**⚠️ Known Issue:** Error messages may not display (BUG-005). Watch console for errors.

---

### Test 4: Input Validation

| Test | Input | Expected | ✓/✗ |
|------|-------|----------|-----|
| Empty name | Leave name blank, try to proceed | Error message | |
| Long name | Enter 150+ characters | Truncated to 100 | |
| Special characters | "José O'Brien-Smith" | Accepted | |
| Invalid email | "not-an-email" | Error shown | |
| Email with + | "user+test@gmail.com" | Accepted | |
| Short phone | "123" | Error: need 10+ digits | |
| No contact | Name only, no email/phone | Error message | |
| No colors | Try to proceed without colors | Error message | |

---

### Test 5: Navigation & State

| Test | Action | Expected | ✓/✗ |
|------|--------|----------|-----|
| Back from customize | Click back button | Returns to product detail | |
| Back from contact | Click back | Returns to customize, data preserved | |
| Browser back | Use browser back button | Same as app back | |
| Page refresh | Refresh on contact page | Data still there | |
| Direct URL | Go to /order/customize directly | Redirect to home | |
| Invalid URL | Go to /invalid-page | 404 page shown | |

---

### Test 6: Security Testing

| Test | How | Expected | ✓/✗ |
|------|-----|----------|-----|
| XSS in name | Enter `<script>alert('xss')</script>` | Text escaped, no alert | |
| XSS in notes | Enter `<img onerror="alert('x')">` | Text escaped, no alert | |
| Check email source | View raw email HTML | Scripts should be escaped | |
| Console secrets | Check console.log output | No API keys visible | |
| Session data | Check sessionStorage | No sensitive data exposed | |

**⚠️ Known Issue:** XSS may not be properly escaped in emails (BUG-001).

---

### Test 7: Accessibility Testing

#### Keyboard Navigation

| Test | Action | Expected | ✓/✗ |
|------|--------|----------|-----|
| Tab through home | Press Tab repeatedly | All interactive elements receive focus | |
| Focus visible | Tab to buttons | Clear focus ring visible | |
| Enter on buttons | Press Enter on focused button | Button activates | |
| Space on file upload | Tab to file upload, press Space | File dialog opens | |
| Escape closes dialogs | If any modals, Escape closes | Modal closes | |

**⚠️ Known Issue:** Space key may not work on file upload (BUG-011).

#### Screen Reader (VoiceOver/NVDA)

| Test | Action | Expected | ✓/✗ |
|------|--------|----------|-----|
| Page announces | Navigate to page | Page title announced | |
| Buttons read | Focus on buttons | Button label read | |
| Form labels | Focus on inputs | Labels announced | |
| Errors announced | Submit invalid form | Errors announced | |
| Images have alt | Focus on images | Alt text or description read | |

#### axe DevTools Audit

Run axe DevTools on each page and record results:

| Page | Critical | Serious | Moderate | Minor |
|------|----------|---------|----------|-------|
| Home | | | | |
| Bracelets listing | | | | |
| Product detail | | | | |
| Customize page | | | | |
| Contact page | | | | |
| Review page | | | | |
| Confirmation | | | | |

---

### Test 8: Performance (Lighthouse)

Run Lighthouse in Chrome DevTools (Incognito mode):

1. Open Chrome DevTools (F12)
2. Go to Lighthouse tab
3. Select: Performance, Accessibility, Best Practices, SEO
4. Device: Mobile
5. Click "Analyze page load"

Record scores:

| Page | Performance | Accessibility | Best Practices | SEO |
|------|-------------|---------------|----------------|-----|
| Home | | | | |
| Product listing | | | | |
| Product detail | | | | |
| Customize | | | | |
| Review | | | | |

**Targets:** All scores should be 90+

---

### Test 9: Cross-Browser Testing

Test on multiple browsers. For each browser:

- [ ] Home loads correctly
- [ ] Products display
- [ ] Order flow completes
- [ ] File upload works
- [ ] No console errors

| Browser | Version | Pass/Fail | Issues |
|---------|---------|-----------|--------|
| Chrome (Windows) | | | |
| Firefox (Windows) | | | |
| Edge (Windows) | | | |
| Chrome (Mobile emulation) | | | |
| Safari (if Mac) | | | |

---

### Test 10: Mobile Testing

Use Chrome DevTools Device Mode (Ctrl+Shift+M) or real device:

| Test | iPhone SE (375px) | iPhone 14 (390px) | iPad (768px) | ✓/✗ |
|------|-------------------|-------------------|--------------|-----|
| Home layout | | | | |
| Product grid | | | | |
| Order form | | | | |
| Color picker | | | | |
| File upload | | | | |
| Buttons visible | | | | |
| Text readable | | | | |

---

## Bug Report Template

If you find a bug, copy this template:

```markdown
## Bug Report

**Title:** [Brief description]

**Environment:**
- Browser: [Chrome/Firefox/Edge/Safari]
- Device: [Desktop/Mobile/Tablet]
- Screen size: [e.g., 1920x1080]

**Steps to Reproduce:**
1. 
2. 
3. 

**Expected:**
[What should happen]

**Actual:**
[What actually happens]

**Console Errors:**
[Copy any errors from DevTools console]

**Severity:**
- [ ] Critical (app unusable)
- [ ] High (major feature broken)
- [ ] Medium (feature impaired)
- [ ] Low (minor issue)
```

---

## After Testing

### Summary

| Category | Tests | Pass | Fail |
|----------|-------|------|------|
| Basic Functionality | | | |
| File Upload | | | |
| Input Validation | | | |
| Navigation | | | |
| Security | | | |
| Accessibility | | | |
| Performance | | | |
| Cross-Browser | | | |
| Mobile | | | |
| **Total** | | | |

### Launch Recommendation

Based on testing results:

- [ ] **READY FOR LAUNCH** - All critical tests pass
- [ ] **NOT READY** - Critical issues found (list them below)

**Blocking Issues:**
1. 
2. 
3. 

**Recommended Fixes Before Launch:**
1. 
2. 
3. 

---

## Notes

[Add any additional observations here]
