# Auth Testing Playbook — TerrainPRO

Token-based JWT auth (Bearer header; token returned in response body, stored in localStorage `terrainpro:token`).

## API Testing
```
API=https://blueprint-build-15.preview.emergentagent.com

# Register (returns token + user with 7-day trial)
curl -s -X POST "$API/api/auth/register" -H "Content-Type: application/json" \
  -d '{"name":"QA User","phone":"0412345678","email":"qa1@test.com","password":"secret123"}'

# Login
curl -s -X POST "$API/api/auth/login" -H "Content-Type: application/json" \
  -d '{"email":"qa1@test.com","password":"secret123"}'

# Me (use token from register/login)
curl -s "$API/api/auth/me" -H "Authorization: Bearer <TOKEN>"
```
Verify: register returns `token`, `user.days_remaining == 7`, `user.trial_active == true`,
`user.trial_expires_at` ~7 days ahead. Duplicate registered email -> 409. Wrong password -> 401.

## Pre-created demo user
- demo@terrainpro.com / trade1234

## Frontend flows
- /signup: fill Name/Mobile/Email/Password -> Start Free Trial -> lands on /dashboard with banner
  `[ SYSTEM STATUS: TRIAL ACTIVE // 7 DAYS REMAINING ]`.
- /login: returning user logs in -> /dashboard.
- /dashboard direct hit without token -> redirects to /signup.
- Hero "Start Free Trial", menu "Start Free Trial", Pricing trial CTAs -> /signup.
- data-testids: signup-form, signup-name/phone/email/password, signup-submit, signup-trial-badge,
  login-form, login-email/password, login-submit, workspace-page, trial-banner, workspace-signout,
  hero-primary-cta, menu-start-trial.
