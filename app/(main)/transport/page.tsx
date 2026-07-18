'use client';

import { useState } from 'react';
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
  findTransportation,
  type FindTransportationOutput,
} from '@/ai/flows/find-transportation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Bus, Search, TramFront, CircleDollarSign, Clock, Footprints, Car } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

type TransportationOption = FindTransportationOutput[0];

const iconMap: { [key: string]: React.ReactNode } = {
    Train: <TramFront className="h-6 w-6 text-muted-foreground" />,
    Bus: <Bus className="h-6 w-6 text-muted-foreground" />,
    Taxi: <Car className="h-6 w-6 text-muted-foreground" />,
    Subway: <TramFront className="h-6 w-6 text-muted-foreground" />,
    Walking: <Footprints className="h-6 w-6 text-muted-foreground" />,
  };
  
const getIconForType = (type: string) => {
    const lowerType = type.toLowerCase();
    for (const key in iconMap) {
        if (lowerType.includes(key.toLowerCase())) {
        return iconMap[key];
        }
    }
    return <Bus className="h-6 w-6 text-muted-foreground" />; // Default icon
};

export default function TransportPage() {
  const [attraction, setAttraction] = useState('');
  const [results, setResults] = useState<FindTransportationOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!attraction.trim()) return;

    setIsLoading(true);
    setResults(null);
    setError(null);
    try {
      const response = await findTransportation({ attraction });
      setResults(response);
    } catch (e) {
      console.error(e);
      setError("Sorry, we couldn't find any transport options. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header title="Transportation Finder" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Find Your Way</CardTitle>
            <CardDescription>
              Enter an attraction to find the best ways to get there.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <Input
                value={attraction}
                onChange={(e) => setAttraction(e.target.value)}
                placeholder="e.g., Fushimi Inari Shrine, Kyoto"
                className="flex-1"
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading || !attraction.trim()}>
                <Search className="mr-2 h-4 w-4" />
                {isLoading ? 'Searching...' : 'Find Transport'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Results</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="space-y-4">
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-28 w-full" />
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
                <Bus className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-xl font-semibold">
                  Search for transportation
                </h3>
                <p className="mb-4 mt-2 text-sm text-muted-foreground">
                  Your transport options will appear here.
                </p>
              </div>
            )}
            {results && results.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 p-12 text-center">
                <Bus className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-xl font-semibold">
                  No Options Found
                </h3>
                <p className="mb-4 mt-2 text-sm text-muted-foreground">
                  Try adjusting your search.
                </p>
              </div>
            )}
            {results && results.length > 0 && (
              <div className="space-y-4">
                {results.map((option, index) => (
                  <Card key={index} className="overflow-hidden p-4">
                    <div className="flex items-start gap-4">
                        <div className="bg-muted p-3 rounded-lg">
                           {getIconForType(option.type)}
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-lg">{option.type}</h3>
                            <p className="text-muted-foreground">{option.details}</p>
                            {option.notes && <p className="text-sm mt-2">{option.notes}</p>}
                        </div>
                        <div className='flex flex-col items-end gap-2 text-sm'>
                            <div className='flex items-center gap-2'>
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span>{option.estimatedTime}</span>
                            </div>
                             <div className='flex items-center gap-2'>
                                <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
                                <span>{option.estimatedCost}</span>
                            </div>
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
  );
}
