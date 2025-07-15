"use client"

import { ProfileHeader } from "@/components/profile/profile-header"
import { ProfileInfo } from "@/components/profile/profile-info"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { StripeAccountSetup } from "@/components/stripe/stripe-account-setup"

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <ProfileHeader />
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <div className="lg:col-span-2 space-y-6">
            <ProfileInfo />
            <StripeAccountSetup />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
