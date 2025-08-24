import { createContext, useContext, useMemo, useSyncExternalStore } from 'react'
import { apiAuth } from '../services/auth'

type AuthState = {
  token: string | null
  userId: string | null
}

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback)
  return () => window.removeEventListener('storage', callback)
}

function getSnapshot(): AuthState {
  return { token: apiAuth.getToken(), userId: apiAuth.getUserId() }
}

const AuthContext = createContext<{
  token: string | null
  userId: string | null
  login: (identifier: string, password: string) => Promise<void>
  logout: () => void
}>({ token: null, userId: null, login: async () => {}, logout: () => {} })

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
  const api = useMemo(() => ({
    token: state.token,
    userId: state.userId,
    async login(identifier: string, password: string) {
      await apiAuth.login(identifier, password)
      // trigger subscribers
      window.dispatchEvent(new StorageEvent('storage'))
    },
    logout() {
      apiAuth.logout()
      window.dispatchEvent(new StorageEvent('storage'))
    },
  }), [state.token, state.userId])
  return <AuthContext.Provider value={api}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}

