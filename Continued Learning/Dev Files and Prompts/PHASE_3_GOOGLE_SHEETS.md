# Phase 3: Google Sheets Integration & Content Pipeline

**Agent Assignment:** Agent 1  
**Estimated Effort:** Medium  
**Dependencies:** None (can run in parallel)  
**Prerequisites:** Access to Google account, Vercel project deployed

---

## Objective

Set up the complete content management pipeline using Google Sheets as the CMS. This allows Dylan and Logan to manage their product listings without touching code.

---

## Background Context

### Architecture Overview
```
┌─────────────────────────────────────────────────────────────────┐
│                        GOOGLE SHEETS                            │
│   (Product Database - Single Source of Truth)                   │
│   PRODUCTS | SETTINGS | CHANGELOG                               │
└──────────────────────────┬──────────────────────────────────────┘
                           │ Click "Publish" button
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    APPS SCRIPT                                   │
│   Transforms sheet data → JSON → POST to webhook                │
└──────────────────────────┬──────────────────────────────────────┘
                           │ POST /api/content/publish
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    VERCEL API                                    │
│   Validates secret → Stores in Vercel KV                        │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    REACT FRONTEND                                │
│   Fetches from /api/content/products → Displays                 │
└─────────────────────────────────────────────────────────────────┘
```

### Existing API Endpoint

The webhook endpoint already exists at `api/content/publish.ts`:
- Accepts POST with JSON body
- Validates `secret` against `CONTENT_PUBLISH_SECRET` env var
- Stores products in Vercel KV
- Returns success/failure response

---

## Tasks

### Task 3.1: Create Google Sheets Database

**File:** Create new Google Spreadsheet named "Selling Sisters - Product Database"

**Sheet 1: PRODUCTS**

Create columns in Row 1 (headers):

| Column | Header | Type | Required | Description |
|--------|--------|------|----------|-------------|
| A | product_id | String | Yes | Unique ID (BR-0001, CP-0001, PT-0001) |
| B | type | Enum | Yes | `bracelet`, `coloring_page`, or `portrait` |
| C | title | String | Yes | Display name |
| D | short_desc | String | Yes | Brief description (max 100 chars) |
| E | status | Enum | Yes | `draft`, `published`, `archived`, `sold_out` |
| F | thumbnail_url | URL | Yes | Main product image |
| G | gallery_urls | String | No | Comma-separated additional image URLs |
| H | sort_order | Number | No | Display order (lower = first) |
| I | bracelet_style | Enum | Bracelet only | `rubber_band` or `beaded` |
| J | color_options | String | Bracelet only | Comma-separated colors |
| K | max_colors | Number | Bracelet only | Max colors customer can select |
| L | materials_display | String | Bracelet only | Materials description |
| M | book_name | String | Coloring only | Coloring book name |
| N | page_name | String | Coloring only | Page name |
| O | blank_page_url | URL | Coloring only | Blank page image |
| P | colored_example_url | URL | Coloring only | Colored example image |
| Q | portrait_size_options | String | Portrait only | Comma-separated sizes |
| R | portrait_style_options | String | Portrait only | Comma-separated styles |
| S | turnaround_display | String | Portrait only | Turnaround time text |
| T | requires_upload | Boolean | Portrait only | TRUE or FALSE |

**Sheet 2: SETTINGS**

| Column A (setting_name) | Column B (setting_value) |
|-------------------------|--------------------------|
| site_title | Selling Sisters |
| site_tagline | Handmade with love by Dylan & Logan |
| contact_email | DylanKDelagarza@gmail.com |
| webhook_url | https://selling-sisters.vercel.app/api/content/publish |
| last_publish_version | 0 |

**Sheet 3: CHANGELOG**

| Column | Header |
|--------|--------|
| A | timestamp |
| B | version |
| C | products_published |
| D | published_by |

---

### Task 3.2: Add Sample Product Data

Add at least 3 products of each type to test:

**Bracelets (rows 2-4):**
```
BR-0001 | bracelet | School Spirit Loom Bracelet | Pick your school colors! | published | [URL] | | 1 | rubber_band | red,blue,green,white,black,yellow,orange,purple,pink,gold,silver | 3 | Rainbow Loom rubber bands
BR-0002 | bracelet | Friendship Bead Bracelet | Classic beaded bracelet | published | [URL] | | 2 | beaded | red,blue,green,white,black,yellow,pink,purple | 5 | Plastic pony beads
BR-0003 | bracelet | Rainbow Loom Bracelet | All rainbow colors! | published | [URL] | | 3 | rubber_band | red,orange,yellow,green,blue,purple | 6 | Rainbow Loom rubber bands
```

