# Start Here: PanelTracker

PanelTracker is now documented in the root [README.md](README.md).

## Demo mode

```powershell
cd client
Copy-Item .env.example .env
npm install
npm run dev
```

Set `VITE_DEMO_MODE=true` in `client/.env`, then open `http://localhost:5173/login`.

## Real full-stack mode

1. Create `server/.env` from `server/.env.example`.
2. Add your Supabase PostgreSQL connection string and JWT secrets.
3. Run `npm run db:schema` from `server`.
4. Start Express with `npm run dev`.
5. Set `VITE_DEMO_MODE=false` in `client/.env` and start Vite.

See the root README for the complete setup, API, security, documentation, and deployment instructions.
