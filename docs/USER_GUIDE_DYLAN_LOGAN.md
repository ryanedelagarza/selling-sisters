# Selling Sisters - Product Management Guide

**Hi Dylan & Logan!**

This guide will teach you how to add, change, and publish your products on the Selling Sisters website!

---

## Getting Started

### Step 1: Open Your Product Spreadsheet

1. Click this link (bookmark it!): **[YOUR GOOGLE SHEETS LINK HERE]**
2. Sign in with your Google account if needed
3. You should see your "Selling Sisters - Product Database" spreadsheet

---

## Understanding Your Spreadsheet

Your spreadsheet has 3 tabs (look at the bottom of the screen):

| Tab Name | What It's For |
|----------|---------------|
| **PRODUCTS** | All your products live here! |
| **SETTINGS** | Website settings (don't change this) |
| **CHANGELOG** | History of when you published updates |

---

## How to Add a New Product

### For a New BRACELET:

1. Go to the **PRODUCTS** tab
2. Find the last row with data
3. Add a new row below it with these columns filled in:

| What to Type | Example |
|--------------|---------|
| **product_id** | BR-0004 (use the next number!) |
| **type** | bracelet |
| **title** | Super Cool Bracelet |
| **short_desc** | A really cool bracelet design! |
| **status** | published |
| **thumbnail_url** | (your image link - see "Adding Pictures" below) |
| **sort_order** | 4 (next number) |
| **bracelet_style** | rubber_band or beaded |
| **color_options** | red,blue,green,yellow (colors separated by commas) |
| **max_colors** | 3 (how many colors can customers pick?) |
| **materials_display** | Rainbow Loom rubber bands |

### For a New COLORING PAGE:

| What to Type | Example |
|--------------|---------|
| **product_id** | CP-0004 (use the next number!) |
| **type** | coloring_page |
| **title** | Cute Puppy |
| **short_desc** | An adorable puppy to color! |
| **status** | published |
| **thumbnail_url** | (your image link) |
| **sort_order** | 4 |
| **book_name** | Animal Friends |
| **page_name** | Cute Puppy |
| **blank_page_url** | (link to the blank coloring page image) |
| **colored_example_url** | (optional - link to a colored example) |

### For a New PORTRAIT:

| What to Type | Example |
|--------------|---------|
| **product_id** | PT-0004 (use the next number!) |
| **type** | portrait |
| **title** | Best Friend Portrait |
| **short_desc** | Draw your best friend! |
| **status** | published |
| **thumbnail_url** | (your image link) |
| **sort_order** | 4 |
| **portrait_size_options** | 5x7,8x10 |
| **portrait_style_options** | Cartoon,Realistic |
| **turnaround_display** | 1-2 weeks |
| **requires_upload** | TRUE or FALSE |

---

## Adding Pictures

To add pictures for your products:

### Easy Way - Using Imgur (Free!)

1. Go to [imgur.com](https://imgur.com)
2. Click the green "New post" button
3. Drag your picture into the box OR click to upload
4. Wait for it to upload
5. Right-click on your uploaded picture
6. Click "Copy image address" (or "Copy image URL")
7. Paste that link into your spreadsheet!

**Tip:** Make sure your pictures are:
- Clear and well-lit
- Showing the product nicely
- Not too big (under 2MB is best)

---

## Status Options - What Do They Mean?

| Status | What Happens |
|--------|--------------|
| **published** | Shows on the website - customers can order it! |
| **draft** | Hidden from website - still working on it |
| **sold_out** | Shows on website with "Sold Out" badge - can't order |
| **archived** | Completely hidden - for old products |

---

## Publishing Your Changes

**IMPORTANT:** After you add or change products, you MUST publish for the website to update!

### How to Publish:

1. Look at the top menu bar in Google Sheets
2. Click **Selling Sisters** (it's a custom menu)
3. Click **Publish Updates**
4. A box will pop up asking "This will update the live website. Continue?"
5. Click **Yes**
6. Wait for the success message!
7. Check the website to see your changes!

### Before Publishing - Validate Your Data:

1. Click **Selling Sisters** in the menu
2. Click **Validate Data**
3. This checks if everything looks right
4. If there are errors, it will tell you what to fix!

---

## Making Changes to Existing Products

### To Edit a Product:
1. Find the row with the product you want to change
2. Click on the cell you want to edit
3. Type your new information
4. Click **Selling Sisters → Publish Updates**

### To Hide a Product:
1. Find the product's row
2. Change the **status** column to `draft` or `archived`
3. Publish!

### To Mark as Sold Out:
1. Find the product's row
2. Change the **status** column to `sold_out`
3. Publish!

### To Bring Back a Hidden Product:
1. Find the product's row
2. Change the **status** column to `published`
3. Publish!

---

## Common Mistakes to Avoid

| Mistake | How to Fix |
|---------|------------|
| Forgot to publish | Always click Selling Sisters → Publish Updates |
| Typo in "type" | Must be exactly: `bracelet`, `coloring_page`, or `portrait` |
| Typo in "status" | Must be exactly: `draft`, `published`, `archived`, or `sold_out` |
| Picture not showing | Make sure the URL starts with `https://` |
| Colors not working | Separate colors with commas, no spaces: `red,blue,green` |

---

## Quick Reference - Product IDs

Always use the correct prefix for your product type:

| Product Type | ID Format | Example |
|--------------|-----------|---------|
| Bracelet | BR-XXXX | BR-0001, BR-0002, BR-0003 |
| Coloring Page | CP-XXXX | CP-0001, CP-0002, CP-0003 |
| Portrait | PT-XXXX | PT-0001, PT-0002, PT-0003 |

**Important:** Each product_id must be unique! Use the next number in sequence.

---

## Need Help?

If something isn't working:

1. Try **Validate Data** first - it might tell you what's wrong
2. Make sure all required fields are filled in
3. Check that your status and type are spelled correctly
4. Ask a parent for help!

---

## Checklist Before Publishing

Before you click "Publish Updates," check:

- [ ] Product ID is unique (BR-0004, not BR-0001 again)
- [ ] Type is correct (bracelet, coloring_page, or portrait)
- [ ] Title is filled in
- [ ] Description is filled in
- [ ] Status is "published" (if you want it on the website)
- [ ] Picture URL is added and works
- [ ] For bracelets: style and colors are set
- [ ] For coloring pages: book name and blank page URL are set
- [ ] For portraits: sizes, styles, and turnaround are set

---

**You've got this! Have fun running your shop!**

*Made with love for Dylan & Logan*
