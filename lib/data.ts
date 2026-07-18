import type { User, Place, Trip, ItineraryItem, ChatMessage, Booking, Offer, Review } from './types';

export const users: User[] = [
  { id: 'user-1', name: 'Alex', avatar: 'user-avatar-1' },
  { id: 'user-2', name: 'Sam', avatar: 'user-avatar-2' },
  { id: 'user-3', name: 'Taylor', avatar: 'user-avatar-3' },
  { id: 'user-4', name: 'Jordan', avatar: 'user-avatar-4' },
];

export const places: Place[] = [
  {
    id: 'place-1',
    name: 'Fushimi Inari Shrine',
    description: 'A vital Shinto shrine in southern Kyoto, famous for its thousands of vermilion torii gates, which straddle a network of trails behind its main buildings.',
    category: 'Shrine',
    openingHours: '24/7',
    images: ['fushimi-inari'],
    website: 'http://inari.jp/',
    location: { lat: 34.9671, lng: 135.7726 },
    specialOffer: 'Walk through thousands of iconic vermilion torii gates on a spiritual hike.',
    isTopDestination: true,
  },
  {
    id: 'place-2',
    name: 'Arashiyama Bamboo Grove',
    description: 'One of Kyoto\'s top sights and for good reason: standing amid these soaring stalks of bamboo is like being in another world.',
    category: 'Nature',
    openingHours: '24/7',
    images: ['arashiyama-bamboo'],
    website: 'https://kyoto.travel/en/shrine_temple/173.html',
    location: { lat: 35.017, lng: 135.675 },
    specialOffer: 'Get lost in a magical bamboo forest and visit the nearby Tenryu-ji Temple.',
    isTopDestination: true,
  },
  {
    id: 'place-3',
    name: 'Golden Temple',
    description: 'A Zen Buddhist temple in northern Kyoto whose top two floors are completely covered in gold leaf.',
    category: 'Temple',
    openingHours: '9:00 AM - 5:00 PM',
    images: ['kinkaku-ji'],
    website: 'https://www.shokoku-ji.jp/en/kinkakuji/',
    location: { lat: 35.0394, lng: 135.7292 },
    specialOffer: 'Witness the stunning Golden Pavilion reflected in the mirror pond.',
    isTopDestination: true,
  },
  {
    id: 'place-4',
    name: 'Colosseum',
    description: 'An oval amphitheatre in the centre of the city of Rome, Italy. Built of travertine, tuff, and brick-faced concrete, it was the largest amphitheatre ever built.',
    category: 'Historic Site',
    openingHours: '9:00 AM - 7:15 PM',
    images: ['colosseum'],
    website: 'https://www.colosseo.it/en/',
    location: { lat: 41.8902, lng: 12.4922 },
    specialOffer: 'Step back in time with skip-the-line access to the ancient Roman amphitheater.',
    isTopDestination: true,
  },
  {
    id: 'place-5',
    name: 'Mount Fitz Roy',
    description: 'A mountain in Patagonia, on the border between Argentina and Chile. It is located in the Southern Patagonian Ice Field, near El Chaltén village and Viedma Lake.',
    category: 'Mountain',
    openingHours: '24/7',
    images: ['mount-fitz-roy'],
    website: 'https://www.losglaciares.com/en/elchalten/fitzroy.html',
    location: { lat: -49.2717, lng: -73.0438 },
    specialOffer: 'Embark on a world-class trek to the base of this iconic Patagonian peak.',
    isTopDestination: true,
  },
  {
    id: 'place-6',
    name: 'Eiffel Tower',
    description: 'A wrought-iron lattice tower on the Champ de Mars in Paris, France. It is named after the engineer Gustave Eiffel, whose company designed and built the tower.',
    category: 'Paris, France',
    openingHours: '9:30 AM - 10:45 PM',
    images: ['eiffel-tower'],
    website: 'https://www.toureiffel.paris/en',
    location: { lat: 48.8584, lng: 2.2945 },
    specialOffer: 'Enjoy priority access and a guided tour to the summit for breathtaking panoramic views of Paris.',
    isTopDestination: true,
  },
  {
    id: 'place-7',
    name: 'Pyramids of Giza',
    description: 'The Great Pyramid of Giza is the largest Egyptian pyramid and the tomb of Fourth Dynasty pharaoh Khufu. It is the oldest of the Seven Wonders of the Ancient World.',
    category: 'Giza, Egypt',
    openingHours: '8:00 AM - 5:00 PM',
    images: ['giza-pyramids'],
    website: 'https://egymonuments.gov.eg/monuments/pyramids-of-giza/',
    location: { lat: 29.9792, lng: 31.1342 },
    specialOffer: 'Experience a camel ride at sunset with the magnificent pyramids as your backdrop.',
    isTopDestination: true,
  },
  {
    id: 'place-8',
    name: 'Taj Mahal',
    description: 'An ivory-white marble mausoleum on the south bank of the Yamuna river in the Indian city of Agra. It was commissioned in 1632 by the Mughal emperor Shah Jahan.',
    category: 'Agra, India',
    openingHours: '6:00 AM - 6:30 PM (Closed Fridays)',
    images: ['taj-mahal'],
    website: 'https://www.tajmahal.gov.in/',
    location: { lat: 27.1751, lng: 78.0421 },
    specialOffer: 'Take a private, sunrise tour to witness the monument\'s beauty in the soft morning light, avoiding the crowds.',
    isTopDestination: true,
  }
];

