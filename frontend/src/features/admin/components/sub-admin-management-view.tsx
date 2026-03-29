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
  useAssignManager,
  useCreateSubAdmin,
  useDeleteSubAdmin,
  useManagerTeam,
  useSubAdmins,
  useUpdateSubAdmin,
  useUpdateSubAdminStatus
} from "@/hooks/admin/use-sub-admins"
import type { TeamMemberDto } from "@/services/sub-admin.service"

type SubAdminRecord = {
  id: string | number
  firstName: string
  lastName?: string
  email: string
  role: string
  mobileNumber?: string
  is_active?: boolean
  status?: string
  parentId?: string | number
}

export default function SubAdminManagementView() {
  const [editingId, setEditingId] = useState<string | number | null>(null)
  const [selectedManagerId, setSelectedManagerId] = useState<string>("")
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("")

  const { data, isLoading } = useSubAdmins()
  const { data: teamData } = useManagerTeam(selectedManagerId)
  const createMutation = useCreateSubAdmin()
  const updateMutation = useUpdateSubAdmin()
  const deleteMutation = useDeleteSubAdmin()
  const statusMutation = useUpdateSubAdminStatus()
  const assignManagerMutation = useAssignManager()

  const rows = useMemo<SubAdminRecord[]>(() => {
    if (Array.isArray(data)) return data
    if (Array.isArray(data?.items)) return data.items
    if (Array.isArray(data?.data)) return data.data
    if (Array.isArray(data?.data?.rows)) return data.data.rows
    return []
  }, [data])

  const managers = rows.filter((row) => (row.role || "").toUpperCase() === "MANAGER")
  const employees = rows.filter((row) => (row.role || "").toUpperCase() === "EMPLOYEE")
  const managerTeam = Array.isArray(teamData?.data) ? teamData.data : []

  const createForm = useForm<SubAdminFormValues>({
    resolver: zodResolver(subAdminFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      mobileNumber: "",
      role: "EMPLOYEE",
      is_active: true
    }
  })

  const editForm = useForm<SubAdminFormValues>({
    resolver: zodResolver(subAdminFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      mobileNumber: "",
      role: "EMPLOYEE",
      is_active: true
    }
  })

  const onCreate = (values: SubAdminFormValues) => {
    createMutation.mutate(values, {
      onSuccess: () => {
        createForm.reset({
          firstName: "",
          lastName: "",
          email: "",
          mobileNumber: "",
          role: "EMPLOYEE",
          is_active: true
        })
      }
    })
  }

  const startEdit = (row: SubAdminRecord) => {
    setEditingId(row.id)
    editForm.reset({
      firstName: row.firstName,
      lastName: row.lastName || "",
      email: row.email,
      mobileNumber: row.mobileNumber || "",
      role: (row.role?.toUpperCase() as SubAdminFormValues["role"]) || "EMPLOYEE",
      is_active: row.is_active ?? row.status === "active"
    })
  }

  const onEdit = (values: SubAdminFormValues) => {
    if (!editingId) return
    updateMutation.mutate(
      {
        id: String(editingId),
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
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Jane" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={createForm.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
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
                name="mobileNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile Number</FormLabel>
                    <FormControl>
                      <Input placeholder="9999999999" {...field} />
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
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
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
                  name="mobileNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile Number</FormLabel>
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
                      <td className="px-6 py-4">{`${row.firstName || ""} ${row.lastName || ""}`.trim()}</td>
                      <td className="px-6 py-4">{row.email}</td>
                      <td className="px-6 py-4">{row.role}</td>
                      <td className="px-6 py-4">
                        <button
                          type="button"
                          className="rounded border border-zinc-300 px-2 py-1 text-xs dark:border-zinc-700"
                          disabled={statusMutation.isPending}
                          onClick={() =>
                            statusMutation.mutate({
                              id: String(row.id),
                              data: { is_active: !(row.is_active ?? row.status === "active") }
                            })
                          }
                        >
                          {row.is_active ?? row.status === "active" ? "Active" : "Inactive"}
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
                          onClick={() => deleteMutation.mutate(String(row.id))}
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

      <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="text-lg font-semibold">Manager Relationship</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Assign an employee to a manager and view manager team members.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <Select value={selectedEmployeeId} onValueChange={setSelectedEmployeeId}>
            <SelectTrigger>
              <SelectValue placeholder="Select Employee" />
            </SelectTrigger>
            <SelectContent>
              {employees.map((employee) => (
                  <SelectItem key={String(employee.id)} value={String(employee.id)}>
                  {`${employee.firstName || ""} ${employee.lastName || ""}`.trim()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedManagerId} onValueChange={setSelectedManagerId}>
            <SelectTrigger>
              <SelectValue placeholder="Select Manager" />
            </SelectTrigger>
            <SelectContent>
              {managers.map((manager) => (
                  <SelectItem key={String(manager.id)} value={String(manager.id)}>
                  {`${manager.firstName || ""} ${manager.lastName || ""}`.trim()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            onClick={() =>
              assignManagerMutation.mutate({
                employeeId: selectedEmployeeId,
                managerId: selectedManagerId
              })
            }
            disabled={!selectedEmployeeId || !selectedManagerId || assignManagerMutation.isPending}
          >
            Assign Manager
          </Button>
        </div>

        {selectedManagerId ? (
          <div className="mt-4 rounded border border-zinc-200 p-4 dark:border-zinc-800">
            <h3 className="font-medium">Selected manager team</h3>
            {managerTeam.length ? (
              <ul className="mt-2 space-y-1 text-sm text-zinc-600 dark:text-zinc-300">
                {managerTeam.map((member: TeamMemberDto) => (
                  <li key={member.id}>
                    {`${member.firstName || ""} ${member.lastName || ""}`.trim()} - {member.email}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-zinc-500">No team members found.</p>
            )}
          </div>
        ) : null}
      </div>
    </div>
  )
}
