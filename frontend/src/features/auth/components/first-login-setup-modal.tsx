"use client"

import { useEffect, useMemo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"

import { useCountries } from "@/hooks/external/use-countries"
import { useUpdateProfile } from "@/hooks/auth/use-auth"
import { SearchableDropdown } from "@/components/ui/searchable-dropdown"
import { Button } from "@/components/ui/button"
import { updateProfileSchema, UpdateProfileFormValues } from "@/schemas/auth.schema"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"

type FirstLoginSetupModalProps = {
  isOpen: boolean
  firstName?: string
}

export default function FirstLoginSetupModal({ isOpen, firstName }: FirstLoginSetupModalProps) {
  const { data: countryData } = useCountries()
  const updateProfileMutation = useUpdateProfile()

  const countries = useMemo(() => countryData?.countries || [], [countryData?.countries])
  const currencies = useMemo(() => countryData?.currencies || [], [countryData?.currencies])

  const form = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      country: "",
      currencyCode: ""
    }
  })

  const selectedCountry = form.watch("country")
  useEffect(() => {
    if (!selectedCountry) return
    const countryMatch = countries.find((country) => country.name === selectedCountry)
    if (countryMatch && countryMatch.currencies.length > 0) {
      form.setValue("currencyCode", countryMatch.currencies[0], {
        shouldDirty: true
      })
    }
  }, [selectedCountry, countries, form])

  const onSubmit = (values: UpdateProfileFormValues) => {
    updateProfileMutation.mutate(values)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-xl rounded-lg border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="text-xl font-semibold tracking-tight">Complete your admin setup</h2>
        <p className="mt-2 text-sm text-zinc-500">
          {`Hi${firstName ? ` ${firstName}` : ""}, select your country and default currency to continue.`}
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <SearchableDropdown
                        options={countries.map((country) => country.name)}
                        value={field.value || ""}
                        onChange={field.onChange}
                        placeholder="Search and select country"
                        searchPlaceholder="Type a country name..."
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
                        options={currencies}
                        value={field.value || ""}
                        onChange={field.onChange}
                        placeholder="Search currency"
                        searchPlaceholder="Type a currency code..."
                        disabled={currencies.length === 0}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full" disabled={updateProfileMutation.isPending}>
              {updateProfileMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save and continue"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
