'use server';

/**
 * @fileOverview An AI agent for generating place descriptions.
 *
 * - generatePlaceDescription - A function that generates a description for a place.
 * - GeneratePlaceDescriptionInput - The input type for the generatePlaceDescription function.
 * - GeneratePlaceDescriptionOutput - The return type for the generatePlaceDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePlaceDescriptionInputSchema = z.object({
  name: z.string().describe('The name of the place.'),
  category: z.string().describe('The category of the place (e.g., restaurant, museum, park).'),
  knownFor: z.string().optional().describe('What the place is known for.'),
  location: z.string().describe('A description of the location of the place.'),
});
export type GeneratePlaceDescriptionInput = z.infer<typeof GeneratePlaceDescriptionInputSchema>;

const GeneratePlaceDescriptionOutputSchema = z.object({
  description: z.string().describe('A detailed and engaging description of the place.'),
});
export type GeneratePlaceDescriptionOutput = z.infer<typeof GeneratePlaceDescriptionOutputSchema>;

export async function generatePlaceDescription(
  input: GeneratePlaceDescriptionInput
): Promise<GeneratePlaceDescriptionOutput> {
  return generatePlaceDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePlaceDescriptionPrompt',
  input: {schema: GeneratePlaceDescriptionInputSchema},
  output: {schema: GeneratePlaceDescriptionOutputSchema},
  prompt: `You are a travel writer who specializes in creating engaging and informative descriptions of places.

  Based on the following information, write a detailed description of the place that would entice tourists to visit.

  Name: {{name}}
  Category: {{category}}
  Known For: {{knownFor}}
  Location: {{location}}

  Description:`,
});

const generatePlaceDescriptionFlow = ai.defineFlow(
  {
    name: 'generatePlaceDescriptionFlow',
    inputSchema: GeneratePlaceDescriptionInputSchema,
    outputSchema: GeneratePlaceDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
