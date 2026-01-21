# Selling Sisters

A mobile-first web application for ordering handmade bracelets, portraits, and coloring pages created by Dylan and Logan.

## Features

- **Browse Products**: View bracelets, portraits, and coloring pages
- **Customize Orders**: Select colors, styles, upload reference photos
- **Easy Contact**: Submit orders via email - no accounts needed
- **Mobile-First**: Optimized for phone and tablet users

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **State**: React Context + React Query
- **Deployment**: Vercel
- **Email**: Resend
- **Storage**: Vercel KV + Vercel Blob
- **CMS**: Google Sheets

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp env.example .env.local

# Start development server
npm run dev
```

### Environment Variables

Copy `env.example` to `.env.local` and fill in:

- `RESEND_API_KEY` - Get from [resend.com](https://resend.com)
- `CONTENT_PUBLISH_SECRET` - Generate a secure random string
- Other variables are auto-configured by Vercel

## Project Structure

```
src/
├── components/
│   ├── layout/       # Header, Footer, Layout
│   ├── order/        # Order flow components
│   ├── products/     # Product cards and grids
│   ├── shared/       # Error boundary, empty states
│   └── ui/           # Buttons, inputs, cards, etc.
├── context/          # Order state management
├── lib/              # Constants, sample data, utilities
├── pages/            # Route pages
├── styles/           # Global CSS
└── types/            # TypeScript definitions
```

## Deployment

1. Connect your GitHub repo to Vercel
2. Add environment variables in Vercel dashboard
3. Add Vercel KV and Blob storage
4. Deploy!

## Content Management

Products are managed via Google Sheets:

1. See `docs/GOOGLE_SHEETS_TEMPLATE.md` for setup
2. Add products to your spreadsheet
3. Click "Selling Sisters → Publish Updates" to sync

## Scripts

```bash
npm run dev        # Start dev server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
npm run type-check # TypeScript check
```

## License

Private - All rights reserved
