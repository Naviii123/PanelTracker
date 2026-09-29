import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { currentUser, isDemo, logout } from '../api'
import DemoNotice from './DemoNotice.jsx'

export function AppShell({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const user = currentUser()

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link className="brand" to="/dashboard" aria-label="PanelTracker overview">
          <img src="/assets/logo/paneltracker-logo-placeholder.svg" alt="PanelTracker" />
        </Link>
        <nav className="sidebar-nav" aria-label="Main navigation">
          <NavLink to="/dashboard" end className={({ isActive }) => isActive && location.hash !== '#search' ? 'active' : ''}>Overview</NavLink>
          <NavLink to="/library">My library</NavLink>
          <NavLink to="/settings">Settings</NavLink>
        </nav>
        <div className="sidebar-foot">
          <span>@{user?.username || 'reader'}</span>
          <button className="link-button" onClick={handleLogout}>Log out</button>
        </div>
      </aside>
      <main className="main-content">
        {isDemo && <DemoNotice />}
        {children}
      </main>
      <nav className="mobile-nav" aria-label="Mobile navigation">
        <NavLink to="/dashboard" end><span aria-hidden="true">⌂</span><small>Overview</small></NavLink>
        <NavLink to="/library"><span aria-hidden="true">▤</span><small>Library</small></NavLink>
        <Link to="/dashboard#search" className={location.pathname === '/dashboard' && location.hash === '#search' ? 'active' : ''}><span aria-hidden="true">⌕</span><small>Search</small></Link>
        <NavLink to="/settings"><span aria-hidden="true">⚙</span><small>Settings</small></NavLink>
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
