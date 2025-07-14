import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
  typescript: true,
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
