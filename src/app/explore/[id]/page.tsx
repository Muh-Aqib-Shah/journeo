'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Suspense, useEffect, useMemo, useState } from 'react';

import ItineraryCard from '@/components/explore/trip-details/itinerary-card';
import SuggestedTrips from '@/components/explore/trip-details/suggested-trips';
import { Spinner } from '@/components/ui/spinner';

// Mock data for the trip
const TRIP_DATA = {
  id: '1',
  name: 'European Summer Adventure',
  duration: '14 days',
  destination: 'Europe',
  image: '/european-trip.jpg',
  itineraries: [
    {
      id: '1',
      day: 1,
      location: 'Paris, France',
      activity: 'Eiffel Tower & City Tour',
      time: '09:00 AM - 06:00 PM',
      description: 'Start your journey with iconic Paris landmarks',
      latitude: 48.8584,
      longitude: 2.2945,
      image: '/eiffel-tower.jpg',
    },
    {
      id: '2',
      day: 2,
      location: 'Paris, France',
      activity: 'Louvre Museum & Art Gallery',
      time: '10:00 AM - 05:00 PM',
      description: 'Explore world-class art and culture',
      latitude: 48.8606,
      longitude: 2.3352,
      image: '/louvre-museum.jpg',
    },
    {
      id: '3',
      day: 3,
      location: 'Amsterdam, Netherlands',
      activity: 'Canal Boat Tour & Markets',
      time: '09:00 AM - 04:00 PM',
      description: 'Experience charming canals and local culture',
      latitude: 52.3676,
      longitude: 4.9041,
      image: '/amsterdam-canal.jpg',
    },
    {
      id: '4',
      day: 4,
      location: 'Barcelona, Spain',
      activity: 'Sagrada Familia & Park Güell',
      time: '08:00 AM - 06:00 PM',
      description: "Discover Gaudí's architectural masterpieces",
      latitude: 41.3874,
      longitude: 2.1686,
      image: '/barcelona-sagrada.jpg',
    },
  ],
};

function TripMapFallback() {
  return (
    <div className="flex h-[400px] items-center justify-center">
      <Spinner className="size-7" />
    </div>
  );
}

export default function TripDetailsPage() {
  const [activeItinerary, setActiveItinerary] = useState(0);
  const [mapLocation, setMapLocation] = useState(TRIP_DATA.itineraries[0]);

  const TripMap = useMemo(
    () =>
      dynamic(() => import('@/components/explore/trip-details/trip-map'), {
        loading: TripMapFallback,
        ssr: false,
      }),
    [],
  );

  useEffect(() => {
    setMapLocation(TRIP_DATA.itineraries[activeItinerary]);
  }, [activeItinerary]);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-foreground">
            {TRIP_DATA.name}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {TRIP_DATA.duration} • Created By Aqib
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="relative mb-32 h-64 w-full overflow-hidden rounded-xl md:h-80 lg:h-96">
          <Image
            src="/louvre-museum.jpg"
            alt="Hero"
            fill
            className="object-cover"
          />
        </div>

        <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {TRIP_DATA.itineraries.map((itinerary, index) => (
                <ItineraryCard
                  key={itinerary.id}
                  itinerary={itinerary}
                  isActive={activeItinerary === index}
                  onSelect={() => setActiveItinerary(index)}
                />
              ))}
            </div>

            <div className="mt-16">
              <SuggestedTrips />
            </div>
          </div>

          <div className="sticky top-24 hidden h-[2em] lg:block">
            <Suspense fallback={<p>Error...</p>}>
              <TripMap posix={[mapLocation.latitude, mapLocation.longitude]} />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
}
