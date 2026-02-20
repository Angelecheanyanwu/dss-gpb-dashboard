"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Shield, Target, MapPin, Fingerprint, Activity, AlertTriangle, ShieldCheck, Zap, Bell, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PersonDetailModalProps {
  notification: any | null;
  onClose: () => void;
}

// Elegant typewriter — not too fast, not too slow (45ms per char)
const TypewriterText: React.FC<{ text: string; delay?: number }> = ({ text, delay = 0 }) => {
  const [displayedText, setDisplayedText] = useState("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setDisplayedText("");
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      let i = 0;
      intervalRef.current = setInterval(() => {
        i++;
        setDisplayedText(text.slice(0, i));
        if (i >= text.length) {
          if (intervalRef.current) clearInterval(intervalRef.current);
        }
      }, 45);
    }, delay);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [text, delay]);

  return (
    <span>
      {displayedText}
      {displayedText.length < text.length && (
        <span className="inline-block w-[2px] h-[0.85em] ml-[1px] align-middle bg-current opacity-70 animate-pulse" />
      )}
    </span>
  );
};

const getClassificationTheme = (classification?: string) => {
  const status = (classification || 'simple').toLowerCase();
  switch (status) {
    case 'grievous':
    case 'grevious':
      return {
        accent: "bg-red-500",
        accentLight: "bg-red-500/10",
        accentBorder: "border-red-200",
        accentText: "text-red-600",
        accentIcon: "bg-red-500 text-white",
        iconBadge: "bg-red-50",
        iconColor: "text-red-500",
        headerBg: "from-red-50 to-white",
        ring: "ring-red-200",
        icon: AlertTriangle,
        label: "GRIEVOUS",
      };
    case 'severe':
      return {
        accent: "bg-orange-500",
        accentLight: "bg-orange-500/10",
        accentBorder: "border-orange-200",
        accentText: "text-orange-600",
        accentIcon: "bg-orange-500 text-white",
        iconBadge: "bg-orange-50",
        iconColor: "text-orange-500",
        headerBg: "from-orange-50 to-white",
        ring: "ring-orange-200",
        icon: Zap,
        label: "SEVERE",
      };
    case 'serious':
      return {
        accent: "bg-yellow-500",
        accentLight: "bg-yellow-500/10",
        accentBorder: "border-yellow-200",
        accentText: "text-yellow-600",
        accentIcon: "bg-yellow-500 text-slate-900",
        iconBadge: "bg-yellow-50",
        iconColor: "text-yellow-500",
        headerBg: "from-yellow-50 to-white",
        ring: "ring-yellow-200",
        icon: Bell,
        label: "SERIOUS",
      };
    case 'minor':
      return {
        accent: "bg-blue-500",
        accentLight: "bg-blue-500/10",
        accentBorder: "border-blue-200",
        accentText: "text-blue-600",
        accentIcon: "bg-blue-500 text-white",
        iconBadge: "bg-blue-50",
        iconColor: "text-blue-500",
        headerBg: "from-blue-50 to-white",
        ring: "ring-blue-200",
        icon: Info,
        label: "MINOR",
      };
    case 'simple':
    default:
      return {
        accent: "bg-emerald-500",
        accentLight: "bg-emerald-500/10",
        accentBorder: "border-emerald-200",
        accentText: "text-emerald-600",
        accentIcon: "bg-emerald-500 text-white",
        iconBadge: "bg-emerald-50",
        iconColor: "text-emerald-500",
        headerBg: "from-emerald-50 to-white",
        ring: "ring-emerald-200",
        icon: ShieldCheck,
        label: "SIMPLE",
      };
  }
};

