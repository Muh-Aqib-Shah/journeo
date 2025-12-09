'use client';

import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';

interface Trip {
  trip_id: number;
  user_id: number;
  destination: string;
  start_date: string;
  end_date: string;
  created_at: string;
}

interface SuggestedTripsProps {
  currentTripId?: string | number;
  limit?: number;
}

export default function SuggestedTrips({ currentTripId = '9', limit = 3 }: SuggestedTripsProps) {
  const router = useRouter();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSuggestedTrips = async () => {
      try {
        setLoading(true);
        setError(null);
        const params = new URLSearchParams({
          limit: limit.toString(),
          exclude: currentTripId.toString(),
        });
        
        const response = await fetch(`/api/trips/suggested?${params}`);
        const data = await response.json();

        if (data.success && Array.isArray(data.trips)) {
          setTrips(data.trips);
        } else {
          setTrips([]);
        }
      } catch (err) {
        console.error('Error fetching suggested trips:', err);
        setError('Failed to load suggested trips');
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestedTrips();
  }, [currentTripId, limit]);

  const calculateDuration = (startDate: string, endDate: string): string => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return `${days} days`;
  };

  const handleViewTrip = (tripId: number) => {
    router.push(`/explore/${tripId}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Suggested Trips</h2>
        <p className="mt-1 text-muted-foreground">
          Discover other amazing trips you might like
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <Spinner className="size-6" />
        </div>
      ) : error ? (
        <div className="text-sm text-red-500">{error}</div>
      ) : trips.length === 0 ? (
        <div className="text-sm text-muted-foreground">No suggested trips available.</div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip) => (
            <Card
              key={trip.trip_id}
              className="group overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer"
            >
              <div className="relative h-40 w-full overflow-hidden bg-gray-200">
                <Image
                  src={`https://images.unsplash.com/search?q=${trip.destination}&w=500&h=300&fit=crop`}
                  alt={trip.destination}
                  width={500}
                  height={300}
                  className="size-full object-cover transition-transform duration-300 group-hover:scale-110"
                  unoptimized
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500&h=300&fit=crop';
                  }}
                />
              </div>

              <CardHeader className="pb-3">
                <CardTitle className="line-clamp-2 text-lg">
                  {trip.destination}
                </CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  Trip ID: {trip.trip_id}
                </p>
              </CardHeader>

              <CardContent className="space-y-4 pb-4">
                <div className="flex items-center justify-between rounded bg-secondary/30 px-3 py-2">
                  <span className="text-xs font-semibold text-muted-foreground">
                    Duration
                  </span>
                  <span className="text-sm font-bold text-foreground">
                    {calculateDuration(trip.start_date, trip.end_date)}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded bg-muted px-3 py-2">
                  <span className="text-xs font-semibold text-muted-foreground">
                    Created
                  </span>
                  <span className="text-sm font-bold text-foreground">
                    {new Date(trip.created_at).toLocaleDateString()}
                  </span>
                </div>

                <Button 
                  className="group/btn w-full gap-2"
                  onClick={() => handleViewTrip(trip.trip_id)}
                >
                  View Trip
                  <ArrowRight className="size-4 transition-transform group-hover/btn:translate-x-1" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
