# AI Usage

This project was built with AI assistance from GitHub Copilot. I reviewed the generated code, selected the parts that fit the project, corrected errors, and verified changes with builds, diagnostics, and browser checks.

The repository currently has one initial commit and the latest work is still uncommitted. The commit field is therefore marked honestly instead of using invented links. After committing each milestone, replace `pending commit` with the real GitHub commit URL.

## 1. How I used AI

### 2026-09-23 - Full-stack application scaffold

- **Tool:** GitHub Copilot
- **What I asked for:** Build the PanelTracker React, Express, PostgreSQL, authentication, and Jikan foundation.
- **What it gave back:** A first implementation of the client routes, server API, PostgreSQL schema, Jikan service, authentication, and environment templates.
- **What I kept, what I changed, and why:** I kept the overall Express-to-PostgreSQL architecture and changed the starter sightings schema and UI into the required PanelTracker domain.
- **Commit:** pending commit

### 2026-09-23 - UI refactor and wireframe styling

- **Tool:** GitHub Copilot
- **What I asked for:** Use the supplied wireframe and make the code more organized and readable.
- **What it gave back:** A split page/component structure, shared UI components, responsive CSS, and a redesigned authentication layout.
- **What I kept, what I changed, and why:** I kept the route behavior and replaced the monolithic `App.jsx` and compressed stylesheet with maintainable page/component files.
- **Commit:** pending commit

### 2026-09-23 - Uploaded authentication artwork

- **Tool:** GitHub Copilot
- **What I asked for:** Use the uploaded manga collage on sign-in and registration pages and organize the asset folders.
- **What it gave back:** A background-image treatment and a `public/assets/images` folder.
- **What I kept, what I changed, and why:** I moved the image to `client/public/assets/images/auth-manga-collage.png`, kept fallback artwork in `placeholders`, and documented the distinction.
- **Commit:** pending commit

### 2026-09-23 - Demo mode troubleshooting

- **Tool:** GitHub Copilot
- **What I asked for:** Explain why demo login/register did not work.
- **What it gave back:** The diagnosis that `.env.example` is only a template and that the local `client/.env` needed `VITE_DEMO_MODE=true`.
- **What I kept, what I changed, and why:** I created the ignored local environment file and rebuilt the client to verify the demo configuration.
- **Commit:** pending commit

### 2026-09-23 - Progress and rating validation

- **Tool:** GitHub Copilot
- **What I asked for:** Reject typed chapter values above the known total and add missing settings/progress features.
- **What it gave back:** Shared chapter-validation helpers, backend total checks, visible frontend errors, bounded chapter selection, rating checks, and a Settings page.
- **What I kept, what I changed, and why:** I kept the existing API contract and added validation at both UI and server boundaries because an HTML `max` attribute alone is not authoritative.
- **Commit:** pending commit

### 2026-09-24 - Documentation and security record

- **Tool:** GitHub Copilot
- **What I asked for:** Complete the graded README, security checklist, weekly report, and screenshot documentation.
- **What it gave back:** A full setup/usage/API README, `SECURITY-CHECKLIST.md`, `REPORT.md`, and a running login screenshot.
- **What I kept, what I changed, and why:** I documented actual behavior and called out unfinished real-database testing, missing automated tests, and dependency audit findings instead of claiming the project was production-complete.
- **Commit:** pending commit

## 2. Where the AI got it wrong

### Case 1 - Jikan package version

- **What it gave me:** An initial dependency version for `@tutkli/jikan-ts`.
- **What was wrong with it:** That version did not exist in the npm registry.
- **What I did instead:** I checked the published package version, updated the dependency, installed the required `ky` runtime dependency, and verified the service import.
- **Commit:** pending commit

### Case 2 - Demo mode assumption

- **What it gave me:** A demo adapter that supported demo login, but the running client had no local `.env` file.
- **What was wrong with it:** Without `VITE_DEMO_MODE=true`, the browser called the real API, so the demo appeared broken.
- **What I did instead:** I created `client/.env`, documented the distinction between `.env` and `.env.example`, and rebuilt the client.
- **Commit:** pending commit

### Case 3 - Chapter max validation

- **What it gave me:** A numeric input with an HTML `max` attribute.
- **What was wrong with it:** A user can still type a value above `max`, and the browser attribute does not protect the API or local demo storage.
- **What I did instead:** I added shared frontend validation, demo validation, backend validation against stored manga metadata, and visible error messages.
- **Commit:** pending commit

## 3. Who wrote what

### Written by me

I reviewed the requirements, supplied the wireframe and design system, selected the final UI direction, checked the local application in the browser, and made decisions about demo mode, Supabase setup, asset organization, and the project’s known limitations. I also need to replace the pending commit markers with real links after committing the milestones.

### The AI-assisted parts I understand best

- `client/src/pages/`: React pages for auth, dashboard, library, series detail, and settings.
- `client/src/utils/progress.js`: shared rules for known and unknown chapter totals.
- `server/server.js`: Express authentication, protected routes, validation, and user-scoped queries.
- `server/db/schema.sql`: PostgreSQL tables and constraints for accounts, manga, progress, and refresh tokens.
- `server/jikanService.js`: the boundary between Express and the Jikan API.

I understand that the real application path is React -> Express -> PostgreSQL/Jikan, while demo mode is an explicitly selected localStorage fallback and must not be treated as production authentication.
