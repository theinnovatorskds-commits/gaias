'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { Place } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, MapPin } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import {
  GoogleMap,
  useJsApiLoader,
  MarkerF,
} from '@react-google-maps/api';
import { useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function MapClient({ places }: { places: Place[] }) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey || '',
    libraries: ['places'],
  });

  const mapCenter = useMemo(() => {
    if (places.length === 0) {
      return { lat: 0, lng: 0 };
    }
    const avgLat =
      places.reduce((sum, p) => sum + p.location.lat, 0) / places.length;
    const avgLng =
      places.reduce((sum, p) => sum + p.location.lng, 0) / places.length;
    return { lat: avgLat, lng: avgLng };
  }, [places]);

  const mapOptions = useMemo(
    () => ({
      disableDefaultUI: true,
      clickableIcons: false,
      scrollwheel: true,
    }),
    []
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trip Map</CardTitle>
        <CardDescription>
          Showing the locations of all items in your itinerary.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[600px] w-full rounded-lg bg-muted overflow-hidden">
          {!apiKey ? (
            <Alert className="h-full flex flex-col justify-center">
              <Info className="h-4 w-4" />
              <AlertTitle>Google Maps API Key Missing</AlertTitle>
              <AlertDescription>
                Please provide a Google Maps API key to display the map. Add it
                to your environment variables as{' '}
                <code className="font-code">
                  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
                </code>
                .
              </AlertDescription>
            </Alert>
          ) : !isLoaded ? (
            <Skeleton className="h-full w-full" />
          ) : (
            <GoogleMap
              mapContainerClassName="w-full h-full"
              center={mapCenter}
              zoom={places.length > 1 ? 11 : 14}
              options={mapOptions}
            >
              {places.map((place) => (
                <MarkerF
                  key={place.id}
                  position={place.location}
                  title={place.name}
                />
              ))}
            </GoogleMap>
          )}
        </div>
        <div className="mt-4">
          <h3 className="mb-2 text-lg font-semibold">Itinerary Places</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {places.map((place) => {
              const placeImage = PlaceHolderImages.find(
                (img) => img.id === place.images[0]
              );
              return (
                <Card key={place.id} className="overflow-hidden">
                  {placeImage && (
                    <div className="relative h-40 w-full">
                      <Image
                        src={placeImage.imageUrl}
                        alt={place.name}
                        fill
                        className="object-cover"
                        data-ai-hint={placeImage.imageHint}
                      />
                    </div>
                  )}
                  <CardContent className="p-4">
                    <CardTitle className="text-base">{place.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <MapPin className="w-4 h-4" />
                      {place.category}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
