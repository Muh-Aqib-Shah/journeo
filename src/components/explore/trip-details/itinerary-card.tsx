/* eslint-disable react/no-danger */

'use client';

import { Activity, Clock, MapPin } from 'lucide-react';
import Image from 'next/image';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { ActivityType } from '@/lib/types/create-trip';

interface ActivityWithCover extends ActivityType {
  picture: string;
}
interface ItineraryCardProps {
  activity: ActivityWithCover;
  index: number;
  destination: string;
  isActive: boolean;
  onSelect: () => void;
}

export default function ItineraryCard({
  activity,
  destination,
  index,
  isActive,
  onSelect,
}: ItineraryCardProps) {
  return (
    <Card
      onClick={onSelect}
      className={`cursor-pointer transition-all duration-300 ${
        isActive
          ? 'border-primary bg-primary/5 ring-2 ring-primary'
          : 'hover:border-primary/50 hover:shadow-md'
      }`}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
              Activity {index}
            </div>
            <CardTitle className="mt-3 text-xl">{activity.name}</CardTitle>
            <CardDescription className="mt-1 text-base" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="relative h-48 w-full overflow-hidden rounded-lg bg-muted">
          <Image
            src={activity.picture}
            alt={activity.picture}
            className="size-full object-cover"
            height={1000}
            width={1000}
          />
        </div>

        <p
          className="line-clamp-3 w-full text-sm text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: activity.description }}
        />

        <div className="grid gap-3 rounded-lg bg-secondary/30 p-4">
          <div className="flex items-center gap-3">
            <Clock className="size-4 text-primary" />
            <span className="text-sm font-medium">
              {activity.minimumDuration}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="size-4 text-primary" />
            <span className="text-sm font-medium">{destination}</span>
          </div>
          <div className="flex items-center gap-3">
            <Activity className="size-4 text-primary" />
            <span className="text-sm font-medium">
              {activity.price.amount} €{' '}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
