import React from 'react';
import { notFound } from 'next/navigation';
import { trips, itineraryItems, places } from '@/lib/data';
import { MapClient } from './map-client';

export default function MapPage({ params }: { params: { id: string } }) {
  const resolvedParams = React.use(params);
  const trip = trips.find((t) => t.id === resolvedParams.id);
  if (!trip) {
    notFound();
  }

  const tripItinerary = itineraryItems.filter((item) => item.tripId === trip.id);
  const tripPlaces = tripItinerary
    .map((item) => places.find((p) => p.id === item.placeId))
    .filter((p): p is NonNullable<typeof p> => p !== undefined);

  return (
    <div>
      <MapClient places={tripPlaces} />
    </div>
  );
}

    