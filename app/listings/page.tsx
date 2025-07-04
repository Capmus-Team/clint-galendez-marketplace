"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { supabase, type Listing } from "@/lib/supabase"
import Link from "next/link"
import Image from "next/image"
import { Trash2 } from "lucide-react"

export default function YourListingsPage() {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    fetchListings()
  }, [])

  const fetchListings = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from("listings").select("*").order("created_at", { ascending: false })

      if (error) throw error
      setListings(data || [])
    } catch (error) {
      console.error("Error fetching listings:", error)
    } finally {
      setLoading(false)
    }
  }

  const deleteListing = async (id: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return

    try {
      const { error } = await supabase.from("listings").delete().eq("id", id)

      if (error) throw error

      setListings(listings.filter((listing) => listing.id !== id))
      alert("Listing deleted successfully!")
    } catch (error) {
      console.error("Error deleting listing:", error)
      alert("Error deleting listing. Please try again.")
    }
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

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="category-card rounded-2xl p-3 md:p-4 animate-pulse">
                    <div className="aspect-square bg-gray-200 rounded-xl mb-3 md:mb-4"></div>
                    <div className="h-3 md:h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-2 md:h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : listings.length === 0 ? (
              <div className="text-center py-8 md:py-12">
                <p className="text-gray-500 text-base md:text-lg mb-4">You haven't created any listings yet</p>
                <Link href="/create">
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium shadow-lg text-sm md:text-base">
                    Create your first listing
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                {listings.map((listing) => (
                  <div key={listing.id} className="category-card rounded-2xl p-3 md:p-4">
                    <div className="aspect-square relative mb-3 md:mb-4 rounded-xl overflow-hidden bg-gray-100">
                      {listing.image_url ? (
                        <Image
                          src={listing.image_url || "/placeholder.svg"}
                          alt={listing.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <span className="text-xs md:text-sm">No image</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-1 md:space-y-2">
                      <h3 className="font-semibold text-base md:text-lg text-gray-800 truncate">${listing.price}</h3>
                      <p className="text-gray-600 font-medium truncate text-sm md:text-base">{listing.title}</p>
                      <p className="text-xs md:text-sm text-gray-500">
                        {new Date(listing.created_at).toLocaleDateString()}
                      </p>
                      <p className="text-xs md:text-sm text-gray-500 truncate">
                        {listing.location || "Location not specified"}
                      </p>
                      <div className="flex space-x-2 pt-2">
                        <Link href={`/item/${listing.id}`} className="flex-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full aero-button bg-transparent text-xs md:text-sm"
                          >
                            View
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteListing(listing.id)}
                          className="aero-button text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
