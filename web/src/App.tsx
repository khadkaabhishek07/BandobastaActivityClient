import { Outlet } from 'react-router-dom'

function App() {
  return (
    <div className="min-h-dvh flex flex-col">
      <header className="border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <a href="/" className="text-xl font-semibold tracking-tight">
            Bandobasta
          </a>
          <nav className="flex items-center gap-4">
            <a href="/venues" className="hover:text-brand-accent">Venues</a>
            <a href="/bookings" className="hover:text-brand-accent">Bookings</a>
            <a href="/login" className="rounded-full px-4 py-1.5 bg-brand text-white">Login</a>
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
