import Stripe from 'stripe';
import { stripe } from './config';
import { StripeDatabase } from './database';
import { ListingService } from '../listings/listing-service';

export class ApplicationFeeWebhookService {
  /**
   * Handle application_fee.created webhook
   * This is called when a platform fee is collected from a successful payment
   */
  static async handleApplicationFeeCreated(applicationFee: Stripe.ApplicationFee): Promise<void> {
    try {
      console.log('Processing application fee:', applicationFee.id);

      // Get the charge ID from the application fee
      const chargeId = applicationFee.charge as string;
      
      if (!chargeId) {
        console.error('No charge ID found for application fee:', applicationFee.id);
        return;
      }

      console.log('Fetching charge details for charge ID:', chargeId);

      // Fetch the full charge object from Stripe to get metadata
      const charge = await stripe.charges.retrieve(chargeId, {
        stripeAccount: applicationFee.account as string,
      });

      console.log('Charge metadata:', charge.metadata);

      // Extract metadata from the charge to get listing information
      const metadata = charge.metadata;
      const listingId = metadata?.listing_id;
      const buyerId = metadata?.buyer_id;
      const sellerId = metadata?.seller_id;

      if (!listingId || !buyerId || !sellerId) {
        console.error('Missing required metadata in charge:', charge.id, 'metadata:', metadata);
        return;
      }

      console.log(`Processing purchase for listing: ${listingId}, buyer: ${buyerId}, seller: ${sellerId}`);

      // Create or update payment transaction record
      await this.createOrUpdatePaymentTransaction(
        listingId,
        buyerId,
        sellerId,
        applicationFee,
        charge
      );

      // Mark the listing as sold
      try {
        await ListingService.markListingAsSold(listingId);
        console.log(`Successfully marked listing ${listingId} as sold`);
      } catch (listingError) {
        console.error(`Error marking listing ${listingId} as sold:`, listingError);
        // Don't throw here - the payment is still successful even if listing update fails
      }

      console.log(`Successfully processed application fee ${applicationFee.id} - listing ${listingId} processed`);

    } catch (error) {
      console.error('Error processing application fee:', error);
      // Don't re-throw the error to avoid webhook retry loops for non-recoverable errors
      // Stripe will retry the webhook automatically for 500 errors
    }
  }

  /**
   * Create or update payment transaction record
   */
  private static async createOrUpdatePaymentTransaction(
    listingId: string,
    buyerId: string,
    sellerId: string,
    applicationFee: Stripe.ApplicationFee,
    charge: Stripe.Charge
  ): Promise<void> {
    try {
      // Check if transaction already exists
      const existingTransaction = await StripeDatabase.getPaymentTransaction(applicationFee.id);

      if (existingTransaction) {
        // Update existing transaction
        await StripeDatabase.updatePaymentTransaction(applicationFee.id, {
          status: 'succeeded',
          stripe_charge_id: charge.id,
        });
        console.log(`Updated existing payment transaction for application fee: ${applicationFee.id}`);
      } else {
        // Create new transaction
        const amount = applicationFee.amount; // This is the platform fee amount
        const currency = applicationFee.currency;
        const stripeAccountId = applicationFee.account as string;

        await StripeDatabase.createPaymentTransaction(
          listingId,
          buyerId,
          sellerId,
          applicationFee.id,
          amount,
          currency,
          stripeAccountId,
          charge.id
        );
        console.log(`Created new payment transaction for application fee: ${applicationFee.id}`);
      }
    } catch (error) {
      console.error('Error creating/updating payment transaction:', error);
      // Log the error but don't throw - this shouldn't prevent the listing from being marked as sold
    }
  }

  /**
   * Handle application_fee.refunded webhook
   * This could be used if you need to handle refunds
   */
  static async handleApplicationFeeRefunded(applicationFee: Stripe.ApplicationFee): Promise<void> {
    try {
      console.log('Processing application fee refund:', applicationFee.id);

      // Update payment transaction status
      await StripeDatabase.updatePaymentTransaction(applicationFee.id, {
        status: 'failed',
      });

      // You might want to revert the listing status or handle the refund logic here
      console.log(`Successfully processed application fee refund: ${applicationFee.id}`);

    } catch (error) {
      console.error('Error processing application fee refund:', error);
      throw error;
    }
  }

  /**
   * Extract listing information from checkout session metadata
   * This is a helper method to get listing details from various sources
   */
  static async extractListingInfoFromMetadata(
    applicationFee: Stripe.ApplicationFee
  ): Promise<{
    listingId: string;
    buyerId: string;
    sellerId: string;
  } | null> {
    try {
      const chargeId = applicationFee.charge as string;
      
      if (!chargeId) {
        return null;
      }

      // Fetch the full charge object from Stripe to get metadata
      const charge = await stripe.charges.retrieve(chargeId, {
        stripeAccount: applicationFee.account as string,
      });
      
      if (!charge || !charge.metadata) {
        return null;
      }

      const { listing_id, buyer_id, seller_id } = charge.metadata;

      if (!listing_id || !buyer_id || !seller_id) {
        return null;
      }

      return {
        listingId: listing_id,
        buyerId: buyer_id,
        sellerId: seller_id,
      };
    } catch (error) {
      console.error('Error extracting listing info from metadata:', error);
      return null;
    }
  }
}
