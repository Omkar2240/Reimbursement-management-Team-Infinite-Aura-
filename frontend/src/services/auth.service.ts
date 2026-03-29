import apiClient from '@/config/api.config';
import {
  LoginFormValues,
  ResetPasswordWithOtpFormValues,
  SendOtpFormValues,
  UpdateProfileFormValues
} from '@/schemas/auth.schema';

const USER_BASE_URL = 'v1/admin/user';

export const postLogin = async (payload: LoginFormValues): Promise<any> => {
  return await apiClient.post(`${USER_BASE_URL}/login`, payload);
};

export const getMe = async (): Promise<any> => {
  return await apiClient.get(`${USER_BASE_URL}`);
};

export const putProfile = async (payload: UpdateProfileFormValues): Promise<any> => {
  return await apiClient.put(`${USER_BASE_URL}`, payload);
};

export const postSendOtp = async (payload: SendOtpFormValues): Promise<any> => {
  return await apiClient.post(`${USER_BASE_URL}/send-otp`, payload);
};

export const patchPasswordWithOtp = async (
  payload: ResetPasswordWithOtpFormValues
): Promise<any> => {
  return await apiClient.patch(`${USER_BASE_URL}/password`, payload);
};
