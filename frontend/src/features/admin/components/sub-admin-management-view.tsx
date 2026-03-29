"use client"

import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  subAdminFormSchema,
  SubAdminFormValues
} from "@/schemas/admin.schema"
import {
  useCreateSubAdmin,
  useDeleteSubAdmin,
  useSubAdmins,
  useUpdateSubAdmin,
  useUpdateSubAdminStatus
} from "@/hooks/admin/use-sub-admins"

type SubAdminRecord = {
  id: string
  name: string
  email: string
  role: string
  is_active?: boolean
}

export default function SubAdminManagementView() {
  const [editingId, setEditingId] = useState<string | null>(null)

  const { data, isLoading } = useSubAdmins()
  const createMutation = useCreateSubAdmin()
  const updateMutation = useUpdateSubAdmin()
  const deleteMutation = useDeleteSubAdmin()
  const statusMutation = useUpdateSubAdminStatus()

  const rows = useMemo<SubAdminRecord[]>(() => {
    if (Array.isArray(data)) return data
    if (Array.isArray(data?.items)) return data.items
    if (Array.isArray(data?.data)) return data.data
    return []
  }, [data])

  const createForm = useForm<SubAdminFormValues>({
    resolver: zodResolver(subAdminFormSchema as any),
    defaultValues: {
      name: "",
      email: "",
      role: "EMPLOYEE",
      is_active: true
    }
  })

  const editForm = useForm<SubAdminFormValues>({
    resolver: zodResolver(subAdminFormSchema as any),
    defaultValues: {
      name: "",
      email: "",
      role: "EMPLOYEE",
      is_active: true
    }
  })

  const onCreate = (values: SubAdminFormValues) => {
    createMutation.mutate(values, {
      onSuccess: () => {
        createForm.reset({
          name: "",
          email: "",
          role: "EMPLOYEE",
          is_active: true
        })
      }
    })
  }

  const startEdit = (row: SubAdminRecord) => {
    setEditingId(row.id)
    editForm.reset({
      name: row.name,
      email: row.email,
      role: (row.role?.toUpperCase() as SubAdminFormValues["role"]) || "EMPLOYEE",
      is_active: row.is_active ?? true
    })
  }

  const onEdit = (values: SubAdminFormValues) => {
    if (!editingId) return
    updateMutation.mutate(
      {
        id: editingId,
        data: values
      },
      {
        onSuccess: () => {
          setEditingId(null)
        }
      }
    )
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Team Management</h1>
        <p className="text-zinc-500 mt-2">
          Create and manage employees/managers who submit and approve expenses.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="text-lg font-semibold">Create User</h2>
          <Form {...createForm}>
            <form onSubmit={createForm.handleSubmit(onCreate)} className="mt-4 space-y-4">
              <FormField
                control={createForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Jane Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={createForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="jane@company.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={createForm.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="EMPLOYEE">Employee</SelectItem>
                          <SelectItem value="MANAGER">Manager</SelectItem>
                          <SelectItem value="FINANCE">Finance</SelectItem>
                          <SelectItem value="DIRECTOR">Director</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                {createMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Create user
              </Button>
            </form>
          </Form>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="text-lg font-semibold">Edit User</h2>
          {editingId ? (
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(onEdit)} className="mt-4 space-y-4">
                <FormField
                  control={editForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <FormControl>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="EMPLOYEE">Employee</SelectItem>
                            <SelectItem value="MANAGER">Manager</SelectItem>
                            <SelectItem value="FINANCE">Finance</SelectItem>
                            <SelectItem value="DIRECTOR">Director</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-3">
                  <Button type="submit" disabled={updateMutation.isPending}>
                    Save
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setEditingId(null)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          ) : (
            <p className="mt-4 text-sm text-zinc-500">Select a user from the table below to edit.</p>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
          <h2 className="text-lg font-semibold">Existing Users</h2>
        </div>
        {isLoading ? (
          <div className="p-6">Loading users...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50 dark:bg-zinc-900">
                <tr>
                  <th className="px-6 py-3 text-left font-medium text-zinc-500">Name</th>
                  <th className="px-6 py-3 text-left font-medium text-zinc-500">Email</th>
                  <th className="px-6 py-3 text-left font-medium text-zinc-500">Role</th>
                  <th className="px-6 py-3 text-left font-medium text-zinc-500">Status</th>
                  <th className="px-6 py-3 text-right font-medium text-zinc-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.length ? (
                  rows.map((row) => (
                    <tr key={row.id} className="border-t border-zinc-100 dark:border-zinc-800">
                      <td className="px-6 py-4">{row.name}</td>
                      <td className="px-6 py-4">{row.email}</td>
                      <td className="px-6 py-4">{row.role}</td>
                      <td className="px-6 py-4">
                        <button
                          type="button"
                          className="rounded border border-zinc-300 px-2 py-1 text-xs dark:border-zinc-700"
                          disabled={statusMutation.isPending}
                          onClick={() =>
                            statusMutation.mutate({
                              id: row.id,
                              data: { is_active: !(row.is_active ?? true) }
                            })
                          }
                        >
                          {row.is_active ?? true ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <Button variant="outline" size="sm" onClick={() => startEdit(row)}>
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={deleteMutation.isPending}
                          onClick={() => deleteMutation.mutate(row.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">
                      No users found.
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
