'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './auth-context'

/**
 * Hook to protect routes that require authentication
 */
export function useAuthGuard(redirectTo: string = '/auth/login') {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push(redirectTo)
      } else {
        setIsAuthorized(true)
      }
    }
  }, [user, loading, router, redirectTo])

  return { isAuthorized, loading, user }
}

/**
 * Hook to redirect authenticated users away from auth pages
 */
export function useGuestGuard(redirectTo: string = '/') {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push(redirectTo)
    }
  }, [user, loading, router, redirectTo])

  return { loading, user }
}

/**
 * Hook for form submission with loading state
 */
export function useAuthSubmit() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submit = async (action: () => Promise<void>) => {
    if (isSubmitting) return

    try {
      setIsSubmitting(true)
      await action()
    } finally {
      setIsSubmitting(false)
    }
  }

  return { isSubmitting, submit }
}
