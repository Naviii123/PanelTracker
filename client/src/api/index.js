const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
const DEMO = import.meta.env.VITE_DEMO_MODE === 'true'
const key = 'paneltracker-demo'

function demoRead() { return JSON.parse(localStorage.getItem(key) || '{"user":null,"library":[]}') }
function demoWrite(data) { localStorage.setItem(key, JSON.stringify(data)); return data }
const demoManga = (anilistId, title = 'Demo Title') => ({ anilistId, title, coverUrl: '', synopsis: 'A demo record. Connect the Express API for live AniList data.', genres: ['Action', 'Fantasy'], chapters: 100, type: 'Manga', authors: ['PanelTracker'], status: 'Releasing', score: 8.4 })

async function request(path, options = {}) {
  const token = localStorage.getItem('paneltracker-access')
  const response = await fetch(`${BASE}${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers } })
  if (response.status === 401 && localStorage.getItem('paneltracker-refresh')) { const refreshed = await refresh(); if (refreshed) return request(path, options) }
  if (!response.ok) { const body = await response.json().catch(() => ({})); throw new Error(body.error || 'Unable to complete that request.') }
  return response.status === 204 ? null : response.json()
}
async function refresh() { try { const response = await fetch(`${BASE}/auth/refresh`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ refreshToken: localStorage.getItem('paneltracker-refresh') }) }); if (!response.ok) throw new Error(); const data = await response.json(); localStorage.setItem('paneltracker-access', data.accessToken); localStorage.setItem('paneltracker-refresh', data.refreshToken); return true } catch { clearSession(); return false } }
function saveSession(data) { localStorage.setItem('paneltracker-access', data.accessToken || 'demo'); localStorage.setItem('paneltracker-refresh', data.refreshToken || 'demo'); localStorage.setItem('paneltracker-user', JSON.stringify(data.user)); return data.user }
function clearSession() { ['paneltracker-access', 'paneltracker-refresh', 'paneltracker-user'].forEach((item) => localStorage.removeItem(item)) }

export const isDemo = DEMO
export async function login(input) { if (DEMO) { const user = saveSession({ user: { id: 'demo', username: input.email.split('@')[0], email: input.email } }); return user }; return saveSession(await request('/auth/login', { method: 'POST', body: JSON.stringify(input) })) }
export async function register(input) { if (DEMO) { const user = saveSession({ user: { id: 'demo', username: input.username, email: input.email } }); return user }; return saveSession(await request('/auth/register', { method: 'POST', body: JSON.stringify(input) })) }
export async function logout() { if (!DEMO) await request('/auth/logout', { method: 'POST', body: JSON.stringify({ refreshToken: localStorage.getItem('paneltracker-refresh') }) }).catch(() => {}); clearSession() }
export function currentUser() { try { return JSON.parse(localStorage.getItem('paneltracker-user')) } catch { return null } }
export async function searchManga(q, page = 1) { if (DEMO) return { items: [demoManga(1, `${q} Chronicle`), demoManga(2, `${q} Academy`), demoManga(3, `${q} Kingdom`)], pageInfo: { currentPage: page, hasNextPage: false, perPage: 12 } }; return request(`/manga/search?q=${encodeURIComponent(q)}&page=${page}`) }
export async function mangaDetails(id) { if (DEMO) return demoManga(Number(id), 'Demo Chronicle'); return request(`/manga/${id}`) }
export async function getLibrary() { if (DEMO) return demoRead().library; return request('/library') }
export async function getDashboard() { if (DEMO) { const library = demoRead().library; const genreCounts = {}; library.forEach((item) => (item.genres || []).forEach((genre) => { genreCounts[genre] = (genreCounts[genre] || 0) + 1 })); return { stats: { tracked: library.length, Reading: library.filter((x) => x.status === 'Reading').length, Completed: library.filter((x) => x.status === 'Completed').length, 'Plan to Read': library.filter((x) => x.status === 'Plan to Read').length, 'On Hold': library.filter((x) => x.status === 'On Hold').length, Dropped: library.filter((x) => x.status === 'Dropped').length }, tracking: library.filter((x) => x.status === 'Reading'), genres: Object.entries(genreCounts).sort((a, b) => b[1] - a[1]).slice(0, 5), recommendations: [demoManga(4, 'Recommended Horizon'), demoManga(5, 'The Last Panel')] } }; return request('/dashboard') }
export async function addToLibrary(manga, progress = {}) { const item = { ...manga, currentChapter: Number(progress.currentChapter || 0), status: progress.status || 'Plan to Read', rating: progress.rating ? Number(progress.rating) : null, lastUpdated: new Date().toISOString() }; const total = manga?.chapters ?? null; if (total !== null && Number.isFinite(Number(total)) && item.currentChapter > Number(total)) throw new Error(`Chapter cannot exceed the known total of ${total}.`); if (DEMO) { const data = demoRead(); data.library = [...data.library.filter((x) => x.anilistId !== manga.anilistId), item]; demoWrite(data); return item }; return request('/library', { method: 'POST', body: JSON.stringify({ anilistId: manga.anilistId, manga, ...progress }) }) }
export async function updateLibrary(id, progress) { if (DEMO) { const data = demoRead(); const item = data.library.find((x) => x.anilistId === Number(id)); const total = Number(item?.chapters ?? item?.totalChapters); if (Number.isFinite(total) && Number(progress.currentChapter) > total) throw new Error(`Chapter cannot exceed the known total of ${total}.`); Object.assign(item, progress, { lastUpdated: new Date().toISOString() }); demoWrite(data); return item }; return request(`/library/${id}`, { method: 'PUT', body: JSON.stringify(progress) }) }
export async function removeFromLibrary(id) { if (DEMO) { const data = demoRead(); data.library = data.library.filter((x) => x.anilistId !== Number(id)); demoWrite(data); return }; return request(`/library/${id}`, { method: 'DELETE' }) }
export async function clearLibrary() { if (DEMO) { demoWrite({ ...demoRead(), library: [] }); return }; return request('/library', { method: 'DELETE' }) }
export { clearSession }
