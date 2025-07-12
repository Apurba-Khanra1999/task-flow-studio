"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Task, Priority } from '@/lib/types';
import { ArrowDown, ArrowUp, Calendar, Minus, ListChecks } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { TaskDetailsDialog } from './task-details-dialog';

interface TaskCardProps {
  task: Task;
  updateTask: (taskId: string, data: Partial<Omit<Task, 'id'>>) => void;
  deleteTask: (taskId: string) => void;
  compactView?: boolean;
}

const priorityIcons: Record<Priority, React.ReactNode> = {
  Low: <ArrowDown className="h-4 w-4" />,
  Medium: <Minus className="h-4 w-4" />,
  High: <ArrowUp className="h-4 w-4" />,
};

const priorityStyles: Record<Priority, string> = {
  High: "text-destructive border-destructive/30 bg-destructive/10 hover:bg-destructive/20",
  Medium: "text-[hsl(var(--chart-4))] border-[hsl(var(--chart-4))]/30 bg-[hsl(var(--chart-4))]/10 hover:bg-[hsl(var(--chart-4))]/20",
  Low: "text-muted-foreground border-border bg-muted hover:bg-muted/80",
};


export function TaskCard({ task, updateTask, deleteTask, compactView = false }: TaskCardProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('taskId', task.id);
    e.currentTarget.style.opacity = '0.5';
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.style.opacity = '1';
  };
  
  const completedSubtasks = (task.subtasks || []).filter(s => s.completed).length;
  const totalSubtasks = (task.subtasks || []).length;

  return (
    <>
      <TaskDetailsDialog isOpen={isDetailsOpen} setIsOpen={setIsDetailsOpen} task={task} updateTask={updateTask} deleteTask={deleteTask} />
      <Card
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onClick={() => setIsDetailsOpen(true)}
        className="cursor-pointer active:cursor-grabbing transition-shadow duration-200 hover:shadow-lg bg-card"
      >
        {!compactView && task.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
                src={task.imageUrl}
                alt={`Image for ${task.title}`}
                className="w-full h-32 object-cover rounded-t-lg"
                data-ai-hint="task illustration"
            />
        )}
        <CardHeader className={cn((compactView || !task.imageUrl) && "pt-6")}>
          <CardTitle className="flex items-start justify-between text-base gap-2">
              <span className="flex-1 font-semibold">{task.title}</span>
               <Badge variant="outline" className={cn("flex shrink-0 items-center gap-1 font-semibold", priorityStyles[task.priority])}>
                  {priorityIcons[task.priority]}
                  {task.priority}
              </Badge>
          </CardTitle>
        </CardHeader>
        {!compactView && (
            <CardContent>
                <CardDescription className="line-clamp-2">{task.description}</CardDescription>
            </CardContent>
        )}
        <CardFooter className={cn("flex justify-between items-center text-sm text-muted-foreground", compactView && "pt-0")}>
          <div className="flex items-center gap-2">
            {task.dueDate && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(task.dueDate), "MMM d")}</span>
              </div>
            )}
             {totalSubtasks > 0 && (
              <Badge variant="outline" className="flex items-center gap-1.5 font-normal">
                <ListChecks className="h-3.5 w-3.5" />
                <span>{completedSubtasks}/{totalSubtasks}</span>
              </Badge>
            )}
          </div>
        </CardFooter>
      </Card>
    </>
  );
}
