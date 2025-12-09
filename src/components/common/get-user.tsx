import { cookies } from 'next/headers';

import { fetchWithAuth } from '@/lib/auth';

async function getUser() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  const headers: HeadersInit = {};
  if (accessToken) headers.cookie = `access_token=${accessToken}`;

  const res = await fetchWithAuth('/api/users');

  const response = await res.json();
  return response ?? null;
}

export { getUser };
