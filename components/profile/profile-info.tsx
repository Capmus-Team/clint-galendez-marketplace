"use client"

import { useAuth } from "@/lib/auth/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, Calendar, MapPin, Edit } from "lucide-react"

export function ProfileInfo() {
  const { user } = useAuth()

  if (!user) {
    return null
  }

  const userInitials = user.user_metadata?.full_name
    ?.split(' ')
    .map((name) => name[0])
    .join('')
    .toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'

  const joinDate = new Date(user.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <Card className="backdrop-blur-md bg-white/80 border-white/20 shadow-lg">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage 
                src={user.user_metadata?.avatar_url} 
                alt={user.user_metadata?.full_name || user.email || 'User'}
              />
              <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <CardTitle className="text-2xl">
                {user.user_metadata?.full_name || 'Anonymous User'}
              </CardTitle>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Active Member
              </Badge>
            </div>
          </div>
          <Button variant="outline" size="sm" className="flex items-center space-x-2">
            <Edit className="w-4 h-4" />
            <span>Edit Profile</span>
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <Mail className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Member since</p>
              <p className="font-medium">{joinDate}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <MapPin className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-medium">{(user.user_metadata as any)?.location || 'Not specified'}</p>
            </div>
          </div>
        </div>
        
        {(user.user_metadata as any)?.bio && (
          <div className="pt-4 border-t">
            <h3 className="font-semibold mb-2">About</h3>
            <p className="text-gray-600 leading-relaxed">{(user.user_metadata as any).bio}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
