export interface UserProfile {
  id: string
  full_name: string
  email: string
  avatar_url?: string
  bio?: string
  location?: string
  phone?: string
  website?: string
}

export interface ProfileUpdateData {
  full_name?: string
  avatar_url?: string
  bio?: string
  location?: string
  phone?: string
  website?: string
}

export interface ProfileFormData {
  full_name: string
  bio: string
  location: string
  phone: string
  website: string
}

export interface AvatarUploadResult {
  url: string
  path: string
}
