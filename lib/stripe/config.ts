import Stripe from 'stripe';

let stripeInstance: Stripe | null = null;

/**
 * Get Stripe instance with lazy initialization
 * This prevents build-time errors when environment variables are not available
 */
export const getStripe = (): Stripe => {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('Missing STRIPE_SECRET_KEY environment variable');
    }
    
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-06-30.basil',
      typescript: true,
    });
  }
  
  return stripeInstance;
};

// For backward compatibility - this will only be used at runtime
export const stripe = new Proxy({} as Stripe, {
  get(target, prop) {
    return getStripe()[prop as keyof Stripe];
  }
});

export const STRIPE_CONFIG = {
  currency: 'usd',
  applicationFeePercent: 2.9, // 2.9% platform fee
  accountType: 'express' as const,
  capabilities: {
    card_payments: { requested: true },
    transfers: { requested: true },
  },
} as const;

export default stripe;
