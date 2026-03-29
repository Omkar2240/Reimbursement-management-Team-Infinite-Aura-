"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/providers/auth-provider"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: string[]
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isLoading, isError } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    // If not loading and no user (or auth error), bounce to login
    if (!isLoading && (!user || isError)) {
      router.replace("/login")
    } 
    // If not loading, user exists, and we have specific role requirements
    else if (!isLoading && user && allowedRoles && allowedRoles.length > 0) {
      // Allow case-insensitive matching if needed, or exact matching based on your backend
      const userRole = user.role?.toUpperCase()
      const hasPermission = allowedRoles.some(role => role.toUpperCase() === userRole)
      
        if (!hasPermission) {
          if ((userRole || "").toUpperCase() === "SUPER_ADMIN") {
            router.replace("/super-admin")
          } else {
            router.replace("/expenses")
          }
        }
      }
  }, [mounted, user, isLoading, isError, router, allowedRoles])

  if (!mounted) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white dark:bg-zinc-950">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    )
  }

  // Show a blank or loading state while fetching auth to prevent unauthorized flashing
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white dark:bg-zinc-950">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    )
  }

  // If unauthorized state persists right before the useEffect unmounts/redirects, render nothing
  if (!user || isError) {
    return null
  }

  // If role does not match, don't render children
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user.role?.toUpperCase()
    const hasPermission = allowedRoles.some(role => role.toUpperCase() === userRole)
    if (!hasPermission) return null
  }

  return <>{children}</>
}
