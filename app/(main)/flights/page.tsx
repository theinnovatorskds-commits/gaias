'use client';

import { useState, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Header } from '@/components/layout/header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  CreditCard,
  Plane,
  PlaneLanding,
  PlaneTakeoff,
} from 'lucide-react';
import {
  findFlights,
  type FindFlightsOutput,
} from '@/ai/flows/find-flights';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { PaymentDialog } from '@/components/payment-dialog';
import { useCurrency } from '@/context/currency-provider';

const flightSearchSchema = z.object({
  from: z.string().min(1, 'Departure location is required.'),
  to: z.string().min(1, 'Arrival location is required.'),
  departDate: z.string().min(1, 'Departure date is required.'),
  returnDate: z.string(),
});

type FlightSearchFormValues = z.infer<typeof flightSearchSchema>;
type FlightOffer = FindFlightsOutput[0];
const USD_TO_INR_RATE = 83;

function FlightSearchContents() {
  const searchParams = useSearchParams();
  const [results, setResults] = useState<FindFlightsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState<FlightOffer | null>(
    null
  );
  const { currency } = useCurrency();

  const form = useForm<FlightSearchFormValues>({
    resolver: zodResolver(flightSearchSchema),
    defaultValues: {
      from: 'New York (JFK)',
      to: '',
      departDate: new Date().toISOString().split('T')[0],
      returnDate: new Date(new Date().setDate(new Date().getDate() + 7))
        .toISOString()
        .split('T')[0],
    },
  });

  useEffect(() => {
    const toParam = searchParams.get('to');
    form.setValue('to', toParam || 'London (LHR)');
  }, [searchParams, form]);


  async function onSubmit(data: FlightSearchFormValues) {
    setIsLoading(true);
    setResults(null);
    setError(null);
    try {
      const response = await findFlights(data);
      setResults(response);
    } catch (e) {
      console.error(e);
      setError("Sorry, we couldn't find any flights. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const handlePayClick = (flight: FlightOffer) => {
    setSelectedFlight(flight);
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

  return (
    <>
      {selectedFlight && (
        <PaymentDialog
          isOpen={isPaymentDialogOpen}
          onOpenChange={setIsPaymentDialogOpen}
          itemType="Flight"
          itemName={`${selectedFlight.airline} ${selectedFlight.flightNumber}`}
          price={selectedFlight.price}
          currency={selectedFlight.currency}
        />
      )}
      <div className="flex min-h-screen w-full flex-col">
        <Header title="Flight Search" />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          <Card>
            <CardHeader>
              <CardTitle>Find Your Flight</CardTitle>
              <CardDescription>
                Search for the best flight deals for your next trip.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="grid items-end gap-4 md:grid-cols-2 lg:grid-cols-5"
                >
                  <div className="grid gap-4 lg:col-span-2 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="from"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>From</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., New York (JFK)"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="to"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>To</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., London (LHR)"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="departDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Depart</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="returnDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Return</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? 'Searching...' : 'Search Flights'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Results</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading && (
                <div className="space-y-4">
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                </div>
              )}
              {error && (
                <Alert variant="destructive">
                  <AlertTitle>Search Failed</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {!isLoading && !error && !results && (
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 p-12 text-center">
                  <Plane className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-xl font-semibold">
                    Search for flights
                  </h3>
                  <p className="mb-4 mt-2 text-sm text-muted-foreground">
                    Your flight search results will appear here.
                  </p>
                </div>
              )}
              {results && results.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 p-12 text-center">
                  <Plane className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-xl font-semibold">
                    No Flights Found
                  </h3>
                  <p className="mb-4 mt-2 text-sm text-muted-foreground">
                    Try adjusting your search criteria.
                  </p>
                </div>
              )}
              {results && results.length > 0 && (
                <div className="space-y-4">
                  {results.map((flight, index) => (
                    <Card key={index} className="overflow-hidden">
                      <div className="grid grid-cols-1 md:grid-cols-4">
                        <div className="p-4 md:col-span-3">
                          <div className="flex items-center gap-4">
                            <div className="bg-muted p-3 rounded-lg">
                              <Plane className="w-6 h-6 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="font-bold text-lg">
                                {flight.airline}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Flight {flight.flightNumber}
                              </p>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-center mt-4 text-sm">
                            <div>
                              <p className="font-semibold">
                                {flight.departureTime}
                              </p>
                              <p className="text-muted-foreground">
                                {form.getValues('from').substring(0, 3).toUpperCase()}
                              </p>
                            </div>
                            <div className="flex flex-col items-center justify-center">
                              <p className="text-muted-foreground text-xs">
                                {flight.duration}
                              </p>
                              <div className="w-full flex items-center">
                                <PlaneTakeoff className="w-4 h-4 text-muted-foreground" />
                                <Separator className="flex-1 mx-2" />
                                <span className="text-muted-foreground text-xs">
                                  {flight.stops > 0
                                    ? `${flight.stops} stop${
                                        flight.stops > 1 ? 's' : ''
                                      }`
                                    : 'Direct'}
                                </span>
                                <Separator className="flex-1 mx-2" />
                                <PlaneLanding className="w-4 h-4 text-muted-foreground" />
                              </div>
                              <p className="text-muted-foreground text-xs">
                                {flight.stops > 0
                                  ? 'via intermediate airport'
                                  : 'Non-stop'}
                              </p>
                            </div>
                            <div>
                              <p className="font-semibold">
                                {flight.arrivalTime}
                              </p>
                              <p className="text-muted-foreground">
                                {form.getValues('to').substring(0, 3).toUpperCase()}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-center justify-center p-4 bg-muted/50 border-t md:border-t-0 md:border-l">
                          <p className="text-2xl font-bold">
                            {getFormattedPrice(flight.price)}
                          </p>
                          <p className="text-muted-foreground text-xs mb-4">
                            per person
                          </p>
                          <Button
                            onClick={() => handlePayClick(flight)}
                            className="w-full"
                          >
                            <CreditCard className="mr-2 h-4 w-4" /> Book Now
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  );
}

export default function FlightsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
        <FlightSearchContents />
    </Suspense>
  )
}
