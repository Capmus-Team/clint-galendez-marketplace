'use client'

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'

export function PurchasedItemsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }, (_, i) => (
        <Card key={i} className="overflow-hidden">
          <CardHeader className="p-0">
            <div className="h-48 bg-gray-200 animate-pulse" />
          </CardHeader>
          
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="h-5 bg-gray-200 animate-pulse rounded w-3/4" />
                <div className="h-4 bg-gray-200 animate-pulse rounded w-20" />
              </div>
              
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 animate-pulse rounded w-full" />
                <div className="h-4 bg-gray-200 animate-pulse rounded w-2/3" />
              </div>
              
              <div className="flex gap-4">
                <div className="h-4 bg-gray-200 animate-pulse rounded w-16" />
                <div className="h-4 bg-gray-200 animate-pulse rounded w-20" />
              </div>
              
              <div className="h-4 bg-gray-200 animate-pulse rounded w-32" />
            </div>
          </CardContent>
          
          <CardFooter className="p-4 pt-0 space-y-2">
            <div className="h-4 bg-gray-200 animate-pulse rounded w-24" />
            <div className="h-8 bg-gray-200 animate-pulse rounded w-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
