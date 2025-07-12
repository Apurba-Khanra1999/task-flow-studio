
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { NewTaskDialog } from '@/components/new-task-dialog';
import { 
  TasksContext,
  getTasksLocalStorageKey,
  initialTasks,
  generateId,
} from '@/hooks/use-tasks';
import {
  NotificationsContext,
  getNotificationsLocalStorageKey,
  generateId as generateNotificationId,
} from '@/hooks/use-notifications';
import { AuthProvider, useAuth } from '@/hooks/use-auth';
import { KanbanSquare, LayoutDashboard, Calendar, Search, Loader2, BookOpen } from 'lucide-react';
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { QuickTaskEntry } from "@/components/quick-task-entry";
import { NotificationBell } from "@/components/notification-bell";
import * as React from 'react';
import type { Task, Status, Priority, Subtask, Notification } from '@/lib/types';
import { Button } from "@/components/ui/button";
import { CommandPalette } from "@/components/command-palette";
import { UserNav } from "@/components/user-nav";

function MainLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { tasks, addTask, updateTask, deleteTask } = React.useContext(TasksContext)!;
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = React.useState(false);

  React.useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);
  
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsCommandPaletteOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const navLinks = [
    { href: "/board", label: "Board", icon: KanbanSquare },
    { href: "/dashboard",label: "Dashboard", icon: LayoutDashboard },
    { href: "/calendar", label: "Calendar", icon: Calendar },
    { href: "/about", label: "Documentation", icon: BookOpen },
  ];

  if (loading || !user) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <>
      <CommandPalette 
        isOpen={isCommandPaletteOpen}
        setIsOpen={setIsCommandPaletteOpen}
        tasks={tasks}
        updateTask={updateTask}
        deleteTask={deleteTask}
      />
      <div className="flex min-h-screen w-full flex-col bg-background">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
          <div className="flex items-center gap-2">
            <KanbanSquare className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold tracking-tight text-foreground">TaskFlow</h1>
          </div>

          <nav className="ml-6 hidden md:flex items-center space-x-4 lg:space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                  pathname === link.href ? "text-primary" : "text-muted-foreground"
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => setIsCommandPaletteOpen(true)} aria-label="Open command palette">
              <Search className="h-4 w-4" />
            </Button>
            <QuickTaskEntry addTask={addTask} />
            <NewTaskDialog addTask={addTask} />
            <NotificationBell />
            <ThemeToggle />
            <UserNav />
          </div>
        </header>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </>
  );
}


