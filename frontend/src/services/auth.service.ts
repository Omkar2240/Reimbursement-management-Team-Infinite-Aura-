import apiClient from '@/config/api.config';
import { LoginFormValues, SignupFormValues } from '@/schemas/auth.schema';

const BASE_URLS = `/api/v1/auth`;

export const postLogin = async (payload: LoginFormValues): Promise<any> => {
  return await apiClient.post(`${BASE_URLS}/login`, payload);
};

export const postSignUp = async (payload: SignupFormValues): Promise<any> => {
  return await apiClient.post(`${BASE_URLS}/signup`, payload);
};

export const getMe = async (): Promise<any> => {
  return await apiClient.get(`${BASE_URLS}/me`);
};

export const postLogout = async (): Promise<any> => {
  return await apiClient.post(`${BASE_URLS}/logout`);
};
