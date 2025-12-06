import { formatDistance, fromUnixTime } from 'date-fns';
import { Heart, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import * as React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from '@/components/ui/card';

interface Props {
  img: string;
  title: string;
  desc: string;
  avatar?: string;
  providerName: string;
  duration: {
    from: number;
    to: number;
  };
}

const TripCard: React.FC<Props> = ({
  img,
  title,
  desc,
  avatar,
  providerName,
  duration,
}) => {
  return (
    <Card className="cursor-pointer space-y-3 border-none shadow-none">
      <div className="h-[10.5rem] overflow-hidden rounded-lg">
        <Image
          src={img}
          height={1000}
          width={1000}
          className="size-full object-cover object-center"
          alt="Vacation"
        />
      </div>
      <CardContent className="space-y-3 px-2 pb-0">
        <span className="rounded-md bg-gray-200 p-1 text-sm">
          {formatDistance(
            fromUnixTime(duration.from),
            fromUnixTime(duration.to),
            {
              includeSeconds: false,
            },
          )}
        </span>
        <CardTitle className="w-full overflow-hidden text-ellipsis text-nowrap">
          {title}
        </CardTitle>
        <CardDescription className="line-clamp-2 w-full overflow-hidden">
          {desc}
        </CardDescription>
      </CardContent>
      <CardFooter className="flex justify-between px-2 pt-2 text-sm">
        <div className="flex">
          <Avatar>
            <AvatarImage src={avatar || ''} alt="avatar" />
            <AvatarFallback>{providerName.at(0)}</AvatarFallback>
          </Avatar>
          <div className="ml-2 flex max-w-48 items-center overflow-hidden text-nowrap">
            <p className="truncate">{providerName}</p>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <Heart className="mr-1 fill-current text-red-500" /> 18 •
          <MessageCircle className="mx-1 mb-1" /> 5
        </div>
      </CardFooter>
    </Card>
  );
};
export default TripCard;
