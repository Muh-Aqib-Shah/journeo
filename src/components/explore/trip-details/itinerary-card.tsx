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

interface ItineraryCardProps {
  itinerary: {
    id: string;
    day: number;
    location: string;
    activity: string;
    time: string;
    description: string;
    image: string;
  };
  isActive: boolean;
  onSelect: () => void;
}

export default function ItineraryCard({
  itinerary,
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
              Activity {itinerary.day}
            </div>
            <CardTitle className="mt-3 text-xl">{itinerary.activity}</CardTitle>
            <CardDescription className="mt-1 text-base">
              {itinerary.location}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="relative h-48 w-full overflow-hidden rounded-lg bg-gray-200">
          <Image
            src={itinerary.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500&h=300&fit=crop'}
            alt={itinerary.activity}
            className="size-full object-cover"
            height={1000}
            width={1000}
            priority
            unoptimized
          />
        </div>

        <p className="text-sm text-muted-foreground">{itinerary.description}</p>

        <div className="grid gap-3 rounded-lg bg-secondary/30 p-4">
          <div className="flex items-center gap-3">
            <Clock className="size-4 text-primary" />
            <span className="text-sm font-medium">{itinerary.time}</span>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="size-4 text-primary" />
            <span className="text-sm font-medium">{itinerary.location}</span>
          </div>
          <div className="flex items-center gap-3">
            <Activity className="size-4 text-primary" />
            <span className="text-sm font-medium">{itinerary.activity}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
