'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wand2 } from 'lucide-react';
import { generateDailyTripBriefing } from '@/ai/flows/generate-daily-trip-briefing';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { trips, itineraryItems, chatMessages, bookings, offers } from '@/lib/data';

export function DailyBriefingClient({ tripId }: { tripId: string }) {
  const [briefing, setBriefing] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateBriefing = async () => {
    setIsLoading(true);
    setError(null);
    setBriefing('');

    const trip = trips.find(t => t.id === tripId);
    if (!trip) {
        setError("Trip not found.");
        setIsLoading(false);
        return;
    }

    const tripItinerary = itineraryItems.filter(i => i.tripId === tripId);
    const tripChat = chatMessages.filter(c => c.tripId === tripId);
    const tripBookings = bookings.filter(b => b.tripId === tripId);
    const tripOffers = offers.filter(o => o.tripId === tripId);
    
    // In a real app, you would fetch real weather data.
    const weather = "Sunny with a high of 25°C. Light breeze from the west.";
    
    // We stringify the data as the AI flow expects strings.
    const input = {
        tripDetails: JSON.stringify(trip),
        itinerary: JSON.stringify(tripItinerary),
        chatSummary: `Summary of recent chat: Members are excited for Fushimi Inari and discussed breakfast options.`, // A real app would generate this.
        bookings: JSON.stringify(tripBookings),
        weather: weather,
        offers: JSON.stringify(tripOffers),
    };

    try {
      const result = await generateDailyTripBriefing(input);
      setBriefing(result.briefing);
    } catch (e) {
      setError('Failed to generate briefing. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-6 w-6 text-primary" />
          AI Daily Briefing
        </CardTitle>
        <CardDescription>
          Get a personalized briefing for your day's adventures.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        )}
        {error && (
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        {briefing && (
            <div className="prose prose-sm dark:prose-invert whitespace-pre-wrap font-body">
                {briefing}
            </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleGenerateBriefing} disabled={isLoading} className="w-full">
          {isLoading ? 'Generating...' : 'Generate Today\'s Briefing'}
        </Button>
      </CardFooter>
    </Card>
  );
}
