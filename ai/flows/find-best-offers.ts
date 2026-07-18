'use server';

/**
 * @fileOverview AI flow to find personalized travel offers based on user preferences.
 *
 * - findBestOffers - A function that finds the best travel offers.
 * - FindBestOffersInput - The input type for the findBestOffers function.
 * - FindBestOffersOutput - The return type for the findBestOffers function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FindBestOffersInputSchema = z.object({
  userPreferences: z
    .string()
    .describe('The user preferences for travel, including desired destination, dates, budget, and interests.'),
});
export type FindBestOffersInput = z.infer<typeof FindBestOffersInputSchema>;

const OfferSchema = z.object({
  source: z.string().describe('The source of the offer (e.g., Expedia, Booking.com).'),
  title: z.string().describe('The title of the offer.'),
  price: z.number().describe('The price of the offer in USD.'),
  currency: z.enum(['USD']).describe('The currency of the offer, which must be USD.'),
  link: z.string().url().describe('The URL to the offer.'),
  notes: z.string().optional().describe('Additional notes about the offer.'),
});

const FindBestOffersOutputSchema = z.array(OfferSchema).describe('An array of travel offers.');
export type FindBestOffersOutput = z.infer<typeof FindBestOffersOutputSchema>;

export async function findBestOffers(input: FindBestOffersInput): Promise<FindBestOffersOutput> {
  return findBestOffersFlow(input);
}

const findBestOffersPrompt = ai.definePrompt({
  name: 'findBestOffersPrompt',
  input: {schema: FindBestOffersInputSchema},
  output: {schema: FindBestOffersOutputSchema},
  prompt: `You are a travel expert who finds the best travel offers for users based on their preferences.\n\nUser Preferences: {{{userPreferences}}}\n\nFind relevant travel offers based on the user preferences. Return a list of offers, including the source, title, price, currency, link, and any relevant notes. All prices MUST be in USD. The price should be a number. Ensure the generated links are valid, complete, and functional URLs starting with https://. The URLs must not contain any spaces or invalid characters. Provide at least three distinct travel offers.\n\nOffers: `,
});

const findBestOffersFlow = ai.defineFlow(
  {
    name: 'findBestOffersFlow',
    inputSchema: FindBestOffersInputSchema,
    outputSchema: FindBestOffersOutputSchema,
  },
  async input => {
    const {output} = await findBestOffersPrompt(input);
    return output!;
  }
);
