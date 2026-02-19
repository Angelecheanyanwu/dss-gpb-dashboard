"use client";

import React from 'react';
import { Bell, AlertTriangle, ShieldCheck, History, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  type: 'alert' | 'warning' | 'info' | 'success';
  message: string;
  time: string;
  location?: string;
}

const mockNotifications: Notification[] = [
  { id: '1', type: 'alert', message: 'Unauthorized access detected at perimeter sector B4', time: '14:24:02', location: 'Gate 2' },
  { id: '2', type: 'warning', message: 'Camera CAM_RE_104 signal degradation detected', time: '14:20:15' },
  { id: '3', type: 'success', message: 'System integrity check complete - All nodes optimal', time: '14:05:00' },
  { id: '4', type: 'info', message: 'Patrol shift rotation scheduled for 15:00', time: '13:58:30' },
  { id: '5', type: 'alert', message: 'Bio-metric mismatch at command center elevator', time: '13:42:11', location: 'Elevator 3' },
  { id: '6', type: 'warning', message: 'Low storage capacity on secondary backup server', time: '13:30:45' },
];

const NotificationSidebar: React.FC = () => {
  return (
    <div className="h-full flex flex-col bg-slate-900 border-l border-slate-800 w-80 shadow-2xl">
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-slate-400" />
          <h2 className="text-xs font-black text-slate-100 uppercase tracking-widest">Incident Ledger</h2>
        </div>
        <div className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-[8px] font-bold text-slate-400 uppercase tracking-tighter">
          Live Feed
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 custom-scrollbar">
        {mockNotifications.map((notif) => (
          <div 
            key={notif.id}
            className={cn(
              "p-3 rounded-xl border flex flex-col gap-2 transition-all hover:translate-x-1 cursor-pointer group",
              notif.type === 'alert' && "bg-red-500/10 border-red-500/20 hover:border-red-500/40",
              notif.type === 'warning' && "bg-amber-500/10 border-amber-500/20 hover:border-amber-500/40",
              notif.type === 'info' && "bg-blue-500/10 border-blue-500/20 hover:border-blue-500/40",
              notif.type === 'success' && "bg-emerald-500/10 border-emerald-500/20 hover:border-emerald-500/40"
            )}
          >
            <div className="flex items-start justify-between">
              <div className={cn(
                "p-1.5 rounded-lg border",
                notif.type === 'alert' && "bg-red-500 text-white border-red-400/20",
                notif.type === 'warning' && "bg-amber-500 text-black border-amber-400/20",
                notif.type === 'info' && "bg-blue-500 text-white border-blue-400/20",
                notif.type === 'success' && "bg-emerald-500 text-white border-emerald-400/20"
              )}>
                {notif.type === 'alert' && <AlertTriangle className="h-3 w-3" />}
                {notif.type === 'warning' && <Bell className="h-3 w-3" />}
                {notif.type === 'info' && <ShieldCheck className="h-3 w-3" />}
                {notif.type === 'success' && <ShieldCheck className="h-3 w-3" />}
              </div>
              <span className="text-[9px] font-mono text-slate-500 group-hover:text-slate-300 transition-colors">
                {notif.time}
              </span>
            </div>
            
            <div className="flex flex-col gap-1">
              <p className="text-[11px] font-bold text-slate-200 leading-relaxed">
                {notif.message}
              </p>
              {notif.location && (
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">
                  At: {notif.location}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-slate-900/50 border-t border-slate-800">
        <button className="w-full py-2.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-[10px] font-black text-slate-300 uppercase tracking-widest border border-slate-700 transition-all flex items-center justify-center gap-2">
          Clear Ledger <X className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
};

export default NotificationSidebar;
