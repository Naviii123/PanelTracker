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
- Added AniList-backed Characters, Staff, and related Recommendations sections to Series Detail with missing-image and empty-data fallbacks.
- Added compact mobile bottom navigation and responsive horizontal character/recommendation rows while preserving desktop sidebar navigation.
- Verified the authenticated Express detail endpoint returns character, staff-role, and recommendation data, then removed the temporary test account.
- Added a default-off Show Adult Content preference based on AniList `isAdult`, threaded through search and recommendations without altering saved library records.
- Added System theme and persistent Indigo/Teal/Rose accent choices in Settings.
- Made tablet portrait use the labeled compact bottom navigation, made Search focus its field, aligned progress controls with responsive grids, and reduced the auth gradient intensity.
- Added a default-off AniList adult-content preference to Settings and applied it to AniList search, dashboard recommendations, and series-related recommendations without changing saved library rows.
- Added System theme support and persistent indigo/teal/rose accent selection.
- Verified AniList's actual filter behavior: OFF excludes adult-marked results; ON includes regular and adult-marked entries. Documented AniList's accuracy and Ecchi limitations.

## Week of: 2026-09-30

## What changed this week

- Added responsive bottom navigation for tablet portrait as well as mobile while keeping the desktop sidebar.
- Made the mobile Search item focus the dashboard search field so it has a distinct action from Overview.
- Improved progress form grid alignment for desktop/tablet/mobile layouts.
- Replaced AniList's exact `isAdult` query filter with local filtering on returned `isAdult` values, because `isAdult: true` returns adult-only entries rather than including adults in regular results.
- Added System theme and accent selections plus the documented adult-content preference.

## Why

This increment targets tablet/mobile usability and settings customization, keeping the existing PanelTracker layout and AniList/Express/PostgreSQL architecture intact.

## What broke or what I got stuck on

- AniList's boolean `isAdult` argument is an exact filter; using `true` alone returned adult-only results. The integration now requests the field and filters results locally to implement the intended include/exclude behavior.
- The browser automation runtime enforces a minimum viewport wider than some requested mobile widths. CSS builds and browser checks ran, but exact 375px/390px validation should also be repeated in a physical or emulator viewport.
- There is no automated test suite yet.

## What is left

- Add automated tests for user preferences, query filtering, responsive breakpoints, and library isolation.
- Confirm the adult-content preference across additional AniList titles, especially entries with missing classification data.
- Review dependency audit findings and production deployment settings before publishing.

## Why

These changes bring the working application closer to the approved HIFI wireframe, make visible controls functional, and make release lifecycle status distinct from progress entry behavior. Theme selection, filtering, date display, and pagination now have real behavior instead of decorative controls.

## What broke or what I got stuck on

- No automated test suite is configured; verification uses production builds, schema application, diagnostics, and browser/API checks.
- The first Releasing-title progress test exposed a client validation bug where a null AniList chapter total was converted to zero. The null check is fixed, and chapter 25 now saves successfully with an unknown total.
- The API was stopped during the first protected detail-endpoint probe; starting the existing server fixed the test, and the route then returned the new AniList sections successfully.
- The Settings page still does not support account profile edits or password reset; those are not required for this increment.

## What is left

- Add automated API/UI tests for dark mode, responsive layout, auth, status options, and progress boundaries.
- Test character, staff, and recommendation empty states across multiple AniList titles and narrow mobile widths.
- Run a two-user isolation test again against the production deployment before publishing.
- Review remaining npm audit findings before deployment.
- Verify GitHub repository settings and production CORS/secrets before publishing.
