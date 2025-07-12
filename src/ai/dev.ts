'use server';

import { config } from 'dotenv';
config();

import '@/ai/flows/generate-subtasks.ts';
import '@/ai/flows/generate-dashboard-summary.ts';
import '@/ai/flows/generate-audio-summary.ts';
import '@/ai/flows/parse-natural-language-task.ts';
import '@/ai/flows/generate-full-task-from-title.ts';
import '@/ai/flows/generate-task-image.ts';
import '@/ai/flows/prioritize-tasks-flow.ts';
import '@/ai/flows/generate-task-description.ts';
