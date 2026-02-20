import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { createClient } from '@supabase/supabase-js'

dotenv.config()

const app = express()
const PORT = Number(process.env.PORT || 8787)
const ADMIN_BASE_URL = process.env.ADMIN_BASE_URL || `http://localhost:${PORT}`
const LOCAL_TZ = process.env.LOCAL_TZ || 'Asia/Kolkata'
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || ''
const SUPABASE_URL = process.env.SUPABASE_URL || ''
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const SUPABASE_TABLE = process.env.SUPABASE_TABLE || 'story_visits'

const BREVO_API_KEY = process.env.BREVO_API_KEY || ''
const BREVO_SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || process.env.MAIL_FROM || ''
const BREVO_SENDER_NAME = process.env.BREVO_SENDER_NAME || 'Love Story'

const allowedOrigins = FRONTEND_ORIGIN.split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

app.set('trust proxy', true)
app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true)
      if (allowedOrigins.length === 0) return callback(null, true)
      if (allowedOrigins.includes(origin)) return callback(null, true)
      return callback(new Error('CORS blocked for origin'))
    },
    credentials: true,
  }),
)
app.use(express.json({ limit: '1mb' }))

const supabaseReady = Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY)
const supabase = supabaseReady
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  : null

let emailState = {
  enabled: Boolean(BREVO_API_KEY && BREVO_SENDER_EMAIL),
  ok: Boolean(BREVO_API_KEY && BREVO_SENDER_EMAIL),
  error: '',
}

const formatLocal = (date) => {
  const d = date instanceof Date ? date : new Date(date)
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: LOCAL_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).format(d)
}

const nowStamps = () => {
  const now = new Date()
  return {
    utc: now.toISOString(),
    local: formatLocal(now),
  }
}

const getClientIp = (req) => {
  const forwarded = req.headers['x-forwarded-for']
  if (typeof forwarded === 'string' && forwarded.length > 0) return forwarded.split(',')[0].trim()
  return req.socket?.remoteAddress || ''
}

const parseEvents = (value) => {
  if (Array.isArray(value)) return value
  if (!value) return []
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const requireSupabase = (res) => {
  if (supabaseReady && supabase) return true
  res.status(500).json({ ok: false, error: 'supabase_not_configured' })
  return false
}

const getVisitById = async (visitId) => {
  const { data, error } = await supabase.from(SUPABASE_TABLE).select('*').eq('visit_id', visitId).maybeSingle()
  if (error) throw error
  return data
}

const updateVisit = async (visitId, patch) => {
  const { error } = await supabase.from(SUPABASE_TABLE).update(patch).eq('visit_id', visitId)
  if (error) throw error
}

const notifyOpen = async (visitId) => {
  const to = process.env.ADMIN_EMAIL
  if (!BREVO_API_KEY || !BREVO_SENDER_EMAIL || !to) return

  const adminUrl = `${ADMIN_BASE_URL.replace(/\/$/, '')}/admin`
  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: { email: BREVO_SENDER_EMAIL, name: BREVO_SENDER_NAME },
      to: [{ email: to }],
      subject: 'Love website opened',
      textContent: `Your website has been opened.\nVisit: ${visitId}\nTap to see all stored data: ${adminUrl}`,
    }),
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`Brevo API failed: ${response.status} ${body}`)
  }
}

const ensureVisitExists = async (visitId, req, { notifyIfCreated = false } = {}) => {
  const existing = await getVisitById(visitId)
  if (existing) return { created: false, row: existing }

  const stamp = nowStamps()
  const ua = req.headers['user-agent'] || ''
  const ip = getClientIp(req)
  const referrer = req.headers.referer || ''

  const baseRow = {
    visit_id: visitId,
    opened_at_local: stamp.local,
    opened_at_utc: stamp.utc,
    closed_at_local: null,
    closed_at_utc: null,
    closed_phase: '',
    completed: 0,
    last_phase: '',
    status: 'open',
    final_message: '',
    events_json: [],
    user_agent: ua,
    ip_address: ip,
    referrer,
  }

  const { data, error } = await supabase.from(SUPABASE_TABLE).insert(baseRow).select('*').single()
  if (error) {
    if (String(error.message || '').toLowerCase().includes('duplicate') || String(error.message || '').includes('23505')) {
      const row = await getVisitById(visitId)
      return { created: false, row }
    }
    throw error
  }

  if (notifyIfCreated) {
    notifyOpen(visitId).catch((mailError) => {
      emailState = { ...emailState, ok: false, error: mailError.message || 'brevo_failed' }
      console.error('Email notify failed:', mailError.message)
    })
  }

  return { created: true, row: data }
}

