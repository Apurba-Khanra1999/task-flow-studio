'use server';

/**
 * @fileOverview Generates a brief, insightful summary of the user's tasks.
 *
 * - generateDashboardSummary - A function that creates a motivational summary.
 * - GenerateDashboardSummaryInput - The input for the flow.
 * - GenerateDashboardSummaryOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const GenerateDashboardSummaryInputSchema = z.object({
  totalTasks: z.number().describe('The total number of tasks.'),
  completedTasks: z.number().describe('The number of completed tasks.'),
  overdueTasks: z.number().describe('The number of tasks that are past their due date.'),
  upcomingTasks: z.number().describe('The number of tasks due in the next 7 days.'),
});
export type GenerateDashboardSummaryInput = z.infer<
  typeof GenerateDashboardSummaryInputSchema
>;

const GenerateDashboardSummaryOutputSchema = z.object({
  summary: z
    .string()
    .describe('A short, insightful, and motivational summary for the user.'),
});
export type GenerateDashboardSummaryOutput = z.infer<
  typeof GenerateDashboardSummaryOutputSchema
>;

const prompt = ai.definePrompt({
  name: 'generateDashboardSummaryPrompt',
  input: {schema: GenerateDashboardSummaryInputSchema},
  output: {schema: GenerateDashboardSummaryOutputSchema},
  prompt: `You are a friendly and encouraging productivity assistant. Based on the following task statistics, write a short, insightful, and motivational summary for the user.

Your tone should be positive and encouraging, even when mentioning overdue tasks.
Keep the summary to 2-3 sentences.

Statistics:
- Total Tasks: {{{totalTasks}}}
- Completed Tasks: {{{completedTasks}}}
- Overdue Tasks: {{{overdueTasks}}}
- Upcoming Tasks: {{{upcomingTasks}}}

Example: "You're making great progress with {{{completedTasks}}} tasks done! You have {{{upcomingTasks}}} tasks coming up. Try to tackle the {{{overdueTasks}}} overdue tasks first to clear your plate. Keep up the great work!"
`,
});

const generateDashboardSummaryFlow = ai.defineFlow(
  {
    name: 'generateDashboardSummaryFlow',
    inputSchema: GenerateDashboardSummaryInputSchema,
    outputSchema: GenerateDashboardSummaryOutputSchema,
  },
  async (input) => {
    // If there are no tasks, return a default message without calling the AI.
    if (input.totalTasks === 0) {
      return {
        summary:
          'No tasks yet! Add a new task to get started and see your progress here.',
      };
    }

    const {output} = await prompt(input);
    return output!;
  }
);

export async function generateDashboardSummary(
  input: GenerateDashboardSummaryInput
): Promise<GenerateDashboardSummaryOutput> {
  return generateDashboardSummaryFlow(input);
}
