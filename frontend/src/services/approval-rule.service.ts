import apiClient from '@/config/api.config';

const BASE_URL = '/admin/approval-rule';

export type ApprovalRule = {
  id: number;
  companyId: number;
  stepNumber: number;
  approverRole: string;
  approverUserId?: number | null;
  isManagerApprover?: boolean;
  percentageThreshold?: number | null;
  allowCfoShortcut?: boolean;
  isActive?: boolean;
};

export type ApprovalRulePayload = {
  companyId: number;
  stepNumber: number;
  approverRole: string;
  approverUserId?: number;
  isManagerApprover?: boolean;
  percentageThreshold?: number;
  allowCfoShortcut?: boolean;
  isActive?: boolean;
};

export const getApprovalRules = async (companyId: string | number): Promise<ApprovalRule[]> => {
  return await apiClient.get(`${BASE_URL}/${companyId}`);
};

export const postApprovalRule = async (payload: ApprovalRulePayload): Promise<ApprovalRule> => {
  return await apiClient.post(BASE_URL, payload);
};

export const putApprovalRule = async (
  id: string | number,
  payload: Partial<ApprovalRulePayload>
): Promise<ApprovalRule> => {
  return await apiClient.put(`${BASE_URL}/${id}`, payload);
};

export const deleteApprovalRule = async (id: string | number): Promise<{ message?: string }> => {
  return await apiClient.delete(`${BASE_URL}/${id}`);
};
