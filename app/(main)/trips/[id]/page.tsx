import React from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { trips, users as allUsers } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import { Calendar, Globe, Users, CloudSun } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DailyBriefingClient } from './daily-briefing-client';
import Link from 'next/link';

export default function TripOverviewPage({
  params,
}: {
  params: { id: string };
}) {
  const resolvedParams = React.use(params);
  const trip = trips.find((t) => t.id === resolvedParams.id);
  if (!trip) {
    notFound();
  }
  const coverImage = PlaceHolderImages.find(
    (img) => img.id === trip.coverImage
  );

  const weatherSearchUrl = `https://www.google.com/search?q=weather+in+${encodeURIComponent(
    trip.destination
  )}`;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Card>
          {coverImage && (
            <div className="relative h-64 w-full overflow-hidden rounded-t-lg">
              <Image
                src={coverImage.imageUrl}
                alt={trip.destination}
                fill
                data-ai-hint={coverImage.imageHint}
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          )}
          <CardHeader>
            <CardTitle className="text-3xl font-headline">
              {trip.destination}
            </CardTitle>
            <CardDescription className="text-base">{trip.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>
                  {format(parseISO(trip.startDate), 'MMM d, yyyy')} -{' '}
                  {format(parseISO(trip.endDate), 'MMM d, yyyy')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                <Badge variant={trip.isPublic ? 'secondary' : 'outline'}>
                  {trip.isPublic ? 'Public' : 'Private'}
                </Badge>
              </div>
              <Link href={weatherSearchUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-foreground">
                <CloudSun className="h-5 w-5" />
                <span>Current Weather</span>
              </Link>
            </div>
            <div>
              <h3 className="mb-2 flex items-center gap-2 font-semibold">
                <Users className="h-5 w-5" />
                Participants
              </h3>
              <div className="flex flex-wrap gap-2">
                {trip.participants.map((participant) => {
                  const avatar = PlaceHolderImages.find(
                    (img) => img.id === participant.avatar
                  );
                  return (
                    <div key={participant.id} className="flex items-center gap-2 rounded-full border bg-secondary p-1 pr-3 text-secondary-foreground">
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src={avatar?.imageUrl}
                          alt={participant.name}
                          data-ai-hint={avatar?.imageHint}
                        />
                        <AvatarFallback>
                          {participant.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{participant.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-1">
        <DailyBriefingClient tripId={trip.id} />
      </div>
    </div>
  );
}

    