import { supabase } from '../supabase';
import { supabaseAdmin } from '../supabase-admin';
import { StripeAccount, ListingStripeProduct, PaymentTransaction } from './types';

export class StripeDatabase {
  // User Stripe Accounts
  static async getUserStripeAccount(userId: string): Promise<StripeAccount | null> {
    const { data, error } = await supabaseAdmin
      .from('user_stripe_accounts')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to get user Stripe account: ${error.message}`);
    }

    return data;
  }

  static async createUserStripeAccount(
    userId: string,
    stripeAccountId: string,
    accountType: 'express' | 'standard' | 'custom' = 'express'
  ): Promise<StripeAccount> {
    const { data, error } = await supabaseAdmin
      .from('user_stripe_accounts')
      .insert({
        user_id: userId,
        stripe_account_id: stripeAccountId,
        account_type: accountType,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create user Stripe account: ${error.message}`);
    }

    return data;
  }

  static async updateUserStripeAccount(
    userId: string,
    updates: Partial<Omit<StripeAccount, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
  ): Promise<StripeAccount> {
    const { data, error } = await supabaseAdmin
      .from('user_stripe_accounts')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update user Stripe account: ${error.message}`);
    }

    return data;
  }

  // Listing Stripe Products
  static async getListingStripeProduct(listingId: string): Promise<ListingStripeProduct | null> {
    const { data, error } = await supabaseAdmin
      .from('listing_stripe_products')
      .select('*')
      .eq('listing_id', listingId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to get listing Stripe product: ${error.message}`);
    }

    return data;
  }

  static async createListingStripeProduct(
    listingId: string,
    userId: string,
    stripeProductId: string,
    stripePriceId: string
  ): Promise<ListingStripeProduct> {
    const { data, error } = await supabaseAdmin
      .from('listing_stripe_products')
      .insert({
        listing_id: listingId,
        user_id: userId,
        stripe_product_id: stripeProductId,
        stripe_price_id: stripePriceId,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create listing Stripe product: ${error.message}`);
    }

    return data;
  }

  static async updateListingStripeProduct(
    listingId: string,
    updates: Partial<Omit<ListingStripeProduct, 'id' | 'listing_id' | 'user_id' | 'created_at' | 'updated_at'>>
  ): Promise<ListingStripeProduct> {
    const { data, error } = await supabaseAdmin
      .from('listing_stripe_products')
      .update(updates)
      .eq('listing_id', listingId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update listing Stripe product: ${error.message}`);
    }

    return data;
  }

  static async getUserListingProducts(userId: string): Promise<ListingStripeProduct[]> {
    const { data, error } = await supabaseAdmin
      .from('listing_stripe_products')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to get user listing products: ${error.message}`);
    }

    return data || [];
  }

  // Payment Transactions
  static async createPaymentTransaction(
    listingId: string,
    buyerId: string,
    sellerId: string,
    stripePaymentIntentId: string,
    amount: number,
    currency: string,
    stripeAccountId: string,
    checkoutSessionId?: string
  ): Promise<PaymentTransaction> {
    const { data, error } = await supabaseAdmin
      .from('payment_transactions')
      .insert({
        listing_id: listingId,
        buyer_id: buyerId,
        seller_id: sellerId,
        stripe_payment_intent_id: stripePaymentIntentId,
        stripe_checkout_session_id: checkoutSessionId,
        amount,
        currency,
        stripe_account_id: stripeAccountId,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create payment transaction: ${error.message}`);
    }

    return data;
  }

  static async updatePaymentTransaction(
    stripePaymentIntentId: string,
    updates: Partial<Pick<PaymentTransaction, 'status' | 'stripe_checkout_session_id'>>
  ): Promise<PaymentTransaction> {
    const { data, error } = await supabaseAdmin
      .from('payment_transactions')
      .update(updates)
      .eq('stripe_payment_intent_id', stripePaymentIntentId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update payment transaction: ${error.message}`);
    }

    return data;
  }

  static async getPaymentTransaction(
    stripePaymentIntentId: string
  ): Promise<PaymentTransaction | null> {
    const { data, error } = await supabaseAdmin
      .from('payment_transactions')
      .select('*')
      .eq('stripe_payment_intent_id', stripePaymentIntentId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to get payment transaction: ${error.message}`);
    }

    return data;
  }

  static async getUserTransactions(
    userId: string,
    type: 'buyer' | 'seller' | 'all' = 'all'
  ): Promise<PaymentTransaction[]> {
    let query = supabaseAdmin.from('payment_transactions').select('*');

    if (type === 'buyer') {
      query = query.eq('buyer_id', userId);
    } else if (type === 'seller') {
      query = query.eq('seller_id', userId);
    } else {
      query = query.or(`buyer_id.eq.${userId},seller_id.eq.${userId}`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to get user transactions: ${error.message}`);
    }

    return data || [];
  }

  static async getListingTransactions(listingId: string): Promise<PaymentTransaction[]> {
    const { data, error } = await supabaseAdmin
      .from('payment_transactions')
      .select('*')
      .eq('listing_id', listingId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to get listing transactions: ${error.message}`);
    }

    return data || [];
  }
}
