import { supabaseAdmin } from '../supabase-admin';
import { Listing } from '../supabase';

export type ListingStatus = 'available' | 'pending' | 'sold';

export class ListingService {
  /**
   * Update listing status
   */
  static async updateListingStatus(
    listingId: string,
    status: ListingStatus
  ): Promise<Listing> {
    const { data, error } = await supabaseAdmin
      .from('listings')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', listingId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update listing status: ${error.message}`);
    }

    return data;
  }

  /**
   * Get listing by ID
   */
  static async getListingById(listingId: string): Promise<Listing | null> {
    const { data, error } = await supabaseAdmin
      .from('listings')
      .select('*')
      .eq('id', listingId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to get listing: ${error.message}`);
    }

    return data;
  }

  /**
   * Mark listing as sold
   */
  static async markListingAsSold(listingId: string): Promise<Listing> {
    console.log(`Marking listing ${listingId} as sold`);
    return this.updateListingStatus(listingId, 'sold');
  }

  /**
   * Mark listing as pending (during checkout process)
   */
  static async markListingAsPending(listingId: string): Promise<Listing> {
    console.log(`Marking listing ${listingId} as pending`);
    return this.updateListingStatus(listingId, 'pending');
  }

  /**
   * Mark listing as available (if transaction fails)
   */
  static async markListingAsAvailable(listingId: string): Promise<Listing> {
    console.log(`Marking listing ${listingId} as available`);
    return this.updateListingStatus(listingId, 'available');
  }

  /**
   * Get available listings (for marketplace display)
   */
  static async getAvailableListings(): Promise<Listing[]> {
    const { data, error } = await supabaseAdmin
      .from('listings')
      .select('*')
      .eq('status', 'available')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to get available listings: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Get user's listings with status filter
   */
  static async getUserListings(
    userId: string,
    status?: ListingStatus
  ): Promise<Listing[]> {
    let query = supabaseAdmin
      .from('listings')
      .select('*')
      .eq('user_id', userId);

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to get user listings: ${error.message}`);
    }

    return data || [];
  }
}
