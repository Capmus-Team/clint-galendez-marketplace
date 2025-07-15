"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { 
  UserListingsGrid, 
  UserListingsSkeleton, 
  UserListingsError 
} from "@/components/listings"
import { useUserListings } from "@/lib/listings/hooks"
import { useAuthGuard } from "@/lib/auth/hooks"
import Link from "next/link"

export default function YourListingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  // Protect the route - only authenticated users can access
  const { isAuthorized, loading: authLoading } = useAuthGuard()
  
  // Use the custom hook to manage user listings
  const { 
    listings, 
    loading: listingsLoading, 
    error, 
    refetch, 
    deleteListing 
  } = useUserListings()

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <div className="flex">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <main className="flex-1 p-3 md:p-6 md:ml-64">
            <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
              <UserListingsSkeleton />
            </div>
          </main>
        </div>
      </div>
    )
  }

  // Don't render anything if user is not authorized (will be redirected)
  if (!isAuthorized) {
    return null
  }

  return (
    <div className="min-h-screen">
      <Header onMenuClick={() => setSidebarOpen(true)} />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 p-3 md:p-6 md:ml-64">
          <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Your Listings
              </h1>
              <Link href="/create">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium shadow-lg text-sm md:text-base">
                  Create New Listing
                </Button>
              </Link>
            </div>

            {listingsLoading ? (
              <UserListingsSkeleton />
            ) : error ? (
              <UserListingsError error={error} onRetry={refetch} />
            ) : (
              <UserListingsGrid 
                listings={listings} 
                onDeleteListing={deleteListing} 
              />
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
