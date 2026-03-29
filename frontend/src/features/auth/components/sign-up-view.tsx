"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { signupSchema, type SignupFormValues } from "@/schemas/auth.schema"
import { useSignup } from "@/hooks/auth/use-auth"
import { useCountries } from "@/hooks/external/use-countries"
import { SearchableDropdown } from "@/components/ui/searchable-dropdown"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

export default function SignUpViewPage() {
  const [showPassword, setShowPassword] = useState(false)
  const { data: countryData } = useCountries()
  const countries = countryData?.countries || []
  const currenciesList = countryData?.currencies || []

  const signupMutation = useSignup()

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema as any),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      company_name: "",
      country: "",
      currency_code: "",
    },
  })



  // Autofill currency when country changes
  const selectedCountry = form.watch("country")
  useEffect(() => {
    if (selectedCountry) {
      const countryMatch = countries.find(c => c.name === selectedCountry)
      if (countryMatch && countryMatch.currencies.length > 0 && !form.getValues("currency_code")) {
        form.setValue("currency_code", countryMatch.currencies[0])
      }
    }
  }, [selectedCountry, countries, form])

  const onSubmit = (data: SignupFormValues) => {
    signupMutation.mutate(data)
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          Create your account
        </h2>
        <p className="text-sm text-zinc-500 mt-2">
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-medium hover:underline">
            Sign in here
          </Link>
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="company_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Acme Inc." {...field} />
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
                <FormLabel>Work Email</FormLabel>
                <FormControl>
                  <Input placeholder="john@acme.com" {...field} />
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

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <SearchableDropdown
                    options={countries.map((c) => c.name)}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Search and select country"
                    searchPlaceholder="Type a country name..."
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currency_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <SearchableDropdown
                    options={currenciesList}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Search currency"
                    searchPlaceholder="Type a currency code..."
                    disabled={currenciesList.length === 0}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            className="w-full mt-6"
            disabled={signupMutation.isPending}
          >
            {signupMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Create account
          </Button>
        </form>
      </Form>
    </div>
  )
}
