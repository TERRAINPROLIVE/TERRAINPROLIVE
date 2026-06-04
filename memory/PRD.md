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

## Backlog
P0 — none (MVP + trial auth complete)
P1 — Branded PDF quote export, save-quote-by-email, returning-user dashboard with saved quotes
P1 — Decouple JWT TTL from trial length; password reset (/forgot-password, /reset-password)
P2 — Custom rates library, Xero/MYOB export, variation deltas, voice-to-job input, Stripe upgrade on trial expiry
