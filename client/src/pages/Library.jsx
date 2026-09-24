import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { clearLibrary, getLibrary, removeFromLibrary, updateLibrary } from '../api'
import { PageHeader } from '../components/AppShell.jsx'
import { EmptyState, Loading, STATUSES, getCover } from '../components/ui.jsx'
import { chapterError, chapterLimit } from '../utils/progress.js'

function LibraryCard({ item, onChange }) {
  const [editing, setEditing] = useState(false)
  const [chapter, setChapter] = useState(item.currentChapter)
  const [status, setStatus] = useState(item.status)
  const [rating, setRating] = useState(item.rating || '')
  const [error, setError] = useState('')

  async function save() {
    const chapterValidation = chapterError(item, chapter)
    const ratingValue = rating === '' ? null : Number(rating)
    if (chapterValidation) return setError(chapterValidation)
    if (ratingValue !== null && (!Number.isInteger(ratingValue) || ratingValue < 1 || ratingValue > 10)) return setError('Rating must be a whole number from 1 to 10.')
    try {
      await updateLibrary(item.anilistId, { currentChapter: Number(chapter), status, rating: ratingValue })
      setError('')
      setEditing(false)
      onChange()
    } catch (caught) {
      setError(caught.message)
    }
  }

  async function remove() {
    await removeFromLibrary(item.anilistId)
    onChange()
  }

  return (
    <article className="library-card">
      <Link to={`/manga/${item.anilistId}`}><img src={getCover(item)} alt="" /></Link>
      <div className="card-body">
        <span className="eyebrow">{item.status}</span>
        <h3>{item.title}</h3>
        {editing ? (
          <div className="edit-fields">
            <label>Chapter<input type="number" min="0" max={chapterLimit(item) ?? undefined} value={chapter} onChange={(event) => { setChapter(event.target.value); setError('') }} /></label>
            <label>Status<select value={status} onChange={(event) => setStatus(event.target.value)}>{STATUSES.map((value) => <option key={value}>{value}</option>)}</select></label>
            <label>Rating<input type="number" min="1" max="10" placeholder="-" value={rating} onChange={(event) => setRating(event.target.value)} /></label>
            <button className="button button-primary" onClick={save}>Save</button>
            {error && <p className="form-error">{error}</p>}
          </div>
        ) : (
          <>
            <p>Chapter {item.currentChapter} {item.totalChapters ? `/ ${item.totalChapters}` : '/ ?'}</p>
            <span className="rating">{item.rating ? `★ ${item.rating}/10` : 'Not rated'}</span>
            <button className="text-button" onClick={() => setEditing(true)}>Update progress</button>
          </>
        )}
        <button className="remove-button" onClick={remove}>Remove</button>
      </div>
    </article>
  )
}

export default function Library() {
  const [items, setItems] = useState(null)
  const [tab, setTab] = useState('All')
  const [error, setError] = useState('')

  function reload() {
    getLibrary().then(setItems).catch((caught) => setError(caught.message))
  }

  useEffect(reload, [])

  async function handleClear() {
    if (window.confirm('Clear your entire library? This cannot be undone.')) {
      await clearLibrary()
      reload()
    }
  }

  if (!items) return <Loading error={error} />
  const visibleItems = items.filter((item) => tab === 'All' || item.status === tab)

  return (
    <>
      <PageHeader eyebrow="YOUR COLLECTION" title="My library" action={<button className="button button-danger" onClick={handleClear}>Clear my library</button>} />
      <div className="tabs">{['All', ...STATUSES].map((value) => <button className={tab === value ? 'active' : ''} key={value} onClick={() => setTab(value)}>{value}</button>)}</div>
      {error && <p className="error-message">{error}</p>}
      <div className="library-grid">{visibleItems.map((item) => <LibraryCard key={item.anilistId} item={item} onChange={reload} />)}</div>
      {!visibleItems.length && <EmptyState text="No titles here yet. Search the catalog to start your shelf." />}
    </>
  )
}
