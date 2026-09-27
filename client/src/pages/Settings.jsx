import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { clearLibrary, currentUser, isDemo, logout } from '../api'
import { PageHeader } from '../components/AppShell.jsx'
import { useTheme } from '../context/ThemeContext.jsx'

export default function Settings() {
  const navigate = useNavigate()
  const user = currentUser()
  const { theme, setTheme } = useTheme()
  const [message, setMessage] = useState('')

  async function handleClearLibrary() {
    if (!window.confirm('Clear your entire library? Your account and shared manga data will not be deleted.')) return
    await clearLibrary()
    setMessage('Your library has been cleared.')
  }

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <>
      <PageHeader eyebrow="ACCOUNT" title="Settings" />
      {message && <p className="success-message settings-message">{message}</p>}
      <div className="settings-grid">
        <section className="settings-section">
          <span className="eyebrow">APPEARANCE</span>
          <h2>Light or dark</h2>
          <p className="settings-help">Choose the appearance used across PanelTracker. Your choice is saved on this device.</p>
          <div className="appearance-control" role="group" aria-label="Appearance">
            <button type="button" className={theme === 'light' ? 'selected' : ''} aria-pressed={theme === 'light'} onClick={() => setTheme('light')}><span className="appearance-swatch light-swatch" />Light</button>
            <button type="button" className={theme === 'dark' ? 'selected' : ''} aria-pressed={theme === 'dark'} onClick={() => setTheme('dark')}><span className="appearance-swatch dark-swatch" />Dark</button>
          </div>
        </section>
        <section className="settings-section">
          <span className="eyebrow">PROFILE</span>
          <h2>Your account</h2>
          <div className="settings-fields">
            <div><span>Username</span><strong>@{user?.username || 'reader'}</strong></div>
            <div><span>Email</span><strong>{user?.email || 'Not available'}</strong></div>
          </div>
          <p className="settings-help">Profile editing is intentionally limited while the account system is in its first release.</p>
        </section>
        <section className="settings-section">
          <span className="eyebrow">APP MODE</span>
          <h2>{isDemo ? 'Demo mode is on' : 'Connected mode is on'}</h2>
          <p className="settings-help">{isDemo ? 'Your demo account and library are stored only in this browser. They are not sent to the Express API or Supabase.' : 'Your account uses the Express API and Supabase PostgreSQL. Library changes are stored on the server.'}</p>
          <span className={`mode-badge ${isDemo ? 'demo' : 'connected'}`}>{isDemo ? 'Local demo' : 'Express + Supabase'}</span>
        </section>
        <section className="settings-section settings-danger">
          <span className="eyebrow">DANGER ZONE</span>
          <h2>Manage your data</h2>
          <p className="settings-help">Clear your saved titles and reading progress without deleting your account.</p>
          <div className="settings-actions">
            <button className="button button-danger" onClick={handleClearLibrary}>Clear my library</button>
            <button className="button button-outline" onClick={handleLogout}>Log out</button>
          </div>
        </section>
      </div>
    </>
  )
}
