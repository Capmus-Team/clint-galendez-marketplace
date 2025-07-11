"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, X } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import Image from "next/image"

const categories = [
  "vehicles",
  "property-rentals",
  "apparel",
  "classifieds",
  "electronics",
  "entertainment",
  "family",
  "free-stuff",
  "garden-outdoor",
  "hobbies",
  "home-goods",
  "home-improvement",
  "home-sales",
  "musical-instruments",
  "office-supplies",
  "pet-supplies",
  "sporting-goods",
  "toys-games",
]

export default function CreateListingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    price: "",
    location: "",
    contactEmail: "",
    description: "",
  })

  useEffect(() => {
    // Cleanup function to revoke object URL only if it's a blob URL
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview)
      }
    }
  }, [imagePreview])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB")
        return
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file")
        return
      }

      // Clean up previous preview
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview)
      }

      setImageFile(file)

      // Use FileReader instead of createObjectURL for better compatibility
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setImagePreview(e.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    // Only revoke if it's a blob URL
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview)
    }
    setImageFile(null)
    setImagePreview(null)
  }

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split(".").pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `listings/${fileName}`

      const { error: uploadError } = await supabase.storage.from("marketplace-images").upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from("marketplace-images").getPublicUrl(filePath)

      return data.publicUrl
    } catch (error) {
      console.error("Error uploading image:", error)
      return null
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.category || !formData.price || !formData.contactEmail) {
      alert("Please fill in all required fields")
      return
    }

    try {
      setLoading(true)

      let imageUrl = null
      if (imageFile) {
        imageUrl = await uploadImage(imageFile)
      }

      const { data, error } = await supabase
        .from("listings")
        .insert([
          {
            title: formData.title,
            description: formData.description,
            price: Number.parseFloat(formData.price),
            category: formData.category,
            location: formData.location,
            contact_email: formData.contactEmail,
            image_url: imageUrl,
          },
        ])
        .select()

      if (error) throw error

      const newListing = data?.[0]
      if (newListing) {
        alert("Listing created successfully!")
        router.push(`/item/${newListing.id}`)
      } else {
        alert("Listing created successfully!")
        router.push("/")
      }
    } catch (error) {
      console.error("Error creating listing:", error)
      alert("Error creating listing. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <div className="flex">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <main className="flex-1 p-3 md:p-6 md:ml-64">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
              {/* Form */}
              <div className="category-card rounded-2xl p-4 md:p-6">
                <div className="flex items-center space-x-3 mb-4 md:mb-6">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm md:text-base">M</span>
                  </div>
                  <h1 className="text-xl md:text-2xl font-bold text-gray-800">Marketplace</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                  {/* Photo Upload */}
                  <div>
                    <Label className="text-sm md:text-base font-medium text-gray-700">Photos</Label>
                    {!imagePreview ? (
                      <div className="mt-2 border-2 border-dashed border-gray-300 rounded-xl p-6 md:p-8 text-center hover:border-blue-400 transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                        />
                        <label htmlFor="image-upload" className="cursor-pointer">
                          <Upload className="w-6 h-6 md:w-8 md:h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-600 font-medium text-sm md:text-base">Add photos</p>
                          <p className="text-xs md:text-sm text-gray-500">JPEG, PNG, or WebP (max 5MB)</p>
                        </label>
                      </div>
                    ) : (
                      <div className="mt-2 relative">
                        <div className="relative aspect-video rounded-xl overflow-hidden">
                          <Image
                            src={imagePreview || "/placeholder.svg"}
                            alt="Preview"
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            onError={(e) => {
                              console.error("Image failed to load:", e)
                              // Fallback to a placeholder if image fails to load
                              e.currentTarget.src = "/placeholder.svg?height=400&width=400"
                            }}
                          />
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute top-2 right-2 w-6 h-6 md:w-8 md:h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                          >
                            <X className="w-3 h-3 md:w-4 md:h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Title */}
                  <div>
                    <Label htmlFor="title" className="text-sm md:text-base font-medium text-gray-700">
                      Title *
                    </Label>
                    <Input
                      id="title"
                      placeholder="What are you selling?"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="mt-2 aero-input text-sm md:text-base"
                      required
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <Label className="text-sm md:text-base font-medium text-gray-700">Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger className="mt-2 aero-input text-sm md:text-base">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category
                              .split("-")
                              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                              .join(" ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price */}
                  <div>
                    <Label htmlFor="price" className="text-sm md:text-base font-medium text-gray-700">
                      Price *
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="mt-2 aero-input text-sm md:text-base"
                      required
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <Label htmlFor="location" className="text-sm md:text-base font-medium text-gray-700">
                      Location
                    </Label>
                    <Input
                      id="location"
                      placeholder="Palo Alto, CA"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="mt-2 aero-input text-sm md:text-base"
                    />
                  </div>

                  {/* Contact Email */}
                  <div>
                    <Label htmlFor="email" className="text-sm md:text-base font-medium text-gray-700">
                      Contact Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                      className="mt-2 aero-input text-sm md:text-base"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <Label htmlFor="description" className="text-sm md:text-base font-medium text-gray-700">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your item..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="mt-2 aero-input min-h-[80px] md:min-h-[100px] text-sm md:text-base"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-2 md:py-3 rounded-xl shadow-lg text-sm md:text-base"
                  >
                    {loading ? "Creating Listing..." : "Create Listing"}
                  </Button>
                </form>
              </div>

              {/* Preview */}
              <div className="category-card rounded-2xl p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4 md:mb-6">Preview</h2>

                <div className="space-y-3 md:space-y-4">
                  <div className="aspect-video relative rounded-xl overflow-hidden bg-gray-100">
                    {imagePreview ? (
                      <Image
                        src={imagePreview || "/placeholder.svg"}
                        alt="Preview"
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        onError={(e) => {
                          console.error("Preview image failed to load:", e)
                          e.currentTarget.src = "/placeholder.svg?height=300&width=400"
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gradient-to-br from-gray-50 to-gray-100">
                        <div className="text-center">
                          <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-2 md:mb-3 rounded-full bg-gray-200 flex items-center justify-center">
                            <svg
                              className="w-6 h-6 md:w-8 md:h-8 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                          <p className="text-xs md:text-sm font-medium text-gray-500">No image uploaded</p>
                          <p className="text-xs text-gray-400 mt-1">Upload a photo to see preview</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 md:space-y-3">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-800">{formData.title || "Title"}</h3>
                    <p className="text-xl md:text-2xl font-bold text-gray-800">
                      {formData.price ? `$${formData.price}` : "Price"}
                    </p>
                    <div className="text-xs md:text-sm text-gray-600 space-y-1">
                      <p>Listed just now</p>
                      <p>in {formData.location || "Location"}</p>
                    </div>
                    <p className="text-xs md:text-sm text-gray-600">
                      Category:{" "}
                      {formData.category
                        ? formData.category
                            .split("-")
                            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(" ")
                        : "Category"}
                    </p>

                    {formData.description && (
                      <div className="mt-3 md:mt-4">
                        <h4 className="font-semibold text-gray-800 mb-2 text-sm md:text-base">Description</h4>
                        <p className="text-gray-600 text-xs md:text-sm">{formData.description}</p>
                      </div>
                    )}

                    <div className="mt-3 md:mt-4">
                      <h4 className="font-semibold text-gray-800 mb-2 text-sm md:text-base">Seller Information</h4>
                      <p className="text-gray-600 text-xs md:text-sm">{formData.contactEmail || "seller@email.com"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
    </ProtectedRoute>
  )
}
