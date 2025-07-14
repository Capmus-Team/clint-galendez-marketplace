import { stripe, STRIPE_CONFIG } from './config';
import { StripeDatabase } from './database';
import type { 
  CreateStripeAccountResponse, 
  CreateProductRequest, 
  CreateCheckoutSessionRequest,
  CheckoutSessionResponse,
  StripeAccountStatus
} from './types';

export class StripeAccountService {
  /**
   * Create a new Stripe Connect account for a user
   */
  static async createAccount(
    userId: string, 
    email: string,
    refreshUrl: string,
    returnUrl: string
  ): Promise<CreateStripeAccountResponse> {
    try {
      // Create Stripe Connect account
      const account = await stripe.accounts.create({
        type: STRIPE_CONFIG.accountType,
        email,
        capabilities: STRIPE_CONFIG.capabilities,
      });

      // Save to database
      await StripeDatabase.createUserStripeAccount(
        userId,
        account.id,
        STRIPE_CONFIG.accountType
      );

      // Create onboarding link
      const accountLink = await stripe.accountLinks.create({
        account: account.id,
        refresh_url: refreshUrl,
        return_url: returnUrl,
        type: 'account_onboarding',
      });

      return {
        account,
        onboardingUrl: accountLink.url,
      };
    } catch (error) {
      console.error('Error creating Stripe account:', error);
      throw new Error('Failed to create Stripe account');
    }
  }

  /**
   * Get the onboarding URL for an existing account
   */
  static async getOnboardingUrl(
    stripeAccountId: string,
    refreshUrl: string,
    returnUrl: string
  ): Promise<string> {
    try {
      const accountLink = await stripe.accountLinks.create({
        account: stripeAccountId,
        refresh_url: refreshUrl,
        return_url: returnUrl,
        type: 'account_onboarding',
      });

      return accountLink.url;
    } catch (error) {
      console.error('Error creating onboarding URL:', error);
      throw new Error('Failed to create onboarding URL');
    }
  }

  /**
   * Get account status and update database
   */
  static async getAccountStatus(userId: string): Promise<StripeAccountStatus> {
    try {
      const dbAccount = await StripeDatabase.getUserStripeAccount(userId);
      
      if (!dbAccount) {
        return {
          connected: false,
          onboardingCompleted: false,
          chargesEnabled: false,
          payoutsEnabled: false,
        };
      }

      // Get latest status from Stripe
      const stripeAccount = await stripe.accounts.retrieve(dbAccount.stripe_account_id);
      
      const chargesEnabled = stripeAccount.charges_enabled || false;
      const payoutsEnabled = stripeAccount.payouts_enabled || false;
      const onboardingCompleted = chargesEnabled && payoutsEnabled;

      // Update database if status changed
      if (
        dbAccount.charges_enabled !== chargesEnabled ||
        dbAccount.payouts_enabled !== payoutsEnabled ||
        dbAccount.onboarding_completed !== onboardingCompleted
      ) {
        await StripeDatabase.updateUserStripeAccount(userId, {
          charges_enabled: chargesEnabled,
          payouts_enabled: payoutsEnabled,
          onboarding_completed: onboardingCompleted,
        });
      }

      return {
        connected: true,
        onboardingCompleted,
        chargesEnabled,
        payoutsEnabled,
        account: {
          ...dbAccount,
          charges_enabled: chargesEnabled,
          payouts_enabled: payoutsEnabled,
          onboarding_completed: onboardingCompleted,
        },
      };
    } catch (error) {
      console.error('Error getting account status:', error);
      throw new Error('Failed to get account status');
    }
  }

  /**
   * Create a login link for the Stripe Express dashboard
   */
  static async createDashboardLink(stripeAccountId: string): Promise<string> {
    try {
      const loginLink = await stripe.accounts.createLoginLink(stripeAccountId);
      return loginLink.url;
    } catch (error) {
      console.error('Error creating dashboard link:', error);
      throw new Error('Failed to create dashboard link');
    }
  }

  /**
   * Delete a Stripe account (careful with this!)
   */
  static async deleteAccount(stripeAccountId: string): Promise<void> {
    try {
      await stripe.accounts.del(stripeAccountId);
    } catch (error) {
      console.error('Error deleting Stripe account:', error);
      throw new Error('Failed to delete Stripe account');
    }
  }
}
