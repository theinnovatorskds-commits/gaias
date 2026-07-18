'use server';

/**
 * @fileOverview An AI chatbot that assists users with planning their trips.
 *
 * - assistWithTripPlanning - A function that handles the trip planning process.
 * - AssistWithTripPlanningInput - The input type for the assistWithTripPlanning function.
 * - AssistWithTripPlanningOutput - The return type for the assistWithTripPlanning function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AssistWithTripPlanningInputSchema = z.object({
  query: z.string().describe('The user query for planning the trip.'),
  tripDetails: z.string().optional().describe('The details of the trip, if available.'),
  itinerary: z.string().optional().describe('The current itinerary, if available.'),
  chatHistory: z.string().optional().describe('The chat history, if available.'),
});
export type AssistWithTripPlanningInput = z.infer<typeof AssistWithTripPlanningInputSchema>;

const AssistWithTripPlanningOutputSchema = z.object({
  response: z.string().describe('The response from the AI chatbot.'),
});
export type AssistWithTripPlanningOutput = z.infer<typeof AssistWithTripPlanningOutputSchema>;

export async function assistWithTripPlanning(input: AssistWithTripPlanningInput): Promise<AssistWithTripPlanningOutput> {
  return assistWithTripPlanningFlow(input);
}

const prompt = ai.definePrompt({
  name: 'assistWithTripPlanningPrompt',
  input: {schema: AssistWithTripPlanningInputSchema},
  output: {schema: AssistWithTripPlanningOutputSchema},
  prompt: `You are an AI chatbot that assists users with planning their trips. You should offer suggestions, answer questions, and provide real-time support.
  Format your response using markdown for better readability. Use headings, lists, and bold text where appropriate.

  The user is asking: {{{query}}}

  Here are the trip details, if available: {{{tripDetails}}}

  Here is the current itinerary, if available: {{{itinerary}}}

  Here is the chat history, if available: {{{chatHistory}}}

  Please provide a helpful and informative response to the user's query.
  `,
});

const assistWithTripPlanningFlow = ai.defineFlow(
  {
    name: 'assistWithTripPlanningFlow',
    inputSchema: AssistWithTripPlanningInputSchema,
    outputSchema: AssistWithTripPlanningOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