function MainLayoutWithProviders({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth();
  
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [tasksInitialized, setTasksInitialized] = React.useState(false);
  
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [notificationsInitialized, setNotificationsInitialized] = React.useState(false);

  // Load tasks from localStorage when user is available
  React.useEffect(() => {
      if (loading || !user) return;
      try {
        const key = getTasksLocalStorageKey(user.uid);
        const item = window.localStorage.getItem(key);
        if (item) {
          let parsedTasks = JSON.parse(item, (key, value) => {
              if (key === 'dueDate' && value) return new Date(value);
              return value;
          });
          if (Array.isArray(parsedTasks)) {
              setTasks(parsedTasks.map(task => ({...task, subtasks: task.subtasks || []})));
          }
        } else {
          // New user, give them initial tasks
           setTasks(initialTasks.map(t => ({...t, subtasks: t.subtasks || []})));
        }
      } catch (error) {
        console.error("Failed to load tasks from localStorage", error);
        setTasks(initialTasks.map(t => ({...t, subtasks: t.subtasks || []})));
      }
      setTasksInitialized(true);
  }, [user, loading]);

  // Save tasks to localStorage
  React.useEffect(() => {
    if (tasksInitialized && user) {
      try {
        const key = getTasksLocalStorageKey(user.uid);
        window.localStorage.setItem(key, JSON.stringify(tasks));
      } catch (error) {
        console.error("Failed to save tasks to localStorage", error);
      }
    }
  }, [tasks, tasksInitialized, user]);

  // Load notifications from localStorage
  React.useEffect(() => {
      if (loading || !user) return;
      try {
          const key = getNotificationsLocalStorageKey(user.uid);
          const item = window.localStorage.getItem(key);
          if (item) {
              const parsedNotifications = JSON.parse(item, (key, value) => {
                  if (key === 'timestamp' && value) return new Date(value);
                  return value;
              });
              if (Array.isArray(parsedNotifications)) {
                  setNotifications(parsedNotifications);
              }
          }
      } catch (error) {
          console.error("Failed to load notifications from localStorage", error);
      }
      setNotificationsInitialized(true);
  }, [user, loading]);

  // Save notifications to localStorage
  React.useEffect(() => {
      if (notificationsInitialized && user) {
          try {
              const key = getNotificationsLocalStorageKey(user.uid);
              window.localStorage.setItem(key, JSON.stringify(notifications));
          } catch (error) {
              console.error("Failed to save notifications to localStorage", error);
          }
      }
  }, [notifications, notificationsInitialized, user]);


  const addNotification = React.useCallback((notificationData: { message: string }) => {
    const newNotification: Notification = {
      id: generateNotificationId(),
      timestamp: new Date(),
      read: false,
      ...notificationData,
    };
    setNotifications(prev => [newNotification, ...prev].slice(0, 100));
  }, []);

  const markAllAsRead = React.useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const unreadCount = React.useMemo(() => notifications.filter(n => !n.read).length, [notifications]);

  const addTask = React.useCallback((newTaskData: { title: string; description: string; priority: Priority; dueDate?: Date; subtasks: Subtask[], imageUrl?: string; }) => {
    const newTask: Task = {
      id: `task-${generateId()}`,
      status: 'To Do',
      ...newTaskData,
    };
    setTasks(prevTasks => [newTask, ...prevTasks]);
    addNotification({ message: `New task added: "${newTaskData.title}"` });
  }, [addNotification]);
  
  const updateTask = React.useCallback((taskId: string, updatedData: Partial<Omit<Task, 'id'>>) => {
    const taskToUpdate = tasks.find(task => task.id === taskId);
    setTasks(prevTasks => prevTasks.map(task => task.id === taskId ? { ...task, ...updatedData } : task));
    if (taskToUpdate) {
      if (updatedData.status && updatedData.status === 'Done' && taskToUpdate.status !== 'Done') {
        addNotification({ message: `Task completed: "${taskToUpdate.title}"` });
      } else {
        addNotification({ message: `Task updated: "${taskToUpdate.title}"` });
      }
    }
  }, [tasks, addNotification]);

  const updateMultipleTasks = React.useCallback((updates: { taskId: string; data: Partial<Omit<Task, 'id'>> }[]) => {
    if (updates.length === 0) return;
    const updateMap = new Map(updates.map(u => [u.taskId, u.data]));
    setTasks(prevTasks => prevTasks.map(task => updateMap.has(task.id) ? { ...task, ...updateMap.get(task.id) } : task));
    addNotification({ message: `AI has re-prioritized ${updates.length} tasks.` });
  }, [addNotification]);

  const deleteTask = React.useCallback((taskId: string) => {
    const taskToDelete = tasks.find(task => task.id === taskId);
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    if (taskToDelete) {
      addNotification({ message: `Task deleted: "${taskToDelete.title}"` });
    }
  }, [tasks, addNotification]);

  const moveTask = React.useCallback((taskId: string, newStatus: Status) => {
    updateTask(taskId, { status: newStatus });
  }, [updateTask]);
  
  const tasksContextValue = { tasks, setTasks, addTask, updateTask, updateMultipleTasks, deleteTask, moveTask, isInitialized: tasksInitialized && !!user };
  const notificationsContextValue = { notifications, addNotification, markAllAsRead, unreadCount, isInitialized: notificationsInitialized && !!user };

  return (
    <TasksContext.Provider value={tasksContextValue}>
      <NotificationsContext.Provider value={notificationsContextValue}>
        <MainLayoutContent>
            {children}
        </MainLayoutContent>
      </NotificationsContext.Provider>
    </TasksContext.Provider>
  );
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <MainLayoutWithProviders>
        {children}
      </MainLayoutWithProviders>
    </AuthProvider>
  )
}
