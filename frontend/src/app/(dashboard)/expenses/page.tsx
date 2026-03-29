import { Metadata } from 'next';
import ExpenseDashboardView from '@/features/expenses/components/expense-dashboard-view';
import ProtectedRoute from '@/components/layout/protected-route';

export const metadata: Metadata = {
  title: 'Expenses | FlowExpense',
  description: 'Manage your expense reports.'
};

export default async function ExpensesPage() {
  return (
    <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER', 'EMPLOYEE']}>
      <ExpenseDashboardView />
    </ProtectedRoute>
  );
}
