import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Listing {
  id: string
  title: string
  description?: string
  price: number
  category: string
  location?: string
  contact_email: string
  image_url?: string
  status: string // 'available' | 'sold' | 'pending'
  created_at: string
  updated_at: string
  user_id: string // seller's user id
}

export interface Message {
  id: string
  listing_id: string
  buyer_email: string
  seller_email: string
  message: string
  created_at: string
}

export interface PaymentTransaction {
  id: string
  listing_id: string
  buyer_id: string
  seller_id: string
  stripe_payment_intent_id: string
  stripe_checkout_session_id?: string
  amount: number
  currency: string
  status: 'pending' | 'succeeded' | 'failed' | 'canceled'
  stripe_account_id: string
  created_at: string
  updated_at: string
}
