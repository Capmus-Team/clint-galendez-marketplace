'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ListingStatus } from './listing-service';

export interface UseListingStatusOptions {
  listingId: string;
  onStatusChange?: (newStatus: ListingStatus) => void;
}

/**
 * Hook to monitor listing status changes in real-time
 */
export function useListingStatus({ listingId, onStatusChange }: UseListingStatusOptions) {
  const [status, setStatus] = useState<ListingStatus>('available');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch initial status
    const fetchInitialStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('listings')
          .select('status')
          .eq('id', listingId)
          .single();

        if (error) {
          console.error('Error fetching listing status:', error);
          return;
        }

        const newStatus = data.status as ListingStatus;
        setStatus(newStatus);
        onStatusChange?.(newStatus);
      } catch (error) {
        console.error('Error fetching initial listing status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialStatus();

    // Set up real-time subscription
    const subscription = supabase
      .channel('listing-status-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'listings',
          filter: `id=eq.${listingId}`,
        },
        (payload) => {
          const newListing = payload.new as any;
          const newStatus = newListing.status as ListingStatus;
          
          setStatus(newStatus);
          onStatusChange?.(newStatus);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [listingId, onStatusChange]);

  return {
    status,
    loading,
  };
}

/**
 * Hook to get listing status without real-time updates
 */
export function useListingStatusOnce(listingId: string) {
  const [status, setStatus] = useState<ListingStatus>('available');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('listings')
          .select('status')
          .eq('id', listingId)
          .single();

        if (error) {
          console.error('Error fetching listing status:', error);
          return;
        }

        setStatus(data.status as ListingStatus);
      } catch (error) {
        console.error('Error fetching listing status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [listingId]);

  return {
    status,
    loading,
  };
}
