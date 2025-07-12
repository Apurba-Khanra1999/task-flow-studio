
"use client";

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Wand2, Loader2, Plus, Calendar as CalendarIcon, Trash2, Image as ImageIcon, UploadCloud, Sparkles } from 'lucide-react';
import type { Priority, Subtask } from '@/lib/types';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Separator } from './ui/separator';
import { Checkbox } from './ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { generateSubtasks } from '@/ai/flows/generate-subtasks';
import { generateFullTaskFromTitle } from '@/ai/flows/generate-full-task-from-title';
import { generateTaskDescription } from '@/ai/flows/generate-task-description';
import { generateTaskImage } from '@/ai/flows/generate-task-image';


const taskSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long."),
  description: z.string().optional(),
  priority: z.enum(["Low", "Medium", "High"]),
  dueDate: z.date().optional(),
  subtasks: z.array(z.object({
    id: z.string(),
    text: z.string(),
    completed: z.boolean(),
  })).optional(),
  imageUrl: z.string().optional(),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface NewTaskDialogProps {
  addTask: (task: { title: string; description: string; priority: Priority; dueDate?: Date; subtasks: Subtask[]; imageUrl?: string; }) => void;
}

export function NewTaskDialog({ addTask }: NewTaskDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isGeneratingSubtasks, setIsGeneratingSubtasks] = useState(false);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isSmartCreating, setIsSmartCreating] = useState(false);
  const [newSubtaskText, setNewSubtaskText] = useState('');
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "Medium",
      subtasks: [],
      imageUrl: undefined,
    },
  });

  const handleSmartCreate = async () => {
    const title = form.getValues("title");
    if (!title) {
      form.setError("title", { message: "Please enter a title to use Smart Create." });
      return;
    }
    setIsSmartCreating(true);
    try {
        const result = await generateFullTaskFromTitle({ title });
        form.setValue("description", result.description, { shouldDirty: true });
        form.setValue("priority", result.priority, { shouldDirty: true });
        form.setValue("imageUrl", result.imageUrl, { shouldDirty: true });

        const newSubtasks = result.subtasks.map(text => ({
            id: `gen-${Date.now()}-${Math.random()}`,
            text,
            completed: false,
        }));
        
        const currentSubtasks = form.getValues('subtasks') || [];
        form.setValue('subtasks', [...currentSubtasks, ...newSubtasks], { shouldDirty: true });

    } catch (error) {
        console.error("AI Smart Create failed:", error);
        toast({
            variant: "destructive",
            title: "AI Smart Create Failed",
            description: "Please ensure your GOOGLE_API_KEY is set correctly and try again.",
        });
    } finally {
        setIsSmartCreating(false);
    }
  };
  
  const handleGenerateDescription = async () => {
    const title = form.getValues("title");
    if (!title) {
      form.setError("title", { message: "Please enter a title first." });
      return;
    }
    setIsGeneratingDescription(true);
    try {
      const result = await generateTaskDescription({ title });
      form.setValue("description", result.description, { shouldDirty: true });
    } catch (error) {
      console.error("AI description generation failed:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate a description. Please ensure your GOOGLE_API_KEY is set.",
      });
    } finally {
      setIsGeneratingDescription(false);
    }
  };
  
  const handleGenerateImage = async () => {
    const title = form.getValues("title");
    if (!title) {
      form.setError("title", { message: "Please enter a title first to generate an image." });
      return;
    }
    setIsGeneratingImage(true);
    try {
      const result = await generateTaskImage({ title: form.getValues('title') });
      form.setValue('imageUrl', result.imageUrl, { shouldDirty: true });
    } catch (error) {
      console.error("AI image generation failed:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate task image. Please ensure your GOOGLE_API_KEY is set.",
      });
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleGenerateSubtasks = async () => {
    const title = form.getValues("title");
    if (!title) {
      form.setError("title", { message: "Please enter a title first." });
      return;
    }
    setIsGeneratingSubtasks(true);
    try {
      const result = await generateSubtasks({
            title,
            description: form.getValues('description') || '',
      });
      const newSubtasks: Subtask[] = result.subtasks.map((text) => ({
        id: `gen-${Date.now()}-${Math.random()}`,
        text,
        completed: false,
      }));
      const currentSubtasks = form.getValues('subtasks') || [];
      form.setValue('subtasks', [...currentSubtasks, ...newSubtasks]);
    } catch (error) {
      console.error("AI subtask generation failed:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate subtasks. Please ensure your GOOGLE_API_KEY is set.",
      });
    } finally {
      setIsGeneratingSubtasks(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast({
          variant: 'destructive',
          title: 'File too large',
          description: 'Please select an image smaller than 2MB.',
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const result = loadEvent.target?.result;
        if (typeof result === 'string') {
          form.setValue('imageUrl', result, { shouldDirty: true });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    form.setValue('imageUrl', undefined);
  };


  const handleAddSubtask = () => {
    if (newSubtaskText.trim() === '') return;
    const newSubtask: Subtask = {
      id: `man-${Date.now()}`,
      text: newSubtaskText.trim(),
      completed: false,
    };
    const currentSubtasks = form.getValues('subtasks') || [];
    form.setValue('subtasks', [...currentSubtasks, newSubtask]);
    setNewSubtaskText('');
  };

  const handleToggleSubtask = (subtaskId: string) => {
    const currentSubtasks = form.getValues('subtasks') || [];
    const updatedSubtasks = currentSubtasks.map(s => s.id === subtaskId ? { ...s, completed: !s.completed } : s);
    form.setValue('subtasks', updatedSubtasks);
  };
  
  const handleDeleteSubtask = (subtaskId: string) => {
    const currentSubtasks = form.getValues('subtasks') || [];
    const updatedSubtasks = currentSubtasks.filter(s => s.id !== subtaskId);
    form.setValue('subtasks', updatedSubtasks);
  };

  const onSubmit = (data: TaskFormValues) => {
    addTask({ ...data, description: data.description || '', subtasks: data.subtasks || [] });
    form.reset();
    setIsOpen(false);
    toast({
      title: "Task Created",
      description: `"${data.title}" has been added to your board.`,
    })
  };

  const anyAiLoading = isSmartCreating || isGeneratingDescription || isGeneratingImage || isGeneratingSubtasks;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) form.reset();
      setIsOpen(open);
    }}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4 flex-shrink-0">
          <DialogTitle>Create a new task</DialogTitle>
          <DialogDescription>
            Fill in the details below, or use AI to help you along the way.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto">
          <div className="px-6 pb-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Title</FormLabel>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleSmartCreate}
                          disabled={anyAiLoading || !form.watch("title")}
                        >
                          {isSmartCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4 text-primary" />}
                          AI Smart Create
                        </Button>
                      </div>
                      <FormControl>
                        <Input placeholder="e.g., Launch new marketing campaign" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Description</FormLabel>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleGenerateDescription}
                          disabled={anyAiLoading || !form.watch("title")}
                        >
                          {isGeneratingDescription ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                          Generate with AI
                        </Button>
                      </div>
                      <FormControl>
                        <Textarea
                            placeholder="A detailed description of the task..."
                            className="resize-none"
                            rows={4}
                            {...field}
                          />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a priority" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Low">Low</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                      control={form.control}
                      name="dueDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col pt-2">
                           <FormLabel>Due Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date < new Date(new Date().setHours(0,0,0,0))
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>

                <Separator />
                
                <div className="space-y-2">
                    <FormLabel>Task Image</FormLabel>
                    {form.watch('imageUrl') ? (
                      <div className="relative group">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                              src={form.getValues('imageUrl')}
                              alt="Task"
                              className="w-full h-48 object-cover rounded-md border"
                              data-ai-hint="task illustration"
                          />
                          <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={handleRemoveImage}
                              >
                              <Trash2 className="h-4 w-4" />
                          </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-2 p-8 border-2 border-dashed rounded-md">
                          <ImageIcon className="h-10 w-10 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">No image added for this task.</p>
                      </div>
                    )}
                    <Tabs defaultValue="ai" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="ai">
                          <Wand2 className="mr-2 h-4 w-4" />
                           Generate with AI
                        </TabsTrigger>
                        <TabsTrigger value="upload">
                          <UploadCloud className="mr-2 h-4 w-4" />
                           Upload Image
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="ai" className="pt-2">
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full"
                          onClick={handleGenerateImage}
                          disabled={anyAiLoading || !form.getValues('title')}
                        >
                          {isGeneratingImage ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                          {form.watch('imageUrl') ? 'Generate a new image' : 'Generate an image'}
                        </Button>
                      </TabsContent>
                      <TabsContent value="upload" className="pt-2">
                        <div className="relative">
                          <Input
                            id="image-upload-new"
                            type="file"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            accept="image/png, image/jpeg, image/gif"
                            onChange={handleImageUpload}
                            ref={fileInputRef}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full pointer-events-none"
                          >
                            <UploadCloud className="mr-2 h-4 w-4" />
                            Choose from device
                          </Button>
                        </div>
                      </TabsContent>
                    </Tabs>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <FormLabel>Subtasks</FormLabel>
                    <Button type="button" variant="outline" size="sm" onClick={handleGenerateSubtasks} disabled={anyAiLoading || !form.getValues('title')}>
                      {isGeneratingSubtasks ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                      Suggest with AI
                    </Button>
                  </div>
                  <div className="pl-1 space-y-2 max-h-40 overflow-y-auto pr-2">
                    {(form.watch('subtasks') || []).map((subtask) => (
                      <div key={subtask.id} className="flex items-center gap-3 group">
                        <Checkbox
                          id={`new-subtask-${subtask.id}`}
                          checked={subtask.completed}
                          onCheckedChange={() => handleToggleSubtask(subtask.id)}
                        />
                        <label
                          htmlFor={`new-subtask-${subtask.id}`}
                          className={cn("flex-1 text-sm cursor-pointer", subtask.completed && "line-through text-muted-foreground")}
                        >
                          {subtask.text}
                        </label>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100"
                            onClick={() => handleDeleteSubtask(subtask.id)}
                          >
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                    ))}
                    {(form.watch('subtasks') || []).length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">No subtasks yet. Add one below or use AI!</p>
                      )}
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <Input 
                        value={newSubtaskText} 
                        onChange={(e) => setNewSubtaskText(e.target.value)} 
                        onKeyDown={(e) => { if(e.key === 'Enter') { e.preventDefault(); handleAddSubtask(); } }}
                        placeholder="Add a new subtask and press Enter"
                      />
                      <Button type="button" size="icon" onClick={handleAddSubtask}><Plus className="h-4 w-4"/></Button>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </div>
        <DialogFooter className="p-6 pt-4 border-t flex-shrink-0">
          <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button type="submit" onClick={form.handleSubmit(onSubmit)}>Create Task</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
