import apiClient from '@/config/api.config';
import { ExpenseFormValues, Expense } from '@/schemas/expense.schema';

const BASE_URLS = `/expenses`;

export const getExpenses = async (): Promise<Expense[]> => {
  return await apiClient.get(`${BASE_URLS}`);
};

export const getExpenseById = async (id: string): Promise<Expense> => {
  return await apiClient.get(`${BASE_URLS}/${id}`);
};

export const createExpense = async (payload: ExpenseFormValues): Promise<Expense> => {
  return await apiClient.post(`${BASE_URLS}`, payload);
};

export const approveExpense = async (id: string): Promise<Expense> => {
  return await apiClient.post(`${BASE_URLS}/${id}/approve`);
};

export const rejectExpense = async (id: string, reason?: string): Promise<Expense> => {
  return await apiClient.post(`${BASE_URLS}/${id}/reject`, { reason });
};
