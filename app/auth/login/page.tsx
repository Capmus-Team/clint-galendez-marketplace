'use client'

import { useRouter } from 'next/navigation'
import { useGuestGuard } from '@/lib/auth/hooks'
import { AuthLayout } from '@/components/auth/auth-layout'
import { LoginForm } from '@/components/auth/login-form'
import { Loader2 } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const { loading } = useGuestGuard('/')

  const handleLoginSuccess = () => {
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <AuthLayout>
      <LoginForm onSuccess={handleLoginSuccess} />
    </AuthLayout>
  )
}
