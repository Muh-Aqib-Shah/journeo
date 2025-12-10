'use client';

import { CircleChevronLeft, CircleChevronRight } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Suspense, useEffect, useMemo, useState } from 'react';

import ItineraryCard from '@/components/explore/trip-details/itinerary-card';
import { Reviews } from '@/components/explore/trip-details/review-section';
import { SuggestedTrips } from '@/components/explore/trip-details/suggested-trips';
import { Spinner } from '@/components/ui/spinner';
import type { ActivityType } from '@/lib/types/create-trip';

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

export default function MyTripDetailsPage() {
  const { id } = useParams();

  const [activeItinerary, setActiveItinerary] = useState<number>(0);
  const [activeActivity, setActiveActivity] = useState<number>(0);
  const [tripData, setTripData] = useState<FetchIteinaryTypes | null>(null);
  const [mapLocation, setMapLocation] = useState<Coords>({
    latitude: 0,
    longitude: 0,
  });
  const [loading, setLoading] = useState(true);

  const TripMap = useMemo(
    () =>
      dynamic(() => import('@/components/explore/trip-details/trip-map'), {
        loading: TripMapFallback,
        ssr: false,
      }),
    [],
  );

  useEffect(() => {
    const fetchTripData = async () => {
      try {
        setLoading(true);
        const tripId = Number(id);
        const res = await fetch(`/api/trips/${tripId}`);
        const data = await res.json();

        if (data.success) {
          // Transform the API response to match the expected format
          const transformedData: FetchIteinaryTypes = {
            id: data.trip.trip_id,
            name: data.trip.destination, // Using destination as name
            destination: data.trip.destination,
            cover_img:
              data.trip.cover_image ||
              'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=400&fit=crop',
            budget_estimate: data.trip.budget_estimate || '',
            total_days: data.trip.total_days || 1,
            iteinary:
              data.itineraries.map((itinerary: any) => ({
                day: itinerary.day || 1,
                date: new Date(itinerary.itinerary_date),
                activities: itinerary.activities || [],
              })) || [],
          };
          setTripData(transformedData);
        } else {
          console.error('Failed to fetch trip:', data.error);
        }
      } catch (error) {
        console.error('Error fetching trip:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTripData();
    }
  }, [id]);

  useEffect(() => {
    if (tripData && tripData.iteinary && tripData.iteinary.length > 0) {
      const currentDay = tripData.iteinary[activeItinerary];
      if (
        currentDay &&
        currentDay.activities &&
        currentDay.activities.length > activeActivity
      ) {
        const firstActivity = currentDay.activities[activeActivity];
        if (firstActivity && firstActivity.geoCode) {
          setMapLocation(firstActivity.geoCode);
        }
      }
    }
  }, [activeItinerary, tripData, activeActivity]);

  if (loading)
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <Spinner className="size-10" />
        <p className="text-gray-500">Loading trip details...</p>
      </div>
    );

  if (!tripData)
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-gray-500">Trip not found</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-foreground">
            {tripData?.name ?? ''}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {tripData?.total_days ?? ''} days
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="relative mb-32 h-64 w-full overflow-hidden rounded-xl md:h-80 lg:h-96">
          <Image
            src={
              tripData?.cover_img ||
              'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=400&fit=crop'
            }
            alt="Hero"
            fill
            className="object-cover"
            unoptimized
          />
        </div>

        {tripData && (
          <div className="my-5 flex justify-between border-black p-5">
            <CircleChevronLeft
              size={30}
              className={`${activeItinerary === 0 ? 'cursor-auto opacity-20' : 'cursor-pointer'}`}
              onClick={() =>
                setActiveItinerary((prev) => Math.max(prev - 1, 0))
              }
            />

            <div className="text-2xl">
              Day{' '}
              {tripData.iteinary[activeItinerary]?.day || activeItinerary + 1}
            </div>

            <CircleChevronRight
              size={30}
              className={`${activeItinerary === tripData.iteinary.length - 1 ? 'cursor-auto opacity-20' : 'cursor-pointer'} `}
              onClick={() =>
                setActiveItinerary((prev) =>
                  Math.min(prev + 1, tripData.iteinary.length - 1),
                )
              }
            />
          </div>
        )}

        <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {tripData &&
              tripData.iteinary[activeItinerary] &&
              tripData.iteinary[activeItinerary].activities &&
              tripData.iteinary[activeItinerary].activities.length > 0 ? (
                tripData.iteinary[activeItinerary].activities.map(
                  (activity, index) => (
                    <ItineraryCard
                      key={activity.name}
                      activity={activity}
                      index={index + 1}
                      destination={tripData.destination}
                      isActive={activeActivity === index}
                      onSelect={() => setActiveActivity(index)}
                    />
                  ),
                )
              ) : (
                <p className="text-center text-gray-500">
                  No activities for this day
                </p>
              )}
            </div>

            <div className="mt-16">
              <Reviews trip_id={tripData.id} />
            </div>

            <div className="mt-16">
              <SuggestedTrips currentTripId={tripData.id} />
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
