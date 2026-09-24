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
