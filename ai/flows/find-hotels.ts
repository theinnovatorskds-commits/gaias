'use server';

/**
 * @fileOverview AI flow to find hotel recommendations for a given destination.
 *
 * - findHotels - A function that finds hotel recommendations.
 * - FindHotelsInput - The input type for the findHotels function.
 * - FindHotelsOutput - The return type for the findHotels function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FindHotelsInputSchema = z.object({
  destination: z.string().describe('The city or area to find hotels in (e.g., "Kyoto, Japan").'),
});
export type FindHotelsInput = z.infer<typeof FindHotelsInputSchema>;

const HotelRecommendationSchema = z.object({
    name: z.string().describe('The name of the hotel.'),
    description: z.string().describe('A brief, appealing description of the hotel, highlighting its key features.'),
    price: z.number().describe('An average price per night in USD.'),
    currency: z.enum(['USD']).describe('The currency of the price, which must be USD.'),
    rating: z.number().min(1).max(5).describe('A star rating from 1 to 5.'),
    bookingLink: z.string().url().describe('A fictional booking link to a major travel aggregator like Booking.com or Expedia.'),
    imageUrl: z.string().url().describe('A URL to a representative image of the hotel.'),
});

const FindHotelsOutputSchema = z.array(HotelRecommendationSchema).describe('An array of hotel recommendations.');
export type FindHotelsOutput = z.infer<typeof FindHotelsOutputSchema>;

export async function findHotels(input: FindHotelsInput): Promise<FindHotelsOutput> {
  return findHotelsFlow(input);
}

const findHotelsPrompt = ai.definePrompt({
  name: 'findHotelsPrompt',
  input: {schema: FindHotelsInputSchema},
  output: {schema: FindHotelsOutputSchema},
  prompt: `You are an expert travel agent specializing in hotel recommendations.

A user is looking for hotels in: {{{destination}}}

Please generate a diverse list of 5 realistic, fictional hotel recommendations. Include a mix of options (e.g., budget-friendly, boutique, luxury).
For each hotel, provide:
- A name.
- A short, enticing description.
- An average price per night in USD.
- A star rating between 1 and 5.
- A fictional but valid-looking booking link to Booking.com, Expedia, or Agoda. The URL must be complete, start with https://, and not contain any spaces.
- A real, publicly accessible image URL from a service like Unsplash that represents the hotel's style (e.g., a modern hotel room, a traditional ryokan interior). The URL must be complete, start with https://, and not contain any spaces.

Return the results as a JSON array.
`,
});

const findHotelsFlow = ai.defineFlow(
  {
    name: 'findHotelsFlow',
    inputSchema: FindHotelsInputSchema,
    outputSchema: FindHotelsOutputSchema,
  },
  async input => {
    const {output} = await findHotelsPrompt(input);
    return output!;
  }
);
