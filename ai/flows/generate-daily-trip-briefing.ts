'use server';
/**
 * @fileOverview Generates a structured daily trip briefing using AI.
 *
 * - generateDailyTripBriefing - A function that generates the daily trip briefing.
 * - GenerateDailyTripBriefingInput - The input type for the generateDailyTripBriefing function.
 * - GenerateDailyTripBriefingOutput - The return type for the generateDailyTripBriefing function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDailyTripBriefingInputSchema = z.object({
  tripDetails: z.string().describe('Details about the trip, including destination and dates.'),
  itinerary: z.string().describe('The itinerary for the day, including place references, arrival times, and expected durations.'),
  chatSummary: z.string().describe('A summary of the group chat related to the trip.'),
  bookings: z.string().describe('Information about bookings, including provider, reference, type, and status.'),
  weather: z.string().describe('The weather forecast for the day at the destination.'),
  offers: z.string().describe('Available offers and links related to the trip.'),
});
export type GenerateDailyTripBriefingInput = z.infer<typeof GenerateDailyTripBriefingInputSchema>;

const GenerateDailyTripBriefingOutputSchema = z.object({
  briefing: z.string().describe('A structured daily trip briefing with optimized recommendations.'),
});
export type GenerateDailyTripBriefingOutput = z.infer<typeof GenerateDailyTripBriefingOutputSchema>;

export async function generateDailyTripBriefing(input: GenerateDailyTripBriefingInput): Promise<GenerateDailyTripBriefingOutput> {
  return generateDailyTripBriefingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDailyTripBriefingPrompt',
  input: {schema: GenerateDailyTripBriefingInputSchema},
  output: {schema: GenerateDailyTripBriefingOutputSchema},
  prompt: `You are an AI assistant that generates daily trip briefings for users.

  Consider the following information to create a concise and helpful briefing:

  Trip Details: {{{tripDetails}}}
  Itinerary: {{{itinerary}}}
  Chat Summary: {{{chatSummary}}}
  Bookings: {{{bookings}}}
  Weather: {{{weather}}}
  Offers: {{{offers}}}

  Provide a structured briefing with optimized recommendations based on the available information.
  Focus on what is most important for the user to know for the day.
`,
});

const generateDailyTripBriefingFlow = ai.defineFlow(
  {
    name: 'generateDailyTripBriefingFlow',
    inputSchema: GenerateDailyTripBriefingInputSchema,
    outputSchema: GenerateDailyTripBriefingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
