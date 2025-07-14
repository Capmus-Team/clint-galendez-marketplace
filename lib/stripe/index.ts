export * from './types';
export * from './config';
export * from './database';
export * from './account-service';
export * from './product-service';
export * from './payment-service';
export * from './hooks';
export * from './client';

// Main Stripe service aggregator
import { StripeAccountService } from './account-service';
import { StripeProductService } from './product-service';
import { StripePaymentService } from './payment-service';
import { StripeDatabase } from './database';

export const StripeService = {
  Account: StripeAccountService,
  Product: StripeProductService,
  Payment: StripePaymentService,
  Database: StripeDatabase,
} as const;

export default StripeService;
