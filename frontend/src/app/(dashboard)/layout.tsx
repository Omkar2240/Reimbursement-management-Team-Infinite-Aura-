"use client"

import React from "react"
import Sidebar from "@/components/layout/sidebar"
import Topbar from "@/components/layout/topbar"
import ProtectedRoute from "@/components/layout/protected-route"
import FirstLoginSetupModal from "@/features/auth/components/first-login-setup-modal"
import { useAuth } from "@/providers/auth-provider"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const showFirstLoginSetup = !user?.country || !user?.currency_code

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-white dark:bg-zinc-950">
      {/* Sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <Sidebar />
      </div>

      <div className="lg:pl-64 flex flex-col flex-1">
        <Topbar />
        <main className="flex-1 overflow-y-auto bg-zinc-50/50 dark:bg-zinc-900/10">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
      <FirstLoginSetupModal isOpen={showFirstLoginSetup} userName={user?.name} />
      </div>
    </ProtectedRoute>
  )
}
