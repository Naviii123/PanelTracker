# PanelTracker

[![Made with AI](https://img.shields.io/badge/Made_with-AI_assistance-blue)](AI-USAGE.md)

PanelTracker is a full-stack web application for discovering, organizing, and tracking manga, manhwa, and manhua. It gives readers one private place to search the AniList catalog, save titles, record chapter progress, choose a reading status, add a personal rating, and review collection statistics. The interface follows the supplied PanelTracker HIFI design system, supports persistent light/dark appearance, and distinguishes titles that are Coming Soon or Releasing.

Series details also include AniList-provided characters, staff roles, and related recommendations when that information is available. Mobile users get a compact bottom navigation and responsive detail sections while desktop keeps the sidebar layout.

The application is designed for readers who want a tracking and organization tool rather than an online reading service. It does not host manga chapters or scrape manga websites.

## Setup and installation

### Requirements

Install these before starting:

- Node.js 20 or newer
- npm, included with Node.js
- Git, if cloning the repository
- A Supabase project with PostgreSQL access for the real full-stack mode

Demo mode only requires Node.js and npm. It does not require Supabase, PostgreSQL, or the Express server.

### Get the code

```powershell
git clone https://github.com/Naviii123/PanelTracker
cd PanelTracker
```

### Install dependencies

Install backend dependencies:

```powershell
cd server
npm install
```

Install frontend dependencies in a second terminal:

```powershell
cd client
npm install
```

### Environment configuration

Environment files contain local configuration and must not be committed. The repository includes safe templates named `.env.example`.

Create the backend environment file:

```powershell
cd server
Copy-Item .env.example .env
```

Edit `server/.env`:

```env
DATABASE_URL=postgresql://user:password@host:5432/database
JWT_SECRET=replace_with_a_long_random_secret
JWT_REFRESH_SECRET=replace_with_another_long_random_secret
CORS_ORIGINS=http://localhost:5173
PORT=5000
```

Create the frontend environment file:

```powershell
cd client
Copy-Item .env.example .env
```

For real API mode, edit `client/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_DEMO_MODE=false
```

For demo mode, use:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_DEMO_MODE=true
```

`VITE_` variables are compiled into the browser and are public. Never place `DATABASE_URL`, `JWT_SECRET`, or `JWT_REFRESH_SECRET` in the client environment file.

### Supabase and database setup

1. Create a project at [supabase.com](https://supabase.com).
2. Open **Project Settings > Database**.
3. Open the Supabase **Connect** dialog and choose the **Session Pooler** connection string for the backend. The direct `db.<project-ref>.supabase.co:5432` connection is IPv6-only for many projects and may time out on local networks. The connection string belongs in `server/.env` as `DATABASE_URL`; it is not the same thing as the Supabase project URL.
4. Run the schema from the `server` folder:

```powershell
cd server
npm run db:schema
```

Alternatively, copy the contents of `server/db/schema.sql` into the Supabase SQL editor and run it.

The schema creates these tables:

- `users`: accounts and bcrypt password hashes
- `manga`: shared AniList metadata keyed by `anilist_id`
- `progress`: user-specific chapter, status, and rating records
- `refresh_tokens`: hashed refresh tokens with expiry and revocation fields

There is no required demo seed. Demo data is created in the browser only when `VITE_DEMO_MODE=true`.

## How to run it

### Demo mode

Demo mode is the fastest way to view the interface without a database:

```powershell
cd client
npm run dev
```

Open [http://localhost:5173/login](http://localhost:5173/login). Use any valid-looking email and any password. Registration also accepts demo values. The demo banner identifies the mode, and demo account/library data is stored in that browser's localStorage.

Restart Vite after changing `.env` because Vite reads environment variables when it starts.

### Real full-stack mode

Start the Express API in one terminal:

```powershell
cd server
npm run dev
```

Expected API output:

```text
PanelTracker API listening on port 5000
```

Check that the process is alive:

```powershell
curl http://localhost:5000/healthz
```

Check that PostgreSQL is reachable:

```powershell
curl http://localhost:5000/readyz
```

Then start the client in a second terminal:

```powershell
cd client
npm run dev
```

Open [http://localhost:5173/login](http://localhost:5173/login). In real mode, registration and login use Express, passwords are hashed with bcrypt, and library data is stored in PostgreSQL.

### Production build

```powershell
cd client
npm run build
npm run preview
```

The build is written to `client/dist`. Deploy that static output to a frontend host and deploy `server/` to a Node.js host. Set `VITE_API_BASE_URL` to the deployed API URL including `/api`, set `VITE_DEMO_MODE=false`, and add the deployed frontend origin to the server's `CORS_ORIGINS`.

## Features and usage

### Primary flow

1. Open `/register` and create an account, or use demo mode with any valid-looking values.
2. Sign in at `/login`.
3. Use the dashboard search field to search AniList by title.
4. Open a result at `/manga/:anilistId`.
5. Review the title, cover, synopsis, genres, author, type, chapters, volumes, score, and publishing details.
6. Add the title to the library with a status, current chapter, and optional rating from 1 to 10.
7. Open `/library` to search saved titles and filter by status. Statuses include `Coming Soon`, `Releasing`, `Reading`, `Completed`, `Plan to Read`, `On Hold`, and `Dropped`.
8. Update progress, status, or rating from a library card or the series detail page.
9. Open `/settings` to switch between light and dark appearance, view account/app mode information, clear the current user's library, or log out.
10. Use the dashboard to see tracked-title statistics, currently reading titles, genre counts, and recommendations.

The dashboard date is generated from the current local date. Settings supports Light, Dark, or System appearance, saved Indigo, Teal, or Rose accent colors, and a persistent Large text option. AniList publication states map to `Coming Soon` and `Releasing` when appropriate. When AniList provides a chapter total, the detail form provides a bounded chapter selector and the backend rejects values above that total. When the total is unknown, the app uses a manual non-negative chapter input and displays `Chapter X / ?`; this remains available for Releasing titles. Detail pages display AniList's optional banner image on desktop when available; the existing layout remains the fallback and banners are hidden on smaller screens.

On the series detail page, Characters and Staff use live AniList data and show an image fallback or a short empty state when data is missing. Related recommendations link to their own series detail pages. On mobile, character and recommendation sections can be swiped horizontally; staff and library rows adapt to the screen width.

### Adult-content preference

Settings includes **Show Adult Content**, off by default. PanelTracker requests AniList's `isAdult` field and excludes entries marked adult from search and automatically fetched recommendations while the preference is off. Enabling it allows those marked entries alongside other results. Existing saved library records are not deleted or changed when this preference changes. AniList's classification is not guaranteed to catch every adult or inappropriate entry; Ecchi entries are not classified as adult by AniList. This setting is a content preference, not complete NSFW protection.

### Main REST API

All application endpoints use the `/api` prefix. Protected endpoints require an access token in the `Authorization: Bearer <token>` header.

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Validate and create a user, hash the password, and issue tokens |
| `POST` | `/api/auth/login` | Authenticate by email/password and issue tokens |
| `POST` | `/api/auth/refresh` | Rotate a valid refresh token and issue a new access token |
| `POST` | `/api/auth/logout` | Revoke a stored refresh-token hash |
| `GET` | `/api/auth/me` | Return the authenticated user |
| `GET` | `/api/dashboard` | Return user statistics, tracking rows, genres, and recommendations |
| `GET` | `/api/library` | Return only the authenticated user's library |
| `GET` | `/api/library/:anilistId` | Return one library record belonging to the authenticated user |
| `POST` | `/api/library` | Add or update a manga and its progress |
| `PUT` | `/api/library/:anilistId` | Update chapter, status, or rating with ownership and total checks |
| `DELETE` | `/api/library/:anilistId` | Remove one title from the authenticated user's library |
| `DELETE` | `/api/library` | Clear all progress for the authenticated user only |
| `GET` | `/api/manga/search?q=...` | Search AniList through the Express GraphQL service |
| `GET` | `/api/manga/:anilistId` | Retrieve full manga details through Express/AniList |
| `GET` | `/api/manga/:anilistId/recommendations` | Retrieve popular AniList manga as recommendations |

Authentication routes use stricter rate limiting. Express-validator handles request validation, SQL uses parameters, and server errors return safe messages instead of stack traces.

## Project structure

```text
PanelTracker/
├── client/
│   ├── public/assets/
│   │   ├── images/          Auth artwork and reusable images
│   │   ├── logo/            PanelTracker logo placeholder
│   │   └── placeholders/    Fallback manga-cover artwork
│   ├── src/
│   │   ├── api/             Real API client and demo adapter logic
│   │   ├── components/      App shell, shared UI, and demo notice
│   │   ├── pages/           Auth, dashboard, library, detail, and settings
│   │   ├── utils/           Progress validation helpers
│   │   ├── App.jsx          Route composition
│   │   └── styles.css       Shared design system and responsive layout
│   ├── .env.example
│   └── package.json
├── server/
│   ├── db/                 PostgreSQL pool, schema, and runner
│   ├── anilistService.js    AniList GraphQL client and metadata mapping
│   ├── server.js           Express routes, auth, validation, and errors
│   ├── .env.example
│   └── package.json
├── docs/
│   ├── assets/             Documentation screenshots
│   ├── 03-design-system.md
│   ├── 06-security-and-privacy.md
│   └── REPORT.md
├── AI-USAGE.md
├── SECURITY-CHECKLIST.md
└── README.md
```

## Screenshots

The screenshot below shows the current sign-in screen, captured in demo mode:

![Current PanelTracker sign-in screen](docs/assets/paneltracker-login.png)

The visual direction follows the supplied PanelTracker design system: `#6366F1` primary actions, `#0F172A` ink, `#475569` muted text, `#F8FAFC` surfaces, `#E2E8F0` borders, Inter typography, and 8px spacing increments.

## Known issues and next steps

- The real Supabase flow cannot be fully exercised until a user supplies a valid local `DATABASE_URL` and runs the schema.
- There are no automated frontend or backend test suites yet; verification currently uses production builds, syntax checks, and manual browser flows.
- The Settings page is intentionally limited to account display, app-mode information, library clearing, and logout. Profile editing and password reset are future work.
- Search currently focuses on title text. Type and genre filters can be added later through AniList query variables.
- Recommendations use a simple AniList popularity fallback rather than personalized ranking.
- Demo mode is intentionally local to one browser and is not a substitute for production authentication or Supabase storage.

## AI use

I set the project direction and feature requirements, supplied the wireframes, and made the final product and behavior decisions. GitHub Copilot was used extensively for implementation, debugging, documentation, and UI polish; I reviewed, tested, and adapted its suggestions. See [AI-USAGE.md](AI-USAGE.md) for the detailed record.

## License

See [LICENSE](LICENSE).
