'use client';
import { Header } from "@/components/layout/header";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { TripCard } from '@/components/trip-card';
import { trips, offers } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ArrowRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useCurrency } from "@/context/currency-provider";

const USD_TO_INR_RATE = 83;

export default function DashboardPage() {
  const featuredOffers = offers.slice(0, 2);
  const { currency } = useCurrency();

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
    <div className="flex min-h-screen w-full flex-col">
      <Header title="Dashboard" />
      <main className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Welcome Back!</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Here's a quick overview of your upcoming adventures.</p>
          </CardContent>
        </Card>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Upcoming Trips</h2>
            <Button variant="outline" asChild>
              <Link href="/trips">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {trips.slice(0, 4).map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        </div>

        <div>
           <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">
              Featured Offers
            </h2>
            <Button variant="outline" asChild>
              <Link href="/offers">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {featuredOffers.map((offer) => (
               <Card key={offer.id}>
                <CardHeader>
                    <CardTitle>{offer.title}</CardTitle>
                    <CardDescription>{offer.source}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">{offer.notes}</p>
                </CardContent>
                <CardFooter className="flex items-center justify-between">
                     <p className="text-xl font-bold">
                        {getFormattedPrice(offer.price, offer.currency)}
                    </p>
                    <Button asChild>
                        <Link href={offer.link} target="_blank" rel="noopener noreferrer">
                        View Offer <ExternalLink className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </CardFooter>
               </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
