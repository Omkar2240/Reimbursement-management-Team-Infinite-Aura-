import { Metadata } from "next"
import ProtectedRoute from "@/components/layout/protected-route"
import SuperAdminDashboardView from "@/features/admin/components/super-admin-dashboard-view"

export const metadata: Metadata = {
  title: "Super Admin Dashboard",
  description: "Manage admin users as Super Admin.",
}

export default function SuperAdminPage() {
  return (
    <ProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
      <SuperAdminDashboardView />
    </ProtectedRoute>
  )
}

