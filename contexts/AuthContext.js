'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase-client'

const AuthContext = createContext({
  user: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,
  signOut: async () => {},
  refreshSession: async () => {},
})

export function AuthProvider({ children, initialSession = null, initialUser = null }) {
  const [user, setUser] = useState(initialUser)
  const [session, setSession] = useState(initialSession)
  const [isLoading, setIsLoading] = useState(!initialSession && !initialUser)
  const supabase = createClient()

  const refreshSession = useCallback(async () => {
    try {
      const { data: { session: newSession }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Error refreshing session:', error)
        setUser(null)
        setSession(null)
        return
      }

      setSession(newSession)
      setUser(newSession?.user ?? null)
    } catch (err) {
      console.error('Unexpected error refreshing session:', err)
      setUser(null)
      setSession(null)
    }
  }, [supabase])

  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Error signing out:', error)
        throw error
      }
      setUser(null)
      setSession(null)
    } catch (err) {
      console.error('Sign out failed:', err)
      throw err
    }
  }, [supabase])

  useEffect(() => {
    if (initialSession || initialUser) {
      setIsLoading(false)
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession)
        setUser(newSession?.user ?? null)
        setIsLoading(false)

        switch (event) {
          case 'SIGNED_IN':
            console.log('User signed in')
            break
          case 'SIGNED_OUT':
            console.log('User signed out')
            break
          case 'TOKEN_REFRESHED':
            console.log('Token refreshed')
            break
          case 'USER_UPDATED':
            console.log('User updated')
            break
        }
      }
    )

    if (!initialSession && !initialUser) {
      refreshSession().finally(() => setIsLoading(false))
    }

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, initialSession, initialUser, refreshSession])

  const value = {
    user,
    session,
    isLoading,
    isAuthenticated: !!user,
    signOut,
    refreshSession,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}
