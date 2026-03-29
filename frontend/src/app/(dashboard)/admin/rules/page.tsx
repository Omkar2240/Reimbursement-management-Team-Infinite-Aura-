import { Metadata } from 'next';
import RulesBuilderView from '@/features/admin/components/rules-builder-view';
import ProtectedRoute from '@/components/layout/protected-route';

export const metadata: Metadata = {
  title: 'Approval Rules | Admin',
  description: 'Manage your approval workflows.'
};

export default async function RulesPage() {
  return (
    <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
      <RulesBuilderView />
    </ProtectedRoute>
  );
}
