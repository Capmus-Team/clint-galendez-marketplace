'use client'

import React from 'react'
import { useAuthGuard } from '@/lib/auth/hooks'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  redirectTo?: string
  fallback?: React.ReactNode
}

export function ProtectedRoute({ 
  children, 
  redirectTo = '/auth/login',
  fallback 
}: ProtectedRouteProps) {
  const { isAuthorized, loading } = useAuthGuard(redirectTo)

  if (loading) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Checking authentication...</p>
          </div>
        </div>
      )
    )
  }

  if (!isAuthorized) {
    return null // Will redirect in useAuthGuard
  }

  return <>{children}</>
}
