'use server';

/**
 * @fileOverview AI flow to find flight deals based on user criteria.
 *
 * - findFlights - A function that finds flight deals.
 * - FindFlightsInput - The input type for the findFlights function.
 * - FindFlightsOutput - The return type for the findFlights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FindFlightsInputSchema = z.object({
  from: z.string().describe('The departure city or airport code (e.g., JFK).'),
  to: z.string().describe('The arrival city or airport code (e.g., LHR).'),
  departDate: z.string().describe('The departure date in YYYY-MM-DD format.'),
  returnDate: z.string().describe('The return date in YYYY-MM-DD format for a round trip.'),
});
export type FindFlightsInput = z.infer<typeof FindFlightsInputSchema>;

const FlightOfferSchema = z.object({
  airline: z.string().describe('The name of the airline (e.g., United Airlines, British Airways).'),
  flightNumber: z.string().describe('The flight number (e.g., UA249).'),
  price: z.number().describe('The total price of the flight for one adult in USD.'),
  currency: z.enum(['USD']).describe('The currency of the price, which must be USD.'),
  link: z.string().url().describe('A fictional booking link to a major travel aggregator.'),
  departureTime: z.string().describe('The departure time in HH:mm format.'),
  arrivalTime: z.string().describe('The arrival time in HH:mm format.'),
  duration: z.string().describe('The total flight duration (e.g., "7h 30m").'),
  stops: z.number().describe('The number of stops.'),
});

const FindFlightsOutputSchema = z.array(FlightOfferSchema).describe('An array of flight offers.');
export type FindFlightsOutput = z.infer<typeof FindFlightsOutputSchema>;

export async function findFlights(input: FindFlightsInput): Promise<FindFlightsOutput> {
  return findFlightsFlow(input);
}

const findFlightsPrompt = ai.definePrompt({
  name: 'findFlightsPrompt',
  input: {schema: FindFlightsInputSchema},
  output: {schema: FindFlightsOutputSchema},
  prompt: `You are an expert flight search engine. Your task is to find flight options based on the user's criteria.

User Request:
- From: {{{from}}}
- To: {{{to}}}
- Depart: {{{departDate}}}
- Return: {{{returnDate}}}

Generate a list of at least 5 realistic, fictional flight options from major, real-world airlines (like United, Delta, American Airlines, British Airways, Lufthansa, etc.).
Ensure the prices are realistic for the given route and are in USD.
The booking link must be a valid, complete, and fictional URL starting with https:// for a known travel aggregator like Google Flights, Kayak, or Expedia. The URL must not contain any spaces.
Return the results as a JSON array of flight offers.
`,
});

const findFlightsFlow = ai.defineFlow(
  {
    name: 'findFlightsFlow',
    inputSchema: FindFlightsInputSchema,
    outputSchema: FindFlightsOutputSchema,
  },
  async input => {
    const {output} = await findFlightsPrompt(input);
    return output!;
  }
);
