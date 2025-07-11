import { supabase } from '@/lib/supabase'
import type { LoginCredentials, RegisterCredentials } from './types'

export class AuthService {
  /**
   * Sign in with email and password
   */
  static async signIn({ email, password }: LoginCredentials) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      throw new Error(error.message)
    }

    return data
  }

  /**
   * Sign up with email and password
   */
  static async signUp({ email, password, fullName }: RegisterCredentials) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (error) {
      throw new Error(error.message)
    }

    return data
  }

  /**
   * Sign out current user
   */
  static async signOut() {
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      throw new Error(error.message)
    }
  }

  /**
   * Get current user session
   */
  static async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      throw new Error(error.message)
    }

    return user
  }

  /**
   * Reset password
   */
  static async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    if (error) {
      throw new Error(error.message)
    }
  }

  /**
   * Update password
   */
  static async updatePassword(password: string) {
    const { error } = await supabase.auth.updateUser({
      password,
    })

    if (error) {
      throw new Error(error.message)
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(updates: { full_name?: string; avatar_url?: string }) {
    const { error } = await supabase.auth.updateUser({
      data: updates,
    })

    if (error) {
      throw new Error(error.message)
    }
  }
}