export const trips: Trip[] = [
  {
    id: 'trip-1',
    destination: 'Kyoto, Japan',
    startDate: '2024-10-15',
    endDate: '2024-10-22',
    coverImage: 'kyoto-cover',
    description: 'An autumn adventure exploring the ancient temples and vibrant culture of Kyoto.',
    isPublic: true,
    participants: [users[0], users[1], users[2]],
  },
  {
    id: 'trip-2',
    destination: 'Patagonia, Argentina',
    startDate: '2025-02-20',
    endDate: '2025-03-05',
    coverImage: 'patagonia-cover',
    description: 'Trekking through the breathtaking landscapes of the Andes.',
    isPublic: false,
    participants: [users[0], users[3]],
  },
  {
    id: 'trip-3',
    destination: 'Rome, Italy',
    startDate: '2024-09-05',
    endDate: '2024-09-12',
    coverImage: 'rome-cover',
    description: 'A journey through history, art, and delicious food in the Eternal City.',
    isPublic: true,
    participants: [users[1], users[2]],
  },
];

export const itineraryItems: ItineraryItem[] = [
  { id: 'item-1', tripId: 'trip-1', placeId: 'place-1', day: 1, startTime: '09:00', duration: 180, notes: 'Start early to avoid crowds.', checkedIn: true },
  { id: 'item-2', tripId: 'trip-1', placeId: 'place-2', day: 2, startTime: '10:00', duration: 120, checkedIn: false },
  { id: 'item-3', tripId: 'trip-1', placeId: 'place-3', day: 2, startTime: '14:00', duration: 90, notes: 'Golden hour photography!', checkedIn: false },
  { id: 'item-4', tripId: 'trip-3', placeId: 'place-4', day: 1, startTime: '11:00', duration: 240, notes: 'Book tickets online beforehand.', checkedIn: false },
  { id: 'item-5', tripId: 'trip-2', placeId: 'place-5', day: 3, startTime: '06:00', duration: 480, notes: 'Full day hike. Pack lunch.', checkedIn: false },
];

export const chatMessages: ChatMessage[] = [
    { id: 'msg-1', tripId: 'trip-1', userId: 'user-1', timestamp: '2024-10-15T08:30:00Z', content: "I'm so excited for Fushimi Inari today!" },
    { id: 'msg-2', tripId: 'trip-1', userId: 'user-2', timestamp: '2024-10-15T08:32:00Z', content: "Me too! Should we grab breakfast near the station?" },
    { id: 'msg-3', tripId: 'trip-1', userId: 'user-3', timestamp: '2024-10-15T08:35:00Z', content: "Good idea. I found a cool cafe, sending the link." },
    { id: 'msg-4', tripId: 'trip-1', userId: 'user-1', timestamp: '2024-10-16T11:00:00Z', content: "The bamboo grove is unreal! 🎋" },
];

export const bookings: Booking[] = [
  { id: 'booking-1', tripId: 'trip-1', provider: 'Japan Airlines', reference: 'JAL-XYZ789', type: 'Flight', status: 'Confirmed', details: 'Round trip from SFO to KIX.' },
  { id: 'booking-2', tripId: 'trip-1', provider: 'Hotel Gracery Kyoto', reference: 'HG-12345', type: 'Hotel', status: 'Confirmed', details: '5 nights, double room.' },
  { id: 'booking-3', tripId: 'trip-3', provider: 'Alitalia', reference: 'AZ-ABCDE', type: 'Flight', status: 'Confirmed', details: 'One-way from JFK to FCO.' },
];

export const offers: Offer[] = [
    { id: 'offer-1', tripId: 'trip-1', source: 'Klook', title: 'Klook Pass Kyoto', price: 35, currency: 'USD', link: 'https://www.klook.com/en-US/activity/76356-klook-pass-kyoto/', notes: 'Includes entry to multiple attractions.' },
    { id: 'offer-2', tripId: 'trip-1', source: 'Viator', title: 'Gion Night Walking Tour', price: 55, currency: 'USD', link: 'https://www.viator.com/tours/Kyoto/Gion-Night-Walking-Tour/d332-24145P2', notes: 'Explore the historic Gion district by night.' },
    { id: 'offer-3', tripId: 'trip-3', source: 'Booking.com', title: 'Colosseum, Roman Forum, Palatine Hill Tour', price: 80, currency: 'USD', link: 'https://www.booking.com/attractions/it/ar1yq0r1yq0r.html', notes: 'Guided tour of ancient Rome\'s most famous sites.' },
];

export const reviews: Review[] = [
  { id: 'review-1', placeId: 'place-1', userId: 'user-1', rating: 5, comment: 'Absolutely breathtaking! The hike up is worth it. Go early to avoid the crowds.', timestamp: '2024-07-10T10:00:00Z' },
  { id: 'review-2', placeId: 'place-1', userId: 'user-3', rating: 4, comment: 'A must-see in Kyoto. It gets very crowded later in the day, but the atmosphere is magical.', timestamp: '2024-06-22T14:20:00Z' },
  { id: 'review-3', placeId: 'place-4', userId: 'user-2', rating: 5, comment: 'Walking through history. It\'s hard to believe how old it is. Book tickets in advance to skip the massive line.', timestamp: '2024-05-15T09:30:00Z' },
  { id: 'review-4', placeId: 'place-2', userId: 'user-4', rating: 5, comment: 'Felt like walking into another world. So peaceful and beautiful.', timestamp: '2024-07-01T11:00:00Z' },
];
