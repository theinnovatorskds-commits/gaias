'use client';
import React, { useState } from 'react';
import Image from 'next/image';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { trips } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Hotel, BedDouble, Star, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  findHotels,
  type FindHotelsOutput,
} from '@/ai/flows/find-hotels';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PaymentDialog } from '@/components/payment-dialog';
import { useCurrency } from '@/context/currency-provider';

type HotelRecommendation = FindHotelsOutput[0];
const USD_TO_INR_RATE = 83;

export default function HotelsPage({ params }: { params: { id: string } }) {
  const trip = trips.find((t) => t.id === params.id);
  const [results, setResults] = useState<FindHotelsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] =
    useState<HotelRecommendation | null>(null);
  const { currency } = useCurrency();

  if (!trip) {
    notFound();
  }

  const handleFindHotels = async () => {
    setIsLoading(true);
    setError(null);
    setResults(null);
    try {
      const response = await findHotels({ destination: trip.destination });
      setResults(response);
    } catch (e) {
      console.error(e);
      setError("Sorry, we couldn't find any hotels. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
          currency={selectedHotel.currency}
        />
      )}
      <Card>
        <CardHeader>
          <CardTitle>Hotel Recommendations</CardTitle>
          <CardDescription>
            Find the perfect place to stay in {trip.destination}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!results && !isLoading && !error && (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 p-12 text-center">
              <Hotel className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-xl font-semibold">
                Find hotels with AI
              </h3>
              <p className="mb-4 mt-2 text-sm text-muted-foreground">
                Let our AI find the best hotel deals and recommendations for
                your trip.
              </p>
              <Button onClick={handleFindHotels} disabled={isLoading}>
                <BedDouble className="mr-2 h-4 w-4" />
                {isLoading ? 'Searching...' : 'Find Hotel Recommendations'}
              </Button>
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
              <Button
                onClick={handleFindHotels}
                disabled={isLoading}
                variant="outline"
              >
                <BedDouble className="mr-2 h-4 w-4" />
                {isLoading ? 'Regenerating...' : 'Regenerate Recommendations'}
              </Button>
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
    </>
  );
}
