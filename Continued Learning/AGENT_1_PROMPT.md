# Agent 1 Prompt: Google Sheets Integration

Copy and paste this prompt to Agent 1:

---

## Your Assignment

You are **Agent 1** working on the **Selling Sisters** project. Your task is to set up the Google Sheets content management system that will allow the shop owners (two young girls named Dylan and Logan) to manage their product listings.

## Project Context

**Selling Sisters** is a mobile-first React/TypeScript web application for ordering handmade products (bracelets, portraits, coloring pages). The frontend and API endpoints are already built. Your job is to connect the content pipeline.

**Repository:** https://github.com/ryanedelagarza/selling-sisters

**Tech Stack:**
- Frontend: React 18 + TypeScript + Vite + Tailwind CSS
- Backend: Vercel serverless functions
- Storage: Vercel KV (key-value store)
- CMS: Google Sheets (your focus)

## Your Documents

Read these files in order to understand your tasks:

1. **Start here:** `Continued Learning/PHASE_1_2_COMPLETED.md`
   - Understand what's already built
   - Review the API endpoint structure

2. **Your main guide:** `Continued Learning/PHASE_3_GOOGLE_SHEETS.md`
   - Complete all tasks (3.1 through 3.7)
   - Follow the step-by-step instructions

3. **Reference:** `Continued Learning/AGENT_COORDINATION.md`
   - Understand file ownership rules
   - Know what files you can/cannot modify

## Your Deliverables

1. **Google Sheets database** with correct structure (PRODUCTS, SETTINGS, CHANGELOG sheets)
2. **Sample product data** (at least 3 products per type: bracelets, coloring pages, portraits)
3. **Apps Script** installed and configured with the correct webhook URL and secret
4. **Verified publish flow** - products appear on the website after clicking "Publish"
5. **User guide** for Dylan & Logan explaining how to add/edit products

## Key Files You May Need to Reference

```
api/content/publish.ts    - Webhook endpoint (already built, reference only)
api/content/products.ts   - Products GET endpoint (already built, reference only)
docs/GOOGLE_SHEETS_TEMPLATE.md - Template documentation
```

## Important Notes

- You need a Google account to create the spreadsheet
- The Vercel project needs `CONTENT_PUBLISH_SECRET` environment variable set
- The Apps Script `WEBHOOK_SECRET` must match the Vercel env var exactly
- Test the full publish flow before marking complete

## When You're Done

Report back with:
1. Google Sheets URL (share link)
2. Confirmation that publish flow works
3. User guide document location
4. Any issues encountered and how you resolved them

---

Begin by cloning the repository and reading `Continued Learning/PHASE_3_GOOGLE_SHEETS.md`.
