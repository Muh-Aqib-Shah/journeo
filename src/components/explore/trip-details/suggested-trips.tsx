/* eslint-disable react-hooks/exhaustive-deps */

'use client';

import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchWithAuth } from '@/lib/auth';

async function getSuggestedTrips(tripId: number, setState: any) {
  try {
    const res = await fetchWithAuth(`/api/explore/suggested?id=${tripId}`);

    if (!res.ok) {
      return {
        success: false,
        data: [],
      };
    }

    const response = await res.json();

    setState(response);
    return {
      success: true,
      data: response.data,
    };
  } catch (err: any) {
    setState({ success: false, data: [] });
    return {
      success: false,
      data: [],
      error: err.message,
    };
  }
}

interface SuggestedProps {
  tripId?: number;
  currentTripId?: number;
}

export const SuggestedTrips: React.FC<SuggestedProps> = ({
  tripId,
  currentTripId,
}) => {
  const id = tripId || currentTripId;
  const [state, setState] = useState<any>(null);

  useEffect(() => {
    async function getTrips() {
      if (id) {
        await getSuggestedTrips(id, setState);
      }
    }
    getTrips();
  }, [id]);

  if (!state) {
    return <div>Nothing here yet</div>;
  }

  if (!state.success) {
    return (
      <p className="text-red-500">
        {state.error || 'Failed to fetch suggested trips'}
      </p>
    );
  }

  if (state.data.length === 0) {
    return (
      <div className="flex items-center justify-center">
        <p>OOPS we ran out of suggestions, come back later!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Suggested Trips</h2>
        <p className="mt-1 text-muted-foreground">
          Discover other amazing trips you might like
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {state.data &&
          state.data.map((trip: any) => (
            <Card
              key={trip.trip_id}
              className="group overflow-hidden transition-all duration-300 hover:shadow-lg"
            >
              <div className="relative h-40 w-full overflow-hidden bg-muted">
                <Image
                  src={trip.cover_image_url || '/placeholder.svg'}
                  alt={trip.name}
                  width={1000}
                  height={1000}
                  className="size-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>

              <CardHeader className="pb-3">
                <CardTitle className="line-clamp-2 text-lg">
                  {trip.title}
                </CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  {trip.destination}
                </p>
              </CardHeader>

              <CardContent className="space-y-4 pb-4">
                <div className="flex items-center justify-between rounded bg-secondary/30 px-3 py-2">
                  <span className="text-xs font-semibold text-muted-foreground">
                    Duration
                  </span>
                  <span className="text-sm font-bold text-foreground">
                    {trip.total_days} days
                  </span>
                </div>

                <div className="flex items-center justify-between rounded bg-primary/10 px-3 py-2">
                  <span className="text-xs font-semibold text-muted-foreground">
                    Starting From
                  </span>
                  <span className="text-sm font-bold text-primary">
                    {trip.budget_estimate}
                  </span>
                </div>

                <Link href={`/explore/${trip.trip_id}u=${trip.username}`}>
                  <Button className="group/btn w-full gap-2">
                    View Trip
                    <ArrowRight className="size-4 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
};
