export type Trip = {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  coverImage: string;
  description: string;
  isPublic: boolean;
  participants: User[];
};

export type User = {
  id: string;
  name: string;
  avatar: string;
};

export type Place = {
  id: string;
  name: string;
  description: string;
  category: string;
  openingHours: string;
  images: string[];
  website?: string;
  location: {
    lat: number;
    lng: number;
  };
  specialOffer?: string;
  isTopDestination?: boolean;
};

export type ItineraryItem = {
  id: string;
  tripId: string;
  placeId: string;
  day: number;
  startTime: string; // "HH:mm"
  duration: number; // in minutes
  notes?: string;
  checkedIn: boolean;
};

export type ChatMessage = {
  id: string;
  tripId: string;
  userId: string;
  timestamp: string;
  content: string;
  file?: {
    name: string;
    url: string;
  };
};

export type Offer = {
  id: string;
  tripId: string;
  source: string;
  title: string;
  price: number;
  currency: string;
  link: string;
  notes?: string;
};

export type Booking = {
  id: string;
  tripId: string;
  provider: string;
  reference: string;
  type: 'Flight' | 'Hotel' | 'Car' | 'Other';
  status: 'Confirmed' | 'Pending' | 'Cancelled';
  details: string;
  fileUrl?: string;
};

export type Review = {
  id: string;
  placeId: string;
  userId: string;
  rating: number;
  comment: string;
  timestamp: string;
};
