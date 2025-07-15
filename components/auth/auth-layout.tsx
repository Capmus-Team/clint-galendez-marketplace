'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface AuthLayoutProps {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>

      {/* Right side - Image/Branding */}
      <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center lg:bg-gradient-to-br lg:from-blue-600 lg:to-purple-600">
        <div className="text-center text-white space-y-6 max-w-md">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">
              Welcome to Clint's Marketplace
            </h2>
            <p className="text-lg text-blue-100">
              Discover amazing products, connect with sellers, and find exactly what you're looking for.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
