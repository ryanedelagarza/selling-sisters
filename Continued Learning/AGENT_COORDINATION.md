# Agent Coordination Guide

**Project:** Selling Sisters Web Application  
**Document Purpose:** Coordinate parallel work across 4 agents  
**Last Updated:** January 20, 2026

---

## Overview

This project uses a parallel development approach with 4 independent agents working simultaneously on different aspects of the application. This document provides coordination guidelines to ensure smooth integration.

---

## Agent Assignments

| Agent | Phase | Focus Area | Primary Files |
|-------|-------|------------|---------------|
| Agent 1 | Phase 3 | Google Sheets Integration | Google Sheets, Apps Script, docs/ |
| Agent 2 | Phase 4 | Email & Order Submission | `api/orders/submit.ts` |
| Agent 3 | Phase 5 | UI/UX & Accessibility | `src/components/`, `src/styles/` |
| Agent 4 | Phase 6 | Testing & QA | Testing documentation |

---

## Phase Documents

| Phase | Document | Description |
|-------|----------|-------------|
| Complete | `PHASE_1_2_COMPLETED.md` | Summary of completed work |
| Phase 3 | `PHASE_3_GOOGLE_SHEETS.md` | Google Sheets CMS setup |
| Phase 4 | `PHASE_4_EMAIL_POLISH.md` | Email templates and order flow |
| Phase 5 | `PHASE_5_UI_ACCESSIBILITY.md` | UI polish and accessibility |
| Phase 6 | `PHASE_6_TESTING_QA.md` | Comprehensive testing |

---

## Dependency Matrix

```
                    ┌──────────────────────────────────────┐
                    │         Can Start Immediately         │
                    └──────────────────────────────────────┘
                                      │
        ┌─────────────────────────────┼─────────────────────────────┐
        │                             │                             │
        ▼                             ▼                             ▼
┌───────────────┐           ┌───────────────┐           ┌───────────────┐
│   Agent 1     │           │   Agent 2     │           │   Agent 3     │
│ Google Sheets │           │ Email Polish  │           │ UI/UX Polish  │
│   (Phase 3)   │           │   (Phase 4)   │           │   (Phase 5)   │
└───────┬───────┘           └───────┬───────┘           └───────┬───────┘
        │                           │                           │
        │                           │                           │
        └───────────────────────────┼───────────────────────────┘
                                    │
                                    ▼
                          ┌───────────────┐
                          │   Agent 4     │
                          │  Testing/QA   │
                          │   (Phase 6)   │
                          └───────────────┘
```

### Dependency Notes

- **Agent 1, 2, 3:** Can all start immediately with no dependencies
- **Agent 4:** Can start basic testing immediately, but full E2E testing benefits from other phases being complete
- **Integration:** All agents' work will be merged into the main branch

---

## File Ownership

To avoid merge conflicts, each agent should primarily work in their designated areas:

### Agent 1 (Google Sheets)
```
OWNS:
├── docs/
│   └── GOOGLE_SHEETS_TEMPLATE.md (update if needed)
├── External: Google Sheets spreadsheet
├── External: Google Apps Script

MAY MODIFY (with caution):
├── api/content/publish.ts (only if bugs found)
├── api/content/products.ts (only if bugs found)
```

### Agent 2 (Email)
```
OWNS:
├── api/orders/submit.ts

MAY MODIFY (with caution):
├── src/lib/api.ts (only submitOrder function)
├── src/hooks/useOrderSubmit.ts (only if needed)
```

### Agent 3 (UI/UX)
```
OWNS:
├── src/components/ (all files)
├── src/styles/globals.css
├── tailwind.config.js

MAY MODIFY (with caution):
├── src/pages/ (only for accessibility/UI fixes)
```

### Agent 4 (Testing)
```
OWNS:
├── Continued Learning/PHASE_6_TESTING_QA.md (test results)
├── Test documentation

DOES NOT MODIFY CODE (reports bugs instead)
```

---

## Communication Protocol

### Status Updates

Each agent should report status using this format:

```markdown
## Status Update - Agent [N] - [Date]

**Phase:** [Phase number and name]
**Progress:** [X]% complete

### Completed Today:
- [Task 1]
- [Task 2]

### In Progress:
- [Task being worked on]

### Blocked:
- [Any blockers]

### Questions:
- [Any questions for other agents]
```

### Bug Reports

If an agent finds a bug in another agent's area:

