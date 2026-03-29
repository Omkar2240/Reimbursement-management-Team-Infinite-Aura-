"use client"

import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/providers/auth-provider"

export default function AuthLayoutWrapper({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    
    if (!isLoading && user) {
      router.replace("/expenses")
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
