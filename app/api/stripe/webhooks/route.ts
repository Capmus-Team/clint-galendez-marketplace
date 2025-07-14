import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/config';
import { StripeService } from '@/lib/stripe';

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

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log('Payment succeeded:', paymentIntent.id);
        
        // Handle successful payment
        if (paymentIntent.transfer_data?.destination) {
          const destination = typeof paymentIntent.transfer_data.destination === 'string' 
            ? paymentIntent.transfer_data.destination 
            : paymentIntent.transfer_data.destination.id;
          
          await StripeService.Payment.handleSuccessfulPayment(
            paymentIntent.id,
            destination
          );
        }
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        console.log('Payment failed:', failedPayment.id);
        
        // Handle failed payment
        if (failedPayment.transfer_data?.destination) {
          const destination = typeof failedPayment.transfer_data.destination === 'string' 
            ? failedPayment.transfer_data.destination 
            : failedPayment.transfer_data.destination.id;
          
          await StripeService.Payment.handleFailedPayment(
            failedPayment.id,
            destination
          );
        }
        break;

      case 'account.updated':
        const account = event.data.object;
        console.log('Account updated:', account.id);
        
        // Update account status in database if needed
        // You might want to sync the latest account status
        break;

      case 'checkout.session.completed':
        const session = event.data.object;
        console.log('Checkout session completed:', session.id);
        
        // Additional handling for successful checkout
        // You can send confirmation emails, update order status, etc.
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
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
