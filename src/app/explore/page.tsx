import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import ExploreClient from '@/components/explore/explore-client';
import { fetchWithAuth } from '@/lib/auth';

async function getExploreTrips() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  const headers: HeadersInit = {};
  if (accessToken) headers.cookie = `access_token=${accessToken}`;

  const res = await fetchWithAuth('/api/explore/trips', {
    headers,
    cache: 'no-cache',
  });

  if (!res.ok) redirect('/login');

  const { data } = await res.json();
  return data ?? [];
}

export default async function Explore() {
  const trips = await getExploreTrips();

  return <ExploreClient trips={trips} />;
}
