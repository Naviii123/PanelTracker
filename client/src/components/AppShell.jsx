import { useEffect } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { currentUser, isDemo, logout } from '../api'
import DemoNotice from './DemoNotice.jsx'
import paneltrackerLogo from '/assets/logo/paneltracker-logo.svg'

export function AppShell({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const user = currentUser()
  const guest = user?.isGuest

  useEffect(() => {
    if (!guest) return
    const timeout = window.setTimeout(() => {
      logout()
      navigate('/login', { replace: true })
    }, Math.max(0, user.guestExpiresAt - Date.now()))
    return () => window.clearTimeout(timeout)
  }, [guest, navigate, user?.guestExpiresAt])

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link className="brand" to="/dashboard" aria-label="PanelTracker overview">
          <img src={paneltrackerLogo} alt="PanelTracker" />
        </Link>
        <nav className="sidebar-nav" aria-label="Main navigation">
          <NavLink to="/dashboard" end className={({ isActive }) => isActive && location.hash !== '#search' ? 'active' : ''}>Overview</NavLink>
          {!guest && <NavLink to="/library">My library</NavLink>}
          {!guest && <NavLink to="/settings">Settings</NavLink>}
        </nav>
        <div className="sidebar-foot">
          <span>{guest ? `Guest access · ends ${new Date(user.guestExpiresAt).toLocaleDateString()}` : `@${user?.username || 'reader'}`}</span>
          {guest && <Link className="link-button" to="/register">Create account</Link>}
          <button className="link-button" onClick={handleLogout}>{guest ? 'Exit guest' : 'Log out'}</button>
        </div>
      </aside>
      <main className="main-content">
        {isDemo && <DemoNotice />}
        {guest && <div className="guest-notice">Browse-only guest session. Your session expires in 48 hours; create an account to save progress.</div>}
        {children}
      </main>
      <nav className="mobile-nav" aria-label="Mobile navigation">
        <NavLink to="/dashboard" end className={({ isActive }) => isActive && location.hash !== '#search' ? 'active' : ''}><span aria-hidden="true">⌂</span><small>Overview</small></NavLink>
        {!guest && <NavLink to="/library"><span aria-hidden="true">▤</span><small>Library</small></NavLink>}
        <Link to="/dashboard#search" className={location.pathname === '/dashboard' && location.hash === '#search' ? 'active' : ''}><span aria-hidden="true">⌕</span><small>Search</small></Link>
        {!guest && <NavLink to="/settings"><span aria-hidden="true">⚙</span><small>Settings</small></NavLink>}
      </nav>
    </div>
  )
}

export function PageHeader({ eyebrow, title, action }) {
  return (
    <header className="topbar">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
      </div>
      {action}
    </header>
  )
}
