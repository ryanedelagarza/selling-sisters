/**
 * Selling Sisters - Google Sheets to Website Publisher
 * 
 * SETUP INSTRUCTIONS:
 * 1. In Google Sheets, go to Extensions → Apps Script
 * 2. Delete any existing code and paste this entire file
 * 3. Update WEBHOOK_URL and WEBHOOK_SECRET below
 * 4. Save (Ctrl+S)
 * 5. Refresh Google Sheets
 * 6. Use the "Selling Sisters" menu to publish
 * 
 * @version 1.0.0
 * @author Agent 1 - Google Sheets Integration
 */

// ============================================================
// CONFIGURATION - UPDATE THESE VALUES!
// ============================================================

/**
 * Your Vercel deployment URL + /api/content/publish
 * Example: 'https://selling-sisters.vercel.app/api/content/publish'
 */
const WEBHOOK_URL = 'https://YOUR-VERCEL-URL.vercel.app/api/content/publish';

/**
 * Must match CONTENT_PUBLISH_SECRET in your Vercel environment variables
 * Generate a secure 32+ character random string
 */
const WEBHOOK_SECRET = 'YOUR-SECRET-HERE';

// ============================================================
// DO NOT MODIFY BELOW THIS LINE
// ============================================================

/**
 * Adds custom menu when spreadsheet opens
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Selling Sisters')
    .addItem('📤 Publish Updates', 'publishToWebsite')
    .addItem('✅ Validate Data', 'validateProducts')
    .addSeparator()
    .addItem('ℹ️ About', 'showAbout')
    .addToUi();
}

/**
 * Shows about dialog
 */
function showAbout() {
  const ui = SpreadsheetApp.getUi();
  ui.alert(
    'Selling Sisters Publisher',
    'Version 1.0.0\n\n' +
    'This script publishes your product data to the Selling Sisters website.\n\n' +
    'Use "Publish Updates" to send changes to the live site.\n' +
    'Use "Validate Data" to check for errors before publishing.',
    ui.ButtonSet.OK
  );
}

/**
 * Main publish function - sends products to website
 */
function publishToWebsite() {
  const ui = SpreadsheetApp.getUi();
  
  // Check configuration
  if (WEBHOOK_URL.includes('YOUR-VERCEL-URL') || WEBHOOK_SECRET.includes('YOUR-SECRET')) {
    ui.alert(
      '⚠️ Configuration Required',
      'Please update WEBHOOK_URL and WEBHOOK_SECRET in the Apps Script editor.\n\n' +
      'Go to Extensions → Apps Script and update the values at the top of the code.',
      ui.ButtonSet.OK
    );
    return;
  }
  
  // Confirm before publishing
  const response = ui.alert(
    '📤 Publish Updates',
    'This will update the live website with your current product data.\n\n' +
    'Continue?',
    ui.ButtonSet.YES_NO
  );
  
  if (response !== ui.Button.YES) {
    return;
  }
  
  // Show progress
  const toast = SpreadsheetApp.getActiveSpreadsheet();
  toast.toast('Publishing...', '⏳ Please wait', 30);
  
  try {
    const products = getProductsFromSheet();
    
    if (products.length === 0) {
      ui.alert('❌ Error', 'No products found in the PRODUCTS sheet.', ui.ButtonSet.OK);
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
      
      toast.toast('Done!', '✅ Published', 3);
      
      ui.alert(
        '✅ Success!',
        `Published ${result.products_published} products to the website!\n\n` +
        `Version: ${result.version}\n` +
        `Total products received: ${result.products_received}`,
        ui.ButtonSet.OK
      );
    } else {
      let errorMessage = 'Unknown error';
      let details = '';
      
      try {
        const error = JSON.parse(responseText);
        errorMessage = error.error || errorMessage;
        if (error.details && error.details.length > 0) {
          details = '\n\nDetails:\n' + error.details.slice(0, 5).join('\n');
        }
      } catch (e) {
        errorMessage = responseText || errorMessage;
      }
      
      toast.toast('Failed', '❌ Error', 3);
      
      ui.alert(
        '❌ Publish Failed',
        `Error: ${errorMessage}${details}\n\n` +
        `Response code: ${responseCode}`,
        ui.ButtonSet.OK
      );
    }
  } catch (error) {
    toast.toast('Failed', '❌ Error', 3);
    ui.alert(
      '❌ Error',
      `Failed to publish: ${error.message}\n\n` +
      'Please check your configuration and try again.',
      ui.ButtonSet.OK
    );
    console.error('Publish error:', error);
  }
}

