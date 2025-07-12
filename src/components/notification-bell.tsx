"use client";

import * as React from 'react';
import Link from 'next/link';
import { useNotifications } from '@/hooks/use-notifications';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Bell, CheckCheck, ArrowRight } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { Separator } from './ui/separator';
import { Badge } from '@/components/ui/badge';

export function NotificationBell() {
  const { notifications, unreadCount, markAllAsRead, isInitialized } = useNotifications();
  const [isOpen, setIsOpen] = React.useState(false);

  const latestNotifications = notifications.slice(0, 10);

  React.useEffect(() => {
    if (isOpen && unreadCount > 0) {
      const timer = setTimeout(() => {
        markAllAsRead();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, unreadCount, markAllAsRead]);
  
  if (!isInitialized) return (
    <Button variant="ghost" size="icon" className="relative" disabled>
        <Bell className="h-5 w-5" />
    </Button>
  );

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
            </span>
          )}
           <span className="sr-only">Open notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-96 p-0 flex flex-col">
        <div className="flex items-center justify-between p-4">
          <h3 className="font-semibold text-lg">Notifications</h3>
          {unreadCount > 0 && <Badge variant="default" className='h-6'>{unreadCount} new</Badge>}
        </div>
        <Separator />
        <ScrollArea className="h-80">
          {latestNotifications.length > 0 ? (
            latestNotifications.map((notif) => (
              <div key={notif.id} className={cn(
                "p-4 text-sm border-b",
                !notif.read && "bg-primary/5"
              )}>
                <p className='leading-snug'>{notif.message}</p>
                <p className="text-xs text-muted-foreground mt-1.5">
                  {formatDistanceToNow(new Date(notif.timestamp), { addSuffix: true })}
                </p>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-16 h-full">
              <CheckCheck className="h-10 w-10 mb-4 text-muted-foreground/50" />
              <p className="font-medium">All caught up!</p>
              <p className="text-xs">You have no new notifications.</p>
            </div>
          )}
        </ScrollArea>
        <Separator />
        <div className="p-2">
            <Link href="/notifications" passHref>
                <Button variant="ghost" className="w-full justify-center text-sm" onClick={() => setIsOpen(false)}>
                    View All Notifications
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