const PersonDetailModal: React.FC<PersonDetailModalProps> = ({ notification, onClose }) => {
  if (!notification) return null;

  const theme = getClassificationTheme(notification.classification);
  const ClassIcon = theme.icon;

  const mockDetails = [
    { label: "Full Name", value: notification.person_name, icon: User },
    { label: "Location", value: `${notification.camera_location} — ${notification.camera_id}`, icon: MapPin },
    { label: "Tracking ID", value: notification.tracking_id, icon: Target },
    { label: "Classification", value: notification.classification, icon: Shield },
    { label: "Biometric ID", value: "DSS-BIO-7729-X", icon: Fingerprint },
    { label: "Status", value: "Active Tracking", icon: Activity },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.93, opacity: 0, y: 24 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.93, opacity: 0, y: 24 }}
          transition={{ type: 'spring', stiffness: 280, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
          className={cn(
            "relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-[0_32px_128px_rgba(0,0,0,0.25)] border-2",
            theme.accentBorder
          )}
        >
          {/* Mirror glass */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/95 via-white/80 to-slate-100/40" />
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(135deg,rgba(255,255,255,0.5)_0%,rgba(255,255,255,0)_50%,rgba(255,255,255,0.1)_100%)]" />


          <div className="relative z-10 flex flex-col md:flex-row h-full max-h-[82vh]">

            {/* Left — avatar + identity */}
            <div className={cn(
              "w-full md:w-[42%] p-8 flex flex-col items-center justify-center gap-6 bg-gradient-to-b border-b md:border-b-0 md:border-r",
              theme.headerBg,
              theme.accentBorder
            )}>
              {/* Avatar */}
              <div className={cn(
                "relative w-40 h-40 rounded-2xl overflow-hidden border-2 shadow-xl ring-4",
                theme.accentBorder,
                theme.ring
              )}>
                <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
                  <User className="h-20 w-20 text-slate-300" />
                </div>
                {/* Scan line */}
                <motion.div
                  className={cn("absolute left-0 right-0 h-[2px] opacity-60 pointer-events-none", theme.accent)}
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                />
              </div>

              {/* Name + badge */}
              <div className="text-center space-y-2">
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight leading-tight">
                  <TypewriterText text={notification.person_name} delay={200} />
                </h2>

                {/* Classification badge */}
                <div className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest",
                  theme.accentLight,
                  theme.accentBorder,
                  theme.accentText
                )}>
                  <ClassIcon className="h-3 w-3" />
                  {theme.label}
                </div>

                {/* Live indicator */}
                <div className="flex items-center gap-2 justify-center pt-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">Live Detection</span>
                </div>
              </div>

              {/* Confidence meter */}
              <div className="w-full space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Confidence</span>
                  <span className={cn("text-[10px] font-black", theme.accentText)}>
                    {(notification.confidence * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    className={cn("h-full rounded-full", theme.accent)}
                    initial={{ width: 0 }}
                    animate={{ width: `${notification.confidence * 100}%` }}
                    transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.4 }}
                  />
                </div>
              </div>
            </div>

            {/* Right — dossier details */}
            <div className="w-full md:flex-1 p-8 flex flex-col gap-5 overflow-y-auto custom-scrollbar">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Incident Dossier</h3>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-full hover:bg-slate-100 transition-colors group"
                >
                  <X className="h-4 w-4 text-slate-400 group-hover:text-slate-700 transition-colors group-hover:rotate-90 duration-200" />
                </button>
              </div>

              <div className="space-y-3">
                {mockDetails.map((detail, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + idx * 0.07, duration: 0.35 }}
                    className="flex items-start gap-3 p-3 rounded-xl bg-white shadow-sm border border-slate-100"
                  >
                    <div className={cn("p-2 rounded-lg flex-shrink-0", theme.iconBadge)}>
                      <detail.icon className={cn("h-3.5 w-3.5", theme.iconColor)} />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
                        {detail.label}
                      </span>
                      <span className="text-[11px] font-bold text-slate-900 break-words">
                        <TypewriterText
                          text={String(detail.value || "UNKNOWN")}
                          delay={400 + idx * 120}
                        />
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-auto pt-2 flex gap-2">
                <button
                  onClick={onClose}
                  className={cn(
                    "flex-1 py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all active:scale-95",
                    theme.accentLight,
                    theme.accentBorder,
                    theme.accentText,
                    "hover:opacity-80"
                  )}
                >
                  Close File
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PersonDetailModal;