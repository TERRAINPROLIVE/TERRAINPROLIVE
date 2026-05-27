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

## Backlog
P0 — none (MVP complete)
P1 — Branded PDF quote export, save-quote-by-email, login (sole trader dashboard)
P2 — Custom rates library, Xero/MYOB export, variation deltas, voice-to-job input
