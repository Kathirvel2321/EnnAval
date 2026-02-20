const VISIT_KEY = 'love-story-visit-id-v1'
const API_BASE =
  import.meta.env.VITE_API_BASE ||
  (import.meta.env.DEV ? 'http://localhost:8787' : '')

if (import.meta.env.PROD && !API_BASE) {
  // eslint-disable-next-line no-console
  console.warn('VITE_API_BASE is missing. Tracking backend calls will use current origin.')
}
let openTrackedInRuntime = false

const createVisitId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `visit_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
}

const getVisitId = () => {
  if (typeof window === 'undefined') return ''
  const existing = window.sessionStorage.getItem(VISIT_KEY)
  if (existing) return existing
  const created = createVisitId()
  window.sessionStorage.setItem(VISIT_KEY, created)
  return created
}

const resetVisitId = () => {
  if (typeof window === 'undefined') return ''
  const created = createVisitId()
  window.sessionStorage.setItem(VISIT_KEY, created)
  return created
}

const post = async (path, payload) => {
  try {
    const response = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    return response.ok
  } catch {
    return false
  }
}

export const trackSiteOpen = async () => {
  if (openTrackedInRuntime) return true
  openTrackedInRuntime = true
  const visitId = resetVisitId()
  if (!visitId) {
    openTrackedInRuntime = false
    return false
  }
  const ok = await post('/api/view/open', {
    visitId,
    phase: 'entry',
    key: 'website_opened',
    value: 'true',
    extra: { path: typeof window !== 'undefined' ? window.location.pathname : '' },
  })
  if (!ok) openTrackedInRuntime = false
  return ok
}

export const trackChoice = async ({ phase, question, choice, extra = {} }) => {
  const visitId = getVisitId()
  if (!visitId) return false
  return post('/api/view/event', {
    visitId,
    eventType: 'choice',
    phase,
    key: question,
    value: choice,
    extra,
  })
}

export const trackMemoryMessage = async (message) => {
  const visitId = getVisitId()
  if (!visitId || !message?.trim()) return false
  return post('/api/view/message', {
    visitId,
    message: message.trim(),
  })
}

export const trackProgress = async ({ phase = '', completed = false } = {}) => {
  const visitId = getVisitId()
  if (!visitId) return false
  return post('/api/view/progress', {
    visitId,
    phase,
    completed,
  })
}

export const trackSiteClose = ({ phase = 'exit', completed = false } = {}) => {
  const visitId = getVisitId()
  if (!visitId || typeof navigator === 'undefined') return

  const payload = JSON.stringify({
    visitId,
    phase,
    key: 'website_closed',
    value: 'true',
    extra: { completed },
  })
  navigator.sendBeacon(`${API_BASE}/api/view/close`, new Blob([payload], { type: 'application/json' }))
}