```markdown
## Bug Found - Agent [N]

**Found By:** Agent [your number]
**Affects:** Agent [affected number]'s area
**Severity:** [Critical/High/Medium/Low]

**Description:**
[What's wrong]

**Steps to Reproduce:**
1. [Step 1]
2. [Step 2]

**Suggested Fix:**
[If known]
```

---

## Git Workflow

### Branch Strategy

Each agent works on their own branch:

```
main
├── agent1/google-sheets
├── agent2/email-polish
├── agent3/ui-accessibility
└── agent4/testing-docs
```

### Commit Message Format

```
[Agent N] Phase X: Brief description

- Detail 1
- Detail 2
```

Example:
```
[Agent 2] Phase 4: Enhance email templates

- Added color swatches to bracelet email
- Improved mobile rendering
- Added reply-to header
```

### Pull Request Process

1. Create PR from your branch to `main`
2. Title: `[Agent N] Phase X: Summary`
3. Include:
   - List of changes
   - Testing done
   - Screenshots (if UI changes)
4. Request review from lead developer

---

## Integration Points

### Shared Resources

These resources are shared and may need coordination:

| Resource | Used By | Notes |
|----------|---------|-------|
| Vercel Environment Variables | Agent 1, 2 | Coordinate secret changes |
| Product Data | Agent 1, 4 | Agent 4 needs test data |
| API Endpoints | Agent 2, 4 | Agent 4 tests Agent 2's changes |
| UI Components | Agent 3, 4 | Agent 4 tests Agent 3's changes |

### Environment Variables

Current environment variables (all agents should be aware):

| Variable | Purpose | Set By |
|----------|---------|--------|
| `RESEND_API_KEY` | Email sending | Already set |
| `CONTENT_PUBLISH_SECRET` | Webhook auth | Agent 1 sets |
| `ORDER_EMAIL_RECIPIENT` | Email recipient | Already set |
| `KV_*` | Vercel KV | Auto-configured |
| `BLOB_*` | Vercel Blob | Auto-configured |

---

## Timeline Coordination

### Suggested Order of Operations

```
Week 1:
├── Day 1-2: All agents read documentation, set up environments
├── Day 3-5: Parallel development
│   ├── Agent 1: Create Sheets, Apps Script
│   ├── Agent 2: Enhance email templates
│   ├── Agent 3: Accessibility audit, fixes
│   └── Agent 4: Create test cases, begin testing
│
Week 2:
├── Day 1-3: Continue parallel work
│   ├── Agent 1: Test publish flow
│   ├── Agent 2: Test all email scenarios
│   ├── Agent 3: Mobile polish, animations
│   └── Agent 4: Cross-browser testing
│
├── Day 4: Integration
│   └── All: Merge branches, resolve conflicts
│
├── Day 5: Final testing
│   └── Agent 4: Full regression test
```

---

## Definition of Done

### Agent 1 (Google Sheets)
- [ ] Google Sheets database created with correct structure
- [ ] Apps Script installed and tested
- [ ] Publish flow works end-to-end
- [ ] User guide created for Dylan & Logan
- [ ] Documentation updated

### Agent 2 (Email)
- [ ] Email templates enhanced
- [ ] All order types tested
- [ ] Edge cases handled
- [ ] Logging added
- [ ] No email delivery failures

### Agent 3 (UI/UX)
- [ ] Mobile layout verified (3 screen sizes minimum)
- [ ] Accessibility audit passed (axe, WAVE)
- [ ] Keyboard navigation complete
- [ ] Focus states visible
- [ ] Animations smooth

### Agent 4 (Testing)
- [ ] All E2E scenarios passed
- [ ] Cross-browser testing complete
- [ ] Performance benchmarks met
- [ ] Security review complete
- [ ] Bug reports filed for any issues

---

## Escalation Path

If an agent encounters a blocking issue:

1. **First:** Try to resolve independently using documentation
2. **Second:** Post question in agent coordination channel
3. **Third:** Escalate to lead developer

---

## Success Criteria

The project is ready for launch when:

1. ✅ All agent Definition of Done criteria met
2. ✅ All branches merged to main
3. ✅ No critical or high-severity bugs open
4. ✅ Agent 4 signs off on launch readiness
5. ✅ Google Sheets CMS working
6. ✅ Email delivery confirmed
7. ✅ Mobile experience verified

---

## Repository Information

- **GitHub:** https://github.com/ryanedelagarza/selling-sisters
- **Vercel:** (to be configured)
- **Google Sheet:** (Agent 1 to create and share link)

---

## Contact

- **Lead Developer:** Ryan
- **Primary Communication:** [Specify channel]
