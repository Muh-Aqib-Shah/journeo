import {
  IconCalendarEvent,
  IconLockFilled,
  IconPoint,
  IconTrash,
} from '@tabler/icons-react';
import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import type { FC } from 'react';
import React from 'react';

import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Button } from '../ui/button';
import { DeleteTripButton } from './delete-button';

interface Props {
  trip_id: number;
  title: string;
  cover_image_url: string;
  start_date: Date;
  total_days: number;
  ispublic: boolean;
}

const TripCard: FC<Props> = ({
  trip_id,
  title,
  cover_image_url,
  start_date,
  total_days,
  ispublic,
}) => {
  return (
    <Card className="cursor-pointer space-y-3 border-none shadow-none">
      <div className="group relative h-[10.5rem] overflow-hidden rounded-lg">
        <Image
          src={cover_image_url}
          height={1000}
          width={1000}
          className="block size-full object-cover object-center"
          alt={title}
        />
        <Dialog modal={false}>
          <DialogTrigger asChild>
            <IconTrash
              stroke={0.7}
              width={20}
              className="absolute right-2 top-2 rounded-sm opacity-0 hover:bg-red-200 group-hover:opacity-100"
            />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete the
                trip
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="justify-end space-x-3">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
              <DeleteTripButton tripId={trip_id} />
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Link href={`/explore/${trip_id}`}>
        <CardContent className="space-y-1 px-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">{title}</h2>
            {!ispublic && <IconLockFilled className="size-5 text-gray-600" />}
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
            <div className="flex gap-1">
              <IconCalendarEvent className="size-4" />
              <span>{format(start_date, 'dd MMM yyyy')} </span>
            </div>
            <IconPoint className="flex size-2 items-center" />
            <div>{total_days} days</div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default TripCard;
