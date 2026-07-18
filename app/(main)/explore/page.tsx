import { Header } from '@/components/layout/header';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { places } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Star, Plane, Hotel, Map, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ExplorePage() {
  const explorePlaces = places.filter((p) => p.isTopDestination);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header title="Explore Top Destinations" />
      <main className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Discover the World</CardTitle>
            <CardDescription>
              Hand-picked destinations with unique experiences to offer.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {explorePlaces.map((place) => {
              const image = PlaceHolderImages.find(
                (img) => img.id === place.images[0]
              );
              return (
                <Card key={place.id} className="overflow-hidden flex flex-col">
                  <div className="relative h-56 w-full">
                    {image && (
                      <Image
                        src={image.imageUrl}
                        alt={place.name}
                        fill
                        className="object-cover"
                        data-ai-hint={image.imageHint}
                      />
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle>{place.name}</CardTitle>
                    <CardDescription>{place.category}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="flex items-start gap-3">
                      <Star className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground">
                        {place.specialOffer}
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="mt-auto grid grid-cols-2 gap-2 p-4">
                    <Button asChild variant="outline" size="sm">
                      <Link
                        href={`/flights?to=${encodeURIComponent(place.name)}`}
                      >
                        <Plane className="mr-2 h-4 w-4" /> Flights
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link
                        href={`https://www.booking.com/searchresults.html?ss=${encodeURIComponent(
                          place.name
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Hotel className="mr-2 h-4 w-4" /> Hotels
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link
                        href={`https://www.google.com/maps/search/?api=1&query=${place.location.lat},${place.location.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Map className="mr-2 h-4 w-4" /> Map
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                        <Link href={`/explore/${place.id}/reviews`}>
                            <MessageSquare className="mr-2 h-4 w-4" /> Reviews
                        </Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
