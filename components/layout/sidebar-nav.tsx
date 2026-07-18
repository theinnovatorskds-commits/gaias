'use client';

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import {
  Compass,
  Bot,
  MessageSquare,
  Sparkles,
  LayoutDashboard,
  Plane,
  Globe,
  TramFront,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function SidebarNav() {
  const pathname = usePathname();

  const menuItems = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      isActive: pathname === '/dashboard',
    },
    {
      href: '/trips',
      label: 'My Trips',
      icon: Compass,
      isActive: pathname.startsWith('/trips'),
    },
    {
      href: '/explore',
      label: 'Explore',
      icon: Globe,
      isActive: pathname.startsWith('/explore'),
    },
    {
      href: '/flights',
      label: 'Flights',
      icon: Plane,
      isActive: pathname.startsWith('/flights'),
    },
    {
      href: '/transport',
      label: 'Transportation',
      icon: TramFront,
      isActive: pathname.startsWith('/transport'),
    },
    {
      href: '/chat',
      label: 'Group Chat',
      icon: MessageSquare,
      isActive: pathname.startsWith('/chat'),
    },
    {
      href: '/offers',
      label: 'Offers',
      icon: Sparkles,
      isActive: pathname.startsWith('/offers'),
    },
    {
      href: '/chatbot',
      label: 'AI Planner',
      icon: Bot,
      isActive: pathname.startsWith('/chatbot'),
    },
  ];

  return (
    <SidebarMenu>
      {menuItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            asChild
            isActive={item.isActive}
            tooltip={{ children: item.label }}
          >
            <Link href={item.href}>
              <item.icon />
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
