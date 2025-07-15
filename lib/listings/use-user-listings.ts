'use client'

import { useState, useEffect } from 'react'
import { supabase, type Listing } from '@/lib/supabase'
import { useAuth } from '@/lib/auth/auth-context'

export interface UseUserListingsResult {
  listings: Listing[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  deleteListing: (id: string) => Promise<void>
}

/**
 * Hook to fetch and manage current user's listings
 */
export function useUserListings(): UseUserListingsResult {
  const { user } = useAuth()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUserListings = async () => {
    if (!user) {
      setListings([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const { data, error: fetchError } = await supabase
        .from('listings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (fetchError) {
        throw new Error(fetchError.message)
      }

      setListings(data || [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch listings'
      setError(errorMessage)
      console.error('Error fetching user listings:', err)
    } finally {
      setLoading(false)
    }
  }

  const deleteListing = async (id: string) => {
    if (!user) {
      throw new Error('User not authenticated')
    }

    try {
      const { error: deleteError } = await supabase
        .from('listings')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id) // Ensure user can only delete their own listings

      if (deleteError) {
        throw new Error(deleteError.message)
      }

      // Update local state to remove the deleted listing
      setListings(prev => prev.filter(listing => listing.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete listing'
      setError(errorMessage)
      throw err
    }
  }

  useEffect(() => {
    fetchUserListings()
  }, [user])

  return {
    listings,
    loading,
    error,
    refetch: fetchUserListings,
    deleteListing
  }
}
