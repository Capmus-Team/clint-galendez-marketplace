-- Stripe Integration Database Setup
-- This script sets up the necessary database schema for Stripe integration

-- Enable Wrappers extension
CREATE EXTENSION IF NOT EXISTS wrappers WITH SCHEMA extensions;

-- Enable the Stripe Wrapper
CREATE FOREIGN DATA WRAPPER stripe_wrapper
  HANDLER stripe_fdw_handler
  VALIDATOR stripe_fdw_validator;

-- Store Stripe credentials in Vault (recommended)
-- Replace <your_stripe_api_key> with your actual Stripe secret key
-- SELECT vault.create_secret(
--   '<your_stripe_api_key>',
--   'stripe',
--   'Stripe API key for Wrappers'
-- );

-- Create Stripe server connection
-- Uncomment and modify one of the following based on your setup:

-- With Vault (recommended):
-- CREATE SERVER stripe_server
--   FOREIGN DATA WRAPPER stripe_wrapper
--   OPTIONS (
--     api_key_id '<key_ID_from_vault>',
--     api_url 'https://api.stripe.com/v1/',
--     api_version '2024-06-20'
--   );

-- Without Vault (less secure):
-- CREATE SERVER stripe_server
--   FOREIGN DATA WRAPPER stripe_wrapper
--   OPTIONS (
--     api_key '<your_stripe_secret_key>',
--     api_url 'https://api.stripe.com/v1/',
--     api_version '2024-06-20'
--   );

-- Create Stripe schema
CREATE SCHEMA IF NOT EXISTS stripe;

-- Import all Stripe foreign tables
-- IMPORT FOREIGN SCHEMA stripe FROM SERVER stripe_server INTO stripe;

-- Or import specific tables only:
-- IMPORT FOREIGN SCHEMA stripe
--    LIMIT TO ("customers", "products", "prices", "checkout_sessions", "payment_intents")
--    FROM SERVER stripe_server INTO stripe;

-- Create application-specific tables for Stripe integration

-- User Stripe accounts table
CREATE TABLE IF NOT EXISTS user_stripe_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_account_id TEXT UNIQUE NOT NULL,
  account_type TEXT NOT NULL DEFAULT 'express', -- express, standard, custom
  charges_enabled BOOLEAN DEFAULT FALSE,
  payouts_enabled BOOLEAN DEFAULT FALSE,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_user_stripe UNIQUE(user_id)
);

-- Listing Stripe products table
CREATE TABLE IF NOT EXISTS listing_stripe_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL, -- References your listings table
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_product_id TEXT UNIQUE NOT NULL,
  stripe_price_id TEXT UNIQUE NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_listing_product UNIQUE(listing_id)
);

-- Payment transactions table
CREATE TABLE IF NOT EXISTS payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL,
  buyer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_payment_intent_id TEXT UNIQUE NOT NULL,
  stripe_checkout_session_id TEXT,
  amount BIGINT NOT NULL, -- Amount in cents
  currency TEXT NOT NULL DEFAULT 'usd',
  status TEXT NOT NULL DEFAULT 'pending', -- pending, succeeded, failed, canceled
  stripe_account_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_stripe_accounts_user_id ON user_stripe_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_stripe_accounts_stripe_id ON user_stripe_accounts(stripe_account_id);
CREATE INDEX IF NOT EXISTS idx_listing_stripe_products_listing_id ON listing_stripe_products(listing_id);
CREATE INDEX IF NOT EXISTS idx_listing_stripe_products_user_id ON listing_stripe_products(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_listing_id ON payment_transactions(listing_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_buyer_id ON payment_transactions(buyer_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_seller_id ON payment_transactions(seller_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_status ON payment_transactions(status);

-- Row Level Security (RLS) policies
ALTER TABLE user_stripe_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_stripe_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

-- Policies for user_stripe_accounts
CREATE POLICY "Users can view their own Stripe accounts" ON user_stripe_accounts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own Stripe accounts" ON user_stripe_accounts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own Stripe accounts" ON user_stripe_accounts
  FOR UPDATE USING (auth.uid() = user_id);

-- Service role can bypass RLS for server-side operations
CREATE POLICY "Service role can manage all Stripe accounts" ON user_stripe_accounts
  FOR ALL USING (current_setting('role') = 'service_role');

-- Policies for listing_stripe_products
CREATE POLICY "Users can view their own listing products" ON listing_stripe_products
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own listing products" ON listing_stripe_products
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own listing products" ON listing_stripe_products
  FOR UPDATE USING (auth.uid() = user_id);

-- Service role can bypass RLS for server-side operations
CREATE POLICY "Service role can manage all listing products" ON listing_stripe_products
  FOR ALL USING (current_setting('role') = 'service_role');

-- Policies for payment_transactions
CREATE POLICY "Users can view transactions they're involved in" ON payment_transactions
  FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- Service role can manage all payment transactions
CREATE POLICY "Service role can manage all payment transactions" ON payment_transactions
  FOR ALL USING (current_setting('role') = 'service_role');

-- Functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_user_stripe_accounts_updated_at
    BEFORE UPDATE ON user_stripe_accounts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_listing_stripe_products_updated_at
    BEFORE UPDATE ON listing_stripe_products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_transactions_updated_at
    BEFORE UPDATE ON payment_transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
