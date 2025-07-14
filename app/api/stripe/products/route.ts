import { NextRequest, NextResponse } from 'next/server';
import { StripeService } from '@/lib/stripe';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, price, currency, listingId } = body;

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

    // Verify user owns this listing (you'll need to implement this check)
    // This is a placeholder - replace with your actual listing ownership check
    // const listing = await getListing(listingId);
    // if (listing.user_id !== user.id) {
    //   return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    // }

    // Create Stripe product and price
    const result = await StripeService.Product.createProduct(
      {
        name,
        description,
        price,
        currency,
        listingId,
      },
      user.id
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error creating Stripe product:', error);
    return NextResponse.json(
      { error: 'Failed to create Stripe product' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { listingId, name, description, active, price } = body;

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

    // Verify user owns this listing
    const listingProduct = await StripeService.Database.getListingStripeProduct(listingId);
    if (!listingProduct || listingProduct.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Update product
    if (name !== undefined || description !== undefined || active !== undefined) {
      await StripeService.Product.updateProduct(listingId, {
        name,
        description,
        active,
      });
    }

    // Update price if provided
    if (price !== undefined) {
      await StripeService.Product.updatePrice(listingId, price);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating Stripe product:', error);
    return NextResponse.json(
      { error: 'Failed to update Stripe product' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const listingId = searchParams.get('listingId');

    if (!listingId) {
      return NextResponse.json({ error: 'Missing listingId' }, { status: 400 });
    }

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

    // Get product details
    const product = await StripeService.Product.getProduct(listingId);

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error getting Stripe product:', error);
    return NextResponse.json(
      { error: 'Failed to get Stripe product' },
      { status: 500 }
    );
  }
}