const appendEvent = async ({ visitId, phase, key, value, eventType = 'choice', extra = {} }) => {
  const row = await getVisitById(visitId)
  if (!row) return false

  const events = parseEvents(row.events_json)
  const stamp = nowStamps()
  events.push({
    type: eventType,
    phase: String(phase || ''),
    key: String(key || ''),
    value: String(value || ''),
    extra,
    time_local: stamp.local,
    time_utc: stamp.utc,
  })

  await updateVisit(visitId, { events_json: events })
  return true
}

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    tz: LOCAL_TZ,
    admin: `${ADMIN_BASE_URL.replace(/\/$/, '')}/admin`,
    supabase: supabaseReady,
  })
})

app.get('/api/admin/mail-status', (_req, res) => {
  res.json({ ok: true, email: emailState })
})

app.post('/api/view/open', async (req, res) => {
  try {
    if (!requireSupabase(res)) return
    const visitId = String(req.body?.visitId || '').trim()
    if (!visitId) return res.status(400).json({ ok: false, error: 'visitId is required' })

    await ensureVisitExists(visitId, req, { notifyIfCreated: true })
    await appendEvent({
      visitId,
      eventType: 'open',
      phase: req.body?.phase || 'entry',
      key: req.body?.key || 'website_opened',
      value: req.body?.value || 'true',
      extra: req.body?.extra || {},
    })
    await updateVisit(visitId, { last_phase: String(req.body?.phase || 'entry') })

    return res.json({ ok: true, visitId })
  } catch (error) {
    console.error('/api/view/open error:', error)
    return res.status(500).json({ ok: false, error: 'internal_error' })
  }
})

app.post('/api/view/event', async (req, res) => {
  try {
    if (!requireSupabase(res)) return
    const visitId = String(req.body?.visitId || '').trim()
    if (!visitId) return res.status(400).json({ ok: false, error: 'visitId is required' })

    await ensureVisitExists(visitId, req)
    const updated = await appendEvent({
      visitId,
      eventType: req.body?.eventType || 'choice',
      phase: req.body?.phase || '',
      key: req.body?.key || '',
      value: req.body?.value || '',
      extra: req.body?.extra || {},
    })

    if (!updated) return res.status(404).json({ ok: false, error: 'visit_not_found' })
    return res.json({ ok: true })
  } catch (error) {
    console.error('/api/view/event error:', error)
    return res.status(500).json({ ok: false, error: 'internal_error' })
  }
})

app.post('/api/view/message', async (req, res) => {
  try {
    if (!requireSupabase(res)) return
    const visitId = String(req.body?.visitId || '').trim()
    const message = String(req.body?.message || '').trim()
    if (!visitId || !message) {
      return res.status(400).json({ ok: false, error: 'visitId and message are required' })
    }

    await ensureVisitExists(visitId, req)
    const row = await getVisitById(visitId)
    const stamp = nowStamps()
    const current = String(row?.final_message || '').trim()
    const nextMessage = current ? `${current}\n\n[${stamp.local}] ${message}` : message

    await updateVisit(visitId, { final_message: nextMessage })
    await appendEvent({
      visitId,
      eventType: 'message',
      phase: 'ending',
      key: 'memory_message',
      value: 'submitted',
      extra: { length: message.length },
    })

    return res.json({ ok: true })
  } catch (error) {
    console.error('/api/view/message error:', error)
    return res.status(500).json({ ok: false, error: 'internal_error' })
  }
})

app.post('/api/view/progress', async (req, res) => {
  try {
    if (!requireSupabase(res)) return
    const visitId = String(req.body?.visitId || '').trim()
    if (!visitId) return res.status(400).json({ ok: false, error: 'visitId is required' })
    await ensureVisitExists(visitId, req)

    const phase = String(req.body?.phase || '')
    const completed = req.body?.completed ? 1 : 0
    const row = await getVisitById(visitId)
    const currentCompleted = Number(row?.completed || 0)
    await updateVisit(visitId, {
      last_phase: phase,
      completed: Math.max(currentCompleted, completed),
    })

    return res.json({ ok: true })
  } catch (error) {
    console.error('/api/view/progress error:', error)
    return res.status(500).json({ ok: false, error: 'internal_error' })
  }
})

