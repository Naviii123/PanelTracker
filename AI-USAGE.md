# AI Usage

This project was built with substantial assistance from GitHub Copilot. I reviewed and adapted the generated code, corrected errors, and verified changes with builds, diagnostics, and browser checks. This log has been maintained across project milestones; links point to the commits containing the related work.

## 1. How I used AI

### 2026-09-23 - Full-stack application scaffold

- **Tool:** GitHub Copilot
- **What I asked for:** Build the PanelTracker React, Express, PostgreSQL, authentication, and Jikan foundation.
- **What it gave back:** A first implementation of the client routes, server API, PostgreSQL schema, Jikan service, authentication, and environment templates.
- **What I kept, what I changed, and why:** I kept the overall Express-to-PostgreSQL architecture and changed the starter sightings schema and UI into the required PanelTracker domain.
- **Commit:** [8f8abaf](https://github.com/Naviii123/PanelTracker/commit/8f8abaf)

### 2026-09-23 - UI refactor and wireframe styling

- **Tool:** GitHub Copilot
- **What I asked for:** Use the supplied wireframe and make the code more organized and readable.
- **What it gave back:** A split page/component structure, shared UI components, responsive CSS, and a redesigned authentication layout.
- **What I kept, what I changed, and why:** I kept the route behavior and replaced the monolithic `App.jsx` and compressed stylesheet with maintainable page/component files.
- **Commit:** [8f8abaf](https://github.com/Naviii123/PanelTracker/commit/8f8abaf)

### 2026-09-23 - Uploaded authentication artwork

- **Tool:** GitHub Copilot
- **What I asked for:** Use the uploaded manga collage on sign-in and registration pages and organize the asset folders.
- **What it gave back:** A background-image treatment and a `public/assets/images` folder.
- **What I kept, what I changed, and why:** I moved the image to `client/public/assets/images/auth-manga-collage.png`, kept fallback artwork in `placeholders`, and documented the distinction.
- **Commit:** [8f8abaf](https://github.com/Naviii123/PanelTracker/commit/8f8abaf)

### 2026-09-23 - Demo mode troubleshooting

- **Tool:** GitHub Copilot
- **What I asked for:** Explain why demo login/register did not work.
- **What it gave back:** The diagnosis that `.env.example` is only a template and that the local `client/.env` needed `VITE_DEMO_MODE=true`.
- **What I kept, what I changed, and why:** I created the ignored local environment file and rebuilt the client to verify the demo configuration.
- **Commit:** [8f8abaf](https://github.com/Naviii123/PanelTracker/commit/8f8abaf)

### 2026-09-23 - Progress and rating validation

- **Tool:** GitHub Copilot
- **What I asked for:** Reject typed chapter values above the known total and add missing settings/progress features.
- **What it gave back:** Shared chapter-validation helpers, backend total checks, visible frontend errors, bounded chapter selection, rating checks, and a Settings page.
- **What I kept, what I changed, and why:** I kept the existing API contract and added validation at both UI and server boundaries because an HTML `max` attribute alone is not authoritative.
- **Commit:** [a2fa694](https://github.com/Naviii123/PanelTracker/commit/a2fa694)

### 2026-09-24 - Documentation and security record

- **Tool:** GitHub Copilot
- **What I asked for:** Complete the graded README, security checklist, weekly report, and screenshot documentation.
- **What it gave back:** A full setup/usage/API README, `SECURITY-CHECKLIST.md`, `REPORT.md`, and a running login screenshot.
- **What I kept, what I changed, and why:** I documented actual behavior and called out unfinished real-database testing, missing automated tests, and dependency audit findings instead of claiming the project was production-complete.
- **Commit:** [8f8abaf](https://github.com/Naviii123/PanelTracker/commit/8f8abaf)

### 2026-09-27 - HIFI interaction and release-state pass

- **Tool:** GitHub Copilot
- **What I asked for:** Finish the dynamic date, remove inactive login options and duplicate navigation, implement persisted light/dark appearance, add Coming Soon/Releasing states, and improve chapter entry and wireframe controls.
- **What it gave back:** A persistent theme provider, dynamic date, library search/count filters, AniList release-state mapping, expanded PostgreSQL status validation, and progress/status presentation improvements.
- **What I kept, what I changed, and why:** I kept the established pages and API/database architecture. A browser test exposed that JavaScript converted a null chapter total to zero; I corrected the null handling and verified chapter 25 saves for a Releasing title with an unknown total.
- **Commit:** [a2fa694](https://github.com/Naviii123/PanelTracker/commit/a2fa694)

### 2026-09-29 - Detail sections and mobile navigation

- **Tool:** GitHub Copilot
- **What I asked for:** Add AniList characters, staff, and related recommendations to the existing detail page, plus improve small-screen navigation and layout without replacing the desktop UI.
- **What it gave back:** Extended the existing AniList GraphQL service and normalized data, added image/empty-data fallbacks, and added a responsive bottom navigation with compact mobile detail sections.
- **What I kept, what I changed, and why:** I kept the existing API service, routes, Supabase library, and desktop shell. No character/staff database tables or new dependencies were introduced.
- **Commit:** [4874ba4](https://github.com/Naviii123/PanelTracker/commit/4874ba4)

### 2026-09-30 - Week 2.5 responsive and content preferences

- **Tool:** GitHub Copilot
- **What I asked for:** Polish tablet/mobile navigation and progress alignment, add useful settings including optional AniList adult filtering, and reduce excessive gradient treatment.
- **What it gave back:** A tablet bottom navigation breakpoint, focused mobile Search action, grid-based progress controls, System/accent settings, and an AniList `isAdult` filtering path.
- **What I kept, what I changed, and why:** I preserved the current pages, desktop sidebar, and API architecture. A live AniList query showed `isAdult: true` filters to adult-only results, so I changed the implementation to request `isAdult` and filter returned entries locally according to the preference; live search tests confirmed OFF excludes marked entries while ON retains both regular and marked results.
- **Commit:** [ce2049d](https://github.com/Naviii123/PanelTracker/commit/ce2049d) and [2d971eb](https://github.com/Naviii123/PanelTracker/commit/2d971eb)

### 2026-10-03 - Clear stale detail-page feedback

- **Tool:** GitHub Copilot
- **What I asked for:** Fix the success message from a previously saved title remaining visible after opening a different manga.
- **What it gave back:** A reset of the detail page's success message and progress error whenever the manga ID changes.
- **What I kept, what I changed, and why:** I kept the route-driven loading behavior and cleared only feedback tied to the previous title. The client production build passed.
- **Commit:** [fc988cb](https://github.com/Naviii123/PanelTracker/commit/fc988cb)

## 2. Where the AI got it wrong

### Case 1 - Jikan package version

- **What it gave me:** An initial dependency version for `@tutkli/jikan-ts`.
- **What was wrong with it:** That version did not exist in the npm registry.
- **What I did instead:** I checked the published package version, updated the dependency, installed the required `ky` runtime dependency, and verified the service import.
- **Commit:** [8f8abaf](https://github.com/Naviii123/PanelTracker/commit/8f8abaf)

### Case 2 - Demo mode assumption

- **What it gave me:** A demo adapter that supported demo login, but the running client had no local `.env` file.
- **What was wrong with it:** Without `VITE_DEMO_MODE=true`, the browser called the real API, so the demo appeared broken.
- **What I did instead:** I created `client/.env`, documented the distinction between `.env` and `.env.example`, and rebuilt the client.
- **Commit:** [8f8abaf](https://github.com/Naviii123/PanelTracker/commit/8f8abaf)

### Case 3 - Chapter max validation

- **What it gave me:** A numeric input with an HTML `max` attribute.
- **What was wrong with it:** A user can still type a value above `max`, and the browser attribute does not protect the API or local demo storage.
- **What I did instead:** I added shared frontend validation, demo validation, backend validation against stored manga metadata, and visible error messages.
- **Commit:** [a2fa694](https://github.com/Naviii123/PanelTracker/commit/a2fa694)

### Case 4 - Null chapter count interpreted as zero

- **What it gave me:** A chapter validator that converted `manga.chapters` to a number before checking whether a total was known.
- **What was wrong with it:** AniList returns `null` when the total is unknown, and `Number(null)` is `0`, which blocked valid manual progress for Releasing titles.
- **What I did instead:** I check for null before numeric validation and verified chapter 25 could be saved with Releasing status and an unknown total.
- **Commit:** [a2fa694](https://github.com/Naviii123/PanelTracker/commit/a2fa694)

## 3. Who wrote what

### My contributions

I set the product direction for PanelTracker as a manga, manhwa, and manhua progress tracker, supplied the HIFI wireframes and visual direction, and made the final decisions about the app's workflow and scope. I tested the application against those decisions, caught incorrect behavior in generated code, and chose the fixes below. Much of the implementation was AI-assisted; the examples here describe the specific logic I corrected and verified rather than claiming I wrote entire files alone.

- **File:** `client/src/utils/progress.js`
- **Commit:** [8f8abaf](https://github.com/Naviii123/PanelTracker/commit/8f8abaf)
- **What I corrected and why:** The first chapter validator treated a missing AniList chapter total as zero because `Number(null)` is `0`. I corrected the total handling so missing totals stay unknown (`null`), and the maximum is enforced only when a real total is available. This lets readers record progress for Releasing titles whose total chapter count has not been reported.

- **File:** `server/anilistService.js`
- **Commit:** [ce2049d](https://github.com/Naviii123/PanelTracker/commit/ce2049d)
- **What I corrected and why:** AniList's `isAdult: true` query argument returns only adult-marked results; it does not mean “include adult results alongside regular results.” I changed the approach to request the `isAdult` field and filter results in the service according to the user's setting. That allows the default-off setting to exclude marked entries while enabling it keeps both regular and marked titles available. I verified the behavior with live search results.

### AI-assisted code I understand best

- **File:** `server/anilistService.js`
- **Commit:** [8f8abaf](https://github.com/Naviii123/PanelTracker/commit/8f8abaf), extended in [4874ba4](https://github.com/Naviii123/PanelTracker/commit/4874ba4)
- **What it does and why it is built this way:** This module sends GraphQL requests to AniList and normalizes the returned media data into the shape used by the app. Keeping AniList-specific query and mapping logic here means the Express routes can use app-shaped manga data without duplicating provider details. I understand the real app path as React -> Express -> PostgreSQL/AniList GraphQL; demo mode is a separate localStorage fallback, not production authentication.
