import apiClient from '@/config/api.config';
import {
  SubAdminFormValues,
  UpdateSubAdminStatusFormValues
} from '@/schemas/admin.schema';

const SUB_ADMIN_BASE_URL = '/admin/sub-admin';

export const getSubAdmins = async (): Promise<any> => {
  return await apiClient.get(SUB_ADMIN_BASE_URL);
};

export const postSubAdmin = async (payload: SubAdminFormValues): Promise<any> => {
  return await apiClient.post(SUB_ADMIN_BASE_URL, payload);
};

export const getSubAdminById = async (id: string): Promise<any> => {
  return await apiClient.get(`${SUB_ADMIN_BASE_URL}/${id}`);
};

export const putSubAdmin = async (
  id: string,
  payload: Partial<SubAdminFormValues>
): Promise<any> => {
  return await apiClient.put(`${SUB_ADMIN_BASE_URL}/${id}`, payload);
};

export const deleteSubAdmin = async (id: string): Promise<any> => {
  return await apiClient.delete(`${SUB_ADMIN_BASE_URL}/${id}`);
};

export const patchSubAdminStatus = async (
  id: string,
  payload: UpdateSubAdminStatusFormValues
): Promise<any> => {
  return await apiClient.patch(`${SUB_ADMIN_BASE_URL}/${id}`, payload);
};
