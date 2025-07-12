"use client";

import * as React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Search, File, ArrowUp, Minus, ArrowDown, ListTodo, Loader2, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Task, Status, Priority } from '@/lib/types';
import { TaskDetailsDialog } from '@/components/task-details-dialog';

interface CommandPaletteProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  tasks: Task[];
  updateTask: (taskId: string, data: Partial<Omit<Task, 'id'>>) => void;
  deleteTask: (taskId: string) => void;
}

const statusIcons: Record<Status, React.ReactNode> = {
  'To Do': <ListTodo className="h-4 w-4 text-muted-foreground" />,
  'In Progress': <Loader2 className="h-4 w-4 text-primary" />,
  'Done': <CheckCircle2 className="h-4 w-4 text-green-500" />,
};

const priorityIcons: Record<Priority, React.ReactNode> = {
    Low: <ArrowDown className="h-4 w-4 text-muted-foreground" />,
    Medium: <Minus className="h-4 w-4 text-yellow-500" />,
    High: <ArrowUp className="h-4 w-4 text-red-500" />,
};

export function CommandPalette({ isOpen, setIsOpen, tasks, updateTask, deleteTask }: CommandPaletteProps) {
  const [query, setQuery] = React.useState('');
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false);
  
  const filteredTasks = React.useMemo(() => {
    if (!query) return tasks.slice(0, 20); // Show some tasks by default
    const lowercasedQuery = query.toLowerCase();
    return tasks.filter(task =>
      task.title.toLowerCase().includes(lowercasedQuery) ||
      (task.description && task.description.toLowerCase().includes(lowercasedQuery))
    );
  }, [query, tasks]);

  const handleSelectTask = (task: Task) => {
    setSelectedTask(task);
    setIsDetailsOpen(true);
    setIsOpen(false);
  };
  
  React.useEffect(() => {
    if (!isOpen) {
      setQuery('');
    }
  }, [isOpen]);

  return (
    <>
      {selectedTask && (
        <TaskDetailsDialog
          isOpen={isDetailsOpen}
          setIsOpen={setIsDetailsOpen}
          task={selectedTask}
          updateTask={updateTask}
          deleteTask={deleteTask}
        />
      )}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-2xl p-0 gap-0 overflow-hidden">
          <div className="flex items-center border-b px-4">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tasks..."
              className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <div className="max-h-[450px] overflow-y-auto">
            {filteredTasks.length > 0 ? (
                <div className='p-2'>
                    <p className='px-2 py-1.5 text-xs font-medium text-muted-foreground'>Tasks</p>
                    {filteredTasks.map(task => (
                        <div
                            key={task.id}
                            onClick={() => handleSelectTask(task)}
                            className="flex items-center gap-4 p-2 rounded-md hover:bg-accent cursor-pointer"
                        >
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                {statusIcons[task.status]}
                                <span className="truncate">{task.title}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                {priorityIcons[task.priority]}
                                <span className="text-xs">{task.priority}</span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <File className="mx-auto h-12 w-12 text-muted-foreground/30" />
                    <p className="mt-4 text-sm font-medium text-muted-foreground">No tasks found</p>
                    <p className="mt-1 text-xs text-muted-foreground">Try a different search query.</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
