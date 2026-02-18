import React, { useState, useRef, useEffect } from 'react';
import { Bell, X, Check, Trash2, MapPin, Target, User, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/store';
import { markAllAsRead, markAsRead, clearNotifications, Notification } from '@/store/slices/notificationSlice';
import { cn } from '@/lib/utils';

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount } = useAppSelector((state) => state.notifications);
  const dispatch = useAppDispatch();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-full p-2 text-slate-600 hover:bg-muted transition-all active:scale-95"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 z-50 w-80 sm:w-96 overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-border p-4 bg-muted/30">
              <h3 className="font-bold text-card-foreground flex items-center gap-2">
                Notifications
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 text-xs">
                    {unreadCount} New
                  </span>
                )}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => dispatch(markAllAsRead())}
                  className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-muted transition-colors"
                  title="Mark all as read"
                >
                  <Check className="h-4 w-4" />
                </button>
                <button
                  onClick={() => dispatch(clearNotifications())}
                  className="rounded-lg p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                  title="Clear history"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                    <Bell className="h-6 w-6 text-slate-500" />
                  </div>
                  <p className="text-sm font-medium text-card-foreground">No notifications yet</p>
                  <p className="text-xs text-slate-500 mt-1">When threats are detected, they will appear here.</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {notifications.map((notification) => (
                    <NotificationItem 
                      key={notification.id} 
                      notification={notification} 
                      onClick={() => dispatch(markAsRead(notification.id))}
                    />
                  ))}
                </div>
              )}
            </div>

            {notifications.length > 0 && (
              <div className="border-t border-border p-3 text-center">
                <button className="text-xs font-bold text-blue-500 hover:text-blue-400 transition-colors uppercase tracking-wider">
                  View All Intelligence Logs
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NotificationItem({ notification, onClick }: { notification: Notification; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative grid grid-cols-[auto_1fr] gap-4 p-4 transition-all hover:bg-muted/50 cursor-pointer",
        !notification.isRead && "bg-blue-500/5"
      )}
    >
      <div className="relative">
        <div className={cn(
          "h-10 w-10 rounded-xl flex items-center justify-center border transition-colors",
          !notification.isRead ? "bg-blue-500/10 border-blue-500/30 text-blue-500" : "bg-muted border-border text-slate-500"
        )}>
          {notification.event_type === 'poi_detection' ? <Target className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
        </div>
        {!notification.isRead && (
          <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-blue-500 ring-2 ring-card" />
        )}
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between gap-2">
          <p className={cn("text-sm font-bold", !notification.isRead ? "text-card-foreground" : "text-muted-foreground")}>
            {notification.person_name || 'Unidentified Person'} apprehended for a {notification.classification || 'Simple'} crime
          </p>
          <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {new Date(notification.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <p className="text-xs text-slate-400 line-clamp-2">
          Alert level: <span className={cn(
            "font-bold uppercase",
            (notification.classification?.toLowerCase() === 'grievous' || 
             notification.classification?.toLowerCase() === 'severe' || 
             notification.classification?.toLowerCase() === 'serious' || 
             notification.classification?.toLowerCase() === 'grevious') ? "text-red-500" : 
            notification.classification?.toLowerCase() === 'minor' ? "text-yellow-500" : 
            "text-blue-500"
          )}>{notification.classification || 'Simple'}</span> • 
          POI detected at {notification.camera_location}.
          Confidence: {(notification.confidence * 100).toFixed(1)}%
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          <span className="inline-flex items-center gap-1 rounded bg-muted px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground">
            <MapPin className="h-3 w-3" />
            {notification.camera_location}
          </span>
          <span className="inline-flex items-center gap-1 rounded bg-muted px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground">
            <User className="h-3 w-3" />
            ID: {notification.person_id}
          </span>
        </div>
      </div>
    </div>
  );
}
