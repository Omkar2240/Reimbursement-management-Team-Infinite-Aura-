import { Metadata } from 'next';
import ProtectedRoute from '@/components/layout/protected-route';
import SubAdminManagementView from '@/features/admin/components/sub-admin-management-view';

export const metadata: Metadata = {
  title: 'Team Management | Admin',
  description: 'Manage employees and managers for expense workflows.'
};

export default async function SubAdminPage() {
  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <SubAdminManagementView />
    </ProtectedRoute>
  );
}
