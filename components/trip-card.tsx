import Link from 'next/link';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { Trip } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { format, parseISO } from 'date-fns';
import { Calendar, Globe } from 'lucide-react';
import { users } from '@/lib/data';

export function TripCard({ trip }: { trip: Trip }) {
  const coverImage = PlaceHolderImages.find((img) => img.id === trip.coverImage);

  const getAvatar = (avatarId: string) => {
    return PlaceHolderImages.find((img) => img.id === avatarId);
  }

  const getParticipant = (userId: string) => {
    return users.find(u => u.id === userId);
  }

  return (
    <Card className="flex flex-col overflow-hidden transition-all hover:shadow-lg">
      <Link href={`/trips/${trip.id}`} className="block">
        <CardHeader className="p-0">
          <div className="relative h-48 w-full">
            {coverImage && (
              <Image
                src={coverImage.imageUrl}
                alt={trip.destination}
                fill
                className="object-cover"
                data-ai-hint={coverImage.imageHint}
              />
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <Badge variant={trip.isPublic ? 'secondary' : 'outline'} className="mb-2">
            <Globe className="mr-1 h-3 w-3" />
            {trip.isPublic ? 'Public' : 'Private'}
          </Badge>
          <CardTitle className="text-xl font-headline tracking-tight">
            {trip.destination}
          </CardTitle>
          <CardDescription className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              {format(parseISO(trip.startDate), 'MMM d')} - {format(parseISO(trip.endDate), 'MMM d, yyyy')}
            </span>
          </CardDescription>
        </CardContent>
      </Link>
      <CardFooter className="mt-auto flex items-center justify-between p-4 pt-0">
        <div className="flex -space-x-2 overflow-hidden">
          {trip.participants.map((participant) => {
            const avatar = getAvatar(participant.avatar);
            return (
              <Avatar key={participant.id} className="h-8 w-8 border-2 border-card">
                <AvatarImage src={avatar?.imageUrl} alt={participant.name} data-ai-hint={avatar?.imageHint} />
                <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
              </Avatar>
            );
          })}
        </div>
      </CardFooter>
    </Card>
  );
}
