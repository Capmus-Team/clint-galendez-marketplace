"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { supabase, type Listing } from "@/lib/supabase"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"

// Helper function to format relative time
const formatRelativeTime = (timestamp: string): string => {
  const now = new Date()
  const createdAt = new Date(timestamp)
  const diffInMs = now.getTime() - createdAt.getTime()

  const seconds = Math.floor(diffInMs / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const weeks = Math.floor(days / 7)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  if (seconds < 60) {
    return "listed just now"
  } else if (minutes < 60) {
    return `listed ${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`
  } else if (hours < 24) {
    return `listed ${hours} ${hours === 1 ? "hour" : "hours"} ago`
  } else if (days < 7) {
    return `listed ${days} ${days === 1 ? "day" : "days"} ago`
  } else if (weeks < 4) {
    return `listed ${weeks} ${weeks === 1 ? "week" : "weeks"} ago`
  } else if (months < 12) {
    return `listed ${months} ${months === 1 ? "month" : "months"} ago`
  } else {
    return `listed ${years} ${years === 1 ? "year" : "years"} ago`
  }
}

export default function HomePage() {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentCategory, setCurrentCategory] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const category = searchParams.get("category")
  const router = useRouter()

  // Update current category when URL changes
  useEffect(() => {
    setCurrentCategory(category)
    fetchListings(category)
  }, [category])

  const fetchListings = async (filterCategory?: string | null) => {
    try {
      setLoading(true)
      let query = supabase.from("listings").select("*").order("created_at", { ascending: false })

      if (filterCategory) {
        query = query.eq("category", filterCategory)
      }

      const { data, error } = await query

      if (error) throw error
      setListings(data || [])
    } catch (error) {
      console.error("Error fetching listings:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogoClick = () => {
    // Clear the current category and fetch all listings
    setCurrentCategory(null)
    setSearchTerm("")
    fetchListings(null)
  }

  const filteredListings = listings.filter(
    (listing) =>
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen">
      <Header onMenuClick={() => setSidebarOpen(true)} onLogoClick={handleLogoClick} />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 p-3 md:p-6 md:ml-64">
          <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {currentCategory
                  ? `${currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1).replace("-", " ")}`
                  : "Today's picks"}
              </h1>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search listings..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-64 md:w-80 aero-input"
                  />
                </div>
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium shadow-lg whitespace-nowrap">
                  Search
                </Button>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="category-card rounded-2xl p-3 md:p-4 animate-pulse">
                    <div className="aspect-square bg-gray-200 rounded-xl mb-3 md:mb-4"></div>
                    <div className="h-3 md:h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-2 md:h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : filteredListings.length === 0 ? (
              <div className="text-center py-8 md:py-12">
                <p className="text-gray-500 text-base md:text-lg">No listings found</p>
                <Link href="/create">
                  <Button className="mt-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium shadow-lg">
                    Create your first listing
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-6">
                {filteredListings.map((listing) => (
                  <Link key={listing.id} href={`/item/${listing.id}`}>
                    <div className="category-card rounded-2xl p-3 md:p-4 cursor-pointer">
                      <div className="aspect-square relative mb-3 md:mb-4 rounded-xl overflow-hidden bg-gray-100">
                        {listing.image_url ? (
                          <Image
                            src={listing.image_url || "/placeholder.svg"}
                            alt={listing.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
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
                          {listing.created_at ? formatRelativeTime(listing.created_at) : "Listed recently"}
                        </p>
                        <p className="text-xs md:text-sm text-gray-500 truncate">
                          {listing.location || "Location not specified"}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
