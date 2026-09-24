import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login, register } from '../api'

export default function AuthPage({ mode }) {
  const navigate = useNavigate()
  const isRegister = mode === 'register'
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    if (isRegister && form.password !== form.confirm) {
      setError('Passwords do not match.')
      return
    }
    try {
      await (isRegister ? register(form) : login(form))
      navigate('/dashboard')
    } catch (caught) {
      setError(caught.message)
    }
  }

  return (
    <div className="auth-page">
      <section className="auth-art" aria-label="PanelTracker introduction">
        <img className="auth-logo" src="/assets/logo/paneltracker-logo-placeholder.svg" alt="PanelTracker" />
        <div className="auth-art-copy">
          <span className="eyebrow">YOUR PERSONAL CATALOG</span>
          <p>Your all-in-one title tracking hub.</p>
          <small>Organize your collection, track progress and releases, and get recommendations.</small>
        </div>
        <div className="auth-art-stats">
          <strong>15k+</strong><span>tracked titles</span>
          <strong>PROGRESS</strong><span>log chapters and see your stats grow</span>
        </div>
      </section>

      <form className="auth-card" onSubmit={handleSubmit}>
        <span className="eyebrow">PANELTRACKER / {isRegister ? 'CREATE ACCOUNT' : 'WELCOME BACK'}</span>
        <h1>{isRegister ? 'Build your reading shelf.' : 'Pick up where you left off.'}</h1>
        {error && <p className="error-message">{error}</p>}
        {isRegister && <label>Username<input name="username" required value={form.username} onChange={updateField} /></label>}
        <label>Email address<input name="email" required type="email" placeholder="Enter your email" value={form.email} onChange={updateField} /></label>
        <label>Password<input name="password" required type="password" placeholder="Enter your password" value={form.password} onChange={updateField} /></label>
        {isRegister && <label>Confirm password<input name="confirm" required type="password" value={form.confirm} onChange={updateField} /></label>}
        {!isRegister && <div className="auth-options"><label className="checkbox-label"><input type="checkbox" /> Remember me</label><span>Forgot password?</span></div>}
        <button className="button button-primary button-wide">{isRegister ? 'Create my account' : 'Sign in'}</button>
        <p className="auth-switch">{isRegister ? 'Already have an account?' : "Don't have an account?"} <Link to={isRegister ? '/login' : '/register'}>{isRegister ? 'Log in' : 'Sign up'}</Link></p>
      </form>
    </div>
  )
}