app.post('/api/view/close', async (req, res) => {
  try {
    if (!requireSupabase(res)) return
    const visitId = String(req.body?.visitId || '').trim()
    if (!visitId) return res.status(400).json({ ok: false, error: 'visitId is required' })

    await ensureVisitExists(visitId, req)
    const closedPhase = String(req.body?.phase || 'exit')
    const completed = req.body?.extra?.completed ? 1 : 0
    const stamp = nowStamps()
    const row = await getVisitById(visitId)
    const currentCompleted = Number(row?.completed || 0)

    await updateVisit(visitId, {
      closed_at_local: stamp.local,
      closed_at_utc: stamp.utc,
      closed_phase: closedPhase,
      completed: Math.max(currentCompleted, completed),
      status: 'closed',
    })

    await appendEvent({
      visitId,
      eventType: 'close',
      phase: closedPhase,
      key: req.body?.key || 'website_closed',
      value: req.body?.value || 'true',
      extra: req.body?.extra || {},
    })

    return res.json({ ok: true })
  } catch (error) {
    console.error('/api/view/close error:', error)
    return res.status(500).json({ ok: false, error: 'internal_error' })
  }
})

app.get('/api/admin/data', async (_req, res) => {
  try {
    if (!requireSupabase(res)) return
    const { data, error } = await supabase.from(SUPABASE_TABLE).select('*').order('id', { ascending: false })
    if (error) throw error

    const rows = (data || []).map((row) => {
      const events = parseEvents(row.events_json)
      return {
        ...row,
        event_count: events.length,
        events,
      }
    })

    return res.json({ ok: true, rows })
  } catch (error) {
    console.error('/api/admin/data error:', error)
    return res.status(500).json({ ok: false, error: 'internal_error' })
  }
})

app.delete('/api/admin/visit/:id', async (req, res) => {
  try {
    if (!requireSupabase(res)) return
    const id = Number(req.params.id)
    if (!Number.isFinite(id)) return res.status(400).json({ ok: false, error: 'invalid_id' })
    const { error } = await supabase.from(SUPABASE_TABLE).delete().eq('id', id)
    if (error) throw error
    return res.json({ ok: true })
  } catch (error) {
    console.error('/api/admin/visit/:id delete error:', error)
    return res.status(500).json({ ok: false, error: 'internal_error' })
  }
})

app.delete('/api/admin/visits', async (_req, res) => {
  try {
    if (!requireSupabase(res)) return
    const { error } = await supabase.from(SUPABASE_TABLE).delete().not('id', 'is', null)
    if (error) throw error
    return res.json({ ok: true })
  } catch (error) {
    console.error('/api/admin/visits delete error:', error)
    return res.status(500).json({ ok: false, error: 'internal_error' })
  }
})

