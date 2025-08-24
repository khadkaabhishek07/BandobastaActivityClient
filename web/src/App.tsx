import { Outlet } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

function App() {
  const { token, logout } = useAuth()
  return (
    <div className="min-h-dvh flex flex-col">
      <header className="border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <a href="/" className="text-xl font-semibold tracking-tight">
            Bandobasta
          </a>
          <nav className="flex items-center gap-4">
            <a href="/venues" className="hover:text-brand-accent">Venues</a>
            {token && <a href="/bookings" className="hover:text-brand-accent">My Bookings</a>}
            {!token ? (
              <a href="/login" className="rounded-full px-4 py-1.5 bg-brand text-white">Login</a>
            ) : (
              <button onClick={logout} className="rounded-full px-4 py-1.5 border">Logout</button>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-slate-500">
          © {new Date().getFullYear()} Bandobasta
        </div>
      </footer>
    </div>
  )
}

export default App
