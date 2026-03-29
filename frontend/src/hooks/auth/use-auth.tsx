import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  getMe,
  patchPasswordWithOtp,
  postLogin,
  postSignup,
  postSendOtp,
  putProfile
} from "@/services/auth.service"
import {
  LoginFormValues,
  ResetPasswordWithOtpFormValues,
  SendOtpFormValues,
  SignupFormValues,
  UpdateProfileFormValues
} from "@/schemas/auth.schema"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import storage from "@/lib/storage"
import { getErrorMessage } from "@/types/api"

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
      const rawToken =
        res?.data?.data?.token ||
        res?.data?.data?.access_token ||
        res?.data?.data?.accessToken ||
        res?.data?.token ||
        res?.data?.access_token ||
        res?.data?.accessToken ||
        res?.result?.data?.token ||
        res?.token ||
        res?.access_token ||
        res?.accessToken

      const token =
        typeof rawToken === "string"
          ? rawToken.replace(/^Bearer\s+/i, "").trim()
          : undefined

      if (token) {
        storage.setToken(token)
      } else {
        toast.error("Login succeeded but token was missing in response")
        return
      }
      const profile = await queryClient.fetchQuery({
        queryKey: ["profile"],
        queryFn: getMe,
      })
      toast.success("Login successful")
      const userRole = (profile?.role || "").toUpperCase()
      if (userRole === "SUPER_ADMIN") {
        router.push("/super-admin")
      } else {
        router.push("/expenses")
      }
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Invalid credentials"))
    },
  })
}

export const useSignup = () => {
  const router = useRouter()
  return useMutation({
    mutationFn: async (data: SignupFormValues) => {
      return await postSignup(data)
    },
    onSuccess: () => {
      toast.success("Signup successful. Please login with your credentials.")
      router.push("/login")
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to sign up"))
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
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to update profile"))
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
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed"))
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
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to send OTP"))
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
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to update password"))
    },
  })
}
