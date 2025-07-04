"use client"

import Link from "next/link"
import {
  Plus,
  List,
  HelpCircle,
  Car,
  Home,
  Shirt,
  Gamepad2,
  Laptop,
  Music,
  Dumbbell,
  Baby,
  Gift,
  TreePine,
  Wrench,
  Building,
  PawPrint,
  Briefcase,
  Puzzle,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePathname, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"

const categories = [
  { name: "Vehicles", icon: Car, href: "/?category=vehicles" },
  { name: "Property Rentals", icon: Home, href: "/?category=property-rentals" },
  { name: "Apparel", icon: Shirt, href: "/?category=apparel" },
  { name: "Classifieds", icon: List, href: "/?category=classifieds" },
  { name: "Electronics", icon: Laptop, href: "/?category=electronics" },
  { name: "Entertainment", icon: Gamepad2, href: "/?category=entertainment" },
  { name: "Family", icon: Baby, href: "/?category=family" },
  { name: "Free Stuff", icon: Gift, href: "/?category=free-stuff" },
  { name: "Garden & Outdoor", icon: TreePine, href: "/?category=garden-outdoor" },
  { name: "Hobbies", icon: Puzzle, href: "/?category=hobbies" },
  { name: "Home Goods", icon: Home, href: "/?category=home-goods" },
  { name: "Home Improvement", icon: Wrench, href: "/?category=home-improvement" },
  { name: "Home Sales", icon: Building, href: "/?category=home-sales" },
  { name: "Musical Instruments", icon: Music, href: "/?category=musical-instruments" },
  { name: "Office Supplies", icon: Briefcase, href: "/?category=office-supplies" },
  { name: "Pet Supplies", icon: PawPrint, href: "/?category=pet-supplies" },
  { name: "Sporting Goods", icon: Dumbbell, href: "/?category=sporting-goods" },
  { name: "Toys & Games", icon: Gamepad2, href: "/?category=toys-games" },
]

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="md:hidden mobile-overlay" onClick={onClose} />}

      <aside
        className={cn(
          "w-64 h-[calc(100vh-4rem)] fixed top-16 left-0 backdrop-blur-md bg-white/60 border-r border-white/20 shadow-lg overflow-y-auto z-20 transition-transform duration-300 ease-in-out",
          "md:translate-x-0", // Always visible on desktop
          isOpen ? "mobile-sidebar-visible" : "mobile-sidebar-hidden", // Mobile toggle
        )}
      >
        <div className="p-4 space-y-4 min-h-full">
          {/* Mobile close button */}
          <div className="md:hidden flex justify-end mb-2">
            <Button variant="ghost" size="icon" onClick={onClose} className="aero-button rounded-full">
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div>
            <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3">Create new listing</h3>
            <Link href="/choose-listing-type" onClick={onClose}>
              <Button className="w-full justify-start bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium shadow-lg mb-2 text-sm md:text-base">
                <Plus className="w-4 h-4 mr-2" />
                Choose listing type
              </Button>
            </Link>
            <Link href="/listings" onClick={onClose}>
              <Button
                variant="ghost"
                className="w-full justify-start hover:bg-white/50 text-gray-700 hover:text-gray-900 text-sm md:text-base"
              >
                <List className="w-4 h-4 mr-2" />
                Your listings
              </Button>
            </Link>
            <Link href="/" onClick={onClose}>
              <Button
                variant="ghost"
                className="w-full justify-start hover:bg-white/50 text-gray-700 hover:text-gray-900 text-sm md:text-base"
              >
                <HelpCircle className="w-4 h-4 mr-2" />
                Seller help
              </Button>
            </Link>
          </div>

          <div className="space-y-2 flex-1 flex flex-col">
            <h3 className="text-base md:text-lg font-semibold text-gray-800">Categories</h3>
            <div className="space-y-1 flex-1 overflow-y-auto min-h-0">
              {categories.map((category) => {
                const Icon = category.icon
                return (
                  <Link key={category.name} href={category.href} onClick={onClose}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start text-xs md:text-sm text-gray-700 hover:text-gray-900 hover:bg-blue-50/80 py-2",
                        category.href === `/?category=${searchParams.get("category")}` &&
                          "bg-blue-100/70 text-blue-800",
                      )}
                    >
                      <Icon className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{category.name}</span>
                    </Button>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
