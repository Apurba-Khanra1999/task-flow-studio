
"use client";

import * as React from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Wand2, Loader2, Sparkles } from 'lucide-react';
import type { Priority, Subtask } from '@/lib/types';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Form, FormControl, FormField, FormItem, FormMessage } from './ui/form';
import { parseNaturalLanguageTask } from '@/ai/flows/parse-natural-language-task';

const schema = z.object({
  prompt: z.string().min(1, "Please enter a task description."),
});

type FormValues = z.infer<typeof schema>;

interface QuickTaskEntryProps {
  addTask: (task: { title: string; description: string; priority: Priority; dueDate?: Date; subtasks: Subtask[]; imageUrl?: string; }) => void;
}

export function QuickTaskEntry({ addTask }: QuickTaskEntryProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isParsing, setIsParsing] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      prompt: "",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsParsing(true);
    try {
      const result = await parseNaturalLanguageTask({ text: data.prompt });
      
      const newTask = {
        title: result.title,
        description: result.description || "",
        priority: result.priority || "Medium",
        dueDate: result.dueDate ? new Date(result.dueDate.replace(/-/g, '/')) : undefined,
        subtasks: [],
        imageUrl: undefined,
      };

      addTask(newTask);

      toast({
        title: "Task Created with AI",
        description: `"${newTask.title}" has been added to your board.`,
      });
      form.reset();
      setIsOpen(false);
    } catch (error) {
      console.error("AI task parsing failed:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not create task. Please ensure your GOOGLE_API_KEY is set correctly.",
      });
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Quick Add Task with AI">
          <Sparkles className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-2">
                <div className="space-y-1">
                  <h4 className="font-medium leading-none">Quick Add</h4>
                  <p className="text-sm text-muted-foreground">
                    Describe a task and AI will do the rest.
                  </p>
                </div>
                 <FormField
                  control={form.control}
                  name="prompt"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          id="quick-task-prompt"
                          placeholder='e.g., "Fix login bug, due tomorrow"'
                          disabled={isParsing}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
            <Button type="submit" className="w-full" disabled={isParsing}>
                {isParsing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                Create Task
            </Button>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
}
