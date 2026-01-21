# Google Sheets Integration - Setup Checklist

**Project:** Selling Sisters  
**Phase:** 3 - Google Sheets CMS  
**Status:** Ready for Setup

---

## Prerequisites

Before starting, ensure you have:

- [ ] Google account access
- [ ] Vercel project deployed at: `https://selling-sisters.vercel.app` (or your custom domain)
- [ ] Access to Vercel dashboard for environment variables

---

## Configuration Values (Fill These In)

Keep track of these values as you set them up:

```
VERCEL_URL: ___________________________________
           (e.g., https://selling-sisters.vercel.app)

CONTENT_PUBLISH_SECRET: _______________________
                       (generate a 32+ character random string)

GOOGLE_SHEETS_URL: ____________________________
                  (share link after creating spreadsheet)
```

---

## Setup Steps

### Step 1: Generate the Webhook Secret

Generate a secure random secret (32+ characters). Choose one method:

**Option A - PowerShell (Windows):**
```powershell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

**Option B - Online Generator:**
Visit https://randomkeygen.com/ and copy a "CodeIgniter Encryption Key"

**Option C - Node.js:**
```javascript
require('crypto').randomBytes(32).toString('hex')
```

**Your Secret:** `________________________________` (SAVE THIS!)

---

### Step 2: Configure Vercel Environment Variable

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select the **selling-sisters** project
3. Go to **Settings** → **Environment Variables**
4. Add new variable:

| Name | Value | Environments |
|------|-------|--------------|
| `CONTENT_PUBLISH_SECRET` | (your secret from Step 1) | Production, Preview |

5. Click **Save**
6. **Important:** Redeploy your project for the variable to take effect
   - Go to **Deployments** → click "..." on latest → **Redeploy**

- [ ] Environment variable added
- [ ] Project redeployed

---

### Step 3: Set Up Vercel KV Storage

1. In Vercel Dashboard, go to your project
2. Click **Storage** tab
3. Click **Create Database** → Select **KV**
4. Name: `selling-sisters-kv`
5. Region: Choose closest to your users
6. Click **Create**

Vercel will automatically add these environment variables:
- `KV_URL`
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`
- `KV_REST_API_READ_ONLY_TOKEN`

- [ ] Vercel KV created and connected

---

### Step 4: Create Google Spreadsheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new blank spreadsheet
3. Name it: **"Selling Sisters - Product Database"**

- [ ] Spreadsheet created

---

### Step 5: Create Sheet Tabs

Create 3 tabs (rename Sheet1, add 2 more):

1. **PRODUCTS** (main product data)
2. **SETTINGS** (configuration)
3. **CHANGELOG** (publish history)

- [ ] All 3 tabs created

---

### Step 6: Set Up PRODUCTS Sheet Headers

In the **PRODUCTS** tab, add these headers in **Row 1**:

Copy this entire line and paste into cell A1 (tab-separated):

```
product_id	type	title	short_desc	status	thumbnail_url	gallery_urls	sort_order	bracelet_style	color_options	max_colors	materials_display	book_name	page_name	blank_page_url	colored_example_url	portrait_size_options	portrait_style_options	turnaround_display	requires_upload
```

Column reference:
| Col | Header |
|-----|--------|
| A | product_id |
| B | type |
| C | title |
| D | short_desc |
| E | status |
| F | thumbnail_url |
| G | gallery_urls |
| H | sort_order |
| I | bracelet_style |
| J | color_options |
| K | max_colors |
| L | materials_display |
| M | book_name |
| N | page_name |
| O | blank_page_url |
| P | colored_example_url |
| Q | portrait_size_options |
| R | portrait_style_options |
| S | turnaround_display |
| T | requires_upload |

- [ ] PRODUCTS headers added

---

### Step 7: Set Up SETTINGS Sheet

In the **SETTINGS** tab, add this data:

| Column A (Row) | Column B |
|----------------|----------|
| site_title | Selling Sisters |
| site_tagline | Handmade with love by Dylan & Logan |
| contact_email | DylanKDelagarza@gmail.com |
| webhook_url | https://selling-sisters.vercel.app/api/content/publish |
| last_publish_version | 0 |

