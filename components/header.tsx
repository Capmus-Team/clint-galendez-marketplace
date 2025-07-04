"use client"
import { MessageCircle, Bell, User, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface HeaderProps {
  onMenuClick?: () => void
  onLogoClick?: () => void
}

export function Header({ onMenuClick, onLogoClick }: HeaderProps) {
  const router = useRouter()

  const handleLogoClick = () => {
    // Clear any category filters and navigate to home
    router.push("/")
    // Call the parent callback to refresh listings
    if (onLogoClick) {
      onLogoClick()
    }
  }

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-white/20 shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {/* Mobile menu button */}
            <Button variant="ghost" size="icon" className="md:hidden aero-button rounded-full" onClick={onMenuClick}>
              <Menu className="w-5 h-5" />
            </Button>

            <div className="flex items-center space-x-2 cursor-pointer" onClick={handleLogoClick}>
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm md:text-lg">M</span>
              </div>
              <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Marketplace
              </span>
            </div>
          </div>

          <div className="flex-1 max-w-md mx-4 md:mx-8 hidden sm:block">
            <div className="relative"></div>
          </div>

          <div className="flex items-center space-x-1 md:space-x-2">
            <Button variant="ghost" size="icon" className="aero-button rounded-full w-8 h-8 md:w-10 md:h-10">
              <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="aero-button rounded-full w-8 h-8 md:w-10 md:h-10">
              <Bell className="w-4 h-4 md:w-5 md:h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="aero-button rounded-full w-8 h-8 md:w-10 md:h-10">
              <User className="w-4 h-4 md:w-5 md:h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