**Coloring Pages (rows 5-7):**
```
CP-0001 | coloring_page | Sleepy Cat | A cozy cat curled up | published | [URL] | | 1 | | | | | Animal Friends | Sleepy Cat | [URL] | [URL]
CP-0002 | coloring_page | Unicorn Dreams | Magical unicorn | published | [URL] | | 2 | | | | | Magical Creatures | Unicorn Dreams | [URL] |
CP-0003 | coloring_page | Flower Garden | Beautiful flowers | published | [URL] | | 3 | | | | | Nature Scenes | Flower Garden | [URL] | [URL]
```

**Portraits (rows 8-10):**
```
PT-0001 | portrait | Pet Portrait | We'll draw your furry friend! | published | [URL] | | 1 | | | | | | | | | 5x7,8x10 | Realistic,Cartoon | 1-2 weeks | TRUE
PT-0002 | portrait | Family Portrait | Custom family portrait | published | [URL] | | 2 | | | | | | | | | 8x10,11x14 | Cartoon,Watercolor | 2-3 weeks | TRUE
PT-0003 | portrait | Fantasy Character | Describe your character! | draft | [URL] | | 3 | | | | | | | | | 5x7,8x10 | Cartoon,Anime | 1-2 weeks | FALSE
```

**Note:** Replace `[URL]` with actual image URLs. Use placeholder images from:
- https://placehold.co/400x400/EDE9FE/A78BFA?text=Bracelet+1
- Or upload real product photos to Imgur/Cloudinary

---

### Task 3.3: Create Apps Script

**Steps:**
1. In Google Sheets, go to Extensions → Apps Script
2. Delete any existing code
3. Paste the following script
4. Save (Ctrl+S)

**Apps Script Code:**

