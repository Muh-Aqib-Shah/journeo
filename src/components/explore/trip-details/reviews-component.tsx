'use client';

import { useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface Review {
  name: string;
  rating: number;
  review_text: string;
}

const INITIAL_REVIEWS: Review[] = [
  {
    name: 'Aqib Shah',
    rating: 5,
    review_text: 'Wonderful trip experience! The itinerary was perfect and everything was well organized.',
  },
  {
    name: 'Emily',
    rating: 5,
    review_text: 'Absolutely amazing! Had the best time ever. Highly recommend this trip!',
  },
  {
    name: 'Barb',
    rating: 4,
    review_text: 'Great experience overall. The only thing I would improve is the accommodation in one location.',
  },
];

interface ReviewsComponentProps {
  tripId?: string | number;
}

export const ReviewsComponent = ({ tripId = '9' }: ReviewsComponentProps) => {
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitReview = async (reviewText: string) => {
    if (!reviewText.trim() || rating === 0) {
      alert('Please provide a rating and review text');
      return;
    }

    try {
      setSubmitting(true);
      // Add review to the list immediately
      const newReview: Review = {
        name: 'You',
        rating: rating,
        review_text: reviewText.trim(),
      };
      
      setReviews((prev) => [newReview, ...prev]);
      setReview('');
      setRating(0);
      console.log('Review submitted:', { tripId, rating, reviewText });
    } catch (err) {
      console.error('Error submitting review:', err);
      alert('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Reviews & Ratings</h2>
      </div>
      <hr />
      
      {reviews.map((rev, idx) => (
        <div className="space-y-2" key={idx}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src="" alt="avatar" />
                <AvatarFallback>{rev.name.at(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-bold">{rev.name}</p>
                <p className="text-sm text-yellow-500">{'★'.repeat(rev.rating)}</p>
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground ml-12">{rev.review_text}</p>
        </div>
      ))}
      
      <hr />
      <div className="space-y-4 pt-5">
        <div>
          <label className="text-sm font-semibold">Your Rating</label>
          <div className="flex gap-1 mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => {
                  setRating(star);
                  console.log('Rating set to:', star);
                }}
                className={`text-3xl transition cursor-pointer hover:scale-125 ${
                  rating >= star ? 'text-yellow-400' : 'text-gray-300'
                }`}
                type="button"
              >
                ★
              </button>
            ))}
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {rating > 0 ? `You selected ${rating} star${rating !== 1 ? 's' : ''}` : 'Select a rating'}
          </p>
        </div>
        
        <div className="flex gap-4">
          <Avatar>
            <AvatarImage src="" alt="avatar" />
            <AvatarFallback>ME</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <Textarea
              placeholder="Share your review..."
              className="w-full rounded-md border-2 border-black"
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />
            <Button
              className={`${!review.trim() || rating === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => handleSubmitReview(review)}
              disabled={!review.trim() || rating === 0 || submitting}
            >
              {submitting ? 'Posting...' : 'Post Review'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
