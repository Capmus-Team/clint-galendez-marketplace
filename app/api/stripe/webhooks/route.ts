import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/config';
import { ApplicationFeeWebhookService } from '@/lib/stripe/application-fee-webhook';

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature')!;

    let event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Handle different webhook events
    switch (event.type) {
      case 'application_fee.created': {
        const applicationFee = event.data.object;
        console.log('Application fee created:', applicationFee.id);
        
        try {
          await ApplicationFeeWebhookService.handleApplicationFeeCreated(applicationFee);
          console.log(`Successfully processed application fee: ${applicationFee.id}`);
        } catch (error) {
          console.error(`Error processing application fee ${applicationFee.id}:`, error);
          return NextResponse.json(
            { error: 'Failed to process application fee' },
            { status: 500 }
          );
        }
        break;
      }
      
      case 'application_fee.refunded': {
        const applicationFee = event.data.object;
        console.log('Application fee refunded:', applicationFee.id);
        
        try {
          await ApplicationFeeWebhookService.handleApplicationFeeRefunded(applicationFee);
          console.log(`Successfully processed application fee refund: ${applicationFee.id}`);
        } catch (error) {
          console.error(`Error processing application fee refund ${applicationFee.id}:`, error);
          // Don't fail the webhook for refund processing errors
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
