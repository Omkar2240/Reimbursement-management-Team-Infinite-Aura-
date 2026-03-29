import { Metadata } from 'next';
import ExpenseDashboardView from '@/features/expenses/components/expense-dashboard-view';

export const metadata: Metadata = {
  title: 'Expenses | FlowExpense',
  description: 'Manage your expense reports.'
};

export default async function ExpensesPage() {
  return (
    <ExpenseDashboardView />
  );
}