/**
 * Reads products from the PRODUCTS sheet
 * @returns {Array} Array of product objects
 */
function getProductsFromSheet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('PRODUCTS');
  if (!sheet) {
    throw new Error('PRODUCTS sheet not found. Make sure you have a tab named exactly "PRODUCTS".');
  }
  
  const data = sheet.getDataRange().getValues();
  
  if (data.length < 2) {
    return []; // No data rows
  }
  
  const headers = data[0].map(h => String(h).trim().toLowerCase());
  const products = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    
    // Skip empty rows (check product_id column)
    if (!row[0] || String(row[0]).trim() === '') continue;
    
    const product = rowToProduct(headers, row);
    if (product) {
      products.push(product);
    }
  }
  
  return products;
}

/**
 * Converts a spreadsheet row to a product object
 * @param {Array} headers - Array of column headers
 * @param {Array} row - Array of row values
 * @returns {Object} Product object
 */
function rowToProduct(headers, row) {
  // Create raw object from headers and row values
  const raw = {};
  for (let i = 0; i < headers.length; i++) {
    const header = headers[i];
    const value = row[i];
    
    // Convert to appropriate type
    if (value === '' || value === null || value === undefined) {
      raw[header] = null;
    } else if (typeof value === 'boolean') {
      raw[header] = value;
    } else if (String(value).toUpperCase() === 'TRUE') {
      raw[header] = true;
    } else if (String(value).toUpperCase() === 'FALSE') {
      raw[header] = false;
    } else if (typeof value === 'number') {
      raw[header] = value;
    } else {
      raw[header] = String(value).trim();
    }
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
    product.gallery = String(raw.gallery_urls)
      .split(',')
      .map(url => url.trim())
      .filter(url => url && url.length > 0);
  }
  
  // Type-specific fields
  if (raw.type === 'bracelet') {
    product.bracelet = {
      style: raw.bracelet_style || null,
      color_options: raw.color_options 
        ? String(raw.color_options).split(',').map(c => c.trim()).filter(c => c)
        : [],
      max_colors: raw.max_colors || null,
      materials: raw.materials_display || null
    };
  }
  
  if (raw.type === 'coloring_page') {
    product.coloring_page = {
      book_name: raw.book_name || null,
      page_name: raw.page_name || null,
      blank_page_url: raw.blank_page_url || null,
      colored_example_url: raw.colored_example_url || null
    };
  }
  
  if (raw.type === 'portrait') {
    product.portrait = {
      size_options: raw.portrait_size_options 
        ? String(raw.portrait_size_options).split(',').map(s => s.trim()).filter(s => s)
        : null,
      style_options: raw.portrait_style_options 
        ? String(raw.portrait_style_options).split(',').map(s => s.trim()).filter(s => s)
        : null,
      turnaround: raw.turnaround_display || null,
      requires_upload: raw.requires_upload === true
    };
  }
  
  return product;
}

/**
 * Gets and increments the version number
 * @returns {number} Next version number
 */
function getNextVersion() {
  const props = PropertiesService.getScriptProperties();
  const current = parseInt(props.getProperty('version') || '0', 10);
  const next = current + 1;
  props.setProperty('version', next.toString());
  return next;
}

/**
 * Logs publish event to CHANGELOG sheet
 * @param {Object} result - Result from the publish API
 */
