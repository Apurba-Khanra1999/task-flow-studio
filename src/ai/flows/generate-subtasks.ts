'use server';

/**
 * @fileOverview Generates a list of subtasks for a given task using AI.
 *
 * - generateSubtasks - A function that generates a list of subtasks.
 * - GenerateSubtasksInput - The input for the flow.
 * - GenerateSubtasksOutput - The return type for the generateSubtasks function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const GenerateSubtasksInputSchema = z.object({
  title: z.string().describe('The title of the main task.'),
  description: z.string().describe('The description of the main task.'),
});
export type GenerateSubtasksInput = z.infer<typeof GenerateSubtasksInputSchema>;

const GenerateSubtasksOutputSchema = z.object({
  subtasks: z
    .array(z.string())
    .describe('A list of short, actionable subtask descriptions.'),
});
export type GenerateSubtasksOutput = z.infer<
  typeof GenerateSubtasksOutputSchema
>;

const prompt = ai.definePrompt({
  name: 'generateSubtasksPrompt',
  input: {schema: GenerateSubtasksInputSchema},
  output: {schema: GenerateSubtasksOutputSchema},
  prompt: `You are an expert project manager. Based on the task title and description, break it down into a list of smaller, actionable subtasks. Each subtask should be a short phrase.

    Task Title: {{{title}}}
    Task Description: {{{description}}}

    Generate a list of subtasks. If the description is brief, create general subtasks appropriate for the title.`,
});

const generateSubtasksFlow = ai.defineFlow(
  {
    name: 'generateSubtasksFlow',
    inputSchema: GenerateSubtasksInputSchema,
    outputSchema: GenerateSubtasksOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);

export async function generateSubtasks(
  input: GenerateSubtasksInput
): Promise<GenerateSubtasksOutput> {
  return generateSubtasksFlow(input);
}
