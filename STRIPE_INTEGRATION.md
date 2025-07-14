# Stripe Integration for Marketplace

This is a comprehensive Stripe integration for your marketplace application that allows users to connect their Stripe accounts to sell listings and enables buyers to purchase directly from listings.

## 🚀 Features

- **Stripe Connect Integration**: Users can connect their Stripe accounts to receive payments
- **Product Management**: Automatically create Stripe products and prices for listings
- **Secure Payments**: Stripe Checkout integration for secure payment processing
- **Platform Fees**: Configurable platform commission fees
- **Real-time Status**: Account onboarding status tracking
- **Dashboard Access**: Direct access to Stripe Express dashboard
- **Webhook Handling**: Automatic payment status updates
- **Type Safety**: Full TypeScript support throughout

## 📁 Project Structure

```
lib/stripe/
├── index.ts                 # Main export file
├── types.ts                 # TypeScript interfaces
├── config.ts                # Stripe configuration
├── client.ts                # Client-side Stripe setup
├── database.ts              # Database operations
├── account-service.ts       # Stripe Connect account management
├── product-service.ts       # Product and price management
├── payment-service.ts       # Payment processing
└── hooks.ts                 # React hooks for Stripe operations

components/stripe/
├── stripe-account-setup.tsx    # Account connection component
├── buy-listing-button.tsx      # Purchase button component
└── stripe-product-setup.tsx    # Product setup component

app/api/stripe/
├── account/route.ts         # Account management API
├── products/route.ts        # Product management API
├── checkout/route.ts        # Checkout session API
├── dashboard/route.ts       # Dashboard link API
└── webhooks/route.ts        # Webhook handler

scripts/
└── stripe-setup.sql         # Database schema setup
```

## 🛠️ Setup Instructions

### 1. Environment Variables

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Database Setup

1. Run the Stripe setup SQL script in your Supabase database:
   ```sql
   -- Copy and run the contents of scripts/stripe-setup.sql
   ```

2. Set up the Stripe Wrapper in Supabase:
   ```sql
   -- Enable Wrappers extension
   CREATE EXTENSION IF NOT EXISTS wrappers WITH SCHEMA extensions;

   -- Enable Stripe Wrapper
   CREATE FOREIGN DATA WRAPPER stripe_wrapper
     HANDLER stripe_fdw_handler
     VALIDATOR stripe_fdw_validator;

   -- Store Stripe API key securely
   SELECT vault.create_secret(
     'your_stripe_secret_key',
     'stripe',
     'Stripe API key for Wrappers'
   );

   -- Create Stripe server
   CREATE SERVER stripe_server
     FOREIGN DATA WRAPPER stripe_wrapper
     OPTIONS (
       api_key_id 'key_id_from_vault',
       api_url 'https://api.stripe.com/v1/',
       api_version '2024-06-20'
     );

   -- Import Stripe foreign tables
   IMPORT FOREIGN SCHEMA stripe FROM SERVER stripe_server INTO stripe;
   ```

### 3. Stripe Dashboard Configuration

1. **Enable Connect**: Go to Stripe Dashboard → Connect → Settings
2. **Set up webhooks**: Add endpoint `https://yourapp.com/api/stripe/webhooks`
   - Events to listen for:
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
     - `account.updated`
     - `checkout.session.completed`

### 4. Application Configuration

The platform fee is configured in `lib/stripe/config.ts`:
```typescript
export const STRIPE_CONFIG = {
  applicationFeePercent: 2.9, // 2.9% platform fee
  // ... other config
};
```

## 🔧 Usage

### For Sellers

1. **Connect Stripe Account**:
   ```tsx
   import { StripeAccountSetup } from '@/components/stripe/stripe-account-setup';
   
   function ProfilePage() {
     return <StripeAccountSetup />;
   }
   ```

2. **Enable Payments for Listing**:
   ```tsx
   import { CreateStripeProduct } from '@/components/stripe/stripe-product-setup';
   
   function ListingPage({ listingId }) {
     return (
       <CreateStripeProduct
         listingId={listingId}
         initialName="My Product"
         initialPrice={99.99}
         onSuccess={() => console.log('Product created!')}
       />
     );
   }
   ```

