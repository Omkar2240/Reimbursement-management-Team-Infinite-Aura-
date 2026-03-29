"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShieldCheck, LayoutDashboard, Receipt, UserCog, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/providers/auth-provider"

const superAdminNavigation = [
  { name: "Admin Dashboard", href: "/super-admin", icon: LayoutDashboard },
]

const adminNavigation = [
  { name: "Expenses", href: "/expenses", icon: Receipt },
  { name: "Team", href: "/admin/sub-admin", icon: Users },
  { name: "Admin Rules", href: "/admin/rules", icon: UserCog },
]

const managerNavigation = [{ name: "Expenses", href: "/expenses", icon: Receipt }]
const employeeNavigation = [{ name: "Expenses", href: "/expenses", icon: Receipt }]

export default function Sidebar() {
  const pathname = usePathname()
  const { user } = useAuth()
  const role = (user?.role || "").toUpperCase()
  const navigation =
    role === "SUPER_ADMIN"
      ? superAdminNavigation
      : role === "ADMIN"
        ? adminNavigation
        : role === "MANAGER"
          ? managerNavigation
          : employeeNavigation

  return (
    <div className="flex h-full w-64 flex-col gap-y-5 overflow-y-auto border-r border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 px-6 pb-4">
      <div className="flex h-16 shrink-0 items-center gap-2 mt-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow">
          <ShieldCheck size={18} />
        </div>
        <span className="text-xl font-bold tracking-tight">FlowExpense</span>
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`) && item.href !== "/"
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        isActive
                          ? "bg-zinc-200/50 text-primary dark:bg-zinc-800 dark:text-zinc-100"
                          : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-100",
                        "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium transition-colors"
                      )}
                    >
                      <item.icon
                        className={cn(
                          isActive ? "text-primary dark:text-zinc-100" : "text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100",
                          "h-5 w-5 shrink-0"
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  )
}
