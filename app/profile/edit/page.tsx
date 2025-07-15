"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { ProfileEditForm } from "@/components/profile/profile-edit-form"

export default function ProfileEditPage() {
  return (
    <ProtectedRoute>
      <ProfileEditForm />
    </ProtectedRoute>
  )
}