### For Buyers

```tsx
import { BuyListingButton } from '@/components/stripe/buy-listing-button';

function ListingPage({ listing }) {
  return (
    <BuyListingButton
      listingId={listing.id}
      sellerId={listing.user_id}
      listingTitle={listing.title}
      price={listing.price}
    />
  );
}
```

### Using React Hooks

```tsx
import { useStripeAccount, useStripeProduct, useStripeCheckout } from '@/lib/stripe/hooks';

function MyComponent() {
  const { accountStatus, createAccount } = useStripeAccount();
  const { createProduct } = useStripeProduct();
  const { createCheckoutSession } = useStripeCheckout();

  // Use the hooks as needed
}
```

### Server-side Operations

```typescript
import { StripeService } from '@/lib/stripe';

// Create a Stripe account
const result = await StripeService.Account.createAccount(
  userId,
  email,
  refreshUrl,
  returnUrl
);

// Create a product
const product = await StripeService.Product.createProduct({
  name: 'My Product',
  price: 99.99,
  listingId: 'listing-123',
}, sellerId);

// Create checkout session
const session = await StripeService.Payment.createCheckoutSession({
  listingId: 'listing-123',
  sellerId: 'seller-456',
  successUrl: 'https://app.com/success',
  cancelUrl: 'https://app.com/cancel',
}, buyerId);
```

## 🔒 Security Features

- **Row Level Security**: Database policies ensure users can only access their own data
- **Authentication**: All API routes require valid authentication
- **Webhook Verification**: Stripe webhook signatures are verified
- **Type Safety**: Full TypeScript coverage prevents runtime errors

## 🎨 UI Components

All components are built with:
- **Shadcn/ui**: Consistent design system
- **Tailwind CSS**: Utility-first styling
- **Lucide Icons**: Beautiful icons
- **Responsive Design**: Mobile-first approach

## 📊 Database Schema

Key tables created:
- `user_stripe_accounts`: Links users to their Stripe Connect accounts
- `listing_stripe_products`: Links listings to Stripe products/prices
- `payment_transactions`: Tracks all payment transactions

## 🔄 Payment Flow

1. **Seller Setup**:
   - User connects Stripe account
   - Completes onboarding
   - Creates products for listings

2. **Buyer Purchase**:
   - Clicks "Buy Now" button
   - Redirected to Stripe Checkout
   - Completes payment

3. **Post-Purchase**:
   - Webhook updates transaction status
   - Funds transferred to seller (minus platform fee)
   - Confirmation emails sent

## 🚨 Error Handling

The integration includes comprehensive error handling:
- Network errors
- Stripe API errors
- Authentication errors
- Validation errors
- Database errors

## 🧪 Testing

### Test Cards (Stripe Test Mode)

- **Success**: `4242424242424242`
- **Decline**: `4000000000000002`
- **3D Secure**: `4000002500003155`

### Webhook Testing

Use Stripe CLI to test webhooks locally:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhooks
```

## 📈 Monitoring

Monitor your integration:
- Stripe Dashboard for payment analytics
- Supabase Dashboard for database metrics
- Application logs for debugging

## 🔧 Customization

### Platform Fees

Modify `STRIPE_CONFIG.applicationFeePercent` in `lib/stripe/config.ts`

### Supported Currencies

Update currency options in product creation forms

### Payment Methods

Configure in Stripe Dashboard → Settings → Payment methods

## 🆘 Troubleshooting

### Common Issues

1. **"Seller not ready to accept payments"**:
   - Ensure Stripe onboarding is completed
   - Check account status in Stripe Dashboard

2. **Webhook not receiving events**:
   - Verify webhook endpoint URL
   - Check webhook secret in environment variables

3. **Database connection errors**:
   - Verify Supabase credentials
   - Check RLS policies

### Support

For issues specific to this integration, check:
1. Application logs
2. Stripe Dashboard logs
3. Supabase Dashboard logs

## 📄 License

This integration is part of your marketplace application and follows the same license terms.
