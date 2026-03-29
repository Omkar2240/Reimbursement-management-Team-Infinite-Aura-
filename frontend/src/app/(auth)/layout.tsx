"use client"

import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/providers/auth-provider"

export default function AuthLayoutWrapper({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    
    if (!isLoading && user) {
      if ((user.role || "").toUpperCase() === "SUPER_ADMIN") {
        router.replace("/super-admin")
      } else {
        router.replace("/expenses")
      }
    }
  }, [user, isLoading, router])

  if (user) {
    return null
  }

  return (
    <React.Fragment>
      {children}
    </React.Fragment>
  )
}
