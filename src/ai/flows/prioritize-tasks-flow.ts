'use server';
/**
 * @fileOverview An AI flow to re-prioritize a list of tasks.
 *
 * - prioritizeTasks - A function that analyzes tasks and assigns new priorities.
 * - PrioritizeTasksInput - The input for the flow.
 * - PrioritizeTasksOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TaskInfoSchema = z.object({
  id: z.string().describe('The unique identifier for the task.'),
  title: z.string().describe('The title of the task.'),
  description: z.string().optional().describe('The description of the task.'),
});

export const PrioritizeTasksInputSchema = z.object({
  tasks: z.array(TaskInfoSchema).describe('The list of tasks to be prioritized.'),
});
export type PrioritizeTasksInput = z.infer<typeof PrioritizeTasksInputSchema>;

const PrioritizedTaskSchema = z.object({
  id: z.string().describe('The unique identifier for the task.'),
  priority: z
    .enum(['High', 'Medium', 'Low'])
    .describe('The AI-assigned priority for the task.'),
});

const PrioritizeTasksOutputSchema = z.object({
  prioritizedTasks: z
    .array(PrioritizedTaskSchema)
    .describe('The list of tasks with their new priorities.'),
});
export type PrioritizeTasksOutput = z.infer<typeof PrioritizeTasksOutputSchema>;

const prompt = ai.definePrompt({
  name: 'prioritizeTasksPrompt',
  input: {schema: PrioritizeTasksInputSchema},
  output: {schema: PrioritizeTasksOutputSchema},
  prompt: `You are an expert project manager. Your goal is to intelligently prioritize a list of tasks.
    
Analyze the provided list of tasks, paying close attention to keywords in the title and description that imply urgency or importance (e.g., "bug", "urgent", "critical", "ASAP" vs. "plan", "research", "later").

Based on your analysis, assign a priority (High, Medium, or Low) to each task.
Return the full list of tasks with their newly assigned priorities.

Tasks to prioritize:
{{#each tasks}}
- ID: {{id}}, Title: "{{title}}", Description: "{{description}}"
{{/each}}
`,
});

const prioritizeTasksFlow = ai.defineFlow(
  {
    name: 'prioritizeTasksFlow',
    inputSchema: PrioritizeTasksInputSchema,
    outputSchema: PrioritizeTasksOutputSchema,
  },
  async (input) => {
    if (input.tasks.length === 0) {
      return {prioritizedTasks: []};
    }

    const {output} = await prompt(input);
    return output!;
  }
);

export async function prioritizeTasks(
  input: PrioritizeTasksInput
): Promise<PrioritizeTasksOutput> {
  return prioritizeTasksFlow(input);
}
