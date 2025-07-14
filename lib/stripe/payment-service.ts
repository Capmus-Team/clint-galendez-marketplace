import { stripe, STRIPE_CONFIG } from './config';
import { StripeDatabase } from './database';
import type { CreateCheckoutSessionRequest, CheckoutSessionResponse } from './types';

export class StripePaymentService {
  /**
   * Create a Checkout Session for purchasing a listing
   */
  static async createCheckoutSession(
    request: CreateCheckoutSessionRequest,
    buyerId: string
  ): Promise<CheckoutSessionResponse> {
    try {
      // Get listing product
      const listingProduct = await StripeDatabase.getListingStripeProduct(request.listingId);
      
      if (!listingProduct) {
        throw new Error('This listing is not available for purchase');
      }

      if (!listingProduct.active) {
        throw new Error('This listing is no longer active');
      }

      // Get seller account
      const sellerAccount = await StripeDatabase.getUserStripeAccount(request.sellerId);
      
      if (!sellerAccount || !sellerAccount.charges_enabled) {
        throw new Error('Seller is not ready to accept payments');
      }

      // Get price details
      const price = await stripe.prices.retrieve(
        listingProduct.stripe_price_id,
        { stripeAccount: sellerAccount.stripe_account_id }
      );

      // Calculate application fee (platform commission)
      const applicationFee = Math.round((price.unit_amount || 0) * (STRIPE_CONFIG.applicationFeePercent / 100));

      // Create Checkout Session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: listingProduct.stripe_price_id,
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: request.successUrl,
        cancel_url: request.cancelUrl,
        payment_intent_data: {
          application_fee_amount: applicationFee,
          metadata: {
            listing_id: request.listingId,
            buyer_id: buyerId,
            seller_id: request.sellerId,
          },
        },
        metadata: {
          listing_id: request.listingId,
          buyer_id: buyerId,
          seller_id: request.sellerId,
        },
      }, {
        stripeAccount: sellerAccount.stripe_account_id,
      });

      // Create payment transaction record
      if (session.payment_intent) {
        await StripeDatabase.createPaymentTransaction(
          request.listingId,
          buyerId,
          request.sellerId,
          session.payment_intent as string,
          price.unit_amount || 0,
          price.currency,
          sellerAccount.stripe_account_id,
          session.id
        );
      }

      return {
        sessionId: session.id,
        url: session.url || '',
      };
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw new Error('Failed to create checkout session');
    }
  }

  /**
   * Handle successful payment (webhook or redirect)
   */
  static async handleSuccessfulPayment(
    paymentIntentId: string,
    stripeAccountId: string
  ): Promise<void> {
    try {
      // Get payment intent details
      const paymentIntent = await stripe.paymentIntents.retrieve(
        paymentIntentId,
        { stripeAccount: stripeAccountId }
      );

      // Update transaction status
      await StripeDatabase.updatePaymentTransaction(paymentIntentId, {
        status: 'succeeded',
      });

      // You can add additional logic here like:
      // - Send email notifications
      // - Update listing status
      // - Create order records
      // - etc.

      console.log('Payment processed successfully:', paymentIntentId);
    } catch (error) {
      console.error('Error handling successful payment:', error);
      throw new Error('Failed to handle successful payment');
    }
  }

  /**
   * Handle failed payment
   */
  static async handleFailedPayment(
    paymentIntentId: string,
    stripeAccountId: string
  ): Promise<void> {
    try {
      // Update transaction status
      await StripeDatabase.updatePaymentTransaction(paymentIntentId, {
        status: 'failed',
      });

      console.log('Payment failed:', paymentIntentId);
    } catch (error) {
      console.error('Error handling failed payment:', error);
      throw new Error('Failed to handle failed payment');
    }
  }

  /**
   * Create a refund
   */
  static async createRefund(
    paymentIntentId: string,
    amount?: number,
    reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer'
  ): Promise<any> {
    try {
      // Get transaction details
      const transaction = await StripeDatabase.getPaymentTransaction(paymentIntentId);
      
      if (!transaction) {
        throw new Error('Transaction not found');
      }

      if (transaction.status !== 'succeeded') {
        throw new Error('Can only refund successful payments');
      }

      // Get seller account
      const sellerAccount = await StripeDatabase.getUserStripeAccount(transaction.seller_id);
      
      if (!sellerAccount) {
        throw new Error('Seller account not found');
      }

      // Create refund
      const refund = await stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: amount ? Math.round(amount * 100) : undefined, // Convert to cents if specified
        reason,
        metadata: {
          listing_id: transaction.listing_id,
          buyer_id: transaction.buyer_id,
          seller_id: transaction.seller_id,
        },
      }, {
        stripeAccount: sellerAccount.stripe_account_id,
      });

      return refund;
    } catch (error) {
      console.error('Error creating refund:', error);
      throw new Error('Failed to create refund');
    }
  }

  /**
   * Get payment details
   */
  static async getPaymentDetails(paymentIntentId: string): Promise<any> {
    try {
      const transaction = await StripeDatabase.getPaymentTransaction(paymentIntentId);
      
      if (!transaction) {
        throw new Error('Transaction not found');
      }

      // Get seller account
      const sellerAccount = await StripeDatabase.getUserStripeAccount(transaction.seller_id);
      
      if (!sellerAccount) {
        throw new Error('Seller account not found');
      }

      // Get payment intent from Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(
        paymentIntentId,
        {
          expand: ['charges'],
        },
        {
          stripeAccount: sellerAccount.stripe_account_id,
        }
      );

      return {
        transaction,
        paymentIntent,
      };
    } catch (error) {
      console.error('Error getting payment details:', error);
      throw new Error('Failed to get payment details');
    }
  }

  /**
   * Check if a listing can be purchased
   */
  static async canPurchaseListing(listingId: string, buyerId: string): Promise<{
    canPurchase: boolean;
    reason?: string;
  }> {
    try {
      // Get listing product
      const listingProduct = await StripeDatabase.getListingStripeProduct(listingId);
      
      if (!listingProduct) {
        return { canPurchase: false, reason: 'This listing is not available for purchase' };
      }

      if (!listingProduct.active) {
        return { canPurchase: false, reason: 'This listing is no longer active' };
      }

      // Check if buyer is trying to buy their own listing
      if (listingProduct.user_id === buyerId) {
        return { canPurchase: false, reason: 'You cannot purchase your own listing' };
      }

      // Get seller account status
      const sellerAccount = await StripeDatabase.getUserStripeAccount(listingProduct.user_id);
      
      if (!sellerAccount || !sellerAccount.charges_enabled) {
        return { canPurchase: false, reason: 'Seller is not ready to accept payments' };
      }

      return { canPurchase: true };
    } catch (error) {
      console.error('Error checking if listing can be purchased:', error);
      return { canPurchase: false, reason: 'Unable to verify purchase eligibility' };
    }
  }
}
