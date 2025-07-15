'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, MapPin, DollarSign, User, Mail } from 'lucide-react'
import type { PurchasedItem } from '@/lib/purchases/types'

interface PurchasedItemsGridProps {
  purchasedItems: PurchasedItem[]
}

export function PurchasedItemsGrid({ purchasedItems }: PurchasedItemsGridProps) {
  if (purchasedItems.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
            <DollarSign className="w-12 h-12 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No purchased items yet
          </h3>
          <p className="text-gray-600 mb-6">
            When you purchase items from the marketplace, they will appear here.
          </p>
          <Link href="/">
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
              Browse Marketplace
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {purchasedItems.map((item) => (
        <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="p-0">
            <div className="relative h-48 bg-gray-100">
              {item.listings?.image_url ? (
                <Image
                  src={item.listings.image_url}
                  alt={item.listings.title || 'Purchased item'}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-sm">No image</span>
                </div>
              )}
              <div className="absolute top-3 left-3">
                <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                  Purchased
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-4">
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-2">
                  {item.listings?.title || 'Unknown Item'}
                </h3>
                <Badge variant="outline" className="text-xs">
                  {item.listings?.category || 'Uncategorized'}
                </Badge>
              </div>

              {item.listings?.description && (
                <p className="text-gray-600 text-sm line-clamp-2">
                  {item.listings.description}
                </p>
              )}

              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  <span className="font-medium">
                    ${(item.amount / 100).toFixed(2)}
                  </span>
                </div>
                
                {item.listings?.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate max-w-24">{item.listings.location}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>
                  Purchased {new Date(item.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </CardContent>

          <CardFooter className="p-4 pt-0 space-y-2">
            {item.listings?.contact_email && (
              <div className="w-full">
                <a 
                  href={`mailto:${item.listings.contact_email}`}
                  className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span className="truncate">Contact seller</span>
                </a>
              </div>
            )}
            
            {item.listings && (
              <Link href={`/item/${item.listings.id}`} className="w-full">
                <Button variant="outline" className="w-full text-sm">
                  View Item Details
                </Button>
              </Link>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
