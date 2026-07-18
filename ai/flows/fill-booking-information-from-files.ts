'use server';
/**
 * @fileOverview An AI agent that extracts booking information from attached files.
 *
 * - fillBookingInformation - A function that handles the booking information extraction process.
 * - FillBookingInformationInput - The input type for the fillBookingInformation function.
 * - FillBookingInformationOutput - The return type for the fillBookingInformation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FillBookingInformationInputSchema = z.object({
  fileDataUri: z
    .string()
    .describe(
      'The file data URI (e.g., ticket image or PDF) from which to extract booking information. The data URI must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' /* TODO:  */
    ),
});
export type FillBookingInformationInput = z.infer<
  typeof FillBookingInformationInputSchema
>;

const FillBookingInformationOutputSchema = z.object({
  provider: z.string().describe('The booking provider (e.g., airline, hotel).'),
  reference: z.string().describe('The booking reference number or code.'),
  type: z.string().describe('The type of booking (e.g., flight, hotel, car rental).'),
  status: z.string().describe('The current status of the booking (e.g., confirmed, pending, cancelled).'),
  details: z.string().describe('A summary of the booking details.'),
});

export type FillBookingInformationOutput = z.infer<
  typeof FillBookingInformationOutputSchema
>;

export async function fillBookingInformation(
  input: FillBookingInformationInput
): Promise<FillBookingInformationOutput> {
  return fillBookingInformationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'fillBookingInformationPrompt',
  input: {schema: FillBookingInformationInputSchema},
  output: {schema: FillBookingInformationOutputSchema},
  prompt: `You are an expert at extracting booking information from files.

  Please extract the following information from the attached file and return it in JSON format.  If you can't, return a JSON with empty strings.

  - Provider: The booking provider (e.g., airline, hotel).
  - Reference: The booking reference number or code.
  - Type: The type of booking (e.g., flight, hotel, car rental).
  - Status: The current status of the booking (e.g., confirmed, pending, cancelled).
  - Details: A summary of the booking details.

  Here is the file: {{media url=fileDataUri}}
  `,
});

const fillBookingInformationFlow = ai.defineFlow(
  {
    name: 'fillBookingInformationFlow',
    inputSchema: FillBookingInformationInputSchema,
    outputSchema: FillBookingInformationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
