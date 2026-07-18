import React from 'react';
import { Header } from '@/components/layout/header';
import { TripHeader } from '@/components/trip-header';
import { trips } from '@/lib/data';
import { notFound } from 'next/navigation';

export default function TripLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const resolvedParams = React.use(params);
  const trip = trips.find((t) => t.id === resolvedParams.id);

  if (!trip) {
    notFound();
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header title={trip.destination} />
      <main className="flex-1">
        <TripHeader tripId={trip.id} />
        <div className="p-4 md:p-6">{children}</div>
      </main>
    </div>
  );
}

    