import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import TripCard from '@/components/explore/explore-card';
import SearchBar from '@/components/explore/search-bar';
import { fetchWithAuth } from '@/lib/auth';

async function getExploreTrips() {
  const headers: HeadersInit = {};

  const cookieStore = cookies();
  const accessToken = cookieStore.get('access_token')?.value;
  if (accessToken) {
    headers.cookie = `access_token=${accessToken}`;
  }

  const res = await fetchWithAuth('/api/explore/trips', {
    headers,
    cache: 'no-cache',
  });

  if (!res.ok) redirect('/login');

  const { data } = await res.json();

  if (!res.ok) return [];

  return data;
}

export default async function Explore() {
  const trips: any[] = await getExploreTrips();

  return (
    <div className="container space-y-4">
      <div className="flex flex-col items-center justify-center space-y-2">
        <h2 className="text-2xl font-semibold">Explore Trips</h2>
        <div className="text-center">
          Find trips created by other users and get inspired for your next
          vacation
        </div>
        <SearchBar />
      </div>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {trips.map((trip) => (
          <Link
            href={`/explore/${trip.trip_id}?u=${trip.username}`}
            key={trip.trip_id}
          >
            <TripCard
              trip_id={trip.trip_id}
              title={trip.title}
              cover_image_url={trip.cover_image_url}
              total_days={trip.total_days}
              username={trip.username}
              description={trip.description}
              likes={trip.likes}
              isLiked={trip.isLiked}
              comment_count={trip.comment_count}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
