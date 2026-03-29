import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  getMe,
  patchPasswordWithOtp,
  postLogin,
  postSendOtp,
  putProfile
} from "@/services/auth.service"
import {
  LoginFormValues,
  ResetPasswordWithOtpFormValues,
  SendOtpFormValues,
  UpdateProfileFormValues
} from "@/schemas/auth.schema"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import storage from "@/lib/storage"

export const useCurrentUser = () => {
  const hasToken = Boolean(storage.getToken())
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const data = await getMe()
      return data
    },
    retry: false,
    enabled: hasToken,
  })
}

export const useLogin = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: LoginFormValues) => {
      const res = await postLogin(data)
      return res
    },
    onSuccess: async (res) => {
      const token = res?.access_token || res?.token || res?.accessToken
      if (token) {
        storage.setToken(token)
      }
      await queryClient.invalidateQueries({ queryKey: ["profile"] })
      toast.success("Login successful")
      router.push("/expenses")
    },
    onError: (error: any) => {
      toast.error(error?.message || "Invalid credentials")
    },
  })
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: UpdateProfileFormValues) => {
      return await putProfile(data)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["profile"] })
      toast.success("Profile updated")
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update profile")
    },
  })
}

export const useLogout = () => {
  const router = useRouter()
  return useMutation({
    mutationFn: async () => Promise.resolve(),
    onSuccess: () => {
      storage.clearToken()
      toast.success("Logout successful")
      router.push("/login")
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed")
    },
  })
}

export const useSendOtp = () => {
  return useMutation({
    mutationFn: async (data: SendOtpFormValues) => {
      return await postSendOtp(data)
    },
    onSuccess: () => {
      toast.success("OTP sent successfully")
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to send OTP")
    },
  })
}

export const useResetPasswordWithOtp = () => {
  return useMutation({
    mutationFn: async (data: ResetPasswordWithOtpFormValues) => {
      return await patchPasswordWithOtp(data)
    },
    onSuccess: () => {
      toast.success("Password updated successfully")
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update password")
    },
  })
}
