'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, ShoppingCart, AlertCircle } from 'lucide-react';
import { useStripeCheckout } from '@/lib/stripe/hooks';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getStripe } from '@/lib/stripe/client';

interface BuyListingButtonProps {
  listingId: string;
  sellerId: string;
  listingTitle: string;
  price: number;
  currency?: string;
  className?: string;
}

export function BuyListingButton({
  listingId,
  sellerId,
  listingTitle,
  price,
  currency = 'USD',
  className,
}: BuyListingButtonProps) {
  const { loading, error, createCheckoutSession } = useStripeCheckout();
  const [isPurchasing, setIsPurchasing] = useState(false);

  const handlePurchase = async () => {
    try {
      setIsPurchasing(true);

      const baseUrl = window.location.origin;
      const successUrl = `${baseUrl}/purchase/success?session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${baseUrl}/item/${listingId}`;

      // Create checkout session
      const session = await createCheckoutSession({
        listingId,
        sellerId,
        successUrl,
        cancelUrl,
      });

      // Redirect to Stripe Checkout
      const stripe = await getStripe();
      if (stripe && session.url) {
        window.location.href = session.url;
      } else {
        throw new Error('Failed to initialize Stripe');
      }
    } catch (err) {
      console.error('Purchase failed:', err);
    } finally {
      setIsPurchasing(false);
    }
  };

  const isLoading = loading || isPurchasing;

  return (
    <div className="space-y-2">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Button
        onClick={handlePurchase}
        disabled={isLoading}
        className={className}
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Buy Now - {currency} ${price.toFixed(2)}
          </>
        )}
      </Button>
    </div>
  );
}

interface ListingPurchaseCardProps {
  listingId: string;
  sellerId: string;
  listingTitle: string;
  description?: string;
  price: number;
  currency?: string;
  imageUrl?: string;
}

export function ListingPurchaseCard({
  listingId,
  sellerId,
  listingTitle,
  description,
  price,
  currency = 'USD',
  imageUrl,
}: ListingPurchaseCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="line-clamp-2">{listingTitle}</CardTitle>
            {description && (
              <CardDescription className="line-clamp-3 mt-2">
                {description}
              </CardDescription>
            )}
          </div>
          <Badge variant="secondary" className="ml-2">
            {currency} ${price.toFixed(2)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {imageUrl && (
          <div className="aspect-video w-full overflow-hidden rounded-lg">
            <img
              src={imageUrl}
              alt={listingTitle}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        
        <BuyListingButton
          listingId={listingId}
          sellerId={sellerId}
          listingTitle={listingTitle}
          price={price}
          currency={currency}
          className="w-full"
        />
        
        <div className="text-sm text-muted-foreground">
          <p>• Secure payment processing by Stripe</p>
          <p>• Instant access after purchase</p>
          <p>• 24/7 customer support</p>
        </div>
      </CardContent>
    </Card>
  );
}
