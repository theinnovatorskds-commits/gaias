'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { TripCard } from '@/components/trip-card';
import { trips as initialTrips, users } from '@/lib/data';
import type { Trip } from '@/lib/types';
import { NewTripDialog } from '@/components/new-trip-dialog';

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>(initialTrips);

  const handleAddTrip = (tripData: Omit<Trip, 'id' | 'participants' | 'coverImage'>) => {
    const newTrip: Trip = {
      id: `trip-${Date.now()}`,
      ...tripData,
      coverImage: 'new-trip-placeholder',
      participants: [users[0]], // Default to current user for now
    };
    setTrips(prevTrips => [newTrip, ...prevTrips]);
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header title="My Trips" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="flex items-center">
          <div className="flex-1" />
          <NewTripDialog onAddTrip={handleAddTrip} />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      </main>
    </div>
  );
}
