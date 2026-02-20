"use client";

import React, { useEffect, useRef } from 'react';
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
  const [toastNotif, setToastNotif] = React.useState<any | null>(null);
  const [visible, setVisible] = React.useState(false);

  // Track the ID of the last notification we've already shown a toast for
  const lastShownIdRef = useRef<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (notifications.length === 0) return;

    const newest = notifications[0];

    // Only trigger if this is a brand-new notification we haven't toasted yet
    if (newest.id === lastShownIdRef.current) return;

    // Mark it as seen so clicks/re-renders don't retrigger
    lastShownIdRef.current = newest.id;

    // If sidebar is open, let it appear there — no toast needed
    if (!sidebarCollapsed) return;

    setToastNotif(newest);
    setVisible(true);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setVisible(false), 10000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [notifications]); // intentionally NOT depending on sidebarCollapsed — we only react to new notifications

  const getClassificationStyles = (classification?: string) => {
    const status = (classification || 'Simple').toLowerCase();
    switch (status) {
      case 'grievous':
      case 'grevious':
        return { bg: "bg-red-500", label: "text-red-600", border: "border-red-200" };
      case 'severe':
        return { bg: "bg-orange-500", label: "text-orange-600", border: "border-orange-200" };
      case 'serious':
        return { bg: "bg-yellow-500", label: "text-yellow-600", border: "border-yellow-200" };
      case 'minor':
        return { bg: "bg-blue-500", label: "text-blue-600", border: "border-blue-200" };
      case 'simple':
        return { bg: "bg-emerald-500", label: "text-emerald-600", border: "border-emerald-200" };
      default:
        return { bg: "bg-slate-500", label: "text-slate-600", border: "border-slate-200" };
    }
  };

  const getIcon = (classification?: string) => {
    const status = (classification || 'Simple').toLowerCase();
    switch (status) {
      case 'grievous':
      case 'grevious': return AlertTriangle;
      case 'severe': return Zap;
      case 'serious': return Bell;
      case 'minor': return Info;
      case 'simple': return ShieldCheck;
      default: return Info;
    }
  };

  if (!toastNotif) return null;

  const styles = getClassificationStyles(toastNotif.classification);
  const Icon = getIcon(toastNotif.classification);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={toastNotif.id}
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{
            x: { type: 'tween', ease: [0.25, 0.46, 0.45, 0.94], duration: 0.8 },
            opacity: { duration: 0.4 },
            exit: { duration: 0.25 },
          }}
          className="fixed bottom-32 left-1/2 -translate-x-1/2 z-[100] w-72 pointer-events-auto"
        >
          <div
            onClick={() => {
              onSelect(toastNotif);
              setVisible(false);
            }}
            className={cn(
              "relative overflow-hidden cursor-pointer bg-white rounded-xl shadow-2xl border-2 p-4",
              styles.border
            )}
          >
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
                <p className={cn("text-[10px] font-black uppercase tracking-widest", styles.label)}>
                  {toastNotif.classification} Alert
                </p>
                <p className="text-xs font-bold text-slate-900 leading-tight">
                  <span className="text-primary">{toastNotif.person_name}</span> detected at {toastNotif.camera_location}
                </p>
              </div>

              <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden mt-1">
                <motion.div
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: 10, ease: 'linear' }}
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