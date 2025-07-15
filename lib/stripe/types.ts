// Stripe Types
export interface StripeAccount {
  id: string;
  user_id: string;
  stripe_account_id: string;
  account_type: 'express' | 'standard' | 'custom';
  charges_enabled: boolean;
  payouts_enabled: boolean;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface ListingStripeProduct {
  id: string;
  listing_id: string;
  user_id: string;
  stripe_product_id: string;
  stripe_price_id: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaymentTransaction {
  id: string;
  listing_id: string;
  buyer_id: string;
  seller_id: string;
  stripe_application_fee_id: string; // Changed from stripe_payment_intent_id
  stripe_charge_id?: string; // Added to track the underlying charge
  stripe_checkout_session_id?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed' | 'canceled';
  stripe_account_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateStripeAccountResponse {
  account: any;
  onboardingUrl: string;
}

export interface CreateProductRequest {
  name: string;
  description?: string;
  price: number;
  currency?: string;
  listingId: string;
}

export interface CreateCheckoutSessionRequest {
  listingId: string;
  sellerId: string;
  successUrl: string;
  cancelUrl: string;
}

export interface StripeAccountStatus {
  connected: boolean;
  onboardingCompleted: boolean;
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  account?: StripeAccount;
}

export interface CheckoutSessionResponse {
  sessionId: string;
  url: string;
}
