import { Metadata } from "next"
import SignUpViewPage from "@/features/auth/components/sign-up-view"
import AuthLayout from "@/components/layout/auth-layout"

export const metadata: Metadata = {
  title: "Authentication | Sign Up",
  description: "Sign up page for Admin users.",
}

export default async function Page() {
  return (
    <AuthLayout>
      <SignUpViewPage />
    </AuthLayout>
  )
}

