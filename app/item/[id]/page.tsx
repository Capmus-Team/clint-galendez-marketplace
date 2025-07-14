"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft } from "lucide-react"
import { supabase, type Listing } from "@/lib/supabase"
import Image from "next/image"
import Link from "next/link"
import { BuyListingButton } from "@/components/stripe/buy-listing-button"

// Helper function to format relative time
const formatRelativeTime = (timestamp: string): string => {
  const now = new Date()
  const createdAt = new Date(timestamp)
  const diffInMs = now.getTime() - createdAt.getTime()

  const seconds = Math.floor(diffInMs / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const weeks = Math.floor(days / 7)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  if (seconds < 60) {
    return "listed just now"
  } else if (minutes < 60) {
    return `listed ${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`
  } else if (hours < 24) {
    return `listed ${hours} ${hours === 1 ? "hour" : "hours"} ago`
  } else if (days < 7) {
    return `listed ${days} ${days === 1 ? "day" : "days"} ago`
  } else if (weeks < 4) {
    return `listed ${weeks} ${weeks === 1 ? "week" : "weeks"} ago`
  } else if (months < 12) {
    return `listed ${months} ${months === 1 ? "month" : "months"} ago`
  } else {
    return `listed ${years} ${years === 1 ? "year" : "years"} ago`
  }
}

export default function ItemDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)
  const [messageLoading, setMessageLoading] = useState(false)
  const [messageSent, setMessageSent] = useState(false)
  const [messageForm, setMessageForm] = useState({
    buyerEmail: "",
    message: "I'm interested in your item!",
  })

  useEffect(() => {
    if (params.id) {
      fetchListing(params.id as string)
    }
  }, [params.id])

  const fetchListing = async (id: string) => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from("listings").select("*").eq("id", id).single()

      if (error) throw error
      setListing(data)
    } catch (error) {
      console.error("Error fetching listing:", error)
      router.push("/")
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!listing || !messageForm.buyerEmail || !messageForm.message) {
      alert("Please fill in all fields")
      return
    }

    try {
      setMessageLoading(true)

      // Save message to database
      const { error } = await supabase.from("messages").insert([
        {
          listing_id: listing.id,
          buyer_email: messageForm.buyerEmail,
          seller_email: listing.contact_email,
          message: messageForm.message,
        },
      ])

      if (error) throw error

      // Send email notification using SendGrid
      const emailResponse = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: listing.contact_email,
          subject: `New message about your listing: ${listing.title}`,
          message: messageForm.message,
          buyerEmail: messageForm.buyerEmail,
          listingTitle: listing.title,
        }),
      })

      const emailResult = await emailResponse.json()

      if (!emailResult.success) {
        console.error("Failed to send email:", emailResult.error)
        // Still show success to user since message was saved to database
        alert("Message saved but email notification failed to send. The seller can still see your message.")
      }

      setMessageSent(true)
      setMessageForm({ buyerEmail: "", message: "I'm interested in your item!" })
    } catch (error) {
      console.error("Error sending message:", error)
      alert("Error sending message. Please try again.")
    } finally {
      setMessageLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-6 md:py-8">
          <div className="animate-pulse">
            <div className="h-6 md:h-8 bg-gray-200 rounded w-1/4 mb-6 md:mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              <div className="aspect-square bg-gray-200 rounded-2xl"></div>
              <div className="space-y-4">
                <div className="h-6 md:h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-5 md:h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 md:h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-3 md:h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-6 md:py-8 text-center">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">Listing not found</h1>
          <Link href="/">
            <Button className="aero-button">Back to Marketplace</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-6 md:py-8">
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 md:mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          <span className="text-sm md:text-base">Back to Marketplace</span>
        </Link>

        <div className="flex items-center space-x-3 mb-6 md:mb-8">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm md:text-base">M</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Marketplace</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Image */}
          <div className="aspect-square relative rounded-2xl overflow-hidden bg-gray-100 category-card">
            {listing.image_url ? (
              <Image
                src={listing.image_url || "/placeholder.svg"}
                alt={listing.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <span className="text-base md:text-lg">No image available</span>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-4 md:space-y-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{listing.title}</h2>
              <p className="text-2xl md:text-3xl font-bold text-gray-800">${listing.price}</p>
              <div className="text-xs md:text-sm text-gray-600 mt-2 space-y-1">
                <p>{listing.created_at ? formatRelativeTime(listing.created_at) : "Listed recently"}</p>
                <p>in {listing.location || "Location not specified"}</p>
              </div>
              <p className="text-xs md:text-sm text-gray-600 mt-2">
                Category:{" "}
                {listing.category
                  .split("-")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </p>
            </div>

            {listing.description && (
              <div>
                <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2">Description</h3>
                <p className="text-gray-600 text-sm md:text-base">{listing.description}</p>
              </div>
            )}

            <div>
              <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2">Seller Information</h3>
              <p className="text-gray-600 text-sm md:text-base">{listing.contact_email}</p>
            </div>

            {/* Buy Now Button for Buyers */}
            <div className="my-6">
              <div className="category-card rounded-2xl p-4 md:p-6">
                <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">Buy Now</h3>
                {/* Modular Stripe Buy Button */}
                <BuyListingButton
                  listingId={listing.id}
                  sellerId={listing.user_id}
                  listingTitle={listing.title}
                  price={listing.price}
                  currency="USD"
                  className="w-full"
                />
              </div>
            </div>

            <div className="category-card rounded-2xl p-4 md:p-6">
              <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">Message Seller</h3>

              {messageSent ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 md:p-4">
                  <p className="text-green-800 font-medium text-sm md:text-base">Message sent successfully!</p>
                  <p className="text-green-600 text-xs md:text-sm mt-1">
                    The seller will receive an email notification.
                  </p>
                </div>
              ) : (
                <form onSubmit={sendMessage} className="space-y-3 md:space-y-4">
                  <div>
                    <Label htmlFor="buyerEmail" className="text-xs md:text-sm font-medium text-gray-700">
                      Your Email
                    </Label>
                    <Input
                      id="buyerEmail"
                      type="email"
                      placeholder="your@email.com"
                      value={messageForm.buyerEmail}
                      onChange={(e) => setMessageForm({ ...messageForm, buyerEmail: e.target.value })}
                      className="mt-1 aero-input text-sm md:text-base"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-xs md:text-sm font-medium text-gray-700">
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="I'm interested in your item!"
                      value={messageForm.message}
                      onChange={(e) => setMessageForm({ ...messageForm, message: e.target.value })}
                      className="mt-1 aero-input text-sm md:text-base"
                      rows={3}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={messageLoading}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-2 rounded-xl text-sm md:text-base"
                  >
                    {messageLoading ? "Sending Message..." : "Send Message"}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
