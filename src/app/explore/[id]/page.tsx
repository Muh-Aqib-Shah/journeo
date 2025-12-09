'use client';

import { CircleChevronLeft, CircleChevronRight } from 'lucide-react';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Suspense, useEffect, useMemo, useState } from 'react';

import ItineraryCard from '@/components/explore/trip-details/itinerary-card';
import { Reviews } from '@/components/explore/trip-details/review-section';
import { ReviewsComponent } from '@/components/explore/trip-details/reviews-component';
import SuggestedTrips from '@/components/explore/trip-details/suggested-trips';
import { Spinner } from '@/components/ui/spinner';

// Mock data for the trip
const TRIP_DATA = {
  id: '9',
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
  const params = useParams();
  const tripId = params.id as string;
  const [activeItinerary, setActiveItinerary] = useState(0);
  const [mapLocation, setMapLocation] = useState(TRIP_DATA.itineraries[0]);
  const [tripData, setTripData] = useState(TRIP_DATA);
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
        const response = await fetch(`/api/trips/${tripId}`);
        const data = await response.json();
        
        if (data.success && data.trip) {
          // For now, use mock itineraries since the API might not have them
          // In production, you would fetch itineraries from the database
          setTripData({
            id: tripId,
            name: `Trip to ${data.trip.destination}`,
            duration: '14 days',
            destination: data.trip.destination,
            image: '/european-trip.jpg',
            itineraries: TRIP_DATA.itineraries, // Use mock data for now
          });
          setActiveItinerary(0);
        }
      } catch (err) {
        console.error('Error fetching trip:', err);
        setTripData(TRIP_DATA);
      } finally {
        setLoading(false);
      }
    };

    if (tripId) {
      fetchTripData();
    }
  }, [tripId]);

  useEffect(() => {
    setMapLocation(tripData.itineraries[activeItinerary]);
  }, [activeItinerary, tripData]);

  const handlePrevDay = () => {
    setActiveItinerary((prev) =>
      prev === 0 ? tripData.itineraries.length - 1 : prev - 1
    );
  };

  const handleNextDay = () => {
    setActiveItinerary((prev) =>
      prev === tripData.itineraries.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-foreground">
            {tripData.name}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {tripData.duration} • Created By Aqib
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner className="size-8" />
          </div>
        ) : (
          <>
            <div className="relative mb-32 h-64 w-full overflow-hidden rounded-xl md:h-80 lg:h-96">
              <Image
                src="/louvre-museum.jpg"
                alt="Hero"
                fill
                className="object-cover"
              />
            </div>

            <div className="my-5 flex justify-between border-black  p-5">
              <button 
                onClick={handlePrevDay}
                className="cursor-pointer hover:scale-110 transition"
              >
                <CircleChevronLeft size={30} />
              </button>
              <div className="text-2xl ">Day {activeItinerary + 1}</div>
              <button 
                onClick={handleNextDay}
                className="cursor-pointer hover:scale-110 transition"
              >
                <CircleChevronRight size={30} />
              </button>
            </div>

            <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <div className="space-y-4">
                  {tripData.itineraries.map((itinerary, index) => (
                    <ItineraryCard
                      key={itinerary.id}
                      itinerary={itinerary}
                      isActive={activeItinerary === index}
                      onSelect={() => setActiveItinerary(index)}
                    />
                  ))}
                </div>

                <div className="mt-16">
                  <ReviewsComponent tripId={tripId} />
                </div>

                <div className="mt-16">
                  <Reviews tripId={tripId} />
                </div>

                <div className="mt-16">
                  <SuggestedTrips currentTripId={tripId} limit={3} />
                </div>
              </div>

              <div className="sticky top-24 hidden h-[2em] lg:block">
                <Suspense fallback={<p>Error...</p>}>
                  <TripMap posix={[mapLocation.latitude, mapLocation.longitude]} />
                </Suspense>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
