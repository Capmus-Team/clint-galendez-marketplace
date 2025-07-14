import { stripe, STRIPE_CONFIG } from './config';
import { StripeDatabase } from './database';
import type { CreateProductRequest } from './types';

export class StripeProductService {
  /**
   * Create a Stripe product and price for a listing
   */
  static async createProduct(request: CreateProductRequest, sellerId: string): Promise<{
    productId: string;
    priceId: string;
  }> {
    try {
      // Get seller's Stripe account
      const sellerAccount = await StripeDatabase.getUserStripeAccount(sellerId);
      
      if (!sellerAccount) {
        throw new Error('Seller must have a connected Stripe account');
      }

      if (!sellerAccount.charges_enabled) {
        throw new Error('Seller account is not ready to accept payments');
      }

      // Create product
      const product = await stripe.products.create({
        name: request.name,
        description: request.description,
        metadata: {
          listing_id: request.listingId,
          seller_id: sellerId,
        },
      }, {
        stripeAccount: sellerAccount.stripe_account_id,
      });

      // Create price
      const price = await stripe.prices.create({
        unit_amount: Math.round(request.price * 100), // Convert to cents
        currency: request.currency || STRIPE_CONFIG.currency,
        product: product.id,
        metadata: {
          listing_id: request.listingId,
          seller_id: sellerId,
        },
      }, {
        stripeAccount: sellerAccount.stripe_account_id,
      });

      // Save to database
      await StripeDatabase.createListingStripeProduct(
        request.listingId,
        sellerId,
        product.id,
        price.id
      );

      return {
        productId: product.id,
        priceId: price.id,
      };
    } catch (error) {
      console.error('Error creating Stripe product:', error);
      throw new Error('Failed to create Stripe product');
    }
  }

  /**
   * Update a Stripe product
   */
  static async updateProduct(
    listingId: string,
    updates: {
      name?: string;
      description?: string;
      active?: boolean;
    }
  ): Promise<void> {
    try {
      const listingProduct = await StripeDatabase.getListingStripeProduct(listingId);
      
      if (!listingProduct) {
        throw new Error('No Stripe product found for this listing');
      }

      const sellerAccount = await StripeDatabase.getUserStripeAccount(listingProduct.user_id);
      
      if (!sellerAccount) {
        throw new Error('Seller account not found');
      }

      // Update product in Stripe
      await stripe.products.update(listingProduct.stripe_product_id, {
        name: updates.name,
        description: updates.description,
        active: updates.active,
      }, {
        stripeAccount: sellerAccount.stripe_account_id,
      });

      // Update in database if active status changed
      if (updates.active !== undefined) {
        await StripeDatabase.updateListingStripeProduct(listingId, {
          active: updates.active,
        });
      }
    } catch (error) {
      console.error('Error updating Stripe product:', error);
      throw new Error('Failed to update Stripe product');
    }
  }

  /**
   * Update the price of a listing (creates new price, archives old one)
   */
  static async updatePrice(
    listingId: string,
    newPrice: number,
    currency: string = STRIPE_CONFIG.currency
  ): Promise<string> {
    try {
      const listingProduct = await StripeDatabase.getListingStripeProduct(listingId);
      
      if (!listingProduct) {
        throw new Error('No Stripe product found for this listing');
      }

      const sellerAccount = await StripeDatabase.getUserStripeAccount(listingProduct.user_id);
      
      if (!sellerAccount) {
        throw new Error('Seller account not found');
      }

      // Archive the old price
      await stripe.prices.update(listingProduct.stripe_price_id, {
        active: false,
      }, {
        stripeAccount: sellerAccount.stripe_account_id,
      });

      // Create new price
      const newPriceObj = await stripe.prices.create({
        unit_amount: Math.round(newPrice * 100), // Convert to cents
        currency,
        product: listingProduct.stripe_product_id,
        metadata: {
          listing_id: listingId,
          seller_id: listingProduct.user_id,
        },
      }, {
        stripeAccount: sellerAccount.stripe_account_id,
      });

      // Update database with new price ID
      await StripeDatabase.updateListingStripeProduct(listingId, {
        stripe_price_id: newPriceObj.id,
      });

      return newPriceObj.id;
    } catch (error) {
      console.error('Error updating Stripe price:', error);
      throw new Error('Failed to update Stripe price');
    }
  }

  /**
   * Deactivate a product (when listing is deleted or deactivated)
   */
  static async deactivateProduct(listingId: string): Promise<void> {
    try {
      await this.updateProduct(listingId, { active: false });
    } catch (error) {
      console.error('Error deactivating Stripe product:', error);
      throw new Error('Failed to deactivate Stripe product');
    }
  }

  /**
   * Get product details from Stripe
   */
  static async getProduct(listingId: string): Promise<any> {
    try {
      const listingProduct = await StripeDatabase.getListingStripeProduct(listingId);
      
      if (!listingProduct) {
        return null;
      }

      const sellerAccount = await StripeDatabase.getUserStripeAccount(listingProduct.user_id);
      
      if (!sellerAccount) {
        throw new Error('Seller account not found');
      }

      const product = await stripe.products.retrieve(
        listingProduct.stripe_product_id,
        { stripeAccount: sellerAccount.stripe_account_id }
      );

      const price = await stripe.prices.retrieve(
        listingProduct.stripe_price_id,
        { stripeAccount: sellerAccount.stripe_account_id }
      );

      return {
        product,
        price,
        listingProduct,
      };
    } catch (error) {
      console.error('Error getting Stripe product:', error);
      throw new Error('Failed to get Stripe product');
    }
  }
}
