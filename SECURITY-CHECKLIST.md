# PanelTracker Security Checklist

Completed: 2026-09-24

This checklist records what was checked in the repository. `No` means the item is not yet true or cannot yet be verified; `N/A` includes a reason where the check does not apply.

## Secrets and credentials

| # | Check | Yes / No / N/A | Evidence |
| --- | --- | --- | --- |
| 1 | `.env` is gitignored and is not in the repository | Yes | `.gitignore` ignores `.env` and `.env.*`; `git ls-files` returned no `client/.env` or `server/.env`. |
| 2 | A `.env.example` with placeholder values only is committed | Yes | Root, client, and server `.env.example` files contain placeholders and no real credentials. |
| 3 | No connection string, key, token or password is hardcoded in source, comments or commented-out code | Yes | I removed the server's development JWT fallback secrets; runtime JWT and database values now come from environment variables. |
| 4 | Git history is clean: I searched `git log -p` for password, secret, api key and `postgres://` | Yes | The history search found template placeholders and configuration names, but no real credential value. |
| 5 | Any credential that was ever committed has been rotated | N/A | The history search did not identify a real credential that was ever committed, so there was no credential to rotate. |
| 6 | Production credentials live only in my hosting provider's environment settings | N/A | Production deployment is not configured yet; the real Supabase and JWT values will be added only to the hosting provider when deployed. |

## GitHub Actions

| # | Check | Yes / No / N/A | Evidence |
| --- | --- | --- | --- |
| 7 | No secret value is written literally in any workflow YAML file | Yes | `.github/workflows/deploy-pages.yml` uses public repository variables and contains no database password, JWT secret, or API key. |
| 8 | Secrets are stored in repository Actions secrets and read with `${{ secrets.NAME }}` | N/A | The Pages workflow needs only public `VITE_DEMO_MODE` and `VITE_API_BASE_URL` variables; server secrets are not used by this client-only workflow. |
| 9 | No workflow step echoes, dumps or debug-prints a secret, and I opened a recent run's log to confirm | No | The workflow does not echo secrets, but there is no verified recent production run log available in this workspace. |
| 10 | Uploaded build artifacts contain no `.env`, key file or generated config | Yes | The local `client/dist` build contains the compiled app and assets; no `.env` or key file is tracked or copied by the build script. |
| 11 | Third-party actions are pinned to a commit SHA, not a moveable tag | No | The workflow currently uses version tags such as `actions/checkout@v4` and `actions/setup-node@v4`; SHA pinning remains future work. |
| 12 | Secret scanning and push protection are enabled on the repository | No | Repository security settings cannot be verified from the local workspace and have not been confirmed in GitHub. |

## Database

| # | Check | Yes / No / N/A | Evidence |
| --- | --- | --- | --- |
| 13 | Every query taking user input uses parameters, never string concatenation | Yes | User values in `server/server.js` are passed through PostgreSQL placeholders such as `$1` and `$2`; dynamic SQL is limited to fixed internal select text. |
| 14 | The database is not open to the whole internet, or is reachable only by the app | No | Supabase network restrictions have not been configured or verified yet; this must be checked before publishing. |
| 15 | The database user the app connects as has only the permissions it needs | No | The Supabase database role and its permissions have not yet been reviewed or reduced to a documented least-privilege role. |
| 16 | Seed and sample data is invented, not real people's data | Yes | The project has no required production seed data; demo records are invented localStorage records. |
| 17 | Debug, seed and reset routes are removed before going public | Yes | The Express app exposes health/readiness checks but no debug, seed, or database-reset HTTP routes. |

## Access control

| # | Check | Yes / No / N/A | Evidence |
| --- | --- | --- | --- |
| 18 | The app has an access layer: Cloudflare Zero Trust, an app-level password, or a real login | Yes | The app has registration/login, bcrypt password comparison, JWT access tokens, refresh tokens, and protected routes. |
| 19 | If Supabase or Firebase: Row Level Security or security rules are on, and I tested it signed out | N/A | The app uses Supabase as PostgreSQL behind Express and does not use the Supabase client/API for application access; isolation is enforced in Express queries. |
| 20 | If Zero Trust: tjakoen.s@gmail.com is on the access policy. If an app password: the credentials are in my private workspace `project/README.md` | N/A | The project uses account authentication rather than Zero Trust or a shared app password. |
| 21 | The gate covers every route, including the ones that only change data | Yes | Client protected routes redirect unauthenticated users to `/login`; API library, dashboard, manga, and modification routes use JWT middleware. |
| 22 | The credentials for the gate are environment variables, not in source | Yes | JWT signing secrets are required from `JWT_SECRET` and `JWT_REFRESH_SECRET`; no gate password is hardcoded. |

## Input and output

| # | Check | Yes / No / N/A | Evidence |
| --- | --- | --- | --- |
| 23 | Input from the user is validated on the server, not only in the browser | Yes | `express-validator` validates auth, IDs, statuses, chapters, and ratings; database constraints provide an additional boundary. |
| 24 | User-supplied text is escaped when rendered, so it cannot inject markup or script | Yes | React renders user and AniList text as text nodes and does not use `dangerouslySetInnerHTML`. |
| 25 | Error responses do not expose stack traces, file paths or connection details | Yes | The centralized Express error handler logs details server-side and returns `Unable to complete that request.` to clients. |
| 26 | CORS is not a wildcard on routes that change data | Yes | Express uses the comma-separated `CORS_ORIGINS` allowlist and does not call unrestricted `cors()`. |

## Repository and privacy

| # | Check | Yes / No / N/A | Evidence |
| --- | --- | --- | --- |
| 27 | No student number, personal email, phone number or home address in the repository or in commit messages | No | The initial commit metadata includes the author's name and GitHub noreply address; this should be reviewed before public release. |
| 28 | No classmate's personal data in the repository | Yes | A repository search found no classmate names, phone numbers, home addresses, or personal records in project files. |
| 29 | Dependencies come from official registries, and `node_modules` is gitignored | Yes | Dependencies are declared in `client/package.json` and `server/package.json`; npm installed them and `node_modules/` is ignored. |
| 30 | Images, fonts and other assets are mine, licensed, or credited | No | The uploaded `auth-manga-collage.png` is present, but its licensing/provenance has not yet been recorded in the repository. |
| 31 | Repository visibility is deliberate, and I checked it after my last push | No | Visibility cannot be verified from this workspace; check the GitHub repository settings before publishing. |

## Anything I found and fixed

This checklist caught a real issue: the Express server had fallback JWT secrets in source, which could have allowed a deployment with missing configuration to start with predictable signing keys. I removed those fallbacks so the server exits until real environment values are supplied. It also caught that the Pages workflow used the old `VITE_USE_MOCK_API` name; the workflow now uses the current `VITE_DEMO_MODE` setting.

Before making the repository public, I still need to review Supabase network/role settings, pin GitHub Actions to commit SHAs, confirm GitHub secret scanning, record the uploaded image's license or permission, and decide whether to remove or amend personal commit metadata.
