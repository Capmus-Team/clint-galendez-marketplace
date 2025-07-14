'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, ExternalLink, CreditCard, AlertCircle, CheckCircle } from 'lucide-react';
import { useStripeAccount } from '@/lib/stripe/hooks';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function StripeAccountSetup() {
  const { accountStatus, loading, error, createAccount, getDashboardLink } = useStripeAccount();
  const [email, setEmail] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateAccount = async () => {
    if (!email.trim()) return;

    try {
      setIsCreating(true);
      const result = await createAccount(email);
      
      // Redirect to Stripe onboarding
      window.location.href = result.onboardingUrl;
    } catch (err) {
      console.error('Failed to create account:', err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleOpenDashboard = async () => {
    if (!accountStatus?.account?.stripe_account_id) return;

    try {
      const dashboardUrl = await getDashboardLink(accountStatus.account.stripe_account_id);
      window.open(dashboardUrl, '_blank');
    } catch (err) {
      console.error('Failed to open dashboard:', err);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading Stripe account status...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Stripe Payment Setup
        </CardTitle>
        <CardDescription>
          Connect your Stripe account to start selling your listings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!accountStatus?.connected ? (
          // Not connected - show setup form
          <div className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You need to connect a Stripe account to receive payments for your listings.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email for Stripe Account
              </label>
              <Input
                id="email"
                type="email"
                placeholder="your-email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <Button 
              onClick={handleCreateAccount}
              disabled={!email.trim() || isCreating}
              className="w-full"
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Connect Stripe Account'
              )}
            </Button>
          </div>
        ) : (
          // Connected - show status
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Account Status:</span>
              <Badge variant={accountStatus.onboardingCompleted ? 'default' : 'secondary'}>
                {accountStatus.onboardingCompleted ? 'Active' : 'Setup Required'}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                {accountStatus.chargesEnabled ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                )}
                Charges Enabled
              </div>
              <div className="flex items-center gap-2">
                {accountStatus.payoutsEnabled ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                )}
                Payouts Enabled
              </div>
            </div>

            {!accountStatus.onboardingCompleted && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Complete your Stripe onboarding to start receiving payments.
                </AlertDescription>
              </Alert>
            )}

            <Button 
              onClick={handleOpenDashboard}
              variant="outline"
              className="w-full"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Open Stripe Dashboard
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
