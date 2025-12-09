'use client';

import { useEffect, useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Spinner } from '@/components/ui/spinner';

interface Comment {
  comment_id: number;
  user_id: number;
  trip_id: number;
  comment_text: string;
  created_at: string;
  updated_at: string;
}

interface ReviewsProps {
  tripId?: string | number;
}

export const Reviews = ({ tripId = '9' }: ReviewsProps) => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/comments?tripId=${tripId}`);
        const data = await response.json();
        
        if (data.success && Array.isArray(data.comments)) {
          setComments(data.comments);
        } else {
          setComments([]);
        }
      } catch (err) {
        console.error('Error fetching comments:', err);
        setError('Failed to load comments');
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [tripId]);

  const handleComment = async (review: string) => {
    if (!review.trim()) return;

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tripId, content: review.trim() }),
      });

      const data = await response.json();
      if (data.success && data.comment) {
        // Add the new comment to the list immediately
        setComments((prev) => [data.comment, ...prev]);
        setComment('');
      } else {
        console.error('Failed to post comment:', data.error);
        alert('Failed to post comment. Make sure you are logged in.');
      }
    } catch (err) {
      console.error('Error posting comment:', err);
      alert('Error posting comment. Are you logged in?');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Comments</h2>
      </div>
      <hr />
      
      {loading ? (
        <div className="flex justify-center">
          <Spinner className="size-6" />
        </div>
      ) : error ? (
        <div className="text-sm text-red-500">{error}</div>
      ) : comments.length === 0 ? (
        <div className="text-sm text-muted-foreground">No reviews yet. Be the first to comment!</div>
      ) : (
        comments.map((cmnt) => (
          <div className="flex" key={cmnt.comment_id}>
            <div>
              <Avatar>
                <AvatarImage src="" alt="avatar" />
                <AvatarFallback>U{cmnt.user_id}</AvatarFallback>
              </Avatar>
            </div>
            <div className="ml-2 flex-1">
              <div>
                <p className="text-sm font-bold">User {cmnt.user_id}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(cmnt.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="mt-1">{cmnt.comment_text}</div>
            </div>
          </div>
        ))
      )}
      <hr />
      <div className="relative flex pt-5 gap-4">
        <div>
          <Avatar>
            <AvatarImage src="" alt="avatar" />
            <AvatarFallback>ME</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex-1 space-y-2">
          <Textarea
            placeholder="Add a comment..."
            className="w-full rounded-md border-2 border-black"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Button
            onClick={() => handleComment(comment)}
            disabled={!comment.trim()}
            className={!comment.trim() ? 'opacity-50 cursor-not-allowed' : ''}
          >
            Post
          </Button>
        </div>
      </div>
    </div>
  );
};
