'use client';

import { useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const COMMENTS = [
  {
    name: 'Aqib Shah',
    comment_text: 'Wonderfull Trip Idea...',
  },
  {
    name: 'Emily',
    comment_text: 'I love it',
  },
  {
    name: 'Barb',
    comment_text: 'I am adding this to my favorites!',
  },
];

export const Reviews = () => {
  const [comment, setComment] = useState('');

  const handleComment = (review: string) => {
    if (!review.trim()) return;

    // add comment to
    setComment('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Review(s)</h2>
      </div>
      <hr />
      {COMMENTS.map((cmnt) => (
        <div className="flex" key={cmnt.comment_text}>
          <div>
            <Avatar>
              <AvatarImage src={cmnt.name || ''} alt="avatar" />
              <AvatarFallback>{cmnt.name.at(0)}</AvatarFallback>
            </Avatar>
          </div>
          <div className="ml-2 line-clamp-2 overflow-hidden text-nowrap">
            <div>
              <p className="truncate text-sm font-bold">{cmnt.name}</p>
            </div>
            <div>{cmnt.comment_text} </div>
          </div>
        </div>
      ))}
      <hr />
      <div className="relative flex pt-5">
        <div>
          <Avatar>
            <AvatarImage src="" alt="avatar" />
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
        </div>
        <div className="ml-2 w-full">
          <div className="w-full">
            <Textarea
              placeholder="Add a review..."
              className=" w-full rounded-md border-2 border-black "
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
        </div>

        <Button
          variant="outline"
          className={`absolute bottom-2 right-2 ${!comment.trim() ? 'hidden' : 'block'}`}
          onClick={() => handleComment(comment)}
        >
          Post
        </Button>
      </div>
    </div>
  );
};
