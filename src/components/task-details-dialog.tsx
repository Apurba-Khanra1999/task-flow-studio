
"use client";

import { useState, useMemo, useEffect, useRef } from 'react';
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
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Calendar as CalendarIcon, Wand2, Loader2, Plus, Image as ImageIcon, UploadCloud } from 'lucide-react';
import type { Task, Status, Subtask } from '@/lib/types';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Separator } from './ui/separator';
import { Checkbox } from './ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateSubtasks } from '@/ai/flows/generate-subtasks';
import { generateTaskImage } from '@/ai/flows/generate-task-image';


const statuses: Status[] = ["To Do", "In Progress", "Done"];

const taskSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long."),
  description: z.string().optional(),
  priority: z.enum(["Low", "Medium", "High"]),
  status: z.enum(["To Do", "In Progress", "Done"]),
  dueDate: z.date().optional(),
  subtasks: z.array(z.object({
    id: z.string(),
    text: z.string(),
    completed: z.boolean(),
  })).optional(),
  imageUrl: z.string().optional(),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface TaskDetailsDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  task: Task;
  updateTask: (taskId: string, data: Partial<Omit<Task, 'id'>>) => void;
  deleteTask: (taskId:string) => void;
}

export function TaskDetailsDialog({ isOpen, setIsOpen, task, updateTask, deleteTask }: TaskDetailsDialogProps) {
  const { toast } = useToast();
  const [newSubtaskText, setNewSubtaskText] = useState('');
  const [isGeneratingSubtasks, setIsGeneratingSubtasks] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    values: useMemo(() => ({
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
      subtasks: task.subtasks || [],
      imageUrl: task.imageUrl
    }), [task])
  });

  useEffect(() => {
    form.reset({
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
      subtasks: task.subtasks || [],
      imageUrl: task.imageUrl
    });
  }, [task, form, isOpen]);

  const handleDeleteTask = () => {
    deleteTask(task.id);
    toast({
        title: "Task Deleted",
        description: `"${task.title}" has been removed.`,
    })
    setIsOpen(false);
  }

  const onSubmit = (data: TaskFormValues) => {
    updateTask(task.id, data);
    setIsOpen(false);
    toast({
      title: "Task Updated",
      description: `"${data.title}" has been saved.`,
    })
  };

  const handleGenerateSubtasks = async () => {
    setIsGeneratingSubtasks(true);
    try {
      const result = await generateSubtasks({
        title: form.getValues('title'),
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

  const handleGenerateImage = async () => {
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
    form.setValue('imageUrl', undefined, { shouldDirty: true });
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

  const anyAiLoading = isGeneratingImage || isGeneratingSubtasks;


  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4 flex-shrink-0">
          <DialogTitle>Task Details</DialogTitle>
          <DialogDescription>
            View, edit, or delete this task. Add subtasks to break down your work.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto">
          <div className="px-6 pb-6">
            <Form {...form}>
              <form id="task-details-form" className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          className="resize-none"
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Low">Low</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                   <FormField
                      control={form.control}
                      name="dueDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Due Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn("pl-3 text-left font-normal",!field.value && "text-muted-foreground")}>
                                  {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus/>
                            </PopoverContent>
                          </Popover>
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
                            id="image-upload-details"
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
                    <Button type="button" variant="outline" size="sm" onClick={handleGenerateSubtasks} disabled={anyAiLoading}>
                      {isGeneratingSubtasks ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                      Suggest with AI
                    </Button>
                  </div>
                  <div className="pl-1 space-y-2 max-h-40 overflow-y-auto pr-2">
                    {(form.watch('subtasks') || []).map((subtask) => (
                      <div key={subtask.id} className="flex items-center gap-3 group">
                        <Checkbox
                          id={`subtask-${subtask.id}`}
                          checked={subtask.completed}
                          onCheckedChange={() => handleToggleSubtask(subtask.id)}
                        />
                        <label
                          htmlFor={`subtask-${subtask.id}`}
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
            <AlertDialog>
                <AlertDialogTrigger asChild>
                     <Button type="button" variant="destructive" className="mr-auto">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Task
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this task.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteTask}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
          <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button type="submit" form="task-details-form" onClick={form.handleSubmit(onSubmit)}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