**Note:** Replace the webhook_url with your actual Vercel URL if different.

- [ ] SETTINGS data added

---

### Step 8: Set Up CHANGELOG Sheet

In the **CHANGELOG** tab, add these headers in **Row 1**:

| Column | Header |
|--------|--------|
| A | timestamp |
| B | version |
| C | products_published |
| D | published_by |

Leave the rest empty - the Apps Script will populate this automatically.

- [ ] CHANGELOG headers added

---

### Step 9: Add Sample Product Data

Add these sample products to test the system. In the **PRODUCTS** tab, starting at Row 2:

**Row 2 - Bracelet 1:**
```
BR-0001	bracelet	School Spirit Loom Bracelet	Pick your school colors and we'll loom it for you!	published	https://placehold.co/400x400/EDE9FE/A78BFA?text=Bracelet+1		1	rubber_band	red,blue,green,white,black,yellow,orange,purple,pink,gold,silver	3	Rainbow Loom rubber bands
```

**Row 3 - Bracelet 2:**
```
BR-0002	bracelet	Friendship Bead Bracelet	Classic beaded bracelet - perfect for sharing with friends!	published	https://placehold.co/400x400/FCE7F3/F472B6?text=Bracelet+2		2	beaded	red,blue,green,white,black,yellow,pink,purple,turquoise,coral	5	Plastic pony beads on stretchy cord
```

**Row 4 - Bracelet 3:**
```
BR-0003	bracelet	Rainbow Loom Bracelet	All the colors of the rainbow in one bracelet!	published	https://placehold.co/400x400/D1FAE5/34D399?text=Bracelet+3		3	rubber_band	red,orange,yellow,green,blue,purple	6	Rainbow Loom rubber bands
```

**Row 5 - Coloring Page 1:**
```
CP-0001	coloring_page	Sleepy Cat	A cozy cat curled up for a nap	published	https://placehold.co/400x400/FEF3C7/F59E0B?text=Coloring+1		1					Animal Friends	Sleepy Cat	https://placehold.co/400x400/FFFFFF/333333?text=Blank+Cat	https://placehold.co/400x400/FEF3C7/F59E0B?text=Colored+Cat
```

**Row 6 - Coloring Page 2:**
```
CP-0002	coloring_page	Unicorn Dreams	A magical unicorn with rainbow mane	published	https://placehold.co/400x400/DBEAFE/3B82F6?text=Coloring+2		2					Magical Creatures	Unicorn Dreams	https://placehold.co/400x400/FFFFFF/333333?text=Blank+Unicorn	
```

**Row 7 - Coloring Page 3:**
```
CP-0003	coloring_page	Flower Garden	Beautiful flowers to color your way!	published	https://placehold.co/400x400/FCE7F3/EC4899?text=Coloring+3		3					Nature Scenes	Flower Garden	https://placehold.co/400x400/FFFFFF/333333?text=Blank+Flowers	https://placehold.co/400x400/FCE7F3/EC4899?text=Colored+Flowers
```

**Row 8 - Portrait 1:**
```
PT-0001	portrait	Pet Portrait	We'll draw your furry friend!	published	https://placehold.co/400x400/EDE9FE/A78BFA?text=Portrait+1		1									5x7,8x10	Realistic,Cartoon	1-2 weeks	TRUE
```

**Row 9 - Portrait 2:**
```
PT-0002	portrait	Family Portrait	A custom portrait of your family!	published	https://placehold.co/400x400/FCE7F3/F472B6?text=Portrait+2		2									8x10,11x14	Cartoon,Watercolor	2-3 weeks	TRUE
```

**Row 10 - Portrait 3:**
```
PT-0003	portrait	Fantasy Character	Describe your dream character and we'll bring it to life!	draft	https://placehold.co/400x400/D1FAE5/34D399?text=Portrait+3		3									5x7,8x10	Cartoon,Anime	1-2 weeks	FALSE
```

- [ ] Sample products added

---

### Step 10: Install Apps Script

1. In Google Sheets, go to **Extensions** → **Apps Script**
2. Delete any existing code in the editor
3. Copy the entire contents from `docs/APPS_SCRIPT.gs` (in this repo)
4. Paste into the Apps Script editor
5. **Update these values at the top of the script:**

