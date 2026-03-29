import { useMutation, useQuery } from "@tanstack/react-query"
import { getMe, postLogin, postLogout, postSignUp } from "@/services/auth.service"
import { LoginFormValues, SignupFormValues } from "@/schemas/auth.schema"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const data = await getMe()
      return data
    },
    retry: false,
  })
}

export const useLogin = () => {
  const router = useRouter()
  return useMutation({
    mutationFn: async (data: LoginFormValues) => {
      const res = await postLogin(data)
      return res
    },
    onSuccess: () => {
      toast.success("Login successful")
      router.push("/dashboard")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Invalid credentials")
    },
  })
}

export const useSignup = () => {
  const router = useRouter()
  return useMutation({
    mutationFn: async (data: SignupFormValues) => {
      const res = await postSignUp(data)
      return res
    },
    onSuccess: () => {
      toast.success("Signup successful")
      router.push("/dashboard")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Invalid credentials")
    },
  })
}

export const useLogout = () => {
  const router = useRouter()
  return useMutation({
    mutationFn: async () => {
      await postLogout()
    },
    onSuccess: () => {
      toast.success("Logout successful")
      router.push("/login")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed")
    },
  })
}
