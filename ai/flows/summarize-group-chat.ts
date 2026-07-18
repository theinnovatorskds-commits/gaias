'use server';
/**
 * @fileOverview This file defines a Genkit flow for summarizing group chat conversations.
 *
 * - summarizeGroupChat - A function to summarize group chat content.
 * - SummarizeGroupChatInput - The input type for the summarizeGroupChat function, expects chat history as a string.
 * - SummarizeGroupChatOutput - The output type for the summarizeGroupChat function, returns a summary string.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeGroupChatInputSchema = z.object({
  chatHistory: z.string().describe('The complete chat history of the group chat.'),
});
export type SummarizeGroupChatInput = z.infer<typeof SummarizeGroupChatInputSchema>;

const SummarizeGroupChatOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the group chat conversation.'),
});
export type SummarizeGroupChatOutput = z.infer<typeof SummarizeGroupChatOutputSchema>;

export async function summarizeGroupChat(input: SummarizeGroupChatInput): Promise<SummarizeGroupChatOutput> {
  return summarizeGroupChatFlow(input);
}

const summarizeGroupChatPrompt = ai.definePrompt({
  name: 'summarizeGroupChatPrompt',
  input: {schema: SummarizeGroupChatInputSchema},
  output: {schema: SummarizeGroupChatOutputSchema},
  prompt: `Summarize the following group chat conversation. Focus on key decisions, important information, and action items.\n\nChat History:\n{{{chatHistory}}}`,
});

const summarizeGroupChatFlow = ai.defineFlow(
  {
    name: 'summarizeGroupChatFlow',
    inputSchema: SummarizeGroupChatInputSchema,
    outputSchema: SummarizeGroupChatOutputSchema,
  },
  async input => {
    const {output} = await summarizeGroupChatPrompt(input);
    return output!;
  }
);
