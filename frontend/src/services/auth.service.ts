import apiClient from '@/config/api.config';
import {
  LoginFormValues,
  ResetPasswordWithOtpFormValues,
  SendOtpFormValues,
  SignupFormValues,
  UpdateProfileFormValues
} from '@/schemas/auth.schema';

const USER_BASE_URL = '/admin/user';
const PUBLIC_USER_BASE_URL = '/user';

const isFallbackEligible = (error: unknown): boolean => {
  if (!error || typeof error !== 'object') return false;
  if (!('statusCode' in error)) return false;
  const statusCode = (error as { statusCode?: number }).statusCode;
  return statusCode === 400 || statusCode === 401 || statusCode === 404;
};

export type AuthUser = {
  id: number;
  firstName: string;
  lastName?: string | null;
  email: string;
  role: string;
  country?: string | null;
  currencyCode?: string | null;
  currency_code?: string | null;
  companyId?: number | null;
  company_id?: number | null;
};

export type LoginResponse = {
  data?: {
    token?: string;
    access_token?: string;
    accessToken?: string;
  };
  token?: string;
  access_token?: string;
  accessToken?: string;
};

export type ApiMessageResponse<T = unknown> = {
  message?: string;
  data?: T;
};

export const postLogin = async (payload: LoginFormValues): Promise<LoginResponse> => {
  try {
    return await apiClient.post(`${USER_BASE_URL}/login`, payload);
  } catch (error) {
    if (isFallbackEligible(error)) {
      return await apiClient.post(`${PUBLIC_USER_BASE_URL}/login`, payload);
    }
    throw error;
  }
};

export const postSignup = async (payload: SignupFormValues): Promise<ApiMessageResponse> => {
  return await apiClient.post(`/user/sign-up`, payload);
};

export const getMe = async (): Promise<AuthUser> => {
  let response: { data?: AuthUser } | AuthUser;
  try {
    response = await apiClient.get<{ data?: AuthUser } | AuthUser>(`${USER_BASE_URL}`);
  } catch (error) {
    if (isFallbackEligible(error)) {
      response = await apiClient.get<{ data?: AuthUser } | AuthUser>(`${PUBLIC_USER_BASE_URL}`);
    } else {
      throw error;
    }
  }
  const normalized = response && typeof response === 'object' && 'data' in response && response.data
    ? response.data
    : (response as AuthUser);
  return {
    ...normalized,
    companyId: normalized.companyId ?? normalized.company_id ?? null,
    currencyCode: normalized.currencyCode ?? normalized.currency_code ?? null,
  }
};

export const putProfile = async (payload: UpdateProfileFormValues): Promise<ApiMessageResponse<AuthUser>> => {
  return await apiClient.put(`${USER_BASE_URL}`, payload);
};

export const postSendOtp = async (payload: SendOtpFormValues): Promise<ApiMessageResponse> => {
  return await apiClient.post(`${USER_BASE_URL}/send-otp`, payload);
};

export const patchPasswordWithOtp = async (
  payload: ResetPasswordWithOtpFormValues
): Promise<ApiMessageResponse> => {
  return await apiClient.patch(`${USER_BASE_URL}/password`, {
    email: payload.email,
    tempOtp: Number(payload.otp),
    password: payload.password
  });
};
