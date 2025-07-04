import type React from "react"
import { cn } from "@/lib/utils"

interface GlassCardProps {
  children: React.ReactNode
  className?: string
}

export function GlassCard({ children, className }: GlassCardProps) {
  return (
    <div
      className={cn(
        "backdrop-blur-md bg-white/80 border border-white/20 rounded-2xl shadow-2xl",
        "before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-white/30 before:to-transparent before:pointer-events-none",
        "relative overflow-hidden",
        className,
      )}
    >
      {children}
    </div>
  )
}
