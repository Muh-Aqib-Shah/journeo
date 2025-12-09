'use client';

import { CircleChevronLeft, CircleChevronRight } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useParams, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useMemo, useState } from 'react';

import ItineraryCard from '@/components/explore/trip-details/itinerary-card';
import { Reviews } from '@/components/explore/trip-details/review-section';
import { SuggestedTrips } from '@/components/explore/trip-details/suggested-trips';
import { Spinner } from '@/components/ui/spinner';
import { fetchWithAuth } from '@/lib/auth';
import type { ActivityType } from '@/lib/types/create-trip';

async function fetchTripByUsername(tripId: number, username: string | null) {
  const res = await fetchWithAuth(
    `/api/explore/iteinaries/?id=${tripId}&username=${username}`,
  );
  const data = await res.json();
  return data;
}

type Coords = { latitude: number; longitude: number };

interface ActivityWithCover extends ActivityType {
  picture: string;
}

type Iteinary = {
  day: number;
  date: Date;
  activities: ActivityWithCover[];
};

interface FetchIteinaryTypes {
  id: number;
  budget_estimate: string;
  destination: string;
  cover_img: string;
  name: string;
  total_days: number;
  iteinary: Iteinary[];
}

function TripMapFallback() {
  return (
    <div className="flex h-[400px] items-center justify-center">
      <Spinner className="size-7" />
    </div>
  );
}

export default function TripDetailsPage() {
  const { id } = useParams();

  const searchParams = useSearchParams();
  const username = searchParams.get('u');

  const [activeItinerary, setActiveItinerary] = useState<number>(0);
  const [activeActivity, setActiveActivity] = useState<number>(0);
  const [iteinary, setItenary] = useState<FetchIteinaryTypes | null>(null);
  const [mapLocation, setMapLocation] = useState<Coords>({
    latitude: 0,
    longitude: 0,
  });

  const TripMap = useMemo(
    () =>
      dynamic(() => import('@/components/explore/trip-details/trip-map'), {
        loading: TripMapFallback,
        ssr: false,
      }),
    [],
  );

  useEffect(() => {
    const fetchIteinary = async () => {
      const tripId = Number(id);
      const response = await fetchTripByUsername(tripId, username);
      if (response.success) setItenary(response.data);
    };
    fetchIteinary();
  }, [id, username]);

  useEffect(() => {
    if (iteinary) {
      const firstActivity =
        iteinary.iteinary[activeItinerary].activities[activeActivity];
      setMapLocation(firstActivity.geoCode);
    }
  }, [activeItinerary, iteinary, activeActivity]);

  if (!iteinary)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="size-10" />
      </div>
    );

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-foreground">
            {iteinary?.name ?? ''}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {iteinary?.total_days ?? ''} days • Created By {username}
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="relative mb-32 h-64 w-full overflow-hidden rounded-xl md:h-80 lg:h-96">
          <Image
            src={iteinary?.cover_img ?? ''}
            alt="Hero"
            fill
            className="object-cover"
          />
        </div>

        {iteinary && (
          <div className="my-5 flex justify-between border-black p-5">
            <CircleChevronLeft
              size={30}
              className={`${activeItinerary === 0 ? 'cursor-auto opacity-20' : 'cursor-pointer'}`}
              onClick={() =>
                setActiveItinerary((prev) => Math.max(prev - 1, 0))
              }
            />

            <div className="text-2xl">
              Day {iteinary.iteinary[activeItinerary].day}
            </div>

            <CircleChevronRight
              size={30}
              className={`${activeItinerary === iteinary.iteinary.length - 1 ? 'cursor-auto opacity-20' : 'cursor-pointer'} `}
              onClick={() =>
                setActiveItinerary((prev) =>
                  Math.min(prev + 1, iteinary.iteinary.length - 1),
                )
              }
            />
          </div>
        )}

        <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {iteinary &&
                iteinary.iteinary[activeItinerary].activities.map(
                  (activity, index) => (
                    <ItineraryCard
                      key={activity.name}
                      activity={activity}
                      index={index + 1}
                      destination={iteinary.destination}
                      isActive={activeActivity === index}
                      onSelect={() => setActiveActivity(index)}
                    />
                  ),
                )}
            </div>

            <div className="mt-16">
              <Reviews trip_id={iteinary.id} />
            </div>

            <div className="mt-16">
              <SuggestedTrips tripId={Number(id)} />
            </div>
          </div>

          <div className="sticky top-24 hidden h-[2em] lg:block">
            <Suspense fallback={<p>Error...</p>}>
              {mapLocation && (
                <TripMap
                  posix={[mapLocation.latitude, mapLocation.longitude]}
                />
              )}
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
}
