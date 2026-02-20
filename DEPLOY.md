# Deployment Guide (Vercel + Backend)

## Recommended Setup
- Frontend: Vercel
- Backend: Render (or Railway)
- DB: Supabase (PostgreSQL)

## 1) Deploy Backend (Render)
1. Push this project to GitHub.
2. Create a new Render Web Service from the repo.
3. Use:
   - Build Command: `npm install`
   - Start Command: `npm run server`
4. Add env vars:
   - `PORT=10000` (or Render default)
   - `ADMIN_BASE_URL=https://<your-backend-domain>`
   - `LOCAL_TZ=Asia/Kolkata`
   - `FRONTEND_ORIGIN=https://<your-vercel-domain>`
   - `SUPABASE_URL=https://<your-project>.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY=<service-role-key>`
   - `SUPABASE_TABLE=story_visits`
   - `BREVO_API_KEY`, `BREVO_SENDER_EMAIL`, `BREVO_SENDER_NAME`, `ADMIN_EMAIL`

After deploy:
- Admin URL: `https://<your-backend-domain>/admin`
- Health URL: `https://<your-backend-domain>/api/health`

## 2) Deploy Frontend (Vercel)
1. Import same repo in Vercel.
2. Add env var:
   - `VITE_API_BASE=https://<your-backend-domain>`
3. Deploy.

## 3) Verify
1. Open Vercel site.
2. Open backend admin page.
3. Confirm visits/events/messages are logged.
4. Confirm email arrives on site open.

## Supabase Table SQL
Run this once in Supabase SQL editor:

```sql
create table if not exists public.story_visits (
  id bigserial primary key,
  visit_id text not null unique,
  opened_at_local text not null,
  opened_at_utc text not null,
  closed_at_local text,
  closed_at_utc text,
  closed_phase text default '',
  completed integer not null default 0,
  last_phase text default '',
  status text not null default 'open',
  final_message text default '',
  events_json jsonb not null default '[]'::jsonb,
  user_agent text,
  ip_address text,
  referrer text
);

create index if not exists idx_story_visits_opened_at_utc on public.story_visits (opened_at_utc);
```

## Notes
- If `VITE_API_BASE` is missing in production, tracking API calls fail.
- Create `story_visits` table in Supabase before first run.
