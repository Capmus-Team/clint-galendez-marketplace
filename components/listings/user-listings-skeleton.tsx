'use client'

interface UserListingsSkeletonProps {
  count?: number
}

export function UserListingsSkeleton({ count = 6 }: UserListingsSkeletonProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="category-card rounded-2xl p-3 md:p-4 animate-pulse">
          <div className="aspect-square bg-gray-200 rounded-xl mb-3 md:mb-4"></div>
          <div className="h-3 md:h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-2 md:h-3 bg-gray-200 rounded w-2/3"></div>
        </div>
      ))}
    </div>
  )
}
