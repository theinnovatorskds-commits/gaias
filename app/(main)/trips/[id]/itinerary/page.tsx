import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { itineraryItems, places, trips } from '@/lib/data';
import { CheckCircle2, Circle, Clock, MapPin, PlusCircle, StickyNote, TramFront } from 'lucide-react';
import { notFound } from 'next/navigation';
import { parseISO } from 'date-fns';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import React from 'react';

export default function ItineraryPage({ params }: { params: { id: string } }) {
  const resolvedParams = React.use(params);
  const trip = trips.find((t) => t.id === resolvedParams.id);
  if (!trip) {
    notFound();
  }

  const tripItinerary = itineraryItems.filter((item) => item.tripId === trip.id);

  const days = Array.from(
    new Set(tripItinerary.map((item) => item.day))
  ).sort((a, b) => a - b);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Trip Itinerary</CardTitle>
        <Button size="sm">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Place
        </Button>
      </CardHeader>
      <CardContent>
        {days.length > 0 ? (
          <Accordion type="single" collapsible defaultValue={`day-${days[0]}`}>
            {days.map((day) => {
              const dayItems = tripItinerary.filter((item) => item.day === day);
              const tripStartDate = parseISO(trip.startDate);
              const dayDate = new Date(new Date(tripStartDate).setDate(tripStartDate.getDate() + day - 1));
              const sortedDayItems = dayItems.sort((a, b) => a.startTime.localeCompare(b.startTime));

              return (
                <AccordionItem key={day} value={`day-${day}`}>
                  <AccordionTrigger>
                    <div className="flex w-full items-center justify-between pr-4">
                      <span className="text-lg font-semibold">
                        Day {day}
                      </span>
                       <span className="text-sm text-muted-foreground">{dayDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      {sortedDayItems
                        .map((item, index) => {
                          const place = places.find(
                            (p) => p.id === item.placeId
                          );
                          if (!place) return null;
                          const placeImage = PlaceHolderImages.find(
                            (img) => img.id === place.images[0]
                          );

                          return (
                            <React.Fragment key={item.id}>
                                <Card className="flex flex-col md:flex-row overflow-hidden">
                                {placeImage && (
                                    <div className="relative h-48 md:h-auto md:w-48 flex-shrink-0">
                                    <Image
                                        src={placeImage.imageUrl}
                                        alt={place.name}
                                        fill
                                        className="object-cover"
                                        data-ai-hint={placeImage.imageHint}
                                    />
                                    </div>
                                )}
                                <div className="p-4 flex flex-col justify-between">
                                    <div>
                                    <h3 className="font-semibold text-lg">{place.name}</h3>
                                    <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                                        <MapPin className="h-4 w-4" /> {place.category}
                                    </p>
                                    <div className="flex items-center gap-4 mt-2 text-sm">
                                        <Badge variant="outline" className="flex items-center gap-1.5">
                                            <Clock className="h-4 w-4" />
                                            {item.startTime} ({item.duration} min)
                                        </Badge>
                                        {item.checkedIn ? (
                                        <Badge className="bg-green-600 hover:bg-green-700 flex items-center gap-1.5">
                                          <CheckCircle2 className="h-4 w-4" />
                                          Checked-In
                                        </Badge>
                                      ) : (
                                        <Badge variant="secondary" className="flex items-center gap-1.5">
                                            <Circle className="h-3 w-3" />
                                            Pending
                                        </Badge>
                                      )}
                                  </div>
                                  {item.notes && <p className="text-sm mt-3 flex items-start gap-2"><StickyNote className="h-4 w-4 mt-0.5 flex-shrink-0"/><span>{item.notes}</span></p>}
                                </div>
                              </div>
                                </Card>
                                {index < sortedDayItems.length - 1 && (
                                    <div className="flex items-center justify-center my-4">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <TramFront className="h-5 w-5" />
                                            <span>Travel by Train</span>
                                            <span className="text-xs">(approx. 20 min)</span>
                                        </div>
                                    </div>
                                )}
                            </React.Fragment>
                          );
                        })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        ) : (
          <p className="text-muted-foreground">No itinerary items have been added for this trip yet.</p>
        )}
      </CardContent>
    </Card>
  );
}

    