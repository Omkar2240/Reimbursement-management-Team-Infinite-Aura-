import apiClient from '@/config/api.config';
import {
  SubAdminFormValues,
  UpdateSubAdminStatusFormValues
} from '@/schemas/admin.schema';

const SUB_ADMIN_BASE_URL = '/admin/sub-admin';

export type SubAdminDto = {
  id: string | number;
  firstName: string;
  lastName?: string;
  email: string;
  role: string;
  mobileNumber?: string;
  is_active?: boolean;
  status?: string;
  parentId?: string;
};

export type TeamMemberDto = {
  id: string | number;
  firstName: string;
  lastName?: string;
  email: string;
};

export const getSubAdmins = async (): Promise<SubAdminDto[]> => {
  return await apiClient.get(SUB_ADMIN_BASE_URL);
};

export const postSubAdmin = async (payload: SubAdminFormValues): Promise<SubAdminDto> => {
  return await apiClient.post(SUB_ADMIN_BASE_URL, {
    firstName: payload.firstName,
    lastName: payload.lastName || '',
    email: payload.email,
    mobileNumber: payload.mobileNumber,
    role: payload.role,
  });
};

export const getSubAdminById = async (id: string): Promise<SubAdminDto> => {
  return await apiClient.get(`${SUB_ADMIN_BASE_URL}/${id}`);
};

export const putSubAdmin = async (
  id: string,
  payload: Partial<SubAdminFormValues>
): Promise<SubAdminDto> => {
  return await apiClient.put(`${SUB_ADMIN_BASE_URL}/${id}`, payload);
};

export const deleteSubAdmin = async (id: string): Promise<{ message?: string }> => {
  return await apiClient.delete(`${SUB_ADMIN_BASE_URL}/${id}`);
};

export const patchSubAdminStatus = async (
  id: string,
  payload: UpdateSubAdminStatusFormValues
): Promise<{ message?: string }> => {
  return await apiClient.patch(`${SUB_ADMIN_BASE_URL}/${id}`, payload);
};

export const patchAssignManager = async (
  employeeId: string,
  managerId: string
): Promise<{ message?: string }> => {
  return await apiClient.patch(`${SUB_ADMIN_BASE_URL}/${employeeId}/manager`, {
    managerId
  });
};

export const getManagerTeam = async (managerId: string): Promise<TeamMemberDto[]> => {
  return await apiClient.get(`${SUB_ADMIN_BASE_URL}/${managerId}/team`);
};
