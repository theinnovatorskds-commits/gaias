import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { bookings, trips } from '@/lib/data';
import { notFound } from 'next/navigation';
import {
  Briefcase,
  CheckCircle,
  Clock,
  FileText,
  Paperclip,
  XCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const statusIcons = {
  Confirmed: <CheckCircle className="h-4 w-4 text-green-500" />,
  Pending: <Clock className="h-4 w-4 text-yellow-500" />,
  Cancelled: <XCircle className="h-4 w-4 text-red-500" />,
};

export default function BookingsPage({ params }: { params: { id: string } }) {
  const resolvedParams = React.use(params);
  const trip = trips.find((t) => t.id === resolvedParams.id);
  if (!trip) {
    notFound();
  }

  const tripBookings = bookings.filter((b) => b.tripId === trip.id);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bookings Vault</CardTitle>
        <CardDescription>
          All your travel documents and confirmations in one place.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {tripBookings.length > 0 ? (
          <div className="space-y-4">
            {tripBookings.map((booking) => (
              <Card key={booking.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
                <div className="md:col-span-2">
                  <div className="flex items-center gap-3">
                    <Briefcase className="h-5 w-5 text-muted-foreground" />
                    <h3 className="font-semibold text-lg">{booking.provider}</h3>
                    <Badge variant="secondary">{booking.type}</Badge>
                  </div>
                  <p className="text-muted-foreground text-sm mt-1">Ref: {booking.reference}</p>
                  <p className="mt-2">{booking.details}</p>
                </div>
                <div className="flex flex-col items-start md:items-end justify-between gap-2">
                    <div className='flex items-center gap-2'>
                        {statusIcons[booking.status]}
                        <span className="font-medium">{booking.status}</span>
                    </div>
                    {booking.fileUrl && (
                        <Button variant="outline" asChild>
                            <a href={booking.fileUrl} target='_blank' rel='noopener noreferrer'>
                                <FileText className='mr-2' /> View Document
                            </a>
                        </Button>
                    )}
                </div>
              </Card>
            ))}
             <div className="flex justify-center pt-4">
                <Button>
                    <Paperclip className="mr-2" />
                    Add New Booking
                </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 p-12 text-center">
            <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-xl font-semibold">No Bookings Found</h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground">
              Add your flight, hotel, and other bookings to keep them organized.
            </p>
            <Button>
              <Paperclip className="mr-2" />
              Add Booking
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

    