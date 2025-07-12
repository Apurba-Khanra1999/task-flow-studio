"use client";

import { useMemo } from 'react';
import type { Task, Status, Priority } from '@/lib/types';
import { KanbanColumn } from '@/components/kanban-column';
import { Skeleton } from './ui/skeleton';

const statuses: Status[] = ["To Do", "In Progress", "Done"];

interface KanbanBoardProps {
  tasks: Task[];
  moveTask: (taskId: string, newStatus: Status) => void;
  updateTask: (taskId: string, data: Partial<Omit<Task, 'id'>>) => void;
  deleteTask: (taskId: string) => void;
  isInitialized: boolean;
  compactView?: boolean;
}

export function KanbanBoard({ 
  tasks, 
  moveTask, 
  updateTask,
  deleteTask,
  isInitialized,
  compactView = false,
}: KanbanBoardProps) {

  const groupedTasks = useMemo(() => {
    const groups: Record<Status, Task[]> = {
      "To Do": [],
      "In Progress": [],
      "Done": [],
    };
    if (tasks) {
      tasks.forEach(task => {
        if (groups[task.status]) {
          groups[task.status].push(task);
        }
      });
    }
    return groups;
  }, [tasks]);

  if (!isInitialized) {
    return (
      <div className="flex h-full flex-1 p-4 md:p-6 gap-6">
        {statuses.map(status => (
          <div key={status} className="flex flex-col w-full md:w-1/3 lg:w-1/4 xl:w-1/5 shrink-0">
             <Skeleton className="h-8 w-1/2 mb-4" />
             <div className="space-y-4">
              <Skeleton className="h-28 w-full" />
              <Skeleton className="h-28 w-full" />
              <Skeleton className="h-28 w-full" />
             </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex h-full flex-1 flex-col">
      <div className="flex flex-1 items-start gap-6 p-4 md:p-6">
        {statuses.map(status => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={groupedTasks[status]}
            moveTask={moveTask}
            updateTask={updateTask}
            deleteTask={deleteTask}
            compactView={compactView}
          />
        ))}
      </div>
    </div>
  );
}
