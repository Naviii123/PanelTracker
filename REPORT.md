# PanelTracker Weekly Increment Report

## Week of: 2026-09-24

## What changed this week

- Replaced the starter sightings interface with the PanelTracker manga tracking application.
- Added React routes for login, registration, dashboard, library, series detail, and settings.
- Added Express authentication with bcrypt password hashing, access JWTs, refresh-token rotation, logout, and auth rate limiting.
- Added Supabase PostgreSQL schema for users, shared manga metadata, progress, and refresh tokens.
- Added AniList GraphQL search, full manga details, recommendations, and popularity fallback through a server-side service.
- Added personal library CRUD, statuses, chapter progress, ratings, dashboard statistics, genre counts, and clear-library behavior.
- Added known chapter-total validation on the frontend and backend. Known totals use a bounded selector; unknown totals use manual numeric input.
- Added visible progress and rating validation errors instead of relying only on the HTML `max` attribute.
- Added a protected Settings page with account display, demo/connected mode status, library clearing, and logout.
- Added explicit localStorage demo mode and documented how to switch between demo and real API mode.
- Added the uploaded auth collage to `client/public/assets/images/` and organized fallback assets under `placeholders/`.
- Updated the UI to follow the PanelTracker design system and created a running login screenshot for the README.
- Added README, `SECURITY-CHECKLIST.md`, and this weekly report.

## Why

These changes establish the main end-to-end tracking flow while keeping the frontend, Express API, PostgreSQL access, and AniList integration separated. The documentation explains how a new reader can run the project, understand its architecture, use demo mode, and identify the remaining work. The security checklist records the current protections before the repository is published.

## What broke or what I got stuck on

- The real database flow has not been fully exercised in this workspace because the Supabase connection string is still a placeholder.
- There are no automated test suites yet. Validation has used production builds, syntax checks, diagnostics, and browser checks.
- The first client start attempted to use a different port when 5173 was already occupied; Vite handled this by selecting another local port.
- `npm audit` reports dependency findings in the server install. These need review before production deployment.
- The Settings page does not yet support editing email, username, or password.

## What is left

- Connect a real Supabase project and run `server/db/schema.sql`.
- Test the complete real-mode flow with two accounts, including user-isolation checks.
- Add automated API tests for authentication, validation, rate limiting, and library ownership.
- Add automated frontend tests for demo login, progress errors, ratings, filters, and clear-library confirmation.
- Decide whether to implement password reset and editable profile settings.
- Review and update dependencies reported by `npm audit`.
- Deploy the Express API and frontend, configure production CORS, and verify the deployed end-to-end flow.

## Week of: 2026-09-27

## What changed this week

- Replaced the fixed dashboard date with the viewer's current localized date.
- Removed the nonfunctional Remember Me and Forgot Password controls.
- Removed duplicate Discover navigation and kept Overview as the dashboard route's active navigation item.
- Implemented persistent light/dark appearance switching from Settings using the existing PanelTracker design tokens.
- Matched the dashboard search field to the light wireframe surface and added AniList pagination, empty results, and loading/error feedback.
- Added library title filtering, per-status counts, and a direct Add Title action.
- Added AniList lifecycle mapping for Coming Soon and Releasing, preserving all five reading statuses.
- Kept chapter progress editable for unknown/releasing titles and retained server validation against known totals.
- Added the Dropped dashboard statistic, release dates/origin/AniList link on detail, and updated the design/README/security documentation.
- Applied the status constraint migration to Supabase with `npm run db:schema`.
- Verified the real-mode dashboard date and Overview navigation in the browser, then switched between light/dark themes and confirmed the choice survives reload.
- Added a Releasing AniList title to the Supabase-backed library at chapter 25 with unknown total, verified the stored progress, then removed the test title.

## Why

These changes bring the working application closer to the approved HIFI wireframe, make visible controls functional, and make release lifecycle status distinct from progress entry behavior. Theme selection, filtering, date display, and pagination now have real behavior instead of decorative controls.

## What broke or what I got stuck on

- No automated test suite is configured; verification uses production builds, schema application, diagnostics, and browser/API checks.
- The first Releasing-title progress test exposed a client validation bug where a null AniList chapter total was converted to zero. The null check is fixed, and chapter 25 now saves successfully with an unknown total.
- The Settings page still does not support account profile edits or password reset; those are not required for this increment.

## What is left

- Add automated API/UI tests for dark mode, responsive layout, auth, status options, and progress boundaries.
- Run a two-user isolation test again against the production deployment before publishing.
- Review remaining npm audit findings before deployment.
- Verify GitHub repository settings and production CORS/secrets before publishing.
