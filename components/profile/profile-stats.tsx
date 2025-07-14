"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, Star, Eye, TrendingUp } from "lucide-react"
import { useAuth } from "@/lib/auth/auth-context"
import { supabase } from "@/lib/supabase"

interface ProfileStatsData {
  totalListings: number
  activeListings: number
  totalViews: number
  rating: number
}

export function ProfileStats() {
  const { user } = useAuth()
  const [stats, setStats] = useState<ProfileStatsData>({
    totalListings: 0,
    activeListings: 0,
    totalViews: 0,
    rating: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return

      try {
        // Fetch user listings count (you'll need to implement this based on your database schema)
        // For now, using placeholder data
        setStats({
          totalListings: 12,
          activeListings: 8,
          totalViews: 2456,
          rating: 4.8
        })
      } catch (error) {
        console.error('Error fetching profile stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [user])

  if (loading) {
    return (
      <Card className="backdrop-blur-md bg-white/80 border-white/20 shadow-lg">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const statItems = [
    {
      icon: Package,
      label: "Total Listings",
      value: stats.totalListings,
      color: "text-blue-600"
    },
    {
      icon: Eye,
      label: "Active Listings",
      value: stats.activeListings,
      color: "text-green-600"
    },
    {
      icon: TrendingUp,
      label: "Profile Views",
      value: stats.totalViews.toLocaleString(),
      color: "text-purple-600"
    },
    {
      icon: Star,
      label: "Rating",
      value: `${stats.rating}/5`,
      color: "text-yellow-600"
    }
  ]

  return (
    <div className="space-y-6">
      <Card className="backdrop-blur-md bg-white/80 border-white/20 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Profile Statistics</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {statItems.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50/50">
              <div className="flex items-center space-x-3">
                <item.icon className={`w-5 h-5 ${item.color}`} />
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
              </div>
              <Badge variant="secondary" className="font-semibold">
                {item.value}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="backdrop-blur-md bg-white/80 border-white/20 shadow-lg">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 gap-3">
            <button className="w-full p-3 text-left rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors border border-blue-200">
              <div className="font-medium text-blue-900">Create New Listing</div>
              <div className="text-sm text-blue-600">Add a new item to sell</div>
            </button>
            <button className="w-full p-3 text-left rounded-lg bg-green-50 hover:bg-green-100 transition-colors border border-green-200">
              <div className="font-medium text-green-900">View My Listings</div>
              <div className="text-sm text-green-600">Manage your active listings</div>
            </button>
            <button className="w-full p-3 text-left rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors border border-purple-200">
              <div className="font-medium text-purple-900">Account Settings</div>
              <div className="text-sm text-purple-600">Update your preferences</div>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
