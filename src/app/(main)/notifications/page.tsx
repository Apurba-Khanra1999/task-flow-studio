
"use client";

import React, { useState, useRef, useCallback, useMemo } from 'react';
import { useNotifications } from '@/hooks/use-notifications';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow, isThisWeek, getDay, differenceInDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { BellRing, CheckCheck, Loader2, Activity, CalendarPlus, Bell } from 'lucide-react';
import type { Notification } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const NOTIFICATIONS_PER_PAGE = 15;

const NotificationItem = ({ notification }: { notification: Notification }) => (
    <div className={cn(
        "flex items-start gap-4 p-4 transition-colors border-b last:border-b-0 hover:bg-muted/50",
        !notification.read && "bg-primary/5 font-medium"
    )}>
        <div className="mt-1">
            <div className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center", 
                !notification.read ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            )}>
                <BellRing className="h-4 w-4" />
            </div>
        </div>
        <div className="flex-1 space-y-1">
            <p className="text-sm leading-snug">{notification.message}</p>
            <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
            </p>
        </div>
        {!notification.read && <div className="h-2.5 w-2.5 rounded-full bg-primary self-center" aria-label="Unread" />}
    </div>
);


export default function NotificationsPage() {
    const { notifications, markAllAsRead, unreadCount, isInitialized } = useNotifications();
    const [visibleCount, setVisibleCount] = useState(NOTIFICATIONS_PER_PAGE);
    const [isLoading, setIsLoading] = useState(false);
    const observer = useRef<IntersectionObserver>();

    const lastNotificationElementRef = useCallback((node: any) => {
        if (isLoading) return;
        if (observer.current) observer.current.disconnect();
        
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && visibleCount < notifications.length) {
                setIsLoading(true);
                setTimeout(() => {
                    setVisibleCount(prev => prev + NOTIFICATIONS_PER_PAGE);
                    setIsLoading(false);
                }, 500); // Add a small delay to simulate loading
            }
        });

        if (node) observer.current.observe(node);
    }, [isLoading, notifications.length, visibleCount]);

    const insights = useMemo(() => {
        if (!isInitialized) return null;

        const now = new Date();
        let completedThisWeek = 0;
        let createdThisWeek = 0;
        
        const activityByDay = Array(7).fill(0); // 0: Sun, 1: Mon, ...

        notifications.forEach(notif => {
            const timestamp = new Date(notif.timestamp);
            if (isThisWeek(timestamp, { weekStartsOn: 1 })) {
                if (notif.message.toLowerCase().includes('completed')) completedThisWeek++;
                if (notif.message.toLowerCase().includes('added')) createdThisWeek++;
            }
            if (differenceInDays(now, timestamp) <= 6) { // Last 7 days including today
                activityByDay[getDay(timestamp)]++;
            }
        });

        const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const busiestDayIndex = activityByDay.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);
        const busiestDay = activityByDay[busiestDayIndex] > 0 ? dayNames[busiestDayIndex] : 'N/A';
        
        return {
            completedThisWeek,
            createdThisWeek,
            busiestDay
        };
    }, [notifications, isInitialized]);

    const visibleNotifications = notifications.slice(0, visibleCount);

    if (!isInitialized || !insights) {
        return (
            <div className="container mx-auto max-w-4xl p-4 md:p-6 space-y-6">
                <Skeleton className="h-10 w-1/3 mb-2" />
                <Skeleton className="h-5 w-1/2 mb-6" />
                <div className="grid gap-4 md:grid-cols-3">
                   <Skeleton className="h-28 w-full rounded-xl" />
                   <Skeleton className="h-28 w-full rounded-xl" />
                   <Skeleton className="h-28 w-full rounded-xl" />
                </div>
                <div className="border rounded-xl overflow-hidden mt-6">
                    <div className="p-4 border-b">
                        <Skeleton className="h-8 w-1/3" />
                    </div>
                    <div className="divide-y">
                        {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-4xl p-4 md:p-6 space-y-8">
            <header>
                <h1 className="text-3xl font-bold tracking-tight">Activity Feed</h1>
                <p className="text-muted-foreground">An overview of all your recent updates and insights.</p>
            </header>

            <section>
                 <h2 className="text-xl font-semibold tracking-tight mb-4">This Week's Insights</h2>
                 <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                           <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
                           <CheckCheck className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                           <div className="text-2xl font-bold">{insights.completedThisWeek}</div>
                           <p className="text-xs text-muted-foreground">Keep up the momentum!</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                           <CardTitle className="text-sm font-medium">Tasks Added</CardTitle>
                           <CalendarPlus className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                           <div className="text-2xl font-bold">{insights.createdThisWeek}</div>
                           <p className="text-xs text-muted-foreground">New challenges await.</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                           <CardTitle className="text-sm font-medium">Busiest Day</CardTitle>
                           <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                           <div className="text-2xl font-bold">{insights.busiestDay}</div>
                           <p className="text-xs text-muted-foreground">Your most productive day this week.</p>
                        </CardContent>
                    </Card>
                 </div>
            </section>
            
            <section>
                <div className="flex justify-between items-center mb-4">
                     <h2 className="text-xl font-semibold tracking-tight">All Notifications</h2>
                     {unreadCount > 0 && (
                        <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                            <CheckCheck className="mr-2 h-4 w-4" />
                            Mark all as read ({unreadCount})
                        </Button>
                     )}
                </div>
                <div className="border rounded-xl overflow-hidden bg-card">
                    {notifications.length > 0 ? (
                        <div className="divide-y">
                            {visibleNotifications.map((notif, index) => (
                                <div key={notif.id} ref={visibleNotifications.length === index + 1 ? lastNotificationElementRef : null}>
                                    <NotificationItem notification={notif} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-16 h-full">
                            <Bell className="h-12 w-12 mb-4 text-muted-foreground/30" />
                            <h3 className="text-lg font-medium">All caught up!</h3>
                            <p className="text-sm">You have no notifications yet.</p>
                        </div>
                    )}
                </div>
                 {isLoading && (
                    <div className="flex justify-center items-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                )}
            </section>
        </div>
    );
}
