import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(null)
const THEME_KEY = 'paneltracker-theme'
const ACCENT_KEY = 'paneltracker-accent'
const accents = {
  indigo: { primary: '#6366F1', hover: '#4F46E5', tint: '#EEF2FF' },
  teal: { primary: '#0F766E', hover: '#115E59', tint: '#CCFBF1' },
  rose: { primary: '#E11D48', hover: '#BE123C', tint: '#FFE4E6' },
}

function storedValue(key, allowed, fallback) {
  try {
    const value = localStorage.getItem(key)
    return allowed.includes(value) ? value : fallback
  } catch {
    return fallback
  }
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => storedValue(THEME_KEY, ['light', 'dark', 'system'], 'light'))
  const [accent, setAccent] = useState(() => storedValue(ACCENT_KEY, Object.keys(accents), 'indigo'))

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const applyTheme = () => {
      document.documentElement.dataset.theme = theme === 'system' ? (media.matches ? 'dark' : 'light') : theme
    }
    applyTheme()
    if (theme === 'system') media.addEventListener('change', applyTheme)
    try {
      localStorage.setItem(THEME_KEY, theme)
    } catch {
      // Theme still applies for the current session when storage is unavailable.
    }
    return () => media.removeEventListener('change', applyTheme)
  }, [theme])

  useEffect(() => {
    const values = accents[accent]
    const root = document.documentElement
    root.style.setProperty('--primary', values.primary)
    root.style.setProperty('--primary-hover', values.hover)
    root.style.setProperty('--lavender', values.tint)
    try {
      localStorage.setItem(ACCENT_KEY, accent)
    } catch {
      // Accent remains active for this session if storage is unavailable.
    }
  }, [accent])

  return <ThemeContext.Provider value={{ theme, setTheme, accent, setAccent }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const value = useContext(ThemeContext)
  if (!value) throw new Error('useTheme must be used inside ThemeProvider.')
  return value
}
