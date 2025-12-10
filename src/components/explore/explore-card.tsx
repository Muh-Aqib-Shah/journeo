import { MessageCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from '@/components/ui/card';

import { Favourites } from './favorites';

interface Props {
  cover_image_url: string;
  trip_id: number;
  username: string;
  description: string;
  title: string;
  total_days: number;
  likes: number;
  isLiked: boolean;
  comment_count: number;
}

const TripCard: React.FC<Props> = ({
  cover_image_url,
  trip_id,
  total_days,
  username,
  title,
  description,
  likes,
  isLiked,
  comment_count,
}) => {
  return (
    <Card className="cursor-pointer space-y-3 border-none shadow-none">
      <Link href={`/explore/${trip_id}?u=${username}`}>
        <div className="h-[10.5rem] overflow-hidden rounded-lg">
          <Image
            src={cover_image_url}
            height={1000}
            width={1000}
            className="size-full object-cover object-center"
            alt="Vacation"
          />
        </div>
        <CardContent className="cursor-auto space-y-3 px-2 pb-0">
          <span className="rounded-md bg-gray-200 p-1 text-sm">
            {total_days} days
          </span>
          <CardTitle className="w-full overflow-hidden text-ellipsis text-nowrap">
            {title}
          </CardTitle>
          <CardDescription className="line-clamp-2 w-full overflow-hidden">
            {description}
          </CardDescription>
        </CardContent>
      </Link>
      <CardFooter className="flex cursor-auto justify-between px-2 pt-2 text-sm">
        <div className="flex">
          <Avatar>
            <AvatarImage src="" alt="avatar" />
            <AvatarFallback>{username.at(0)}</AvatarFallback>
          </Avatar>
          <div className="ml-2 flex max-w-48 items-center overflow-hidden text-nowrap">
            <p className="truncate">{username}</p>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <Favourites likes={likes} isLiked={isLiked} trip_id={trip_id} /> •
          <MessageCircle className="mx-1 mb-1" /> {comment_count}
        </div>
      </CardFooter>
    </Card>
  );
};
export default TripCard;
