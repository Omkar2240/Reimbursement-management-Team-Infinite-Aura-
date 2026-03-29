"use client"

import { useMemo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SearchableDropdown } from "@/components/ui/searchable-dropdown"
import { signupSchema, type SignupFormValues } from "@/schemas/auth.schema"
import { useSignup } from "@/hooks/auth/use-auth"
import { useCountries } from "@/hooks/external/use-countries"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

export default function SignUpViewPage() {
  const signupMutation = useSignup()
  const { data: countryData } = useCountries()
  const countries = useMemo(() => countryData?.countries || [], [countryData?.countries])

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      countryCode: "91",
      mobileNumber: "",
      password: "",
      country: "",
      currencyCode: "",
    },
  })

  const selectedCountry = form.watch("country")
  const currencyOptions = useMemo(() => {
    const c = countries.find((country) => country.name === selectedCountry)
    return c?.currencies || []
  }, [countries, selectedCountry])

  const onSubmit = (values: SignupFormValues) => {
    signupMutation.mutate(values)
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          Create Admin account
        </h2>
        <p className="text-sm text-zinc-500 mt-2">
          Signup is available for Admin users. Managers and Employees are created by Admin.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="countryCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country Code</FormLabel>
                  <FormControl>
                    <Input placeholder="91" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mobileNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile Number</FormLabel>
                  <FormControl>
                    <Input placeholder="9999999999" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="countryCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <SearchableDropdown
                      options={countries.map((country) => country.name)}
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value)
                        form.setValue("currencyCode", "")
                      }}
                      placeholder="Select country"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currencyCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <FormControl>
                    <SearchableDropdown
                      options={currencyOptions}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select currency"
                      disabled={!selectedCountry}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="w-full" disabled={signupMutation.isPending}>
            {signupMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Sign up as Admin
          </Button>
        </form>
      </Form>

      <p className="text-sm text-zinc-500 mt-4">
        Already have an account?{" "}
        <Link href="/login" className="text-primary underline underline-offset-2">
          Sign in
        </Link>
      </p>
    </div>
  )
}

