# Agent 3 Prompt: UI/UX Polish & Accessibility

Copy and paste this prompt to Agent 3:

---

## Your Assignment

You are **Agent 3** working on the **Selling Sisters** project. Your task is to polish the user interface, ensure mobile responsiveness, and achieve WCAG 2.1 AA accessibility compliance.

## Project Context

**Selling Sisters** is a mobile-first React/TypeScript web application for ordering handmade products (bracelets, portraits, coloring pages). The core functionality is built, but the UI needs polish and accessibility improvements.

**Repository:** https://github.com/ryanedelagarza/selling-sisters

**Tech Stack:**
- Frontend: React 18 + TypeScript + Vite
- Styling: Tailwind CSS
- Design: Pastel color palette (purple, pink, green)
- Fonts: Fredoka One (headings), Nunito (body)

## Your Documents

Read these files in order to understand your tasks:

1. **Start here:** `Continued Learning/PHASE_1_2_COMPLETED.md`
   - Understand the component structure
   - Review the design system

2. **Your main guide:** `Continued Learning/PHASE_5_UI_ACCESSIBILITY.md`
   - Complete all tasks (5.1 through 5.8)
   - Follow the accessibility checklist

3. **Reference:** `Continued Learning/AGENT_COORDINATION.md`
   - Understand file ownership rules
   - Know what files you can/cannot modify

## Your Deliverables

1. **Mobile responsiveness** verified on iPhone SE (375px), iPhone 14 (390px), iPad (820px)
2. **Accessibility audit passed** using axe DevTools (0 critical/serious issues)
3. **Keyboard navigation** working for entire order flow
4. **Focus states** visible on all interactive elements
5. **Loading states and animations** polished

## Key Files You Will Modify

```
src/components/           - All component files
src/styles/globals.css    - Global styles
tailwind.config.js        - Design tokens
src/pages/                - Page components (for a11y fixes)
```

## Key Areas to Focus

1. **Mobile Layout** - Cards, grids, forms must work on small screens
2. **Touch Targets** - All buttons/links must be at least 48x48px
3. **Color Contrast** - Text must have 4.5:1 ratio against background
4. **Focus Indicators** - Visible focus rings on all interactive elements
5. **Screen Reader** - Proper labels, ARIA attributes, semantic HTML

## Testing Tools

- Chrome DevTools (Device Mode for mobile simulation)
- axe DevTools browser extension
- WAVE browser extension
- Lighthouse accessibility audit
- Keyboard navigation (Tab, Enter, Space)
- VoiceOver (Mac) or NVDA (Windows) for screen reader testing

## Important Notes

- Primary users access on mobile phones
- The color palette is intentionally soft/pastel - ensure contrast still passes
- Preserve the "kid-friendly" feel while improving accessibility
- Test on actual mobile devices if possible, not just emulators

## When You're Done

Report back with:
1. Lighthouse accessibility score (target: 90+)
2. axe DevTools results (0 critical/serious)
3. List of components modified
4. Any color changes made (with justification)
5. Screenshots of mobile layouts

---

Begin by cloning the repository and reading `Continued Learning/PHASE_5_UI_ACCESSIBILITY.md`.
