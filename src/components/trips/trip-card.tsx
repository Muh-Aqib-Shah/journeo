import {
  IconCalendarEvent,
  IconLockFilled,
  IconPoint,
  IconTrash,
} from '@tabler/icons-react';
import { format, formatDistance, fromUnixTime } from 'date-fns';
import Image from 'next/image';
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

interface Props {
  location: string;
  image: string;
  date: {
    // timestamp
    from: number;
    to: number;
  };
  isPrivate: boolean;
}

const TripCard: FC<Props> = ({ date, image, isPrivate, location }) => {
  return (
    <Card className="cursor-pointer space-y-3 border-none shadow-none">
      <div className="group relative h-[10.5rem] overflow-hidden rounded-lg">
        <Image
          src={image}
          height={1000}
          width={1000}
          className="block size-full object-cover object-center"
          alt={location}
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
              <Button className="bg-red-500">Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <CardContent className="space-y-1 px-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">{location}</h2>
          {isPrivate && <IconLockFilled className="size-5 text-gray-600" />}
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
          <div className="flex gap-1">
            <IconCalendarEvent className="size-4" />
            <span>{format(fromUnixTime(date.from), 'dd MMM yyyy')} </span>
          </div>
          <IconPoint className="flex size-2 items-center" />
          <div>
            {formatDistance(fromUnixTime(date.from), fromUnixTime(date.to), {
              includeSeconds: false,
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TripCard;
