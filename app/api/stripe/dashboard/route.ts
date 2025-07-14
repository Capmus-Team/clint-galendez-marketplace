import { NextRequest, NextResponse } from 'next/server';
import { StripeService } from '@/lib/stripe';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { stripeAccountId } = body;

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

    // Verify user owns this Stripe account
    const userAccount = await StripeService.Database.getUserStripeAccount(user.id);
    if (!userAccount || userAccount.stripe_account_id !== stripeAccountId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Create dashboard link
    const dashboardUrl = await StripeService.Account.createDashboardLink(stripeAccountId);

    return NextResponse.json({ url: dashboardUrl });
  } catch (error) {
    console.error('Error creating dashboard link:', error);
    return NextResponse.json(
      { error: 'Failed to create dashboard link' },
      { status: 500 }
    );
  }
}
