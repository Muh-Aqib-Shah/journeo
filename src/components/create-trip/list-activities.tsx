/* eslint-disable react/no-array-index-key */

'use client';

import Image from 'next/image';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useActivities } from '@/lib/hooks/activities';

import { Spinner } from '../ui/spinner';

export function ActivitiesList({ lat, lng }: { lat: number; lng: number }) {
  const { activities, loading } = useActivities(lat, lng);
  if (loading)
    return (
      <p className="text-center">
        <Spinner />
        Loading activities…
      </p>
    );
  if (!activities.length) return <p>No activities found.</p>;

  return (
    <div className="space-y-4">
      {activities.map((act, i) => (
        <Card
          key={i}
          className="flex overflow-hidden rounded-xl border shadow-sm"
        >
          {act.pictures?.length > 0 && (
            <div className="w-1/3">
              <Image
                src={act.pictures[0]}
                alt={act.name}
                width={1000}
                height={1000}
                className="size-full object-cover"
              />
            </div>
          )}

          <div className="flex w-2/3 flex-col justify-between p-4">
            <div>
              <CardHeader className="p-0">
                <CardTitle className="text-lg">{act.name}</CardTitle>
              </CardHeader>
              <CardContent className="mt-2 p-0">
                <p className="line-clamp-3 text-sm text-muted-foreground">
                  some description {/* act.description */}
                </p>
              </CardContent>
            </div>
            <div className="mt-2 text-sm font-medium text-gray-700">
              <span className="mr-4">Price: ${act.price.amount}</span>
              <span>Min Duration: {act?.minimumDuration ?? 1} hrs</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