app.get('/admin', (_req, res) => {
  res.type('html').send(`<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Love Story Admin</title>
  <style>
    body { margin: 0; font-family: Arial, sans-serif; background: #0b1220; color: #e2e8f0; padding: 20px; }
    h1 { margin: 0 0 8px; }
    .row { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 14px; }
    button { border: 0; border-radius: 10px; padding: 10px 14px; cursor: pointer; font-weight: 600; }
    .primary { background: #38bdf8; color: #082f49; }
    .danger { background: #f87171; color: #450a0a; }
    .card { border: 1px solid #334155; border-radius: 12px; background: #111827; padding: 12px; margin-top: 10px; }
    .muted { color: #94a3b8; margin-bottom: 12px; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; }
    th, td { border-bottom: 1px solid #334155; text-align: left; vertical-align: top; padding: 8px; }
    th { background: #0f172a; position: sticky; top: 0; }
    .scroll { max-height: 70vh; overflow: auto; }
    .small { font-size: 11px; color: #9ca3af; }
    .ok { color: #86efac; }
    details { margin: 0; }
    pre { white-space: pre-wrap; margin: 0; font-size: 11px; }
  </style>
</head>
<body>
  <h1>Love Story Admin</h1>
  <div class="muted">One row = one website open. Timezone: ${LOCAL_TZ}</div>
  <div id="status" class="muted">Loading...</div>
  <div id="smtpStatus" class="muted">Mail status: checking...</div>

  <div class="row">
    <button class="primary" id="refreshBtn">Refresh</button>
    <button class="danger" id="deleteAllBtn">Delete All Visits</button>
  </div>

  <div class="card">
    <div class="scroll">
      <table id="visitsTable"></table>
    </div>
  </div>

  <script>
    const state = { rows: [] };

    const escapeHtml = (value) => String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;');

    const render = () => {
      const table = document.getElementById('visitsTable');
      if (!state.rows.length) {
        table.innerHTML = '<tr><td>No visits yet.</td></tr>';
        return;
      }

      const head = \`
        <tr>
          <th>ID</th>
          <th>Opened (Local)</th>
          <th>Closed (Local)</th>
          <th>Closed Phase</th>
          <th>Last Phase</th>
          <th>Completed</th>
          <th>Status</th>
          <th>Events</th>
          <th>Final Message</th>
          <th>Actions</th>
        </tr>
      \`;

      const body = state.rows.map((row) => {
        const events = Array.isArray(row.events) ? row.events : [];
        const eventsBlock = events.length
          ? '<details><summary>' + events.length + ' events</summary><pre>' + escapeHtml(JSON.stringify(events, null, 2)) + '</pre></details>'
          : '<span class="small">No events</span>';

        const msg = row.final_message
          ? '<pre>' + escapeHtml(row.final_message) + '</pre>'
          : '<span class="small">No message</span>';

        return \`
          <tr>
            <td>\${row.id}<div class="small">\${escapeHtml(row.visit_id)}</div></td>
            <td>\${escapeHtml(row.opened_at_local)}</td>
            <td>\${escapeHtml(row.closed_at_local || 'Still open')}</td>
            <td>\${escapeHtml(row.closed_phase || '-')}</td>
            <td>\${escapeHtml(row.last_phase || '-')}</td>
            <td>\${row.completed ? 'Completed' : 'Not completed'}</td>
            <td>\${escapeHtml(row.status)}</td>
            <td>\${eventsBlock}</td>
            <td>\${msg}</td>
            <td><button class="danger" data-id="\${row.id}">Delete</button></td>
          </tr>
        \`;
      }).join('');

      table.innerHTML = head + body;
      table.querySelectorAll('button[data-id]').forEach((btn) => {
        btn.addEventListener('click', async () => {
          const id = btn.getAttribute('data-id');
          await fetch('/api/admin/visit/' + id, { method: 'DELETE' });
          await load();
        });
      });
    };

    const setStatus = (text, ok = false) => {
      const el = document.getElementById('status');
      el.innerHTML = ok ? '<span class="ok">' + text + '</span>' : text;
    };

    const load = async () => {
      setStatus('Loading...');
      try {
        const mailRes = await fetch('/api/admin/mail-status');
        const mailJson = await mailRes.json();
        if (mailJson.ok) {
          const text = mailJson.email.enabled
            ? mailJson.email.ok
              ? 'Mail status: Brevo ready'
              : 'Mail status: Brevo error - ' + (mailJson.email.error || 'unknown')
            : 'Mail status: disabled (Brevo not configured)';
          document.getElementById('smtpStatus').textContent = text;
        }
        const res = await fetch('/api/admin/data');
        const json = await res.json();
        if (!json.ok) throw new Error('failed');
        state.rows = json.rows || [];
        render();
        setStatus('Loaded successfully.', true);
      } catch {
        setStatus('Failed to load data.');
      }
    };

    document.getElementById('refreshBtn').addEventListener('click', load);
    document.getElementById('deleteAllBtn').addEventListener('click', async () => {
      const yes = confirm('Delete all visits permanently?');
      if (!yes) return;
      await fetch('/api/admin/visits', { method: 'DELETE' });
      await load();
    });

    load();
  </script>
</body>
</html>`)
})

const start = async () => {
  if (!supabaseReady) {
    console.error('Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.')
  }
  if (BREVO_API_KEY && BREVO_SENDER_EMAIL) {
    emailState = { enabled: true, ok: true, error: '' }
    console.log('Brevo API ready: mail notifications enabled.')
  } else {
    emailState = { enabled: false, ok: false, error: 'brevo_not_configured' }
    console.warn('Brevo not configured: mail notifications disabled.')
  }

  app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`)
    console.log(`Admin panel: http://localhost:${PORT}/admin`)
  })
}

start().catch((error) => {
  console.error('Failed to start server:', error)
  process.exit(1)
})
