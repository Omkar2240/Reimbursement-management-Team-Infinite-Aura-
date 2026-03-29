import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export type LoginFormValues = z.infer<typeof loginSchema>

export const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  country: z.string().min(1, "Country is required"),
  currency_code: z.string().min(1, "Currency code is required"),
})

export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>

export const sendOtpSchema = z.object({
  email: z.string().email("Invalid email address"),
})

export type SendOtpFormValues = z.infer<typeof sendOtpSchema>

export const resetPasswordWithOtpSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().min(4, "OTP is required"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
})

export type ResetPasswordWithOtpFormValues = z.infer<typeof resetPasswordWithOtpSchema>