```javascript
// Configuration - UPDATE THESE VALUES
const WEBHOOK_URL = 'https://YOUR-VERCEL-URL.vercel.app/api/content/publish';
const WEBHOOK_SECRET = 'YOUR-SECRET-HERE'; // Must match CONTENT_PUBLISH_SECRET in Vercel

/**
 * Adds custom menu when spreadsheet opens
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Selling Sisters')
    .addItem('Publish Updates', 'publishToWebsite')
    .addItem('Validate Data', 'validateProducts')
    .addToUi();
}

/**
 * Main publish function - sends products to website
 */
function publishToWebsite() {
  const ui = SpreadsheetApp.getUi();
  
  // Confirm before publishing
  const response = ui.alert(
    'Publish Updates',
    'This will update the live website. Continue?',
    ui.ButtonSet.YES_NO
  );
  
  if (response !== ui.Button.YES) {
    return;
  }
  
  try {
    const products = getProductsFromSheet();
    
    if (products.length === 0) {
      ui.alert('Error', 'No products found in the PRODUCTS sheet.', ui.ButtonSet.OK);
      return;
    }
    
    const payload = {
      published_at: new Date().toISOString(),
      source: 'google_sheets',
      version: getNextVersion(),
      secret: WEBHOOK_SECRET,
      products: products
    };
    
    const options = {
      method: 'POST',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };
    
    const response = UrlFetchApp.fetch(WEBHOOK_URL, options);
    const responseCode = response.getResponseCode();
    const responseText = response.getContentText();
    
    if (responseCode === 200) {
      const result = JSON.parse(responseText);
      logToChangelog(result);
      ui.alert(
        'Success!',
        `Published ${result.products_published} products to the website.\nVersion: ${result.version}`,
        ui.ButtonSet.OK
      );
    } else {
      const error = JSON.parse(responseText);
      ui.alert(
        'Error',
        `Failed to publish: ${error.error || 'Unknown error'}\n\nDetails: ${JSON.stringify(error.details || [])}`,
        ui.ButtonSet.OK
      );
    }
  } catch (error) {
    ui.alert('Error', `Failed to publish: ${error.message}`, ui.ButtonSet.OK);
    console.error(error);
  }
}

/**
 * Reads products from the PRODUCTS sheet
 */
function getProductsFromSheet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('PRODUCTS');
  if (!sheet) {
    throw new Error('PRODUCTS sheet not found');
  }
  
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const products = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    
    // Skip empty rows
    if (!row[0]) continue;
    
    const product = rowToProduct(headers, row);
    if (product) {
      products.push(product);
    }
  }
  
  return products;
}

/**
 * Converts a spreadsheet row to a product object
 */
function rowToProduct(headers, row) {
  // Create object from headers and row values
  const raw = {};
  for (let i = 0; i < headers.length; i++) {
    raw[headers[i]] = row[i];
  }
  
  // Base product structure
  const product = {
    product_id: raw.product_id,
    type: raw.type,
    title: raw.title,
    short_desc: raw.short_desc,
    status: raw.status || 'draft',
    thumbnail_url: raw.thumbnail_url,
    sort_order: raw.sort_order || 999
  };
  
  // Add gallery if present
  if (raw.gallery_urls) {
    product.gallery = raw.gallery_urls.split(',').map(url => url.trim()).filter(url => url);
  }
  
  // Type-specific fields
  if (raw.type === 'bracelet') {
    product.bracelet = {
      style: raw.bracelet_style,
      color_options: raw.color_options ? raw.color_options.split(',').map(c => c.trim()) : [],
      max_colors: raw.max_colors || null,
      materials: raw.materials_display || null
    };
  }
  
  if (raw.type === 'coloring_page') {
    product.coloring_page = {
      book_name: raw.book_name,
      page_name: raw.page_name,
      blank_page_url: raw.blank_page_url,
      colored_example_url: raw.colored_example_url || null
    };
  }
  
  if (raw.type === 'portrait') {
    product.portrait = {
      size_options: raw.portrait_size_options ? raw.portrait_size_options.split(',').map(s => s.trim()) : null,
      style_options: raw.portrait_style_options ? raw.portrait_style_options.split(',').map(s => s.trim()) : null,
      turnaround: raw.turnaround_display || null,
      requires_upload: raw.requires_upload === true || raw.requires_upload === 'TRUE'
    };
  }
  
  return product;
}

/**
 * Gets and increments the version number
 */
function getNextVersion() {
  const props = PropertiesService.getScriptProperties();
  const current = parseInt(props.getProperty('version') || '0');
  const next = current + 1;
  props.setProperty('version', next.toString());
  return next;
}

/**
 * Logs publish event to CHANGELOG sheet
 */
function logToChangelog(result) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('CHANGELOG');
  if (!sheet) return;
  
  sheet.appendRow([
    new Date(),
    result.version,
    result.products_published,
    Session.getActiveUser().getEmail() || 'Unknown'
  ]);
}

/**
 * Validates product data without publishing
 */
function validateProducts() {
  const ui = SpreadsheetApp.getUi();
  
  try {
    const products = getProductsFromSheet();
    const errors = [];
    
    products.forEach((product, index) => {
      const rowNum = index + 2; // +2 because row 1 is headers, arrays are 0-indexed
      
      if (!product.product_id) {
        errors.push(`Row ${rowNum}: Missing product_id`);
      }
      if (!product.type || !['bracelet', 'coloring_page', 'portrait'].includes(product.type)) {
        errors.push(`Row ${rowNum}: Invalid type "${product.type}"`);
      }
      if (!product.title) {
        errors.push(`Row ${rowNum}: Missing title`);
      }
      if (!product.thumbnail_url) {
        errors.push(`Row ${rowNum}: Missing thumbnail_url`);
      }
      
      // Type-specific validation
      if (product.type === 'bracelet' && product.bracelet) {
        if (!product.bracelet.style) {
          errors.push(`Row ${rowNum}: Bracelet missing style`);
        }
        if (!product.bracelet.color_options || product.bracelet.color_options.length === 0) {
          errors.push(`Row ${rowNum}: Bracelet missing color_options`);
        }
      }
      
      if (product.type === 'coloring_page' && product.coloring_page) {
        if (!product.coloring_page.book_name) {
          errors.push(`Row ${rowNum}: Coloring page missing book_name`);
        }
        if (!product.coloring_page.blank_page_url) {
          errors.push(`Row ${rowNum}: Coloring page missing blank_page_url`);
        }
      }
    });
    
    if (errors.length > 0) {
      ui.alert(
        'Validation Errors',
        `Found ${errors.length} issues:\n\n${errors.slice(0, 10).join('\n')}${errors.length > 10 ? '\n...and more' : ''}`,
        ui.ButtonSet.OK
      );
    } else {
      ui.alert(
        'Validation Passed',
        `All ${products.length} products are valid and ready to publish!`,
        ui.ButtonSet.OK
      );
    }
  } catch (error) {
    ui.alert('Error', `Validation failed: ${error.message}`, ui.ButtonSet.OK);
  }
}
```