```javascript
const WEBHOOK_URL = 'https://YOUR-VERCEL-URL.vercel.app/api/content/publish';
const WEBHOOK_SECRET = 'YOUR-SECRET-FROM-STEP-1';
```

6. Click **Save** (Ctrl+S / Cmd+S)
7. Close the Apps Script editor
8. **Refresh** the Google Sheet page
9. Look for **"Selling Sisters"** menu in the top menu bar

- [ ] Apps Script installed
- [ ] WEBHOOK_URL configured
- [ ] WEBHOOK_SECRET configured (matches Vercel env var!)
- [ ] "Selling Sisters" menu appears after refresh

---

### Step 11: Test Validation

1. Click **Selling Sisters** → **Validate Data**
2. The first time, you'll need to authorize the script:
   - Click **Continue**
   - Choose your Google account
   - Click **Advanced** → **Go to Selling Sisters (unsafe)** (it's safe, just unverified)
   - Click **Allow**
3. You should see: "All X products are valid and ready to publish!"

- [ ] Validation passed

---

### Step 12: Test Publishing

1. Click **Selling Sisters** → **Publish Updates**
2. Click **Yes** when prompted
3. You should see a success message:
   - "Published X products to the website. Version: 1"

- [ ] Publish succeeded

---

### Step 13: Verify on Website

1. Go to your Vercel URL (e.g., https://selling-sisters.vercel.app)
2. Navigate to each product category:
   - Bracelets (should show 3 products)
   - Coloring Pages (should show 3 products)
   - Portraits (should show 2 products - PT-0003 is draft)
3. Click on a product to see details
4. Verify all data displays correctly

- [ ] Products appear on website
- [ ] All 3 categories working
- [ ] Draft products NOT showing

---

### Step 14: Share Google Sheets Access

1. Click **Share** button (top right of Google Sheets)
2. Add anyone who needs access to manage products
3. Set permission level:
   - **Editor** - Can add/edit products and publish
   - **Viewer** - Can only view (not recommended for Dylan/Logan)

- [ ] Access shared with appropriate users

---

## Troubleshooting

### "Selling Sisters" menu doesn't appear
- Refresh the Google Sheets page
- Make sure you saved the Apps Script
- Wait 30 seconds and refresh again

### "Invalid secret" error when publishing
- Verify WEBHOOK_SECRET in Apps Script matches CONTENT_PUBLISH_SECRET in Vercel EXACTLY
- Check for extra spaces or quotes
- Redeploy Vercel project after adding env var

### Products not appearing on website
- Check that status is "published" (not "draft")
- Verify Vercel KV is connected
- Check Vercel function logs for errors (Vercel Dashboard → Deployments → Functions)

### "PRODUCTS sheet not found" error
- Make sure the tab is named exactly "PRODUCTS" (case-sensitive)
- Don't rename it to "Products" or "products"

---

## Final Checklist

Before marking setup complete:

- [ ] Vercel environment variable set (CONTENT_PUBLISH_SECRET)
- [ ] Vercel KV storage created
- [ ] Google Spreadsheet created with 3 tabs
- [ ] PRODUCTS headers configured
- [ ] SETTINGS data added
- [ ] CHANGELOG headers added
- [ ] Sample products added (9 total)
- [ ] Apps Script installed and configured
- [ ] Validation test passed
- [ ] Publish test succeeded
- [ ] Products visible on live website
- [ ] User guide shared with Dylan & Logan

---

## Important Links

| Resource | URL |
|----------|-----|
| Google Sheets | [YOUR SHEETS URL] |
| Vercel Dashboard | https://vercel.com/dashboard |
| Live Website | https://selling-sisters.vercel.app |
| User Guide | `docs/USER_GUIDE_DYLAN_LOGAN.md` |

---

## Configuration Summary

Once complete, record these values:

```
VERCEL_URL: _________________________________
CONTENT_PUBLISH_SECRET: _____________________ (keep secret!)
GOOGLE_SHEETS_ID: ___________________________
GOOGLE_SHEETS_URL: __________________________
```
