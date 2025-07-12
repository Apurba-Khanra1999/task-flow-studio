"use client";

import { createContext, useContext } from 'react';
import type { Task, Status, Priority, Subtask } from '@/lib/types';

export const getTasksLocalStorageKey = (userId: string) => `taskflow-tasks-${userId}`;

export const initialTasks: Task[] = [
    {
      id: 'task-1',
      title: 'Design the new landing page',
      description: 'Create a modern and responsive design for the new landing page, focusing on user engagement and conversion.',
      status: 'To Do',
      priority: 'High',
      dueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
      subtasks: [
        { id: 'sub-1-1', text: 'Define color palette', completed: true },
        { id: 'sub-1-2', text: 'Create wireframes', completed: true },
        { id: 'sub-1-3', text: 'Design hero section', completed: false },
      ],
      imageUrl: 'https://images.pexels.com/photos/285814/pexels-photo-285814.jpeg',
    },
    {
      id: 'task-2',
      title: 'Develop user authentication',
      description: 'Implement secure user authentication using JWT and password hashing. Include sign-up, login, and logout functionality.',
      status: 'In Progress',
      priority: 'High',
      subtasks: [],
      imageUrl: 'https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg',
    },
    {
      id: 'task-3',
      title: 'Set up CI/CD pipeline',
      description: 'Configure a continuous integration and continuous deployment pipeline to automate testing and deployment.',
      status: 'In Progress',
      priority: 'Medium',
      subtasks: []
    },
    {
      id: 'task-4',
      title: 'Write documentation for the API',
      description: 'Create comprehensive documentation for all API endpoints, including request/response examples.',
      status: 'Done',
      priority: 'Medium',
      dueDate: new Date(new Date().setDate(new Date().getDate() - 5)),
      subtasks: []
    },
    {
      id: 'task-5',
      title: 'Update footer with new links',
      description: 'Add the new social media links and privacy policy link to the website footer.',
      status: 'To Do',
      priority: 'Low',
      subtasks: []
    }
  ];

export const generateId = () => `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

// Define the context shape
export interface TasksContextType {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  addTask: (newTaskData: { title: string; description: string; priority: Priority; dueDate?: Date; subtasks: Subtask[], imageUrl?: string; }) => void;
  updateTask: (taskId: string, updatedData: Partial<Omit<Task, 'id'>>) => void;
  updateMultipleTasks: (updates: { taskId: string; data: Partial<Omit<Task, 'id'>> }[]) => void;
  deleteTask: (taskId: string) => void;
  moveTask: (taskId: string, newStatus: Status) => void;
  isInitialized: boolean;
}

// Create the context with a default value
export const TasksContext = createContext<TasksContextType | undefined>(undefined);

// The custom hook that components will use
export function useTasks() {
  const context = useContext(TasksContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TasksProvider');
  }
  return context;
}
