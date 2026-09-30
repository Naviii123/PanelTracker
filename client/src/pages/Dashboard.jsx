import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { currentUser, getDashboard, searchManga } from '../api'
import { PageHeader } from '../components/AppShell.jsx'
import { EmptyState, MangaPoster, Loading, StatCard, getCover } from '../components/ui.jsx'

function TrackingRow({ item }) {
  const total = item.totalChapters ? Number(item.totalChapters) : null
  const progress = total ? Math.min(100, Number(item.currentChapter) / total * 100) : 0
  const lifecycle = item.metadata?.status

  return (
    <Link to={`/manga/${item.anilistId}`} className="tracking-row">
      <img src={getCover(item)} alt="" />
      <div className="tracking-copy">
        <div className="row-between"><strong>{item.title}</strong><span>{item.status}</span></div>
        <p>Chapter {item.currentChapter} {total ? `/ ${total}` : '/ ?'}</p>
        <div className="progress-bar"><i style={{ width: `${progress}%` }} /></div>
        <small>{total ? `${Math.round(progress)}% complete` : lifecycle === 'Releasing' ? 'Releasing · total unknown' : 'Chapter total unknown'}</small>
      </div>
    </Link>
  )
}

export default function Dashboard() {
  const location = useLocation()
  const searchInput = useRef(null)
  const [data, setData] = useState(null)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [error, setError] = useState('')
  const [searched, setSearched] = useState(false)
  const [searchPage, setSearchPage] = useState(1)
  const [pageInfo, setPageInfo] = useState(null)

  useEffect(() => {
    getDashboard().then(setData).catch((caught) => setError(caught.message))
  }, [])

  useEffect(() => {
    if (location.hash === '#search') {
      document.getElementById('search')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      searchInput.current?.focus({ preventScroll: true })
    }
  }, [location.hash, data])

  async function loadSearchPage(page) {
    setError('')
    setSearched(true)
    try {
      const response = await searchManga(query.trim(), page)
      setResults(response.items || response)
      setPageInfo(response.pageInfo || null)
      setSearchPage(page)
    } catch (caught) {
      setError(caught.message)
      setResults([])
    }
  }

  async function handleSearch(event) {
    event.preventDefault()
    if (query.trim().length < 2) return
    await loadSearchPage(1)
  }

  if (!data) return <Loading error={error} />
  const genreMax = Math.max(...data.genres.map(([, count]) => count), 1)
  const displayDate = new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date())

  return (
    <>
      <PageHeader
        eyebrow={displayDate}
        title={`Good evening, ${currentUser()?.username || 'reader'}.`}
        action={<Link className="button button-primary" to="/library">Open library <span>↗</span></Link>}
      />
      <section className="search-panel" id="search">
        <form onSubmit={handleSearch} className="search-form">
          <input ref={searchInput} placeholder="Search manga, manhwa, manhua..." value={query} onChange={(event) => setQuery(event.target.value)} />
          <button className="button button-primary">Search</button>
        </form>
        {results.length > 0 && (
          <>
            <div className="search-results">{results.map((item) => <MangaPoster key={item.anilistId} item={item} compact />)}</div>
            {pageInfo && <div className="search-pagination"><button className="button button-outline" disabled={searchPage <= 1} onClick={() => loadSearchPage(searchPage - 1)}>Previous</button><span>Page {pageInfo.currentPage}</span><button className="button button-outline" disabled={!pageInfo.hasNextPage} onClick={() => loadSearchPage(searchPage + 1)}>Next</button></div>}
          </>
        )}
        {searched && results.length === 0 && !error && <p className="search-empty">No titles found. Try another title or spelling.</p>}
      </section>
      {error && <p className="error-message">{error}</p>}
      <div className="stats-grid">
        <StatCard label="Tracked titles" value={data.stats.tracked} />
        <StatCard label="Reading now" value={data.stats.Reading} tone="mint" />
        <StatCard label="Completed" value={data.stats.Completed} tone="yellow" />
        <StatCard label="Plan to read" value={data.stats['Plan to Read']} tone="pink" />
        <StatCard label="Dropped" value={data.stats.Dropped} />
      </div>
      <div className="dashboard-grid">
        <section>
          <div className="section-heading"><div><span className="eyebrow">YOUR CURRENT ROTATION</span><h2>Currently tracking</h2></div><Link to="/library">See all ↗</Link></div>
          <div className="tracking-list">{data.tracking.length ? data.tracking.map((item) => <TrackingRow key={item.anilistId} item={item} />) : <EmptyState text="Your reading rotation is waiting for its first title." />}</div>
        </section>
        <aside className="side-column">
          <section className="panel">
            <div className="section-heading"><h2>Top genres</h2><span className="eyebrow">LIBRARY MIX</span></div>
            {data.genres.length ? data.genres.map(([genre, count]) => <div className="genre-row" key={genre}><span>{genre}</span><div><i style={{ width: `${Math.max(18, count / genreMax * 100)}%` }} /></div><b>{count}</b></div>) : <p className="muted-copy">Genre insights appear as your library grows.</p>}
          </section>
          <section className="panel recommendations"><div className="section-heading"><h2>For your shelf</h2><span>✦</span></div>{data.recommendations.length ? data.recommendations.slice(0, 3).map((item) => <MangaPoster key={item.anilistId} item={item} compact />) : <p className="muted-copy">Recommendations are temporarily unavailable.</p>}</section>
        </aside>
      </div>
    </>
  )
}
