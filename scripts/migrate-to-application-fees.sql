-- Migration to support application fees instead of payment intents
-- Run this script to update existing tables

-- First, make the stripe_payment_intent_id column nullable
ALTER TABLE payment_transactions 
ALTER COLUMN stripe_payment_intent_id DROP NOT NULL;

-- Add new columns to payment_transactions table
ALTER TABLE payment_transactions 
ADD COLUMN IF NOT EXISTS stripe_application_fee_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_charge_id TEXT;

-- Create index for application fee lookups
CREATE INDEX IF NOT EXISTS idx_payment_transactions_application_fee_id 
ON payment_transactions(stripe_application_fee_id);

CREATE INDEX IF NOT EXISTS idx_payment_transactions_charge_id 
ON payment_transactions(stripe_charge_id);

-- Add unique constraint for application fee ID
ALTER TABLE payment_transactions 
ADD CONSTRAINT unique_application_fee UNIQUE(stripe_application_fee_id);

-- For future installations, you can drop the payment_intent_id column entirely:
-- ALTER TABLE payment_transactions DROP COLUMN stripe_payment_intent_id;
