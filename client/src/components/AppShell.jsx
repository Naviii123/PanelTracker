import { Link, NavLink, useNavigate } from 'react-router-dom'
import { currentUser, isDemo, logout } from '../api'
import DemoNotice from './DemoNotice.jsx'

export function AppShell({ children }) {
  const navigate = useNavigate()
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
          <NavLink to="/dashboard" end>Overview</NavLink>
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
