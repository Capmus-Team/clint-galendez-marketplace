import { NextRequest, NextResponse } from 'next/server';
import { StripeService } from '@/lib/stripe';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { listingId, sellerId, successUrl, cancelUrl } = body;

    // Get authenticated user
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if listing can be purchased
    const eligibility = await StripeService.Payment.canPurchaseListing(listingId, user.id);
    
    if (!eligibility.canPurchase) {
      return NextResponse.json(
        { error: eligibility.reason },
        { status: 400 }
      );
    }

    // Create checkout session
    const session = await StripeService.Payment.createCheckoutSession(
      {
        listingId,
        sellerId,
        successUrl,
        cancelUrl,
      },
      user.id
    );

    return NextResponse.json(session);
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