---

### Task 3.4: Configure Vercel Environment

**In Vercel Dashboard:**

1. Go to your project → Settings → Environment Variables
2. Add the following:

| Name | Value | Environment |
|------|-------|-------------|
| `CONTENT_PUBLISH_SECRET` | (generate a random 32+ char string) | Production, Preview |

**Generate secret:**
```bash
# On Windows (PowerShell)
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})

# Or use: https://randomkeygen.com/
```

3. Copy the same secret value to the Apps Script `WEBHOOK_SECRET` constant

---

### Task 3.5: Set Up Vercel KV Storage

**In Vercel Dashboard:**

1. Go to your project → Storage tab
2. Click "Create Database"
3. Select "KV"
4. Name it "selling-sisters-kv"
5. Click "Create"

Vercel will automatically add the environment variables:
- `KV_URL`
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`
- `KV_REST_API_READ_ONLY_TOKEN`

---

### Task 3.6: Test the Pipeline

**Test Steps:**

1. **Deploy to Vercel** (if not already)
   - Push code to GitHub
   - Vercel auto-deploys

2. **Update Apps Script configuration**
   - Set `WEBHOOK_URL` to your Vercel URL
   - Set `WEBHOOK_SECRET` to match Vercel env var

3. **Run validation**
   - In Google Sheets: Selling Sisters → Validate Data
   - Fix any errors

4. **Publish**
   - In Google Sheets: Selling Sisters → Publish Updates
   - Confirm the publish

5. **Verify on website**
   - Visit your Vercel URL
   - Check that products appear correctly
   - Test all three product types

---

### Task 3.7: Create User Guide for Dylan & Logan

Create a simple guide document they can reference:

**Title:** "How to Update Products on Selling Sisters"

**Contents:**
1. Open the Google Sheet (bookmark link)
2. Find the PRODUCTS tab
3. To add a product: Add a new row with all required fields
4. To edit a product: Change the values in the row
5. To hide a product: Change status to "draft" or "archived"
6. To mark as sold out: Change status to "sold_out"
7. When ready: Click "Selling Sisters" menu → "Publish Updates"
8. Wait for success message
9. Check the website to see your changes!

**Include:**
- Screenshot of the Publish menu
- Screenshot of the success message
- List of status options and what they mean
- Tips for good product photos

---

## Acceptance Criteria

- [ ] Google Sheets database created with correct structure
- [ ] Sample products added (at least 3 per type)
- [ ] Apps Script installed and working
- [ ] CONTENT_PUBLISH_SECRET configured in Vercel
- [ ] Vercel KV storage created and connected
- [ ] Publish flow tested end-to-end
- [ ] Products appear correctly on website after publish
- [ ] User guide created for Dylan & Logan

---

## Troubleshooting Guide

### "Invalid secret" error
- Verify WEBHOOK_SECRET in Apps Script matches CONTENT_PUBLISH_SECRET in Vercel
- Check for extra spaces or quotes

### "Products not appearing"
- Check status is "published" (not "draft")
- Verify KV storage is connected
- Check Vercel function logs for errors

### "PRODUCTS sheet not found"
- Ensure sheet tab is named exactly "PRODUCTS" (case-sensitive)

### "Network error" when publishing
- Verify WEBHOOK_URL is correct
- Check Vercel deployment is live
- Try redeploying

---

## Files to Reference

- `api/content/publish.ts` - Webhook endpoint (already created)
- `api/content/products.ts` - Products GET endpoint (already created)
- `docs/GOOGLE_SHEETS_TEMPLATE.md` - Detailed template documentation

---

## Handoff Notes

When complete, notify the main developer that:
1. Google Sheets URL: [provide link]
2. Publishing is working
3. Any issues encountered and how they were resolved
4. User guide location
