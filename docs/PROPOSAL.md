# Final project - proposal


## The idea
PanelTracker is a full‑stack web app that lets manga, manhwa, and manhua fans log their reading progress, organize their library, and discover new titles using metadata from the AniList GraphQL API.

## Why
It solves the problem of scattered or manual tracking (spreadsheets, notes, group chats) by providing a structured, interactive tracker. It also gives me hands‑on experience with React, Express, PostgreSQL, and API integration, which are core skills I want to strengthen for my thesis and future work.

## Scope
In for first version:

 - Authentication with JWT + bcrypt.
 - Dashboard showing progress, stats, and recommendations.
 - Library CRUD with tabs (Reading, Completed, On Hold, Dropped).
 - Series Detail with metadata, progress bar, and update options.
 - Database schema for users, manga, progress.

Deliberately out (for now):
 - Social features (sharing libraries, following users).
 - Payment gateways or premium features.
 - Advanced analytics beyond basic stats.
 - Mobile app version (focus is web only).

## Milestones
- [ ] Week 1 (Sept 23) → Repo setup, frontend in demo mode, mock data replaced with manga sample data, deploy client to GitHub Pages.
- [ ] Week 2 (Sept 27) → PostgreSQL schema + Express API locally, implement auth + CRUD routes, connect client in dev mode.
- [ ] Week 3 (Oct 4) → Deploy API + hosted PostgreSQL (Neon/Railway), flip client to live mode, confirm full stack integration.
- [ ] Beyond Week 3 → Add charts, polish UI, caching for AniList API, optional recommendation features.

## Open questions
 - How much caching is needed for AniList API calls to avoid rate limits?
 - Should I include refresh tokens for JWT or keep it simple with short‑lived tokens?
 - Which charting library (Chart.js, Recharts, etc.) is best for the Dashboard stats?
