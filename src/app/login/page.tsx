import { cookies } from 'next/headers';

import { LoginForm } from '@/components/auth/authenticate'; // Client Component

export default function LoginPage() {
  const accessToken = cookies().get('access_token')?.value;

  return <LoginForm access_token={accessToken} />;
}
