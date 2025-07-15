"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { 
  PurchasedItemsGrid, 
  PurchasedItemsSkeleton, 
  PurchasedItemsError 
} from "@/components/purchases"
import { usePurchasedItems } from "@/lib/purchases"
import { useAuthGuard } from "@/lib/auth/hooks"
import Link from "next/link"

export default function YourPurchasedItemsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  // Protect the route - only authenticated users can access
  const { isAuthorized, loading: authLoading } = useAuthGuard()
  
  // Use the custom hook to manage purchased items
  const { 
    purchasedItems, 
    loading: itemsLoading, 
    error, 
    refetch
  } = usePurchasedItems()

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <div className="flex">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <main className="flex-1 p-3 md:p-6 md:ml-64">
            <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
              <PurchasedItemsSkeleton />
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
                Your Purchased Items
              </h1>
              <Link href="/">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium shadow-lg text-sm md:text-base">
                  Browse Marketplace
                </Button>
              </Link>
            </div>

            {itemsLoading ? (
              <PurchasedItemsSkeleton />
            ) : error ? (
              <PurchasedItemsError error={error} onRetry={refetch} />
            ) : (
              <PurchasedItemsGrid purchasedItems={purchasedItems} />
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
