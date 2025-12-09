import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import TripCard from '@/components/trips/trip-card';
import { fetchWithAuth } from '@/lib/auth';

async function getTrips() {
  const headers: HeadersInit = {};

  const cookieStore = cookies();
  const accessToken = cookieStore.get('access_token')?.value;
  if (accessToken) {
    headers.cookie = `access_token=${accessToken}`;
  }

  const res = await fetchWithAuth('/api/my-trips', { headers });

  if (!res.ok) redirect('/login');

  const { data } = await res.json();

  if (!res.ok) return [];

  return data;
}

export default async function Trips() {
  const trips: any[] = await getTrips();

  return (
    <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 xl:grid-cols-3">
      {trips.length === 0 ? (
        <p className="w-full text-center text-gray-600">No trips yet!</p>
      ) : (
        trips.map((trip) => (
          <TripCard
            key={trip.trip_id}
            trip_id={trip.trip_id}
            title={trip.title}
            cover_image_url={trip.cover_image_url}
            start_date={new Date(trip.start_date)}
            total_days={trip.total_days}
            ispublic={!!trip.is_public}
          />
        ))
      )}
    </div>
  );
}
