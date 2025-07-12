"use client";

import React, { useState } from 'react';
import type { Task, Status } from '@/lib/types';
import { TaskCard } from '@/components/task-card';
import { cn } from '@/lib/utils';
import { ScrollArea } from './ui/scroll-area';

interface KanbanColumnProps {
  status: Status;
  tasks: Task[];
  moveTask: (taskId: string, newStatus: Status) => void;
  updateTask: (taskId: string, data: Partial<Omit<Task, 'id'>>) => void;
  deleteTask: (taskId: string) => void;
  compactView?: boolean;
}

export function KanbanColumn({ status, tasks, moveTask, updateTask, deleteTask, compactView = false }: KanbanColumnProps) {
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      moveTask(taskId, status);
    }
    setIsDraggingOver(false);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'flex w-full md:w-80 lg:w-96 shrink-0 flex-col rounded-xl border-2 transition-colors',
        isDraggingOver ? 'border-primary bg-primary/10' : 'border-transparent bg-card/40'
      )}
    >
      <div className="p-4 border-b-2 border-border/50">
        <h2 className="text-lg font-semibold flex items-center justify-between">
            <span>{status}</span>
            <span className='text-sm font-medium bg-muted text-muted-foreground rounded-full px-2 py-0.5'>{tasks.length}</span>
        </h2>
      </div>
      <ScrollArea className="h-[calc(100vh-14rem)] flex-1">
        <div className="flex flex-col gap-4 p-4">
          {tasks.length > 0 ? (
            tasks.map(task => <TaskCard key={task.id} task={task} updateTask={updateTask} deleteTask={deleteTask} compactView={compactView} />)
          ) : (
            <div className="flex h-32 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
              <p>Drag tasks here</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
