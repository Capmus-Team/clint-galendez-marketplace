'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { AuthService } from './auth-service'
import type { AuthContextType, AuthUser, LoginCredentials, RegisterCredentials } from './types'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user as AuthUser ?? null)
      } catch (err) {
        console.error('Error getting initial session:', err)
        setError('Failed to get user session')
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user as AuthUser ?? null)
      setLoading(false)

      if (event === 'SIGNED_OUT') {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (credentials: LoginCredentials) => {
    try {
      setError(null)
      setLoading(true)
      await AuthService.signIn(credentials)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during sign in'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (credentials: RegisterCredentials) => {
    try {
      setError(null)
      setLoading(true)
      await AuthService.signUp(credentials)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during sign up'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setError(null)
      setLoading(true)
      await AuthService.signOut()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during sign out'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const clearError = () => {
    setError(null)
  }

  const value: AuthContextType = {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    clearError,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
