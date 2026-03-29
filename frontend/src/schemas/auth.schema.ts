import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export type LoginFormValues = z.infer<typeof loginSchema>

export const signupSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  countryCode: z.string().min(1, "Country code is required"),
  mobileNumber: z.string().min(8, "Mobile number is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  country: z.string().min(1, "Country is required"),
  currencyCode: z.string().min(1, "Currency code is required"),
})

export type SignupFormValues = z.infer<typeof signupSchema>

export const updateProfileSchema = z.object({
  country: z.string().min(1, "Country is required"),
  currencyCode: z.string().min(1, "Currency code is required"),
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


