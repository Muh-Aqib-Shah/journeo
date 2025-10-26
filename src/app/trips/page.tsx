import { IconPlus } from '@tabler/icons-react';
import Link from 'next/link';
import React from 'react';

import TripCard from '@/components/trips/trip-card';
import { Button } from '@/components/ui/button';

const Trips = () => {
  return (
    <div className="container space-y-10">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-medium">Your Trips</h2>
        <Link href="/create-trip">
          <Button className="space-x-1">
            <IconPlus className="size-5" />
            <span>New trip</span>
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <TripCard
          date={{ from: 1721478234, to: 1722167509 }}
          isPrivate
          image="/placeholder_location.png"
          location="Karachi, Pakistan"
        />
        <TripCard
          date={{ from: 1721478234, to: 1722167509 }}
          isPrivate
          image="/placeholder_location.png"
          location="Karachi, Pakistan"
        />
        <TripCard
          date={{ from: 1721478234, to: 1722167509 }}
          isPrivate
          image="/placeholder_location.png"
          location="Karachi, Pakistan"
        />
        <TripCard
          date={{ from: 1721478234, to: 1722167509 }}
          isPrivate={false}
          image="/placeholder_location.png"
          location="Karachi, Pakistan"
        />
        <TripCard
          date={{ from: 1721478234, to: 1722167509 }}
          isPrivate={false}
          image="/placeholder_location.png"
          location="Karachi, Pakistan"
        />
      </div>
    </div>
  );
};

export default Trips;
