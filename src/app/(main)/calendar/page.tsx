"use client";

import { useTasks } from '@/hooks/use-tasks';
import { CalendarView } from '@/components/calendar-view';

export default function CalendarPage() {
  const { 
    tasks, 
    updateTask,
    deleteTask,
    isInitialized 
  } = useTasks();

  return (
    <div className="flex-1 p-4 md:p-6">
      <CalendarView 
        tasks={tasks}
        updateTask={updateTask}
        deleteTask={deleteTask}
        isInitialized={isInitialized}
      />
    </div>
  );
}
