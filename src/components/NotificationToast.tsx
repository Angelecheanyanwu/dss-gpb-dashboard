"use client";

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, AlertTriangle, ShieldCheck, Zap, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppSelector } from '@/store';

interface ToastProps {
  onSelect: (notif: any) => void;
  sidebarCollapsed: boolean;
}

const NotificationToast: React.FC<ToastProps> = ({ onSelect, sidebarCollapsed }) => {
  const { notifications } = useAppSelector((state) => state.notifications);
  const [latestNotif, setLatestNotif] = React.useState<any | null>(null);
  const [visible, setVisible] = React.useState(false);

  useEffect(() => {
    if (notifications.length > 0 && sidebarCollapsed) {
      const topNotif = notifications[0];
      // Only show if it's new (simple heuristic for demo)
      setLatestNotif(topNotif);
      setVisible(true);

      const timer = setTimeout(() => setVisible(false), 10000);
      return () => clearTimeout(timer);
    }
  }, [notifications, sidebarCollapsed]);

  const getClassificationStyles = (classification?: string) => {
    const status = (classification || 'Simple').toLowerCase();
    switch (status) {
      case 'grievous':
      case 'grevious':
        return { bg: "bg-red-500", icon: AlertTriangle };
      case 'severe':
        return { bg: "bg-orange-500", icon: Zap };
      case 'serious':
        return { bg: "bg-yellow-500", icon: Bell };
      case 'minor':
        return { bg: "bg-blue-500", icon: Info };
      case 'simple':
        return { bg: "bg-emerald-500", icon: ShieldCheck };
      default:
        return { bg: "bg-slate-500", icon: Info };
    }
  };

  if (!latestNotif || !visible) return null;

  const styles = getClassificationStyles(latestNotif.classification);
  const Icon = styles.icon;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, y: -100 }}
          className="fixed top-8 right-8 z-[100] w-72 pointer-events-auto"
        >
          <div 
            onClick={() => onSelect(latestNotif)}
            className="relative overflow-hidden group cursor-pointer bg-white rounded-xl shadow-2xl border-2 border-primary/20 p-4 transition-all hover:border-primary/40"
          >
            {/* Mirror Vibe Background */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/80 via-transparent to-slate-200/30" />
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(135deg,rgba(255,255,255,0.4)_0%,rgba(255,255,255,0)_50%,rgba(255,255,255,0.1)_100%)]" />
            
            <div className="relative z-10 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className={cn("p-1.5 rounded-lg text-white shadow-lg", styles.bg)}>
                  <Icon className="h-4 w-4" />
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); setVisible(false); }}
                  className="p-1 hover:bg-slate-100 rounded-md transition-colors"
                >
                  <X className="h-4 w-4 text-slate-400" />
                </button>
              </div>
              
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  {latestNotif.classification} ALERT
                </p>
                <p className="text-xs font-bold text-slate-900 leading-tight">
                  <span className="text-primary">{latestNotif.person_name}</span> detected at {latestNotif.camera_location}
                </p>
              </div>
              
              <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden mt-1">
                <motion.div 
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: 10, ease: "linear" }}
                  className={cn("h-full", styles.bg)}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationToast;
