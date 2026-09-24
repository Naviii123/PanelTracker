import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { currentUser, getDashboard, searchManga } from '../api'
import { PageHeader } from '../components/AppShell.jsx'
import { EmptyState, MangaPoster, Loading, StatCard, getCover } from '../components/ui.jsx'

function TrackingRow({ item }) {
  const total = item.totalChapters ? Number(item.totalChapters) : null
  const progress = total ? Math.min(100, Number(item.currentChapter) / total * 100) : 0
  return (
    <Link to={`/manga/${item.anilistId}`} className="tracking-row">
      <img src={getCover(item)} alt="" />
      <div className="tracking-copy">
        <div className="row-between"><strong>{item.title}</strong><span>{item.status}</span></div>
        <p>Chapter {item.currentChapter} {total ? `/ ${total}` : '/ ?'}</p>
        <div className="progress-bar"><i style={{ width: `${progress}%` }} /></div>
        <small>{total ? `${Math.round(progress)}% complete` : 'Currently publishing'}</small>
      </div>
    </Link>
  )
}

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    getDashboard().then(setData).catch((caught) => setError(caught.message))
  }, [])

  async function handleSearch(event) {
    event.preventDefault()
    if (query.trim().length < 2) return
    try {
      const response = await searchManga(query.trim())
      setResults(response.items || response)
    } catch (caught) {
      setError(caught.message)
    }
  }

  if (!data) return <Loading error={error} />
  const genreMax = Math.max(...data.genres.map(([, count]) => count), 1)

  return (
    <>
      <PageHeader
        eyebrow="WEDNESDAY, SEPTEMBER 23"
        title={`Good evening, ${currentUser()?.username || 'reader'}.`}
        action={<Link className="button button-primary" to="/library">Open library <span>↗</span></Link>}
      />
      <section className="search-panel">
        <form onSubmit={handleSearch} className="search-form">
          <input placeholder="Search manga, manhwa, manhua..." value={query} onChange={(event) => setQuery(event.target.value)} />
          <button className="button button-primary">Search</button>
        </form>
        {results.length > 0 && <div className="search-results">{results.map((item) => <MangaPoster key={item.anilistId} item={item} compact />)}</div>}
      </section>
      {error && <p className="error-message">{error}</p>}
      <div className="stats-grid">
        <StatCard label="Tracked titles" value={data.stats.tracked} />
        <StatCard label="Reading now" value={data.stats.Reading} tone="mint" />
        <StatCard label="Completed" value={data.stats.Completed} tone="yellow" />
        <StatCard label="Plan to read" value={data.stats['Plan to Read']} tone="pink" />
      </div>
      <div className="dashboard-grid">
        <section>
          <div className="section-heading"><div><span className="eyebrow">YOUR CURRENT ROTATION</span><h2>Currently tracking</h2></div><Link to="/library">See all ↗</Link></div>
          <div className="tracking-list">{data.tracking.length ? data.tracking.map((item) => <TrackingRow key={item.anilistId} item={item} />) : <EmptyState text="Your reading rotation is waiting for its first title." />}</div>
        </section>
        <aside className="side-column">
          <section className="panel" id="discover">
            <div className="section-heading"><h2>Top genres</h2><span className="eyebrow">LIBRARY MIX</span></div>
            {data.genres.map(([genre, count]) => <div className="genre-row" key={genre}><span>{genre}</span><div><i style={{ width: `${Math.max(18, count / genreMax * 100)}%` }} /></div><b>{count}</b></div>)}
          </section>
          <section className="panel recommendations"><div className="section-heading"><h2>For your shelf</h2><span>✦</span></div>{data.recommendations.slice(0, 3).map((item) => <MangaPoster key={item.anilistId} item={item} compact />)}</section>
        </aside>
      </div>
    </>
  )
}
