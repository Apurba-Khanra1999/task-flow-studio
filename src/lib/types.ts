export type Priority = "Low" | "Medium" | "High";
export type Status = "To Do" | "In Progress" | "Done";

export interface Subtask {
  id: string;
  text: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  dueDate?: Date;
  subtasks: Subtask[];
  imageUrl?: string;
}

export interface Notification {
  id: string;
  message: string;
  timestamp: Date;
  read: boolean;
}
