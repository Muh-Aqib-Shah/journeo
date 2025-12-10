/* eslint-disable */

'use client';

import React, { useEffect, useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { fetchWithAuth } from '@/lib/auth';

interface ReviewTypes {
  comment_text: string;
  username: string;
  created_at: Date;
  comment_id: string;
}

async function getCommentsForTrip(
  tripId: number,
  setValue: React.Dispatch<React.SetStateAction<ReviewTypes[]>>,
) {
  try {
    const res = await fetch(`/api/explore/trips/comment/get?id=${tripId}`);

    const response = await res.json();
    setValue(response);
  } catch (error) {
    return [];
  }
}
async function addCommentsForTrip(
  tripId: number,
  comment: string,
  setValue: React.Dispatch<React.SetStateAction<ReviewTypes[]>>,
) {
  try {
    const res = await fetchWithAuth(`/api/explore/trips/comment/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ comment, tripId }),
    });

    const response = await res.json();
    setValue(response.comments);
  } catch (error) {
    return [];
  }
}
interface CommentProps {
  trip_id: number;
}

export const Reviews: React.FC<CommentProps> = ({ trip_id }) => {
  const [mycomment, setMyComment] = useState<string>('');
  const [comments, setComments] = useState<ReviewTypes[]>([]);

  const handleComment = (review: string) => {
    if (!review.trim()) return;

    addCommentsForTrip(trip_id, mycomment, setComments);
    setMyComment('');
  };

  useEffect(() => {
    async function getComments() {
      await getCommentsForTrip(trip_id, setComments);
    }

    getComments();
  }, []);
  if(!comments){
    return <div></div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Review(s)</h2>
      </div>
      <hr />
      {comments.length === 0 ? 
        <div className="flex items-center justify-center">
        <p>No Reviews for this trip!</p>
      </div>
      :
      (comments.map((cmnt) => (
        <div className="flex" key={cmnt.comment_id}>
          <div>
            <Avatar>
              <AvatarImage src="" alt="avatar" />
              <AvatarFallback>{cmnt.username[0]}</AvatarFallback>
            </Avatar>
          </div>
          <div className="ml-2 line-clamp-2 overflow-hidden text-nowrap">
            <div>
              <p className="truncate text-sm font-bold">{cmnt.username}</p>
            </div>
            <div>{cmnt.comment_text} </div>
          </div>
        </div>
      )))}
      <hr />
      <div className="relative flex pt-5">
        <div>
          <Avatar>
            <AvatarImage src="" alt="avatar" />
            <AvatarFallback>ME</AvatarFallback>
          </Avatar>
        </div>
        <div className="ml-2 w-full">
          <div className="w-full">
            <Textarea
              placeholder="Add a review..."
              className=" w-full rounded-md border-2 border-black "
              value={mycomment}
              onChange={(e) => setMyComment(e.target.value)}
            />
          </div>
        </div>

        <Button
          variant="outline"
          className={`absolute bottom-2 right-2 ${!mycomment.trim() ? 'hidden' : 'block'}`}
          onClick={() => handleComment(mycomment)}
        >
          Post
        </Button>
      </div>
    </div>
  );
};
