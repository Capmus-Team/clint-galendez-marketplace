"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/auth-context'
import { ProfileService } from '@/lib/profile'
import { ProfileForm } from './profile-form'
import { AvatarUpload } from './avatar-upload'
import type { ProfileFormData } from '@/lib/profile'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export function ProfileEditForm() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(
    user?.user_metadata?.avatar_url
  )

  if (!user) {
    return null
  }

  const userInitials = user.user_metadata?.full_name
    ?.split(' ')
    .map((name) => name[0])
    .join('')
    .toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'

  const initialFormData: ProfileFormData = {
    full_name: user.user_metadata?.full_name || '',
    bio: (user.user_metadata as any)?.bio || '',
    location: (user.user_metadata as any)?.location || '',
    phone: (user.user_metadata as any)?.phone || '',
    website: (user.user_metadata as any)?.website || '',
  }

  const handleFormSubmit = async (data: ProfileFormData) => {
    setIsLoading(true)
    
    try {
      await ProfileService.updateProfile({
        full_name: data.full_name,
        avatar_url: avatarUrl,
        bio: data.bio,
        location: data.location,
        phone: data.phone,
        website: data.website,
      })

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully."
      })

      router.push('/profile')
    } catch (error) {
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "Failed to update profile.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAvatarChange = (newAvatarUrl: string | undefined) => {
    setAvatarUrl(newAvatarUrl)
  }

  const handleCancel = () => {
    router.push('/profile')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <Card className="mb-6 backdrop-blur-md bg-white/80 border-white/20 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  className="flex items-center space-x-2"
                  disabled={isLoading}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Profile</span>
                </Button>
                <CardTitle className="text-2xl">Edit Profile</CardTitle>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Avatar Upload */}
          <div className="lg:col-span-1 space-y-6">
            <AvatarUpload
              currentAvatar={avatarUrl}
              userInitials={userInitials}
              onAvatarChange={handleAvatarChange}
              disabled={isLoading}
            />
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <ProfileForm
              initialData={initialFormData}
              onSubmit={handleFormSubmit}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
