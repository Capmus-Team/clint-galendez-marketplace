import { supabase } from '@/lib/supabase'
import type { ProfileUpdateData, AvatarUploadResult } from './types'

export class ProfileService {
  /**
   * Update user profile data
   */
  static async updateProfile(data: ProfileUpdateData): Promise<void> {
    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: data.full_name,
        avatar_url: data.avatar_url,
        bio: data.bio,
        location: data.location,
        phone: data.phone,
        website: data.website,
      },
    })

    if (error) {
      throw new Error(error.message)
    }
  }

  /**
   * Upload avatar image
   */
  static async uploadAvatar(file: File): Promise<AvatarUploadResult> {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      throw new Error('User must be authenticated to upload avatar')
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random()}.${fileExt}`
    const filePath = `${user.id}/avatar/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('user-avatars')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      throw new Error(uploadError.message)
    }

    const { data } = supabase.storage
      .from('user-avatars')
      .getPublicUrl(filePath)

    return {
      url: data.publicUrl,
      path: filePath,
    }
  }

  /**
   * Delete avatar image
   */
  static async deleteAvatar(path: string): Promise<void> {
    const { error } = await supabase.storage
      .from('user-avatars')
      .remove([path])

    if (error) {
      throw new Error(error.message)
    }
  }

  /**
   * Get current user profile
   */
  static async getCurrentUserProfile() {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      throw new Error(error.message)
    }

    return user
  }
}
