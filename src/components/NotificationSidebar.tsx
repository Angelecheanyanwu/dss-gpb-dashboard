"use client";

import React from 'react';
import { Bell, AlertTriangle, ShieldCheck, Zap, Info, History, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppSelector, useAppDispatch } from '@/store';
import { clearNotifications, markAsRead } from '@/store/slices/notificationSlice';

interface NotificationSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  onSelect: (notif: any) => void;
}

const NotificationSidebar: React.FC<NotificationSidebarProps> = ({ isCollapsed, onToggle, onSelect }) => {
  const { notifications } = useAppSelector((state) => state.notifications);
  const dispatch = useAppDispatch();

  const getClassificationStyles = (classification?: string) => {
    const status = (classification || 'Simple').toLowerCase();
    switch (status) {
      case 'grievous':
      case 'grevious':
        return {
          bg: "bg-red-500/10 border-red-500/20 hover:border-red-500/40",
          iconBg: "bg-red-500 text-white border-red-400/20",
          icon: AlertTriangle,
          label: "text-red-600"
        };
      case 'severe':
        return {
          bg: "bg-orange-500/10 border-orange-500/20 hover:border-orange-500/40",
          iconBg: "bg-orange-500 text-white border-orange-400/20",
          icon: Zap,
          label: "text-orange-600"
        };
      case 'serious':
        return {
          bg: "bg-yellow-500/10 border-yellow-500/20 hover:border-yellow-500/40",
          iconBg: "bg-yellow-500 text-slate-900 border-yellow-400/20",
          icon: Bell,
          label: "text-yellow-600"
        };
      case 'minor':
        return {
          bg: "bg-blue-500/10 border-blue-500/20 hover:border-blue-500/40",
          iconBg: "bg-blue-500 text-white border-blue-400/20",
          icon: Info,
          label: "text-blue-600"
        };
      case 'simple':
        return {
          bg: "bg-emerald-500/10 border-emerald-500/20 hover:border-emerald-500/40",
          iconBg: "bg-emerald-500 text-white border-emerald-400/20",
          icon: ShieldCheck,
          label: "text-emerald-600"
        };
      default:
        return {
          bg: "bg-slate-100 border-slate-200 hover:border-slate-300",
          iconBg: "bg-slate-500 text-white border-slate-400/20",
          icon: Info,
          label: "text-slate-600"
        };
    }
  };

  return (
    <div className={cn(
      "h-full flex flex-col relative overflow-hidden bg-white border-l border-border transition-all duration-500 ease-in-out shadow-xl",
      isCollapsed ? "w-0 border-l-0" : "w-80"
    )}>
      {/* Mirror Glass Reflection Effect */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/80 via-transparent to-slate-200/30 font-inter" />
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(135deg,rgba(255,255,255,0.4)_0%,rgba(255,255,255,0)_50%,rgba(255,255,255,0.1)_100%)]" />
      
      <div className={cn(
        "relative z-10 flex flex-col h-full transition-opacity duration-300",
        isCollapsed ? "opacity-0 invisible" : "opacity-100 visible"
      )}>
        <div className="p-5 border-b border-border/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-gray-500 font-black" />
            <h2 className="text-xs text-center font-black text-slate-900 uppercase tracking-widest">Notifications</h2>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={onToggle}
              className="group flex items-center gap-1.5 px-2 py-1 rounded-md border border-slate-200 bg-white text-slate-950 hover:text-gray-500 transition-all duration-300 shadow-sm active:scale-95"
              title="Close Sidebar"
            >
              <X className="h-3.5 w-3.5 transition-transform group-hover:rotate-90" />
              <span className="text-[9px] font-black uppercase tracking-widest">Close</span>
            </button>
            </div>

        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 custom-scrollbar">
          {notifications.map((notif) => {
            const styles = getClassificationStyles(notif.classification);
            const Icon = styles.icon;
            
            return (
              <div 
                key={notif.id}
                onClick={() => {
                  dispatch(markAsRead(notif.id));
                  onSelect(notif);
                }}
                className={cn(
                  "p-3 rounded-xl border flex flex-col gap-2 transition-all hover:translate-x-1 cursor-pointer group relative",
                  styles.bg,
                  !notif.isRead && "ring-1 ring-primary/20"
                )}
              >
                {!notif.isRead && (
                  <div className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-primary" />
                )}
                <div className="flex items-start justify-between">
                  <div className={cn("p-1.5 rounded-lg border", styles.iconBg)}>
                    <Icon className="h-3 w-3" />
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[9px] font-mono text-slate-500 group-hover:text-slate-700 transition-colors">
                      {new Date(notif.timestamp).toLocaleTimeString()}
                    </span>
                    <span className={cn("text-[7px] font-black uppercase tracking-tighter", styles.label)}>
                      {notif.classification}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-1">
                  <p className="text-[11px] font-bold text-slate-900 leading-relaxed">
                    <span className="text-primary">{notif.person_name}</span> detected at {notif.camera_location} of {notif.camera_id}, assigned a tracking ID <span className="font-mono text-[9px] text-slate-500">{notif.tracking_id}</span>
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                      Confidence: {(notif.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
          {notifications.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 opacity-50 py-20">
              <History className="h-8 w-8 mb-2" />
              <p className="text-[10px] font-bold uppercase tracking-widest">No recent incidents</p>
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-50 border-t border-border/20">
          <button 
            onClick={() => dispatch(clearNotifications())}
            className="w-full py-2.5 rounded-lg bg-white hover:bg-slate-50 text-[10px] font-black text-slate-600 uppercase tracking-widest border border-slate-200 transition-all shadow-sm flex items-center justify-center gap-2"
          >
            Clear Ledger <X className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationSidebar;
