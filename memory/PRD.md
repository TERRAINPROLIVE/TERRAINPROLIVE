# Quoteforge — Tradesman AI Quoting App (Landing Page)

## Problem Statement
Build a landing page: tradesman AI quoting app, quote builder, estimator.

## User Choices (locked)
- Trade focus: Landscapers, Earth Moving, Concreting (Australia / AUD)
- Working AI estimator demo: YES
- Visual style: Bold & Industrial (dark, high-contrast, yellow accents, Oswald + IBM Plex Sans + JetBrains Mono)
- LLM model: GPT-5.2 via Emergent Universal Key (emergentintegrations)

## Architecture
- Backend: FastAPI (Python), MongoDB (motor). Endpoints under /api.
- Frontend: React + Tailwind + shadcn/ui, framer-motion, react-fast-marquee, lucide-react, sonner toasts.
- AI: emergentintegrations LlmChat → openai/gpt-5.2 with strict-JSON system prompt; backend extracts and validates JSON, persists to db.quotes.
- Env: EMERGENT_LLM_KEY in /app/backend/.env. Frontend uses REACT_APP_BACKEND_URL.

## User Persona
Aussie tradies (sole traders, 2–10 person crews, contractors) running earthmoving, concreting and landscaping who want fast, defensible, line-itemed quotes on a phone.

## Core Requirements (static)
- Industrial, mobile-first landing with hero, marquee, AI estimator demo, how-it-works, features bento, use cases, pricing, testimonials, FAQ, waitlist, footer.
- Interactive AI estimator that posts to /api/quote/generate and renders quote readout with line items, totals, total range, assumptions, next steps.
- Waitlist email capture posting to /api/waitlist with duplicate-email idempotency and live count.

## Implemented (2025-12)
- Backend endpoints: GET /api/, POST /api/quote/generate, POST /api/waitlist, GET /api/waitlist/count, /api/status [POST/GET]
- GPT-5.2 integration with strict JSON output, persisted to MongoDB
- Full landing UI with all 11 sections, sharp industrial aesthetic, terminal-style AI output panel
- Mobile responsive header with hamburger menu, shadcn Select / Slider / Checkbox / Textarea / Accordion / Toast usage
- Tested: 11/11 backend, 100% frontend (testing_agent_v3 iteration_1)

## Implemented (2026-06) — 7-Day Auth-Gated Free Trial
- JWT email/password auth (bcrypt + PyJWT, Bearer token in Authorization header; token stored in localStorage `terrainpro:token`).
- Endpoints: POST /api/auth/register (name, phone, email, password) -> token + user, sets trial_expires_at = now + 7 days, auto-login; POST /api/auth/login; GET /api/auth/me (returns trial_active, days_remaining, trial_expires_at).
- Frontend routes: /signup (Name, Mobile, Email, Password + "[ NO CREDIT CARD REQUIRED — 7 DAYS FREE ACCESS ]" badge), /login, /dashboard (ProtectedRoute) = AI Quote Estimator workspace with top banner "[ SYSTEM STATUS: TRIAL ACTIVE // N DAYS REMAINING ]"; trial-expired lock screen with View Plans CTA.
- All "Start Free Trial" CTAs (hero, hamburger menu, Pricing trial tiers) route to /signup.
- JWT_SECRET added to backend/.env. Demo user: demo@terrainpro.com / trade1234.
- Tested: 9/9 backend auth + 9/9 frontend e2e (testing_agent iteration_3), zero issues.
- Many landing styling refinements: mountain logo lockup, ticker tape marquee, consistent left-aligned section headers + bento cards across Process/Capabilities/UseCases/Pricing/Testimonials/FAQ/EarlyAccess, Watch Demo CTA, industrial "You Ready" menu toggle.

## Implemented (2026-06) — Workspace, Dashboard, Estimator & Quote Export
- Business Dashboard (`/dashboard`) as post-login landing: identity block, KPI cards, editable hourly Labour Rate (persisted via PUT /api/auth/profile, fed into AI quote `labour_rate`), Recent AI Quotes table (real data via GET /api/quotes), Quick Actions. Estimator moved to `/quote` (AppShell shared layout + trial banner + expiry lock).
- Estimator Step 1/2/3 redesigned to a consistent industrial bento language (SectionHeader yellow-bar labels, zinc-950 inputs w/ amber focus, bento toggle cards). New "Decorative Rocks & Pebbles" job group (5 types). Step 2 live Area/Volume summary (length×width, ×depth). Top "Back to Dashboard" + "Previous Step" ghost buttons.
- Step 3: sticky bottom Total banner (aligned to QTY column), 120s request timeout + retry, **Export to PDF** (jsPDF branded doc) and **Save Quote** (POST /api/quotes, per-user) actions.
- Backend: POST/GET /api/quotes (auth, db.saved_quotes, user-scoped), totals coerced to float.
- Tested: testing_agent iteration_4 — 14/14 backend (9 auth + 5 quotes), 100% frontend. Tests at /app/backend/tests/test_auth.py & test_quotes.py.

## Backlog
P0 — none (MVP + trial auth complete)
P1 — save-quote-by-email, returning-user dashboard with saved quotes
P1 — Decouple JWT TTL from trial length; password reset (/forgot-password, /reset-password)
P2 — Custom rates library, Xero/MYOB export, variation deltas, voice-to-job input, Stripe upgrade on trial expiry

## Implemented (2026-06-04) — Editable Step 3, Saved-Quote View, Profile ABN, UI polish
- **Step 3 fully editable rebuild**: three-tier breakdown — Material Costs + Labour & Earthmoving (auto-classified by unit hr/day) with inline editable QTY & RATE per row (instant per-row total), plus a global Margin & Markup slider/% input. Live Totals sidebar (Subtotal → Markup → GST 10% → Total AUD) recalculates instantly. Actions: "Save Draft / Re-Calculate" + primary "Generate Final Client Quote →" (saves + exports branded PDF). Mobile sticky total bar. Edited values flow into Save and PDF (parent `computed`/`computedQuote` model in EstimatorWizard.jsx).
- **Saved-quote detail view**: dashboard rows/cards are clickable → `SavedQuoteDetail` modal (total range, scope summary, grouped line items, totals breakdown, assumptions, Export PDF + close). Fixed "can't save multiple" — estimator resets `saved` on each new generation; backend inserts a new record per save.
- **Profile ABN + Business Name**: added to PUT /api/auth/profile and /auth/me; editable on dashboard business-meta block (pencil → inputs → save); printed on exported quote PDFs.
- **Dashboard cleanup**: removed hardcoded sample-quote fallback (now shows real data / proper empty state); `wiz-reset` now fully clears wizard state (customer, jobs, measurements, complexity, notes).
- **UI polish**: trial banner text smaller + reworded "Trial Active // N Days Remaining"; dashboard header alignment (G'day heading + Business box in shared 4-col grid, business logo placeholder); signup page compacted to single-screen (no scroll) with new subtitle + Home button; landing header → sleek circular hamburger (mobile + web) with Estimator/Features/Pricing/Contact dropdown; industrial concrete watermark background ("YOUR PROJECT," / "OUR TERRAIN.") on AppShell + signup.
- Tested: testing_agent iteration_5 — backend 19/19 (9 auth + 5 quotes + 5 profile/multi-save), frontend 11/11 functional checks. Live recalc math verified (markup = subtotal×pct, GST = (subtotal+markup)×0.10).
