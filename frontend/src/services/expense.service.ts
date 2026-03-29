import apiClient from '@/config/api.config';
import { ExpenseFormValues, Expense } from '@/schemas/expense.schema';

const BASE_URLS = `/expenses`;

export type ExpenseRule = {
  id?: number | null;
  stepNumber: number;
  approverRole: string;
  isManagerApprover?: boolean;
  percentageThreshold?: number | null;
  allowCfoShortcut?: boolean;
};

export type ConversionResult = {
  amount: number;
  from: string;
  to: string;
  rate: number;
};

export type ReceiptUploadResult = {
  expenseId: number;
  receiptUrl: string;
  ocrExtractedData: Record<string, unknown> | null;
};

export const getExpenses = async (): Promise<Expense[]> => {
  return await apiClient.get(`${BASE_URLS}`);
};

export const getExpenseById = async (id: string): Promise<Expense> => {
  const expenseId = String(id).trim();
  return await apiClient.get(`${BASE_URLS}/${expenseId}`);
};

export const createExpense = async (payload: ExpenseFormValues): Promise<Expense> => {
  return await apiClient.post(`${BASE_URLS}`, payload);
};

export const approveExpense = async (id: string): Promise<Expense> => {
  const expenseId = String(id).trim();
  return await apiClient.post(`${BASE_URLS}/${expenseId}/approve`);
};

export const rejectExpense = async (id: string, reason?: string): Promise<Expense> => {
  const expenseId = String(id).trim();
  return await apiClient.patch(`${BASE_URLS}/${expenseId}/reject`, { reason });
};

export const getPendingApprovals = async (): Promise<Expense[]> => {
  return await apiClient.get(`${BASE_URLS}/pending-approvals`);
};

export const getTeamExpenses = async (): Promise<Expense[]> => {
  return await apiClient.get(`${BASE_URLS}/team-expenses`);
};

export const getExpenseApprovalChain = async (
  id: string
): Promise<{ expense: Expense; rules: ExpenseRule[] }> => {
  const expenseId = String(id).trim();
  return await apiClient.get(`${BASE_URLS}/${expenseId}/approval-chain`);
};

export const convertExpense = async (id: string, toCurrency: string): Promise<ConversionResult> => {
  const expenseId = String(id).trim();
  return await apiClient.get(`${BASE_URLS}/${expenseId}/convert`, {
    params: { toCurrency }
  });
};

export const uploadExpenseReceipt = async (id: string, file: File): Promise<ReceiptUploadResult> => {
  const expenseId = String(id).trim();
  const formData = new FormData();
  formData.append('receipt', file);
  return await apiClient.post(`${BASE_URLS}/${expenseId}/receipt`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};
