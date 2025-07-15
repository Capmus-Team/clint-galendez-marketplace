'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth/auth-context'
import type { PurchasedItem, UsePurchasedItemsResult } from './types'

/**
 * Hook to fetch and manage current user's purchased items
 */
export function usePurchasedItems(): UsePurchasedItemsResult {
  const { user } = useAuth()
  const [purchasedItems, setPurchasedItems] = useState<PurchasedItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPurchasedItems = async () => {
    if (!user) {
      setPurchasedItems([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      console.log('Fetching purchased items for user:', user.id)
      
      // First, let's check what tables and columns actually exist
      const { data: tableData, error: tableError } = await supabase
        .from('payment_transactions')
        .select('*')
        .limit(1)

      console.log('Sample payment_transactions data:', tableData)
      console.log('Table error (if any):', tableError)

      // Fetch ALL payment transactions for this user to debug
      const { data: allTransactions, error: allTransactionError } = await supabase
        .from('payment_transactions')
        .select('*')
        .eq('buyer_id', user.id)
        .order('created_at', { ascending: false })

      console.log('All transactions for user:', allTransactions)
      console.log('All transaction error:', allTransactionError)

      if (allTransactionError) {
        throw new Error(allTransactionError.message)
      }

      if (!allTransactions || allTransactions.length === 0) {
        console.log('No transactions found for user')
        setPurchasedItems([])
        return
      }

      // For now, let's use all transactions regardless of status to see what we have
      const transactions = allTransactions

      // Extract listing IDs to fetch listings data
      const listingIds = transactions.map(t => t.listing_id)
      console.log('Listing IDs to fetch:', listingIds)
      
      // Fetch the corresponding listings
      const { data: listings, error: listingsError } = await supabase
        .from('listings')
        .select(`
          id,
          title,
          description,
          price,
          category,
          location,
          image_url,
          contact_email
        `)
        .in('id', listingIds)

      console.log('Fetched listings:', listings)

      if (listingsError) {
        throw new Error(listingsError.message)
      }

      // Combine the data
      const purchasedItemsData = transactions.map(transaction => ({
        ...transaction,
        listings: listings?.find(listing => listing.id === transaction.listing_id)
      }))

      console.log('Final purchased items data:', purchasedItemsData)
      setPurchasedItems(purchasedItemsData)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch purchased items'
      setError(errorMessage)
      console.error('Error fetching purchased items:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPurchasedItems()
  }, [user])

  return {
    purchasedItems,
    loading,
    error,
    refetch: fetchPurchasedItems
  }
}
