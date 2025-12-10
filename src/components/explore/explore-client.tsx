'use client';

import { useMemo, useState } from 'react';

import TripCard from './explore-card';
import SearchBar from './search-bar';

export default function ExploreClient({ trips }: { trips: any[] }) {
  const [searchText, setSearchText] = useState('');
  const [duration, setDuration] = useState<number | null>(null);

  const filteredTrips = useMemo(() => {
    return trips.filter((trip) => {
      const matchesText =
        trip.title.toLowerCase().includes(searchText.toLowerCase()) ||
        trip.description.toLowerCase().includes(searchText.toLowerCase());

      const matchesDuration = duration === null || trip.total_days >= duration;

      return matchesText && matchesDuration;
    });
  }, [trips, searchText, duration]);

  return (
    <div className="container space-y-4">
      <div className="flex flex-col items-center justify-center space-y-2">
        <h2 className="text-2xl font-semibold">Explore Trips</h2>
        <div className="text-center">
          Find trips created by other users and get inspired for your next
          vacation
        </div>

        <SearchBar
          onSearchChange={(value) => setSearchText(value)}
          onDurationChange={(value) =>
            setDuration(value ? Number(value) : null)
          }
        />
      </div>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredTrips.map((trip) => (
          <div key={trip.trip_id}>
            <TripCard {...trip} />
          </div>
        ))}
      </div>
    </div>
  );
}
