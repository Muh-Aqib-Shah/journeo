import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SUGGESTED_TRIPS = [
  {
    id: '1',
    name: 'Alpine Mountain Retreat',
    destination: 'Swiss Alps',
    duration: '7 days',
    price: '$1,200',
    image: '/swiss-alps.jpg',
  },
  {
    id: '2',
    name: 'Mediterranean Coast',
    destination: 'Greece & Italy',
    duration: '10 days',
    price: '$1,500',
    image: '/mediterranean-coast.jpg',
  },
  {
    id: '3',
    name: 'Nordic Winter Wonder',
    destination: 'Scandinavia',
    duration: '8 days',
    price: '$1,400',
    image: '/nordic-winter.jpg',
  },
];

export default function SuggestedTrips() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Suggested Trips</h2>
        <p className="mt-1 text-muted-foreground">
          Discover other amazing trips you might like
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {SUGGESTED_TRIPS.map((trip) => (
          <Card
            key={trip.id}
            className="group overflow-hidden transition-all duration-300 hover:shadow-lg"
          >
            <div className="relative h-40 w-full overflow-hidden bg-muted">
              <Image
                src={trip.image || '/placeholder.svg'}
                alt={trip.name}
                width={1000}
                height={1000}
                className="size-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>

            <CardHeader className="pb-3">
              <CardTitle className="line-clamp-2 text-lg">
                {trip.name}
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
                  {trip.duration}
                </span>
              </div>

              <div className="flex items-center justify-between rounded bg-primary/10 px-3 py-2">
                <span className="text-xs font-semibold text-muted-foreground">
                  Starting From
                </span>
                <span className="text-sm font-bold text-primary">
                  {trip.price}
                </span>
              </div>

              <Button className="group/btn w-full gap-2">
                View Trip
                <ArrowRight className="size-4 transition-transform group-hover/btn:translate-x-1" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
