"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { StripeAccountSetup, CreateStripeProduct } from "@/components/stripe";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function StripeSetupPage() {
  const params = useParams();
  const router = useRouter();
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchListing(params.id as string);
    }
  }, [params.id]);

  const fetchListing = async (id: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("listings").select("*").eq("id", id).single();
      if (error) throw error;
      setListing(data);
    } catch (error) {
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Listing Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>Could not find the listing. Please try again.</CardDescription>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12">
      <Card className="max-w-lg w-full">
        <CardHeader>
          <CardTitle>Enable Payments for Your Listing</CardTitle>
          <CardDescription>
            Connect your Stripe account and enable payments for <span className="font-semibold">{listing.title}</span>.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <StripeAccountSetup />
          <CreateStripeProduct
            listingId={listing.id}
            initialName={listing.title}
            initialDescription={listing.description}
            initialPrice={listing.price}
            onSuccess={() => router.push(`/item/${listing.id}`)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
