"use client"

import { ProfileHeader } from "@/components/profile/profile-header"
import { ProfileInfo } from "@/components/profile/profile-info"
import { ProfileStats } from "@/components/profile/profile-stats"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <ProfileHeader />
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ProfileInfo />
            </div>
            <div className="lg:col-span-1">
              <ProfileStats />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
