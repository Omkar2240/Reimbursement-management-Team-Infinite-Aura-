import { Metadata } from 'next';
import SignUpViewPage from '@/features/auth/components/sign-up-view';
import AuthLayout from '@/components/layout/auth-layout';

export const metadata: Metadata = {
  title: 'Authentication | Sign Up',
  description: 'Sign Up page for FlowReimburse.'
};

export default async function Page() {
  return (
    <AuthLayout>
      <SignUpViewPage />
    </AuthLayout>
  );
}
