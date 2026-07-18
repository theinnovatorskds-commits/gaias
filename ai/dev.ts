import { config } from 'dotenv';
config();

import '@/ai/flows/find-best-offers.ts';
import '@/ai/flows/fill-booking-information-from-files.ts';
import '@/ai/flows/summarize-group-chat.ts';
import '@/ai/flows/assist-with-trip-planning.ts';
import '@/ai/flows/generate-daily-trip-briefing.ts';
import '@/ai/flows/generate-place-descriptions.ts';
import '@/ai/flows/find-flights.ts';
import '@/ai/flows/find-hotels.ts';
import '@/ai/flows/find-transportation.ts';
