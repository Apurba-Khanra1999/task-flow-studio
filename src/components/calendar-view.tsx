"use client";

import * as React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TaskDetailsDialog } from '@/components/task-details-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from "@/lib/utils";
import type { Task, Priority, Status } from '@/lib/types';
import { isSameDay, format } from 'date-fns';
import type { DayContentProps } from 'react-day-picker';
import { ListTodo, Loader2, CheckCircle2, CalendarCheck } from 'lucide-react';

interface CalendarViewProps {
  tasks: Task[];
  updateTask: (taskId: string, data: Partial<Omit<Task, 'id'>>) => void;
  deleteTask: (taskId: string) => void;
  isInitialized: boolean;
}

const priorityStyles: Record<Priority, string> = {
  High: "bg-destructive",
  Medium: "bg-[hsl(var(--chart-4))]",
  Low: "bg-muted-foreground/50",
};

const statusIcons: Record<Status, React.ReactNode> = {
  'To Do': <ListTodo className="h-4 w-4 text-muted-foreground" />,
  'In Progress': <Loader2 className="h-4 w-4 animate-spin text-[hsl(var(--chart-2))]" />,
  'Done': <CheckCircle2 className="h-4 w-4 text-[hsl(var(--chart-3))]" />,
};

const CalendarTaskItem = ({ task, onSelect }: { task: Task, onSelect: () => void }) => (
    <button onClick={onSelect} className="w-full text-left p-0.5 group">
        <div className="flex items-center gap-3 p-3 rounded-lg group-hover:bg-accent transition-colors">
        <div className={cn("w-1.5 h-10 rounded-full", priorityStyles[task.priority])} />
        <div className="flex-shrink-0">
            {statusIcons[task.status]}
        </div>
        <div className="flex-1 overflow-hidden">
            <p className="font-semibold text-sm truncate">{task.title}</p>
            <p className="text-xs text-muted-foreground">{task.status}</p>
        </div>
        </div>
    </button>
);


export function CalendarView({ tasks, updateTask, deleteTask, isInitialized }: CalendarViewProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const tasksWithDueDate = React.useMemo(() => tasks.filter(task => !!task.dueDate), [tasks]);
  
  const tasksForSelectedDay = React.useMemo(() => {
    if (!selectedDate) return [];
    return tasksWithDueDate
      .filter(task => task.dueDate && isSameDay(new Date(task.dueDate), selectedDate))
      .sort((a,b) => {
          const statusOrder: Record<Status, number> = { "In Progress": 1, "To Do": 2, "Done": 3 };
          return statusOrder[a.status] - statusOrder[b.status];
      });
  }, [tasksWithDueDate, selectedDate]);
  
  const handleTaskSelect = (task: Task) => {
    setSelectedTask(task);
    setIsDialogOpen(true);
  };
  
  const DayWithDots = React.useCallback(({ date, activeModifiers }: DayContentProps) => {
    const dayTasks = tasksWithDueDate.filter(task => task.dueDate && isSameDay(new Date(task.dueDate), date));
    
    return (
        <div className="relative h-full w-full flex items-center justify-center">
            <span>{format(date, 'd')}</span>
            {dayTasks.length > 0 && !activeModifiers.selected && (
                <div className="absolute bottom-1.5 w-full flex justify-center items-center gap-1">
                   {dayTasks.slice(0, 3).map((task) => {
                        const colorClass = priorityStyles[task.priority];
                        return <div key={task.id} className={cn("w-1.5 h-1.5 rounded-full", colorClass)} />
                   })}
                </div>
            )}
        </div>
    );
  }, [tasksWithDueDate]);

  if (!isInitialized) {
    return (
      <div className="grid md:grid-cols-2 gap-6 h-full">
        <Skeleton className="h-[500px] w-full" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  return (
    <>
      {selectedTask && (
        <TaskDetailsDialog
          isOpen={isDialogOpen}
          setIsOpen={setIsDialogOpen}
          task={selectedTask}
          updateTask={updateTask}
          deleteTask={deleteTask}
        />
      )}
       <div className="grid md:grid-cols-2 lg:grid-cols-[450px_1fr] gap-6 h-full max-h-[calc(100vh-10rem)]">
        <Card className="h-full flex flex-col">
          <CardContent className="flex-1 flex justify-center items-center p-2">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="p-0"
              classNames={{
                day_selected: "bg-primary text-primary-foreground hover:bg-primary/90 focus:bg-primary/90",
                day_today: "bg-accent text-accent-foreground",
                cell: "h-14 w-16 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                day: "h-14 w-16 p-0 font-normal aria-selected:opacity-100",
                head_cell: "text-muted-foreground rounded-md w-16 font-normal text-[0.8rem]",
              }}
              components={{
                DayContent: DayWithDots
              }}
            />
          </CardContent>
        </Card>
        
        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle className="text-xl">
              {selectedDate ? format(selectedDate, 'EEEE, MMMM d') : 'No date selected'}
            </CardTitle>
            <CardDescription>
              {selectedDate ? `${tasksForSelectedDay.length} task(s) due on this day.` : 'Select a day to see tasks.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 flex-1">
            <ScrollArea className="h-full">
              <div className="px-2 pb-2">
                {tasksForSelectedDay.length > 0 ? (
                  tasksForSelectedDay.map(task => (
                    <CalendarTaskItem key={task.id} task={task} onSelect={() => handleTaskSelect(task)} />
                  ))
                ) : (
                  <div className="text-center text-sm text-muted-foreground py-16 px-4 flex flex-col items-center justify-center gap-4 h-full">
                    <CalendarCheck className="h-20 w-20 text-muted-foreground/20" />
                    <p className='text-lg font-medium'>All clear!</p>
                    <p className='max-w-xs text-center text-muted-foreground'>
                      {selectedDate ? "There are no tasks due on this day. Enjoy the peace and quiet." : "Select a day from the calendar to see the tasks scheduled."}
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
