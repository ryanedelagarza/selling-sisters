# Agent 4 Prompt: Testing & Quality Assurance

Copy and paste this prompt to Agent 4:

---

## Your Assignment

You are **Agent 4** working on the **Selling Sisters** project. Your task is to perform comprehensive testing and quality assurance. You will test the application, document bugs, and verify that everything works correctly before launch.

## Project Context

**Selling Sisters** is a mobile-first React/TypeScript web application for ordering handmade products (bracelets, portraits, coloring pages). The app is built and other agents are polishing it. Your job is to test everything thoroughly.

**Repository:** https://github.com/ryanedelagarza/selling-sisters

**Tech Stack:**
- Frontend: React 18 + TypeScript + Vite + Tailwind CSS
- Backend: Vercel serverless functions
- Email: Resend
- Storage: Vercel KV, Vercel Blob

## Your Documents

Read these files in order to understand your tasks:

1. **Start here:** `Continued Learning/PHASE_1_2_COMPLETED.md`
   - Understand the complete application architecture
   - Learn the user flows

2. **Your main guide:** `Continued Learning/PHASE_6_TESTING_QA.md`
   - Complete all test scenarios (6.1 through 6.9)
   - Fill in the test result tables
   - Document all bugs found

3. **Reference:** `Continued Learning/AGENT_COORDINATION.md`
   - Understand your role (testing, not modifying code)
   - Know how to report bugs to other agents

## Your Deliverables

1. **Completed test scenarios** (E2E tests for all order types)
2. **Edge case test results** (validation, file upload, navigation)
3. **Cross-browser test results** (Chrome, Firefox, Safari, Edge, mobile)
4. **Performance benchmarks** (Lighthouse scores, Core Web Vitals)
5. **Security review** (no exposed secrets, input sanitization)
6. **Bug reports** for any issues found
7. **Launch readiness sign-off**

## Important: Your Role

**You are a tester, not a developer.** Your job is to:
- ✅ Find bugs and document them
- ✅ Run test scenarios and record results
- ✅ Verify functionality works correctly
- ✅ Report issues to other agents
- ❌ Do NOT modify code (except test documentation)

If you find a bug, document it using the bug report template in your guide document.

## Test Environments

| Environment | URL | When to Use |
|-------------|-----|-------------|
| Local | http://localhost:3000 | Initial testing |
| Production | https://selling-sisters.vercel.app | Final verification |

## Testing Priority

1. **Critical Path First:**
   - Home → Product Listing → Product Detail → Order Flow → Confirmation
   - This is the main user journey - test it thoroughly

2. **Then Edge Cases:**
   - Invalid inputs, large files, network errors, etc.

3. **Then Cross-Browser:**
   - Ensure it works everywhere

4. **Finally Performance & Security:**
   - Lighthouse audits, security review

## Tools You'll Need

- Chrome DevTools (device simulation, Lighthouse, Network throttling)
- axe DevTools (accessibility testing)
- Multiple browsers (Chrome, Firefox, Safari/Edge)
- Mobile device or emulator

## When You're Done

Report back with:
1. Completed `PHASE_6_TESTING_QA.md` with all tables filled in
2. List of bugs found (with severity ratings)
3. Lighthouse reports
4. Recommendation: Ready for launch? Yes/No with justification
5. Any blockers that must be fixed before launch

---

Begin by cloning the repository and reading `Continued Learning/PHASE_6_TESTING_QA.md`. Run the app locally first (`npm install && npm run dev`), then test the deployed version.
