"use client"

import React, { useState, useRef } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Upload, X, Loader2 } from 'lucide-react'
import { ProfileService } from '@/lib/profile'
import { useToast } from '@/hooks/use-toast'

interface AvatarUploadProps {
  currentAvatar?: string
  userInitials: string
  onAvatarChange: (avatarUrl: string | undefined) => void
  disabled?: boolean
}

export function AvatarUpload({ 
  currentAvatar, 
  userInitials, 
  onAvatarChange, 
  disabled = false 
}: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(currentAvatar)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive"
      })
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive"
      })
      return
    }

    setIsUploading(true)

    try {
      // Upload new avatar
      const result = await ProfileService.uploadAvatar(file)
      setPreviewUrl(result.url)
      onAvatarChange(result.url)
      
      toast({
        title: "Avatar uploaded",
        description: "Your profile picture has been updated successfully."
      })
    } catch (error) {
      console.error('Avatar upload error:', error)
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload avatar.",
        variant: "destructive"
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveAvatar = () => {
    setPreviewUrl(undefined)
    onAvatarChange(undefined)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src={previewUrl} alt="Profile picture" />
              <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            
            {previewUrl && !disabled && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                onClick={handleRemoveAvatar}
                disabled={isUploading}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>

          <div className="text-center space-y-2">
            <h3 className="font-medium">Profile Picture</h3>
            <p className="text-sm text-gray-600">
              Upload a photo to personalize your profile
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleUploadClick}
              disabled={disabled || isUploading}
              className="flex items-center space-x-2"
            >
              {isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              <span>{isUploading ? 'Uploading...' : 'Upload Photo'}</span>
            </Button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={disabled || isUploading}
          />

          <p className="text-xs text-gray-500 text-center">
            Supports: JPG, PNG, GIF (max 5MB)
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
