'use client'

import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

interface UserListingsErrorProps {
  error: string
  onRetry: () => void
}

export function UserListingsError({ error, onRetry }: UserListingsErrorProps) {
  return (
    <div className="text-center py-8 md:py-12">
      <div className="flex justify-center mb-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Listings</h3>
      <p className="text-gray-500 text-base mb-4">{error}</p>
      <Button
        onClick={onRetry}
        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium shadow-lg text-sm md:text-base"
      >
        Try Again
      </Button>
    </div>
  )
}
