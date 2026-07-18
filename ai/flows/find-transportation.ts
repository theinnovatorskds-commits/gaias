'use server';

/**
 * @fileOverview AI flow to find transportation options to a specific attraction.
 *
 * - findTransportation - A function that finds transportation options.
 * - FindTransportationInput - The input type for the findTransportation function.
 * - FindTransportationOutput - The return type for the findTransportation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FindTransportationInputSchema = z.object({
  attraction: z.string().describe('The name of the attraction or destination.'),
  currentLocation: z.string().optional().describe('The user\'s current location (e.g., "Shibuya Station, Tokyo" or "downtown Kyoto"). Defaults to a central point if not provided.'),
});
export type FindTransportationInput = z.infer<typeof FindTransportationInputSchema>;

const TransportationOptionSchema = z.object({
  type: z.string().describe('The mode of transport (e.g., "Train", "Bus", "Taxi", "Subway", "Walking").'),
  details: z.string().describe('Specific details about the route, like line names, transfer points, or service providers (e.g., "JR Yamanote Line to Shinjuku, then Chuo Line").'),
  estimatedTime: z.string().describe('The estimated travel time (e.g., "Approx. 45 minutes").'),
  estimatedCost: z.string().describe('The estimated cost for a single trip (e.g., "¥200", "$15 - $20", "Free").'),
  notes: z.string().optional().describe('Any additional notes, such as frequency, tips, or what to look for.'),
});

const FindTransportationOutputSchema = z.array(TransportationOptionSchema).describe('An array of transportation options.');
export type FindTransportationOutput = z.infer<typeof FindTransportationOutputSchema>;

export async function findTransportation(input: FindTransportationInput): Promise<FindTransportationOutput> {
  return findTransportationFlow(input);
}

const findTransportationPrompt = ai.definePrompt({
  name: 'findTransportationPrompt',
  input: {schema: FindTransportationInputSchema},
  output: {schema: FindTransportationOutputSchema},
  prompt: `You are a local transit expert. A user wants to know how to get to a specific attraction.

Attraction: {{{attraction}}}
{{#if currentLocation}}
Current Location: {{{currentLocation}}}
{{/if}}

Please provide a list of practical transportation options to get to the attraction. For each option, include the mode of transport, specific route details, estimated travel time, and estimated cost. Provide realistic, fictional details for a major city context if the location is ambiguous. Include at least three different types of options (e.g., train, bus, taxi, walking if close).
`,
});

const findTransportationFlow = ai.defineFlow(
  {
    name: 'findTransportationFlow',
    inputSchema: FindTransportationInputSchema,
    outputSchema: FindTransportationOutputSchema,
  },
  async input => {
    const {output} = await findTransportationPrompt(input);
    return output!;
  }
);
