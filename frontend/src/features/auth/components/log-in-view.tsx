"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  loginSchema,
  resetPasswordWithOtpSchema,
  type LoginFormValues,
  type ResetPasswordWithOtpFormValues
} from "@/schemas/auth.schema"
import { useLogin, useResetPasswordWithOtp, useSendOtp } from "@/hooks/auth/use-auth"
import Link from "next/link"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

export default function LogInViewPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showResetPassword, setShowResetPassword] = useState(false)

  const loginMutation = useLogin()
  const sendOtpMutation = useSendOtp()
  const resetPasswordMutation = useResetPasswordWithOtp()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const resetPasswordForm = useForm<ResetPasswordWithOtpFormValues>({
    resolver: zodResolver(resetPasswordWithOtpSchema),
    defaultValues: {
      email: "",
      otp: "",
      password: "",
    },
  })

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data)
  }

  const onResetPassword = (data: ResetPasswordWithOtpFormValues) => {
    resetPasswordMutation.mutate(data, {
      onSuccess: () => {
        setShowResetPassword(false)
        resetPasswordForm.reset()
      },
    })
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          Sign in to your account
        </h2>
        <p className="text-sm text-zinc-500 mt-2">
          Super Admin logs in with seeded credentials. New Admins can sign up here.
        </p>
        <p className="text-sm mt-2">
          <Link href="/signup" className="text-primary underline underline-offset-2">
            Create Admin account
          </Link>
        </p>
      </div>

      {!showResetPassword ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Work Email</FormLabel>
                  <FormControl>
                    <Input placeholder="name@company.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Password</FormLabel>
                  </div>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 focus:outline-none"
                      tabIndex={-1}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Sign in
            </Button>

            <Button
              type="button"
              variant="link"
              className="w-full"
              onClick={() => setShowResetPassword(true)}
            >
              Forgot password?
            </Button>
          </form>
        </Form>
      ) : (
        <Form {...resetPasswordForm}>
          <form onSubmit={resetPasswordForm.handleSubmit(onResetPassword)} className="space-y-4">
            <FormField
              control={resetPasswordForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="name@company.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={sendOtpMutation.isPending}
              onClick={async () => {
                const email = resetPasswordForm.getValues("email")
                if (await resetPasswordForm.trigger("email")) {
                  sendOtpMutation.mutate({ email })
                }
              }}
            >
              {sendOtpMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Send OTP
            </Button>

            <FormField
              control={resetPasswordForm.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>OTP</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter OTP" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={resetPasswordForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={resetPasswordMutation.isPending}
            >
              {resetPasswordMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Update password
            </Button>

            <Button
              type="button"
              variant="link"
              className="w-full"
              onClick={() => setShowResetPassword(false)}
            >
              Back to sign in
            </Button>
          </form>
        </Form>
      )}
    </div>
  )
}
