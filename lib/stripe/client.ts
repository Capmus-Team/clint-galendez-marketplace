import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null> | null = null;

export const getStripe = () => {
  if (!stripePromise) {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    
    if (!publishableKey) {
      // During build time, return null promise instead of throwing
      if (typeof window === 'undefined' && process.env.NODE_ENV === 'production') {
        stripePromise = Promise.resolve(null);
        return stripePromise;
      }
      throw new Error('Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable');
    }
    
    stripePromise = loadStripe(publishableKey);
  }
  
  return stripePromise;
};

export default getStripe;