function logToChangelog(result) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('CHANGELOG');
  if (!sheet) {
    console.log('CHANGELOG sheet not found, skipping log');
    return;
  }
  
  const userEmail = Session.getActiveUser().getEmail() || 'Unknown';
  
  sheet.appendRow([
    new Date(),
    result.version || 'N/A',
    result.products_published || 0,
    userEmail
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
    const warnings = [];
    
    if (products.length === 0) {
      ui.alert(
        '⚠️ No Products Found',
        'The PRODUCTS sheet appears to be empty.\n\n' +
        'Add some products starting at row 2.',
        ui.ButtonSet.OK
      );
      return;
    }
    
    // Track product IDs for duplicates
    const seenIds = new Set();
    
    products.forEach((product, index) => {
      const rowNum = index + 2; // +2 because row 1 is headers, arrays are 0-indexed
      
      // Required fields
      if (!product.product_id) {
        errors.push(`Row ${rowNum}: Missing product_id`);
      } else {
        if (seenIds.has(product.product_id)) {
          errors.push(`Row ${rowNum}: Duplicate product_id "${product.product_id}"`);
        }
        seenIds.add(product.product_id);
      }
      
      if (!product.type || !['bracelet', 'coloring_page', 'portrait'].includes(product.type)) {
        errors.push(`Row ${rowNum}: Invalid type "${product.type}" (must be bracelet, coloring_page, or portrait)`);
      }
      
      if (!product.title) {
        errors.push(`Row ${rowNum}: Missing title`);
      }
      
      if (!product.short_desc) {
        warnings.push(`Row ${rowNum}: Missing short_desc (recommended)`);
      }
      
      if (!product.status || !['draft', 'published', 'archived', 'sold_out'].includes(product.status)) {
        errors.push(`Row ${rowNum}: Invalid status "${product.status}"`);
      }
      
      if (!product.thumbnail_url) {
        errors.push(`Row ${rowNum}: Missing thumbnail_url`);
      } else if (!product.thumbnail_url.startsWith('http')) {
        warnings.push(`Row ${rowNum}: thumbnail_url should start with http:// or https://`);
      }
      
      // Type-specific validation
      if (product.type === 'bracelet' && product.bracelet) {
        if (!product.bracelet.style || !['rubber_band', 'beaded'].includes(product.bracelet.style)) {
          errors.push(`Row ${rowNum}: Bracelet needs style (rubber_band or beaded)`);
        }
        if (!product.bracelet.color_options || product.bracelet.color_options.length === 0) {
          errors.push(`Row ${rowNum}: Bracelet needs color_options`);
        }
      }
      
      if (product.type === 'coloring_page' && product.coloring_page) {
        if (!product.coloring_page.book_name) {
          warnings.push(`Row ${rowNum}: Coloring page missing book_name`);
        }
        if (!product.coloring_page.blank_page_url) {
          errors.push(`Row ${rowNum}: Coloring page needs blank_page_url`);
        }
      }
      
      if (product.type === 'portrait' && product.portrait) {
        if (!product.portrait.size_options || product.portrait.size_options.length === 0) {
          warnings.push(`Row ${rowNum}: Portrait missing size_options`);
        }
      }
    });
    
    // Count by status
    const published = products.filter(p => p.status === 'published').length;
    const drafts = products.filter(p => p.status === 'draft').length;
    const soldOut = products.filter(p => p.status === 'sold_out').length;
    const archived = products.filter(p => p.status === 'archived').length;
    
    // Build summary message
    let summaryMessage = `Found ${products.length} products:\n` +
      `• Published: ${published}\n` +
      `• Drafts: ${drafts}\n` +
      `• Sold Out: ${soldOut}\n` +
      `• Archived: ${archived}\n`;
    
    if (errors.length > 0) {
      ui.alert(
        '❌ Validation Failed',
        `Found ${errors.length} error(s):\n\n` +
        errors.slice(0, 10).join('\n') +
        (errors.length > 10 ? `\n...and ${errors.length - 10} more` : '') +
        '\n\n' + summaryMessage,
        ui.ButtonSet.OK
      );
    } else if (warnings.length > 0) {
      ui.alert(
        '⚠️ Validation Passed with Warnings',
        summaryMessage + '\n' +
        `${warnings.length} warning(s):\n\n` +
        warnings.slice(0, 8).join('\n') +
        (warnings.length > 8 ? `\n...and ${warnings.length - 8} more` : '') +
        '\n\nYou can still publish, but consider fixing these.',
        ui.ButtonSet.OK
      );
    } else {
      ui.alert(
        '✅ Validation Passed!',
        summaryMessage + '\n' +
        'All products are valid and ready to publish!',
        ui.ButtonSet.OK
      );
    }
  } catch (error) {
    ui.alert(
      '❌ Error',
      `Validation failed: ${error.message}`,
      ui.ButtonSet.OK
    );
    console.error('Validation error:', error);
  }
}
