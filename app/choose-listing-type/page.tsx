"use client"

import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Package, Car, Home, Shirt } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const listingTypes = [
  {
    id: "item",
    title: "Item for Sale",
    description: "Sell physical items like electronics, furniture, books, etc.",
    icon: Package,
    href: "/create",
  },
  {
    id: "vehicle",
    title: "Vehicle",
    description: "Cars, motorcycles, boats, and other vehicles",
    icon: Car,
    href: "/create",
  },
  {
    id: "property",
    title: "Property Rental",
    description: "Rent out apartments, houses, or rooms",
    icon: Home,
    href: "/create",
  },
  {
    id: "service",
    title: "Service",
    description: "Offer services like tutoring, cleaning, repairs, etc.",
    icon: Shirt,
    href: "/create",
  },
]

export default function ChooseListingTypePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen">
      <Header onMenuClick={() => setSidebarOpen(true)} />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 p-3 md:p-6 md:ml-64">
          <div className="max-w-4xl mx-auto">
            <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 md:mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="text-sm md:text-base">Back to Marketplace</span>
            </Link>

            <div className="flex items-center space-x-3 mb-6 md:mb-8">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm md:text-base">M</span>
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">Choose Listing Type</h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              {listingTypes.map((type) => {
                const Icon = type.icon
                return (
                  <Link key={type.id} href={type.href}>
                    <div className="category-card rounded-2xl p-4 md:p-6 cursor-pointer h-full">
                      <div className="flex items-start space-x-3 md:space-x-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-1 md:mb-2">
                            {type.title}
                          </h3>
                          <p className="text-xs md:text-sm text-gray-600">{type.description}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
