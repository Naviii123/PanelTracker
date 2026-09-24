import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { currentUser } from './api'
import { AppShell } from './components/AppShell.jsx'
import AuthPage from './pages/AuthPage.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Detail from './pages/Detail.jsx'
import Library from './pages/Library.jsx'
import Settings from './pages/Settings.jsx'

function ProtectedRoutes() {
  if (!currentUser()) return <Navigate to="/login" replace />

  return (
    <AppShell>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/library" element={<Library />} />
        <Route path="/manga/:anilistId" element={<Detail />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AppShell>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/register" element={<AuthPage mode="register" />} />
        <Route path="/" element={<Navigate to={currentUser() ? '/dashboard' : '/login'} replace />} />
        <Route path="*" element={<ProtectedRoutes />} />
      </Routes>
    </BrowserRouter>
  )
}
