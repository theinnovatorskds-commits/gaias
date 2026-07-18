import Link from 'next/link';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { Place } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { MapPin } from 'lucide-react';
import { Badge } from './ui/badge';

export function PlaceCard({ place }: { place: Place }) {
  const coverImage = PlaceHolderImages.find((img) => img.id === place.images[0]);

  return (
    <Card className="flex flex-col overflow-hidden transition-all hover:shadow-lg">
      <Link href={`/places/${place.id}`} className="block">
        <CardHeader className="p-0">
          <div className="relative h-48 w-full">
            {coverImage && (
              <Image
                src={coverImage.imageUrl}
                alt={place.name}
                fill
                className="object-cover"
                data-ai-hint={coverImage.imageHint}
              />
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4">
            <CardTitle className="text-lg font-headline tracking-tight">
                {place.name}
            </CardTitle>
             <Badge variant="secondary" className="mt-2">
                <MapPin className="mr-1 h-3 w-3" />
                {place.category}
            </Badge>
        </CardContent>
      </Link>
    </Card>
  );
}
