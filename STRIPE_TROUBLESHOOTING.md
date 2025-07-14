# Stripe Integration Troubleshooting Guide

## Row Level Security (RLS) Issues

### Problem: "new row violates row-level security policy"

This error occurs when the server-side API routes try to insert data into Supabase tables with Row Level Security enabled, but the authentication context is not properly set up.

### Solution

1. **Add Service Role Key to Environment Variables**

   Add the following to your `.env.local` file:
   ```
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

   You can find your service role key in:
   - Supabase Dashboard → Settings → API → Service Role Key

2. **Update RLS Policies**

   Run the following SQL in your Supabase SQL Editor to add service role policies:

   ```sql
   -- Allow service role to bypass RLS for user_stripe_accounts
   CREATE POLICY "Service role can manage all Stripe accounts" ON user_stripe_accounts
     FOR ALL USING (current_setting('role') = 'service_role');

   -- Allow service role to bypass RLS for listing_stripe_products  
   CREATE POLICY "Service role can manage all listing products" ON listing_stripe_products
     FOR ALL USING (current_setting('role') = 'service_role');

   -- Allow service role to bypass RLS for payment_transactions
   CREATE POLICY "Service role can manage all payment transactions" ON payment_transactions
     FOR ALL USING (current_setting('role') = 'service_role');
   ```

3. **Verify Database Operations Use Admin Client**

   The code should use `supabaseAdmin` for server-side operations:
   ```typescript
   import { supabaseAdmin } from '../supabase-admin';
   
   // Use supabaseAdmin instead of supabase for server operations
   const { data, error } = await supabaseAdmin
     .from('user_stripe_accounts')
     .insert(...)
   ```

### Quick Fix Commands

1. **Check if you have the service role key**:
   ```bash
   # In your project directory
   grep -r "SUPABASE_SERVICE_ROLE_KEY" .env.local
   ```

2. **Test database connection**:
   ```bash
   npm run setup:stripe
   ```

3. **Verify RLS policies**:
   ```sql
   -- Check existing policies
   SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
   FROM pg_policies 
   WHERE tablename IN ('user_stripe_accounts', 'listing_stripe_products', 'payment_transactions');
   ```

## Common Environment Variable Issues

### Missing Stripe Keys

**Error**: "Missing STRIPE_SECRET_KEY environment variable"

**Solution**: Add Stripe keys to `.env.local`:
```
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Missing App URL

**Error**: Checkout redirects failing

**Solution**: Set your app URL:
```
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Stripe Connect Issues

### Account Creation Fails

**Symptoms**: 
- Error creating Stripe account
- User can't complete onboarding

**Solutions**:
1. Verify Stripe Connect is enabled in your Stripe Dashboard
2. Check that your app is properly configured in Stripe Connect settings
3. Ensure redirect URLs are whitelisted

### Onboarding URL Issues

**Symptoms**:
- Onboarding links don't work
- Users can't complete setup

**Solutions**:
1. Check return and refresh URLs are correct
2. Verify domain is added to Stripe Connect settings
3. Use HTTPS in production

## Payment Processing Issues

### Checkout Session Creation Fails

**Common causes**:
1. Seller account not properly set up
2. Product not created in Stripe
3. Missing price information

**Debug steps**:
1. Check seller account status: `GET /api/stripe/account`
2. Verify product exists: `GET /api/stripe/products?listingId=...`
3. Check Stripe Dashboard for error details

### Webhook Not Receiving Events

**Solutions**:
1. Verify webhook endpoint URL in Stripe Dashboard
2. Check webhook secret matches environment variable
3. Test with Stripe CLI: `stripe listen --forward-to localhost:3000/api/stripe/webhooks`

## Database Connection Issues

### Tables Not Found

**Error**: "relation does not exist"

**Solution**: Run the database setup:
```bash
npm run setup:stripe
```

Or manually run the SQL from `scripts/stripe-setup.sql`

### Permission Denied

**Error**: "permission denied for table"

**Solution**: Check user permissions in Supabase Dashboard → Authentication → Users

## Development vs Production

### Test vs Live Keys

**Development**: Use test keys (sk_test_, pk_test_)
**Production**: Use live keys (sk_live_, pk_live_)

### Webhook Endpoints

**Development**: Use ngrok or Stripe CLI for local testing
**Production**: Use your actual domain with HTTPS

## Getting Help

1. **Check Logs**:
   - Browser Console for client-side errors
   - Next.js console for server-side errors
   - Stripe Dashboard → Developers → Logs

2. **Test Integration**:
   - Use Stripe test cards: 4242424242424242
   - Check webhook delivery in Stripe Dashboard

3. **Verify Setup**:
   ```bash
   # Check environment variables
   npm run setup:stripe
   
   # Test API endpoints
   curl -X GET http://localhost:3000/api/stripe/account \
     -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
   ```

4. **Common Test Cards**:
   - Success: 4242424242424242
   - Decline: 4000000000000002
   - 3D Secure: 4000002500003155

## Support Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
