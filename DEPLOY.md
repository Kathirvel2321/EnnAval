
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
   - `JOB_SECRET=<strong-random-string>`

After deploy:
- Admin URL: `https://<your-backend-domain>/admin`
- Health URL: `https://<your-backend-domain>/api/health`

## 2) Deploy Frontend (Vercel)
1. Import same repo in Vercel.
2. Add env var:
   - `VITE_API_BASE=https://<your-backend-domain>`
   - `VITE_FORMSPREE_OPEN_ENDPOINT=https://formspree.io/f/<your-form-id>`
3. Deploy.

## 2.1) Frontend Formspree Open Alert (Backup)
- This sends a direct open notification from frontend at site-open time.
- It does not replace backend DB tracking; it is only a backup alert.
- Implemented in `src/lib/tracker.js` via `trackSiteOpen()`.

## 2.2) Cron for Guaranteed Backend Email Retry
- Create a cron job (cron-job.org/UptimeRobot/Render Cron):
  - Method: `POST`
  - URL: `https://<your-backend-domain>/api/jobs/send-open-mails`
  - Header: `x-job-secret: <JOB_SECRET>`
  - Body: `{"limit":80}`
  - Frequency: every 1-2 minutes

## 3) Verify
1. Open Vercel site.
2. Open backend admin page.
3. Confirm visits/events/messages are logged.
4. Confirm email arrives on site open.
5. Confirm Formspree receives `website_opened` notification.

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
