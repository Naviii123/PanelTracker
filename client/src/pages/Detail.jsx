import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { addToLibrary, getLibrary, mangaDetails, removeFromLibrary } from '../api'
import { EmptyState, Loading, MangaPoster, PersonImage, STATUSES, getCover } from '../components/ui.jsx'
import { chapterError, chapterLimit } from '../utils/progress.js'

export default function Detail() {
  const { anilistId } = useParams()
  const [item, setItem] = useState(null)
  const [library, setLibrary] = useState([])
  const [chapter, setChapter] = useState(0)
  const [status, setStatus] = useState('Plan to Read')
  const [rating, setRating] = useState('')
  const [message, setMessage] = useState('')
  const [progressError, setProgressError] = useState('')
  const [showAllRecommendations, setShowAllRecommendations] = useState(false)

  useEffect(() => {
    setMessage('')
    setProgressError('')
    Promise.all([mangaDetails(anilistId), getLibrary()]).then(([details, saved]) => {
      setItem(details)
      setLibrary(saved)
      const existing = saved.find((row) => row.anilistId === Number(anilistId))
      if (existing) {
        setChapter(existing.currentChapter)
        setStatus(existing.status)
        setRating(existing.rating || '')
      } else if (details.status === 'Coming Soon' || details.status === 'Releasing') {
        setStatus(details.status)
      }
    }).catch((caught) => setMessage(caught.message))
  }, [anilistId])

  if (!item) return <Loading error={message} />
  const existing = library.find((row) => row.anilistId === Number(anilistId))
  const recommendations = item.recommendations || []
  const visibleRecommendations = showAllRecommendations ? recommendations : recommendations.slice(0, 4)

  async function save() {
    const error = chapterError(item, chapter)
    const ratingValue = rating === '' ? null : Number(rating)
    if (error) return setProgressError(error)
    if (ratingValue !== null && (!Number.isInteger(ratingValue) || ratingValue < 1 || ratingValue > 10)) return setProgressError('Rating must be a whole number from 1 to 10.')

    try {
      await addToLibrary(item, { currentChapter: chapter, status, rating: ratingValue })
      setLibrary((current) => [...current.filter((row) => row.anilistId !== item.anilistId), { ...item, currentChapter: Number(chapter), status, rating: ratingValue, lastUpdated: new Date().toISOString() }])
      setProgressError('')
      setMessage('Saved to your library.')
    } catch (caught) {
      setProgressError(caught.message)
    }
  }

  async function remove() {
    await removeFromLibrary(item.anilistId)
    setLibrary((current) => current.filter((row) => row.anilistId !== item.anilistId))
    setMessage('Removed from your library.')
  }

  return (
    <>
      <Link className="back-link" to="/dashboard">← Back to overview</Link>
      {item.bannerUrl && <div className="detail-banner" aria-hidden="true"><img src={item.bannerUrl} alt="" /></div>}
      <div className={`detail-layout${item.bannerUrl ? ' detail-layout-with-banner' : ''}`}>
        <img className="detail-cover" src={getCover(item)} alt="" />
        <div className="detail-copy">
          <span className="eyebrow">{item.type} / <span className={`release-status ${item.status === 'Coming Soon' ? 'upcoming' : item.status === 'Releasing' ? 'releasing' : ''}`}>{item.status}</span></span>
          <h1>{item.title}</h1>
          {item.alternativeTitles?.length > 0 && <p className="alternative-titles">Also known as: {item.alternativeTitles.join(' · ')}</p>}
          <p className="synopsis">{item.synopsis}</p>
          <div className="chips">{item.genres?.map((genre) => <span key={genre}>{genre}</span>)}</div>
          <section className="title-metadata" aria-label="Title details">
            <span className="eyebrow">Title details</span>
            <dl className="metadata">
              <div><dt>Chapters</dt><dd>{item.chapters ?? '?'}</dd></div>
              <div><dt>Volumes</dt><dd>{item.volumes ?? '?'}</dd></div>
              <div><dt>Score</dt><dd>{item.score ?? '—'}</dd></div>
              <div><dt>Author</dt><dd>{item.authors?.[0] || 'Unknown'}</dd></div>
              <div><dt>Release</dt><dd>{item.startDate || 'Unknown'}{item.endDate ? ` – ${item.endDate}` : ''}</dd></div>
              {item.countryOfOrigin && <div><dt>Origin</dt><dd>{item.countryOfOrigin}</dd></div>}
              {item.siteUrl && <div><dt>Source</dt><dd><a className="anilist-link" href={item.siteUrl} target="_blank" rel="noreferrer">AniList ↗</a></dd></div>}
            </dl>
          </section>
        </div>
      </div>
      <section className="progress-panel">
        <div>
          <span className="eyebrow">MY PROGRESS</span>
          <h2>{existing ? 'Keep the momentum.' : 'Add this title to your shelf.'}</h2>
          {existing && <div className="progress-summary"><span>Chapter {existing.currentChapter}</span><span>{existing.status}</span><span>{existing.rating ? `★ ${existing.rating}/10` : 'Not rated'}</span><span>{existing.lastUpdated ? new Date(existing.lastUpdated).toLocaleDateString() : 'Not updated'}</span></div>}
        </div>
        <div className="progress-form">
          <label>Chapter{chapterLimit(item) !== null ? <select aria-label="Current chapter" value={chapter} onChange={(event) => { setChapter(event.target.value); setProgressError('') }}>{Array.from({ length: chapterLimit(item) + 1 }, (_, value) => <option key={value} value={value}>{value}</option>)}</select> : <><input aria-label="Current chapter" type="number" min="0" value={chapter} onChange={(event) => { setChapter(event.target.value); setProgressError('') }} /><small className="field-hint">Total chapters unknown. Enter your current chapter.</small></>}</label>
          <label>Status<select value={status} onChange={(event) => setStatus(event.target.value)}>{STATUSES.map((value) => <option key={value}>{value}</option>)}</select></label>
          <label>Rating<input type="number" min="1" max="10" placeholder="-" value={rating} onChange={(event) => { setRating(event.target.value); setProgressError('') }} /></label>
          <button className="button button-accent" onClick={save}>{existing ? 'Update progress' : 'Add to library'}</button>
          {existing && <button className="button button-outline-light" onClick={remove}>Remove</button>}
        </div>
        {progressError && <p className="form-error">{progressError}</p>}
        {message && <p className="success-message">{message}</p>}
      </section>
      <section className="detail-people-section">
        <div className="section-heading"><div><span className="eyebrow">CAST</span><h2>Characters</h2></div></div>
        {item.characters?.length ? <div className="character-grid">{item.characters.map((character) => <article className="character-card" key={character.id}><PersonImage src={character.imageUrl} name={character.name} className="character-image" /><div><strong>{character.name}</strong><small>{character.role || 'Character'}</small></div></article>)}</div> : <p className="muted-copy">Character information is not available for this title.</p>}
      </section>
      <section className="detail-people-section">
        <div className="section-heading"><div><span className="eyebrow">CREATORS</span><h2>Staff</h2></div></div>
        {item.staff?.length ? <div className="staff-grid">{item.staff.map((person) => <article className="staff-card" key={`${person.id}-${person.role}`}><PersonImage src={person.imageUrl} name={person.name} className="staff-image" /><div><strong>{person.name}</strong><small>{person.role}</small></div></article>)}</div> : <p className="muted-copy">Staff information is not available for this title.</p>}
      </section>
      <section className="detail-recommendations">
        <div className="section-heading">
          <div><h2>Recommendations</h2></div>
          {recommendations.length > 4 && <button type="button" className="text-button" aria-expanded={showAllRecommendations} aria-controls="detail-recommendation-list" onClick={() => setShowAllRecommendations((current) => !current)}>{showAllRecommendations ? 'Show fewer' : `Show all (${recommendations.length})`}</button>}
        </div>
        {recommendations.length ? <div className="detail-recommendation-row" id="detail-recommendation-list">{visibleRecommendations.map((recommendation) => <MangaPoster key={recommendation.anilistId} item={recommendation} compact />)}</div> : <p className="muted-copy">No recommendations are available for this title yet.</p>}
      </section>
    </>
  )
}
