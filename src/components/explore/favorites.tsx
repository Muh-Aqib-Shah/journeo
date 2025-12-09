'use client';

import { Heart } from 'lucide-react';
import { useState } from 'react';

import { fetchWithAuth } from '@/lib/auth';

interface FavouritesProps {
  likes: number;
  isLiked: boolean;
  trip_id?: number;
}

async function toggleFavourite(
  state: FavouritesProps,
  setValue: React.Dispatch<React.SetStateAction<FavouritesProps>>,
  tripId?: number,
) {
  const oldState: FavouritesProps = { ...state };
  setValue((prev) => {
    if (prev.isLiked) {
      return { likes: prev.likes - 1, isLiked: false };
    }
    return { likes: prev.likes + 1, isLiked: true };
  });

  const res = await fetchWithAuth('/api/explore/trips/toggleFavourite', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ tripId }),
  });

  if (!res.ok) setValue(oldState);
}
export const Favourites: React.FC<FavouritesProps> = ({
  likes,
  isLiked,
  trip_id,
}) => {
  const [change, setChange] = useState<FavouritesProps>({ likes, isLiked });

  return (
    <>
      <Heart
        onClick={async () => toggleFavourite(change, setChange, trip_id)}
        className={`mr-1 cursor-pointer ${change.isLiked ? 'fill-red-500 text-red-500' : ''}`}
      />
      {change.likes}
    </>
  );
};
