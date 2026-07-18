'use client';
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { offers, trips } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ExternalLink, Sparkles, Tag } from 'lucide-react';
import Link from 'next/link';
import { useCurrency } from '@/context/currency-provider';

const USD_TO_INR_RATE = 83;

export default function OffersPage({ params }: { params: { id: string } }) {
  const { currency } = useCurrency();
  const trip = trips.find((t) => t.id === params.id);
  if (!trip) {
    notFound();
  }

  const tripOffers = offers.filter((o) => o.tripId === trip.id);

  const getFormattedPrice = (price: number, offerCurrency: string) => {
    let displayPrice = price;
    let displayCurrency = offerCurrency;

    if (offerCurrency === 'USD' && currency === 'INR') {
        displayPrice = price * USD_TO_INR_RATE;
        displayCurrency = 'INR';
    } else if (offerCurrency === 'INR' && currency === 'USD') {
        displayPrice = price / USD_TO_INR_RATE;
        displayCurrency = 'USD';
    }

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: displayCurrency,
    }).format(displayPrice);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Offers & Links</CardTitle>
        <CardDescription>
          Curated offers and helpful links for your trip to {trip.destination}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {tripOffers.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tripOffers.map((offer) => (
              <Card key={offer.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-muted-foreground">{offer.source}</p>
                      <CardTitle className="text-lg mt-1">{offer.title}</CardTitle>
                    </div>
                    <Tag className="h-5 w-5 text-primary flex-shrink-0" />
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  {offer.notes && <p className="text-sm text-muted-foreground">{offer.notes}</p>}
                </CardContent>
                <CardFooter className="flex items-center justify-between bg-muted/50 p-4">
                  <p className="text-xl font-bold">
                    {getFormattedPrice(offer.price, offer.currency)}
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
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 p-12 text-center">
            <Sparkles className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-xl font-semibold">No Offers Available</h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground">
              Check back later for special deals related to your trip.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
