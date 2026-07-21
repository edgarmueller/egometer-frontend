import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import { setAuthToken } from '@/lib/api-client'
import { queryClient } from '@/lib/query-client'
import { authApi } from './api'
import type { User } from './types'

const TOKEN_STORAGE_KEY = 'egometer.token'

interface AuthContextValue {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  /** True while we're validating a persisted token against the backend on boot. */
  isInitializing: boolean
  setSession: (token: string, user: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_STORAGE_KEY),
  )
  const [user, setUser] = useState<User | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)

  // Keep the api-client's module-level token in sync.
  useEffect(() => {
    setAuthToken(token)
  }, [token])

  // On boot (or whenever the token changes from outside a login/register
  // call), validate it against the backend and hydrate the user.
  useEffect(() => {
    let cancelled = false

    if (!token) {
      setIsInitializing(false)
      return
    }

    authApi
      .me()
      .then((me) => {
        if (!cancelled) setUser(me)
      })
      .catch(() => {
        if (!cancelled) {
          localStorage.removeItem(TOKEN_STORAGE_KEY)
          setToken(null)
          setUser(null)
        }
      })
      .finally(() => {
        if (!cancelled) setIsInitializing(false)
      })

    return () => {
      cancelled = true
    }
  }, [token])

  const setSession = useCallback((newToken: string, newUser: User) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, newToken)
    setAuthToken(newToken)
    setToken(newToken)
    setUser(newUser)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY)
    setAuthToken(null)
    setToken(null)
    setUser(null)
    queryClient.clear()
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      isInitializing,
      setSession,
      logout,
    }),
    [user, token, isInitializing, setSession, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}
