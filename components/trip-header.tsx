'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LayoutDashboard,
  List,
  Briefcase,
  Map,
  MessageSquare,
} from 'lucide-react';

export function TripHeader({ tripId }: { tripId: string }) {
  const pathname = usePathname();

  const tabs = [
    {
      name: 'Overview',
      href: `/trips/${tripId}`,
      icon: LayoutDashboard,
      isActive: pathname === `/trips/${tripId}`,
    },
    {
      name: 'Itinerary',
      href: `/trips/${tripId}/itinerary`,
      icon: List,
      isActive: pathname.startsWith(`/trips/${tripId}/itinerary`),
    },
    {
      name: 'Map',
      href: `/trips/${tripId}/map`,
      icon: Map,
      isActive: pathname.startsWith(`/trips/${tripId}/map`),
    },
    {
      name: 'Bookings',
      href: `/trips/${tripId}/bookings`,
      icon: Briefcase,
      isActive: pathname.startsWith(`/trips/${tripId}/bookings`),
    },
    {
      name: 'Chat',
      href: `/trips/${tripId}/chat`,
      icon: MessageSquare,
      isActive: pathname.startsWith(`/trips/${tripId}/chat`),
    },
  ];

  const activeTab = tabs.find((tab) => tab.isActive)?.name || 'Overview';

  return (
    <div className="border-b">
      <Tabs value={activeTab} className="p-4 md:p-6">
        <TabsList className="grid w-full grid-cols-2 sm:w-auto sm:grid-cols-5">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.name} value={tab.name} asChild>
              <Link href={tab.href}>
                <tab.icon className="mr-2 h-4 w-4" />
                {tab.name}
              </Link>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
