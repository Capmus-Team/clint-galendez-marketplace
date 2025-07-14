'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Loader2, Package, DollarSign, AlertCircle, CheckCircle } from 'lucide-react';
import { useStripeProduct, useStripeAccount } from '@/lib/stripe/hooks';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

interface CreateStripeProductProps {
  listingId: string;
  initialName?: string;
  initialDescription?: string;
  initialPrice?: number;
  onSuccess?: () => void;
}

export function CreateStripeProduct({
  listingId,
  initialName = '',
  initialDescription = '',
  initialPrice = 0,
  onSuccess,
}: CreateStripeProductProps) {
  const { accountStatus } = useStripeAccount();
  const { loading, error, createProduct } = useStripeProduct();
  
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [price, setPrice] = useState(initialPrice);
  const [currency] = useState('usd');

  const canCreateProduct = accountStatus?.connected && accountStatus?.onboardingCompleted;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || price <= 0) return;

    try {
      await createProduct({
        name: name.trim(),
        description: description.trim() || undefined,
        price,
        currency,
        listingId,
      });

      onSuccess?.();
    } catch (err) {
      console.error('Failed to create product:', err);
    }
  };

  if (!accountStatus?.connected) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          You need to connect your Stripe account before you can sell this listing.
        </AlertDescription>
      </Alert>
    );
  }

  if (!accountStatus.onboardingCompleted) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Complete your Stripe onboarding to start selling this listing.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Enable Payments for Listing
        </CardTitle>
        <CardDescription>
          Set up Stripe payment processing for this listing
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <label htmlFor="product-name" className="text-sm font-medium">
              Product Name *
            </label>
            <Input
              id="product-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter product name"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="product-description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="product-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your product..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="product-price" className="text-sm font-medium">
              Price (USD) *
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="product-price"
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                className="pl-10"
                required
              />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={loading || !name.trim() || price <= 0}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Product...
              </>
            ) : (
              'Enable Payments'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

interface ManageStripeProductProps {
  listingId: string;
  onProductRemoved?: () => void;
}

export function ManageStripeProduct({
  listingId,
  onProductRemoved,
}: ManageStripeProductProps) {
  const { loading, error, getProduct, updateProduct } = useStripeProduct();
  const [productData, setProductData] = useState<any>(null);
  const [isActive, setIsActive] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await getProduct(listingId);
        setProductData(data);
        setIsActive(data?.product?.active ?? true);
      } catch (err) {
        console.error('Failed to load product:', err);
      }
    };

    loadProduct();
  }, [listingId, getProduct]);

  const handleToggleActive = async () => {
    try {
      setIsUpdating(true);
      const newActiveState = !isActive;
      
      await updateProduct({
        listingId,
        active: newActiveState,
      });
      
      setIsActive(newActiveState);
    } catch (err) {
      console.error('Failed to update product:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading && !productData) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading product...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!productData) {
    return null;
  }

  const price = productData.price?.unit_amount / 100 || 0;
  const currency = productData.price?.currency?.toUpperCase() || 'USD';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Stripe Product
          </span>
          <Badge variant={isActive ? 'default' : 'secondary'}>
            {isActive ? 'Active' : 'Inactive'}
          </Badge>
        </CardTitle>
        <CardDescription>
          Manage payment settings for this listing
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          <div>
            <span className="text-sm font-medium">Product Name:</span>
            <p className="text-sm text-muted-foreground">{productData.product?.name}</p>
          </div>
          
          {productData.product?.description && (
            <div>
              <span className="text-sm font-medium">Description:</span>
              <p className="text-sm text-muted-foreground">{productData.product.description}</p>
            </div>
          )}
          
          <div>
            <span className="text-sm font-medium">Price:</span>
            <p className="text-sm text-muted-foreground">{currency} ${price.toFixed(2)}</p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium">Accept Payments</span>
              <p className="text-xs text-muted-foreground">
                Toggle payment acceptance for this listing
              </p>
            </div>
            <Switch
              checked={isActive}
              onCheckedChange={handleToggleActive}
              disabled={isUpdating}
            />
          </div>
        </div>

        {isActive && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              This listing is ready to accept payments through Stripe.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
