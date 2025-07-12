'use server';
/**
 * @fileOverview Generates an image for a task based on its title.
 *
 * - generateTaskImage - A function that generates an image for a task.
 * - GenerateTaskImageInput - The input for the flow.
 * - GenerateTaskImageOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const GenerateTaskImageInputSchema = z.object({
  title: z.string().describe('The title of the task.'),
});
export type GenerateTaskImageInput = z.infer<
  typeof GenerateTaskImageInputSchema
>;

const GenerateTaskImageOutputSchema = z.object({
  imageUrl: z
    .string()
    .describe(
      "The generated image as a data URI. Expected format: 'data:image/png;base64,<encoded_data>'."
    ),
});
export type GenerateTaskImageOutput = z.infer<
  typeof GenerateTaskImageOutputSchema
>;

const generateTaskImageFlow = ai.defineFlow(
  {
    name: 'generateTaskImageFlow',
    inputSchema: GenerateTaskImageInputSchema,
    outputSchema: GenerateTaskImageOutputSchema,
  },
  async ({title}) => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: `Generate a clean, modern, and professional image that visually represents the following task: "${title}". The image should be suitable for a project management application. Avoid text and logos.`,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media) {
      throw new Error('No image was generated.');
    }

    return {
      imageUrl: media.url,
    };
  }
);

export async function generateTaskImage(
  input: GenerateTaskImageInput
): Promise<GenerateTaskImageOutput> {
  return generateTaskImageFlow(input);
}
