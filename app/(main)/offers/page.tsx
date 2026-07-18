'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ExternalLink, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { findBestOffers, type FindBestOffersOutput } from '@/ai/flows/find-best-offers';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Header } from '@/components/layout/header';
import { useCurrency } from '@/context/currency-provider';

const USD_TO_INR_RATE = 83;

export default function OffersPage() {
  const [preferences, setPreferences] = useState('');
  const [offers, setOffers] = useState<FindBestOffersOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currency } = useCurrency();

  const handleFindOffers = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!preferences.trim()) return;

    setIsLoading(true);
    setError(null);
    setOffers(null);

    try {
      const result = await findBestOffers({ userPreferences: preferences });
      setOffers(result);
    } catch (e) {
      console.error(e);
      setError('Sorry, we couldn\'t find any offers. Please try refining your preferences.');
    } finally {
      setIsLoading(false);
    }
  };

  const getFormattedPrice = (price: number) => {
    let displayPrice = price;
    if (currency === 'INR') {
        displayPrice = price * USD_TO_INR_RATE;
    }
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(displayPrice);
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header title="Personalized Offers" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Find Your Perfect Deal</CardTitle>
            <CardDescription>
              Describe your dream trip, and let our AI find the best offers for you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFindOffers} className="space-y-4">
              <div className="grid w-full gap-1.5">
                <Label htmlFor="preferences">What are you looking for?</Label>
                <Textarea
                  id="preferences"
                  placeholder="e.g., A relaxing beach vacation in Thailand for two weeks in December, under $2000."
                  value={preferences}
                  onChange={(e) => setPreferences(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" disabled={isLoading || !preferences.trim()}>
                <Sparkles className="mr-2 h-4 w-4" />
                {isLoading ? 'Searching...' : 'Find Offers'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {isLoading && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader><Skeleton className="h-5 w-2/4" /></CardHeader>
              <CardContent><Skeleton className="h-4 w-full" /></CardContent>
              <CardFooter><Skeleton className="h-8 w-1/4 ml-auto" /></CardFooter>
            </Card>
            <Card>
              <CardHeader><Skeleton className="h-5 w-2/4" /></CardHeader>
              <CardContent><Skeleton className="h-4 w-full" /></CardContent>
              <CardFooter><Skeleton className="h-8 w-1/4 ml-auto" /></CardFooter>
            </Card>
            <Card>
              <CardHeader><Skeleton className="h-5 w-2/4" /></CardHeader>
              <CardContent><Skeleton className="h-4 w-full" /></CardContent>
              <CardFooter><Skeleton className="h-8 w-1/4 ml-auto" /></CardFooter>
            </Card>
          </div>
        )}

        {error && (
            <Alert variant="destructive">
                <AlertTitle>Search Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        {offers && offers.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 p-12 text-center">
                <Sparkles className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-xl font-semibold">No Offers Found</h3>
                <p className="mb-4 mt-2 text-sm text-muted-foreground">
                    We couldn't find any offers matching your preferences. Try being more specific or broad in your search.
                </p>
            </div>
        )}

        {offers && offers.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {offers.map((offer, index) => (
              <Card key={index} className="flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-muted-foreground">{offer.source}</p>
                      <CardTitle className="text-lg mt-1">{offer.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  {offer.notes && <p className="text-sm text-muted-foreground">{offer.notes}</p>}
                </CardContent>
                <CardFooter className="flex items-center justify-between bg-muted/50 p-4">
                  <p className="text-xl font-bold">
                    {getFormattedPrice(offer.price)}
                  </p>
                  <Button asChild size="sm">
                    <Link href={offer.link} target="_blank" rel="noopener noreferrer">
                      View Offer <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}
