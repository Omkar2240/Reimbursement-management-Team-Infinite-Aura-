"use client"

import { useMemo } from "react"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useSubAdmins, useDeleteSubAdmin, useUpdateSubAdminStatus } from "@/hooks/admin/use-sub-admins"

type UserRow = {
  id: string | number
  firstName: string
  lastName?: string
  email: string
  role: string
  is_active?: boolean
  status?: string
}

export default function SuperAdminDashboardView() {
  const { data, isLoading } = useSubAdmins()
  const deleteMutation = useDeleteSubAdmin()
  const statusMutation = useUpdateSubAdminStatus()

  const rows = useMemo<UserRow[]>(() => {
    if (Array.isArray(data)) return data
    if (Array.isArray(data?.items)) return data.items
    if (Array.isArray(data?.data)) return data.data
    if (Array.isArray(data?.data?.rows)) return data.data.rows
    return []
  }, [data])

  const adminRows = rows.filter((row) => (row.role || "").toUpperCase() === "ADMIN")

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Super Admin Dashboard</h1>
        <p className="text-zinc-500 mt-2">Manage Admin accounts in one place.</p>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
          <h2 className="text-lg font-semibold">Admins</h2>
        </div>

        {isLoading ? (
          <div className="p-6 flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading admins...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50 dark:bg-zinc-900">
                <tr>
                  <th className="px-6 py-3 text-left font-medium text-zinc-500">Name</th>
                  <th className="px-6 py-3 text-left font-medium text-zinc-500">Email</th>
                  <th className="px-6 py-3 text-left font-medium text-zinc-500">Status</th>
                  <th className="px-6 py-3 text-right font-medium text-zinc-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {adminRows.length ? (
                  adminRows.map((row) => (
                    <tr key={row.id} className="border-t border-zinc-100 dark:border-zinc-800">
                      <td className="px-6 py-4">{`${row.firstName || ""} ${row.lastName || ""}`.trim()}</td>
                      <td className="px-6 py-4">{row.email}</td>
                      <td className="px-6 py-4">
                        {row.is_active ?? row.status === "active" ? "Active" : "Inactive"}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={statusMutation.isPending}
                          onClick={() =>
                            statusMutation.mutate({
                              id: String(row.id),
                              data: { is_active: !(row.is_active ?? row.status === "active") },
                            })
                          }
                        >
                          Toggle Status
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={deleteMutation.isPending}
                          onClick={() => deleteMutation.mutate(String(row.id))}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-zinc-500">
                      No admins found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

