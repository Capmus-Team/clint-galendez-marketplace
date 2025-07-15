export * from './types';
export * from './config';
export * from './database';
export * from './account-service';
export * from './product-service';
export * from './payment-service';
export * from './application-fee-webhook';
export * from './hooks';
export { getStripe as getStripeClient } from './client';

// Main Stripe service aggregator
import { StripeAccountService } from './account-service';
import { StripeProductService } from './product-service';
import { StripePaymentService } from './payment-service';
import { ApplicationFeeWebhookService } from './application-fee-webhook';
import { StripeDatabase } from './database';

export const StripeService = {
  Account: StripeAccountService,
  Product: StripeProductService,
  Payment: StripePaymentService,
  ApplicationFeeWebhook: ApplicationFeeWebhookService,
  Database: StripeDatabase,
} as const;

export default StripeService;
