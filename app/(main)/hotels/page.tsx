'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Hotel, Search, Star, CreditCard } from 'lucide-react';
import {
  findHotels,
  type FindHotelsOutput,
} from '@/ai/flows/find-hotels';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PaymentDialog } from '@/components/payment-dialog';
import { Header } from '@/components/layout/header';
import { Input } from '@/components/ui/input';
import { useCurrency } from '@/context/currency-provider';

type HotelRecommendation = FindHotelsOutput[0];
const USD_TO_INR_RATE = 83;

function HotelsSearchPage() {
  const searchParams = useSearchParams();
  const [destination, setDestination] = useState('');
  const [results, setResults] = useState<FindHotelsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<HotelRecommendation | null>(null);
  const { currency } = useCurrency();

  useEffect(() => {
    const destFromParams = searchParams.get('destination');
    if (destFromParams) {
      setDestination(destFromParams);
      handleFindHotels(destFromParams);
    }
  }, [searchParams]);

  const handleFindHotels = async (searchDestination: string) => {
    if (!searchDestination.trim()) return;
    setIsLoading(true);
    setError(null);
    setResults(null);
    try {
      const response = await findHotels({ destination: searchDestination });
      setResults(response);
    } catch (e) {
      console.error(e);
      setError("Sorry, we couldn't find any hotels. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleFindHotels(destination);
  };
  
  const handlePayClick = (hotel: HotelRecommendation) => {
    setSelectedHotel(hotel);
    setIsPaymentDialogOpen(true);
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
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.round(rating)
            ? 'text-amber-400 fill-amber-400'
            : 'text-muted-foreground/50'
        }`}
      />
    ));
  };

  return (
    <>
      {selectedHotel && (
        <PaymentDialog
          isOpen={isPaymentDialogOpen}
          onOpenChange={setIsPaymentDialogOpen}
          itemType="Hotel"
          itemName={selectedHotel.name}
          price={selectedHotel.price}
          currency="USD"
        />
      )}
      <div className="flex min-h-screen w-full flex-col">
        <Header title="Hotel Search" />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          <Card>
            <CardHeader>
              <CardTitle>Find a Hotel</CardTitle>
              <CardDescription>Search for the perfect hotel for your trip.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <Input
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g., Kyoto, Japan"
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button type="submit" disabled={isLoading}>
                  <Search className="mr-2 h-4 w-4" />
                  {isLoading ? 'Searching...' : 'Search Hotels'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
                <CardTitle>Results</CardTitle>
            </CardHeader>
            <CardContent>
                {!results && !isLoading && !error && (
                    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 p-12 text-center">
                    <Hotel className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-xl font-semibold">Find hotels with AI</h3>
                    <p className="mb-4 mt-2 text-sm text-muted-foreground">
                        Let our AI find the best hotel deals and recommendations for your trip.
                    </p>
                    </div>
                )}

                {isLoading && (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Card key={i}>
                        <Skeleton className="h-48 w-full" />
                        <CardHeader>
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-10 w-full" />
                        </CardContent>
                        <CardFooter>
                            <Skeleton className="h-10 w-full" />
                        </CardFooter>
                        </Card>
                    ))}
                    </div>
                )}

                {error && (
                    <Alert variant="destructive">
                    <AlertTitle>Search Failed</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {results && (
                    <div className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {results.map((hotel, index) => (
                        <Card key={index} className="flex flex-col overflow-hidden">
                            <div className="relative h-48 w-full">
                            <Image
                                src={hotel.imageUrl}
                                alt={hotel.name}
                                fill
                                className="object-cover"
                            />
                            </div>
                            <CardHeader>
                            <CardTitle>{hotel.name}</CardTitle>
                            <div className="flex items-center gap-1">
                                {renderStars(hotel.rating)}
                            </div>
                            </CardHeader>
                            <CardContent className="flex-grow">
                            <p className="text-sm text-muted-foreground">
                                {hotel.description}
                            </p>
                            </CardContent>
                            <CardFooter className="flex items-center justify-between bg-muted/50 p-4">
                            <p className="font-semibold">{getFormattedPrice(hotel.price)}</p>
                            <Button
                                onClick={() => handlePayClick(hotel)}
                                size="sm"
                            >
                                <CreditCard className="mr-2 h-4 w-4" />
                                Book Now
                            </Button>
                            </CardFooter>
                        </Card>
                        ))}
                    </div>
                    </div>
                )}
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  );
}

export default function HotelsPage() {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <HotelsSearchPage />
      </Suspense>
    );
  }
