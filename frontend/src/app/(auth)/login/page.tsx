import { Metadata } from "next"
import LogInViewPage from "@/features/auth/components/log-in-view"
import AuthLayout from "@/components/layout/auth-layout"

export const metadata: Metadata = {
  title: "Authentication | Sign In",
  description: "Sign in page for FlowExpense.",
}

export default async function Page() {
  return (
    <AuthLayout>
      <LogInViewPage />
    </AuthLayout>
  )
}
