'use client'

import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface PurchasedItemsErrorProps {
  error: string
  onRetry: () => void
}

export function PurchasedItemsError({ error, onRetry }: PurchasedItemsErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Alert className="max-w-md mb-6 border-red-200 bg-red-50">
        <AlertCircle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          {error}
        </AlertDescription>
      </Alert>
      
      <Button 
        onClick={onRetry} 
        variant="outline"
        className="flex items-center gap-2"
      >
        <RefreshCw className="w-4 h-4" />
        Try Again
      </Button>
    </div>
  )
}
