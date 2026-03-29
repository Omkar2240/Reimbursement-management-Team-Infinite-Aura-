"use client"

import React from "react"
import { ModeToggle } from "@/components/ui/mode-toggle"
import { useAuth } from "@/providers/auth-provider"
import { LogOut } from "lucide-react"

export default function Topbar() {
  const { user, isLoading, logout } = useAuth()
  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 justify-end items-center">
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <ModeToggle />
          
          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-zinc-200 dark:lg:bg-zinc-800" aria-hidden="true" />

          {/* User Profile */}
          <div className="flex items-center gap-x-4">
            <span className="sr-only">Your profile</span>
            {isLoading ? (
              <div className="h-8 w-8 rounded-full bg-zinc-200 animate-pulse dark:bg-zinc-800"></div>
            ) : user ? (
              <>
                <div className="h-8 w-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                  {user.firstName?.charAt(0).toUpperCase() || "U"}
                </div>
                <button
                  onClick={logout}
                  className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-2"
                >
                  <LogOut size={16} />
                  <span className="hidden lg:inline">Sign out</span>
                </button>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
