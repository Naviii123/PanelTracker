import { Link } from 'react-router-dom'

export const STATUSES = ['Reading', 'Completed', 'Plan to Read', 'On Hold', 'Dropped']

export function getCover(item) {
  return item.coverUrl || '/assets/placeholders/manga-cover-placeholder.svg'
}

export function StatCard({ label, value, tone = '' }) {
  return (
    <div className={`stat-card ${tone}`}>
      <span>{label}</span>
      <strong>{value ?? 0}</strong>
    </div>
  )
}

export function MangaPoster({ item, compact = false }) {
  return (
    <Link className={`manga-poster ${compact ? 'compact' : ''}`} to={`/manga/${item.anilistId}`}>
      <img src={getCover(item)} alt="" />
      <div>
        <strong>{item.title}</strong>
        <small>{item.status || item.type || 'Manga'}</small>
      </div>
    </Link>
  )
}

export function Loading({ error }) {
  return (
    <div className="loading-state">
      <span className="eyebrow">PANELTRACKER</span>
      <h2>{error || 'Loading your shelf...'}</h2>
      {error && <Link className="button button-primary" to="/login">Return to login</Link>}
    </div>
  )
}

export function EmptyState({ text }) {
  return (
    <div className="empty-state">
      <span aria-hidden="true">＋</span>
      <p>{text}</p>
      <Link to="/dashboard#discover">Discover a title</Link>
    </div>
  )
}
