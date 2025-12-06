/* eslint-disable react/no-array-index-key */

'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { useActivities } from '@/lib/hooks/activities';
import type { ActivityType, Coordinates } from '@/lib/types/create-trip';

import { Spinner } from '../../ui/spinner';
import { ActivityCard } from './activity-card';

export function ActivitiesList({
  coords,
  time,
  selectAct,
}: {
  coords: Coordinates | null;
  time: Date;
  selectAct: (time: Date, activity: ActivityType) => void;
}) {
  let params;
  if (!coords) params = { longitude: 0, latitude: 0 };
  else params = coords;

  const { activities, loading } = useActivities(params);

  const [selected, setSelected] = useState<ActivityType | null>(null);
  if (loading)
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner />
        <p className="ml-2">Loading activities…</p>
      </div>
    );
  if (!activities.length) return <p>No activities found.</p>;

  return (
    <div className="relative flex h-[80vh] flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto">
        {activities.map((act) => (
          <ActivityCard
            act={act}
            key={act.name}
            selected={selected}
            setSelected={setSelected}
          />
        ))}
      </div>

      {selected && (
        <Button
          variant="default"
          className="absolute bottom-0 right-[10%]"
          onClick={() => selectAct(time, selected)}
        >
          Add
        </Button>
      )}
    </div>
  );
}
