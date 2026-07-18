'use client';

import React, { useState } from 'react';
import { notFound } from 'next/navigation';
import {
  places,
  reviews as initialReviews,
  users,
} from '@/lib/data';
import type { Review } from '@/lib/types';
import { Header } from '@/components/layout/header';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Star } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';

const StarRating = ({ rating, setRating, interactive = false }: { rating: number; setRating?: (rating: number) => void; interactive?: boolean }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-5 w-5 ${
            star <= rating
              ? 'text-amber-400 fill-amber-400'
              : 'text-muted-foreground/50'
          } ${interactive ? 'cursor-pointer' : ''}`}
          onClick={() => interactive && setRating?.(star)}
        />
      ))}
    </div>
  );
};


export default function ReviewsPage({ params }: { params: { id: string } }) {
  const resolvedParams = React.use(params);
  const place = places.find((p) => p.id === resolvedParams.id);
  const [reviews, setReviews] = useState<Review[]>(initialReviews.filter(r => r.placeId === resolvedParams.id));
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!place) {
    notFound();
  }

  const currentUser = users[0]; // Assuming current user is Alex

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRating === 0 || !newComment.trim()) {
      // Could show a toast message here
      return;
    }
    setIsSubmitting(true);
    const newReview: Review = {
        id: `review-${Date.now()}`,
        placeId: resolvedParams.id,
        userId: currentUser.id,
        rating: newRating,
        comment: newComment,
        timestamp: new Date().toISOString(),
    };

    // Simulate API call
    setTimeout(() => {
        setReviews(prev => [newReview, ...prev]);
        setNewRating(0);
        setNewComment('');
        setIsSubmitting(false);
    }, 500);
  };


  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header title={`Reviews for ${place.name}`} />
      <main className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-6">
        <Card>
            <CardHeader>
                <CardTitle>Share Your Experience</CardTitle>
                <CardDescription>Let others know what you think about {place.name}.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <div>
                        <p className="mb-2 font-medium">Your Rating</p>
                        <StarRating rating={newRating} setRating={setNewRating} interactive />
                    </div>
                    <div>
                        <Textarea 
                            placeholder="Share your thoughts..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            rows={4}
                            disabled={isSubmitting}
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={isSubmitting || newRating === 0 || !newComment.trim()}>
                        {isSubmitting ? 'Submitting...' : 'Submit Review'}
                    </Button>
                </CardFooter>
            </form>
        </Card>

        <Separator />

        <Card>
          <CardHeader>
            <CardTitle>Community Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            {reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((review) => {
                  const user = users.find((u) => u.id === review.userId);
                  const userAvatar = user ? PlaceHolderImages.find(p => p.id === user.avatar) : null;
                  return (
                    <div key={review.id} className="flex items-start gap-4">
                      <Avatar className="h-10 w-10 border">
                        <AvatarImage src={userAvatar?.imageUrl} alt={user?.name} data-ai-hint={userAvatar?.imageHint} />
                        <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-semibold">{user?.name}</p>
                                <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(review.timestamp), { addSuffix: true })}</p>
                            </div>
                           <StarRating rating={review.rating} />
                        </div>
                        <p className="mt-2 text-sm text-foreground">{review.comment}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-center text-muted-foreground">No reviews yet. Be the first to share your thoughts!</p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
