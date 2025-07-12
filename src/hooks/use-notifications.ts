"use client";

import { createContext, useContext } from 'react';
import type { Notification } from '@/lib/types';

export const getNotificationsLocalStorageKey = (userId: string) => `taskflow-notifications-${userId}`;

export const generateId = () => `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

export interface NotificationsContextType {
  notifications: Notification[];
  addNotification: (notificationData: { message: string }) => void;
  markAllAsRead: () => void;
  unreadCount: number;
  isInitialized: boolean;
}

export const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
}
