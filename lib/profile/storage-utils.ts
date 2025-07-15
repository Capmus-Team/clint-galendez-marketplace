import { supabase } from '@/lib/supabase'

export class StorageUtils {
  /**
   * Test if storage bucket is accessible
   */
  static async testStorageAccess(): Promise<{ success: boolean; error?: string }> {
    try {
      // Try to list files in the bucket (should work even if empty)
      const { data, error } = await supabase.storage
        .from('user-avatars')
        .list('', { limit: 1 })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown storage error' 
      }
    }
  }

  /**
   * Test if user can upload to storage
   */
  static async testUploadPermission(): Promise<{ success: boolean; error?: string }> {
    try {
      // Create a tiny test file
      const testFile = new File(['test'], 'test.txt', { type: 'text/plain' })
      
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        return { success: false, error: 'User not authenticated' }
      }

      const testPath = `${user.id}/test/test-${Date.now()}.txt`
      
      // Try to upload
      const { error: uploadError } = await supabase.storage
        .from('user-avatars')
        .upload(testPath, testFile)

      if (uploadError) {
        return { success: false, error: uploadError.message }
      }

      // Clean up test file
      await supabase.storage
        .from('user-avatars')
        .remove([testPath])

      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown upload error' 
      }
    }
  }
}
