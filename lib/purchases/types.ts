export interface PurchasedItem {
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
  // Joined data from listings table
  listings?: {
    id: string
    title: string
    description?: string
    price: number
    category: string
    location?: string
    image_url?: string
    contact_email: string
  }
  // Joined data from seller profile
  seller?: {
    id: string
    email?: string
  }
}

export interface UsePurchasedItemsResult {
  purchasedItems: PurchasedItem[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}
