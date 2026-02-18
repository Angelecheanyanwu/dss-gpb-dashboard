'use strict';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppSelector, useAppDispatch } from '@/store';
import { markAsRead, Notification } from '@/store/slices/notificationSlice';
import { AlertCircle, ShieldAlert, BellRing, Octagon, TriangleAlert, Fingerprint } from 'lucide-react';
import { cn } from '@/lib/utils';

// --- Sound Engine (Web Audio API) ---
const playAlarm = (severity: string): { stop: () => void } | void => {
  if (typeof window === 'undefined') return;
  
  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  const playTone = (freq: number, duration: number, start: number, volume: number = 0.1, type: OscillatorType = 'sine') => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
    gain.gain.setValueAtTime(volume, ctx.currentTime + start);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime + start);
    osc.stop(ctx.currentTime + start + duration);
  };

  if (severity === 'Simple') {
    playTone(880, 0.1, 0);
    return;
  }
  
  if (severity === 'Minor') {
    playTone(660, 0.08, 0);
    playTone(660, 0.08, 0.1);
    return;
  }

  // Cinematic Synthetic Alarm for high intensity
  if (['Serious', 'Severe', 'Grievous'].includes(severity)) {
    const interval = setInterval(() => {
      // 1. Digital Chirp (Balanced frequency)
      playTone(2000, 0.04, 0, 0.15, 'triangle');
      playTone(2000, 0.04, 0.1, 0.15, 'triangle');
      
      // 2. Heartbeat Thump (Deep Bass - 45Hz)
      playTone(45, 0.3, 0, 0.6, 'sine');
      
      // 3. System Alert Sequence (Medium Resonance)
      if (Math.random() > 0.5) {
        playTone(800, 0.03, 0.3, 0.1, 'triangle');
      }
    }, 700);

    return {
      stop: () => {
        clearInterval(interval);
        ctx.close();
      }
    };
  }
};

interface SeverityProps {
  notification: Notification;
  onClose: () => void;
}

const SeverityAlert = ({ notification, onClose }: SeverityProps) => {
  // Normalize classification to handle case-sensitivity and common misspelling from backend
  const rawClassification = (notification.classification || 'Simple').toLowerCase();
  
  let classification: 'Simple' | 'Minor' | 'Serious' | 'Severe' | 'Grievous';
  
  if (rawClassification === 'grevious' || rawClassification === 'grievous') {
    classification = 'Grievous';
  } else if (rawClassification === 'severe') {
    classification = 'Severe';
  } else if (rawClassification === 'serious') {
    classification = 'Serious';
  } else if (rawClassification === 'minor') {
    classification = 'Minor';
  } else {
    classification = 'Simple';
  }
  
  const isHighIntensity = ['Serious', 'Severe', 'Grievous'].includes(classification);

  // Animation Variants
  const variants = {
    Simple: { scale: [1, 1.05, 1], transition: { duration: 0.8, repeat: 1 } },
    Minor: { scale: [1, 1.1, 1], x: [0, -2, 2, 0], transition: { duration: 0.5, repeat: 1 } },
    Serious: { x: [-6, 6, -6], transition: { duration: 0.5, repeat: Infinity } },
    Severe: { x: [-8, 8, -8], transition: { duration: 0.4, repeat: Infinity } },
    Grievous: { x: [-10, 10, -10], transition: { duration: 0.3, repeat: Infinity } },
  };

  const cssColors = {
    Simple: "border-blue-500 text-blue-500 shadow-blue-500/30 bg-blue-950/90",
    Minor: "border-yellow-500 text-yellow-500 shadow-yellow-500/30 bg-slate-950/90",
    Serious: "border-red-600 text-red-500 shadow-red-600/30 bg-slate-950/90",
    Severe: "border-red-700 text-red-500 shadow-red-700/30 bg-slate-950/90",
    Grievous: "border-red-800 text-red-500 shadow-red-800/60 bg-slate-950/90",
  };

  const colors = {
    Simple: "bg-blue-600 border-blue-400 text-white", // Blue for Simple
    Minor: "bg-yellow-500 border-yellow-300 text-slate-900 shadow-yellow-500/20", // Yellow for Minor
    Serious: "bg-red-600 border-red-400 text-white shadow-red-600/30", // Red for Serious
    Severe: "bg-red-700 border-red-500 text-white shadow-red-700/40",
    Grievous: "bg-red-800 border-red-500 text-white shadow-red-800/60 ring-4 ring-red-600/30",
  };

  const Icons = {
    Simple: BellRing,
    Minor: BellRing,
    Serious: ShieldAlert,
    Severe: TriangleAlert,
    Grievous: Octagon,
  };

  const Icon = Icons[classification] || BellRing;

  useEffect(() => {
    const alarm = playAlarm(classification);
    return () => alarm?.stop();
  }, [classification]);

  if (isHighIntensity) {
    return (
      <>
        <motion.div 
          animate={variants[classification]}
          className={cn(
            "w-96 p-8 rounded-none border-[3px] text-center space-y-6 shadow-2xl relative overflow-hidden pointer-events-auto", 
            cssColors[classification],
            "font-mono transition-none"
          )}
        >
          {/* Cyber Corners */}
          <div className={cn("absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2", classification === 'Simple' ? 'border-blue-500' : 'border-red-500')} />
          <div className={cn("absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2", classification === 'Simple' ? 'border-blue-500' : 'border-red-500')} />
          <div className={cn("absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2", classification === 'Simple' ? 'border-blue-500' : 'border-red-500')} />
          <div className={cn("absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2", classification === 'Simple' ? 'border-blue-500' : 'border-red-500')} />

          {/* Glitch Overlay */}
          <motion.div 
            animate={{ opacity: [0, 0.1, 0, 0.2, 0] }}
            transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 2 }}
            className={cn("absolute inset-0 z-0 pointer-events-none", classification === 'Simple' ? 'bg-blue-500/5' : 'bg-red-500/10')}
          />

          <div className="flex justify-between items-center text-[10px] opacity-60 z-10 relative">
            <span>SEC_SYSTEM_v4.5</span>
            <span>{notification.camera_id}</span>
          </div>

          <div className="flex justify-center relative z-10 group">
            {/* Target Crosshairs */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
              className={cn("absolute -inset-4 border border-dashed opacity-30", classification === 'Simple' ? 'border-blue-500' : 'border-red-500')}
            />
            <div className={cn("p-6 border-2 relative", classification === 'Simple' ? 'bg-blue-950/50 border-blue-500/50' : 'bg-red-950/50 border-red-500/50')}>
               <Icon className={cn("h-16 w-16", classification === 'Simple' ? 'text-blue-500' : classification === 'Minor' ? 'text-yellow-500' : 'text-red-500')} />
               <motion.div 
                 animate={{ scale: [1, 1.2, 1] }}
                 transition={{ duration: 1.5, repeat: Infinity }}
                 className={cn("absolute -top-1 -right-1 w-3 h-3 rounded-full shadow-lg", classification === 'Simple' ? 'bg-blue-500 shadow-blue-500' : classification === 'Minor' ? 'bg-yellow-500 shadow-yellow-500' : 'bg-red-500 shadow-red-500')}
               />
            </div>
          </div>
          
          <div className="space-y-4 relative z-10 text-left">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={cn("w-2 h-2 animate-pulse", classification === 'Simple' ? 'bg-blue-500' : classification === 'Minor' ? 'bg-yellow-500' : 'bg-red-500')} />
                <h2 className={cn("text-xl font-black tracking-widest uppercase", classification === 'Simple' ? 'text-blue-500' : classification === 'Minor' ? 'text-yellow-500' : 'text-red-500')}>
                  {classification === 'Grievous' ? 'GRIEVOUS_THREAT' : 'SECURITY_BREACH'}
                </h2>
              </div>
              <p className="text-[10px] font-bold opacity-60 uppercase leading-none">Status: APPREHENDED</p>
            </div>
            
            <div className={cn("p-3 border space-y-2 bg-black/20", classification === 'Simple' ? 'border-blue-500/20' : classification === 'Minor' ? 'border-yellow-500/20' : 'border-red-500/20')}>
              <div className="flex justify-between text-[10px] opacity-40 uppercase">
                <span>Identity_ID</span>
                <span>Location_Fix</span>
              </div>
              <div className="flex justify-between items-end">
                <p className="text-sm font-black text-white">{notification.person_name}</p>
                <p className="text-[10px] font-bold opacity-80">{notification.camera_location}</p>
              </div>
            </div>
          </div>

          <motion.button 
            whileTap={{ scale: 0.95 }}
            onPointerDown={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className={cn(
              "w-full py-4 text-white font-black text-sm rounded-none border-2 transition-all shadow-2xl uppercase tracking-[0.2em] relative z-10",
              classification === 'Simple' ? 'bg-blue-600 border-blue-400 hover:bg-blue-500' : classification === 'Minor' ? 'bg-yellow-600 border-yellow-400 hover:bg-yellow-500' : 'bg-red-600 border-red-400 hover:bg-red-500'
            )}
          >
            Click to view details
          </motion.button>
        </motion.div>
        
        {/* Cinematic Glitch Frames */}
        <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: [0, 0.2, 0] }}
           transition={{ duration: 2, repeat: Infinity }}
           className={cn(
             "absolute inset-0 pointer-events-none border-[20px]",
             classification === 'Simple' ? 'border-blue-900/10' : 'border-red-900/10'
           )}
        />
      </>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8, x: 50 }}
      layout
      className={cn(
        "pointer-events-auto w-96 rounded-2xl border-2 p-5 shadow-2xl flex items-start gap-4 mb-4",
        colors[classification]
      )}
    >
      <div className="p-2.5 rounded-xl bg-white/10 shrink-0">
        <Icon className="h-6 w-6" />
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-widest opacity-70">{classification} Alert</span>
          <span className="text-[10px] opacity-50 font-mono font-bold">{new Date(notification.timestamp).toLocaleTimeString()}</span>
        </div>
        <p className="text-sm font-bold leading-tight">
          {notification.person_name} apprehended for a {classification} crime
        </p>
        <p className="text-[10px] opacity-70 font-bold uppercase tracking-wider">{notification.camera_location}</p>
      </div>
      <motion.button 
        whileTap={{ scale: 0.9 }}
        onPointerDown={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="text-white/30 hover:text-white transition-colors p-1"
      >
        <X className="h-4 w-4" />
      </motion.button>
    </motion.div>
  );
};

// Main Exported Component
export const NotificationManager = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(state => state.notifications.notifications);
  const [activeAlerts, setActiveAlerts] = useState<Notification[]>([]);
  const processedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Detect new notifications
    const newOnes = notifications.filter(n => !n.isRead && !processedRef.current.has(n.id));
    if (newOnes.length > 0) {
      setActiveAlerts(prev => [...prev, ...newOnes]);
      newOnes.forEach(n => processedRef.current.add(n.id));
    }
  }, [notifications]);

  const removeAlert = useCallback((id: string) => {
    const alertToRemove = activeAlerts.find(n => n.id === id);
    if (!alertToRemove) return;

    // Suppress duplicates: remove all active alerts for the same person & location
    setActiveAlerts(prev => prev.filter(n => 
      n.id !== id && 
      !(n.person_name === alertToRemove.person_name && n.camera_location === alertToRemove.camera_location)
    ));

    // Mark as read in the store
    dispatch(markAsRead(id));
    
    // Also mark any potential duplicates as read in the store to be safe
    activeAlerts.forEach(n => {
      if (n.person_name === alertToRemove.person_name && n.camera_location === alertToRemove.camera_location) {
        dispatch(markAsRead(n.id));
      }
    });
  }, [dispatch, activeAlerts]);

  // Determine if we have high-intensity alerts
  const highIntensityAlerts = activeAlerts.filter(n => 
    ['serious', 'severe', 'grievous', 'grevious'].includes((n.classification || '').toLowerCase())
  );
  
  const hasHighIntensity = highIntensityAlerts.length > 0;
  // In I-Robot/CIA mode, if there are multiple, we only want to show the LATEST one to prevent stacking
  const latestHighIntensity = highIntensityAlerts[highIntensityAlerts.length - 1];
  const sideToasts = activeAlerts.filter(n => !['serious', 'severe', 'grievous', 'grevious'].includes((n.classification || '').toLowerCase()));

  return (
    <>
      <AnimatePresence>
        {hasHighIntensity && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9998] bg-black/10 backdrop-blur-sm pointer-events-none"
          />
        )}
      </AnimatePresence>

      <div className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center">
        <AnimatePresence mode="wait">
          {latestHighIntensity && (
            <SeverityAlert 
              key={latestHighIntensity.id} 
              notification={latestHighIntensity} 
              onClose={() => removeAlert(latestHighIntensity.id)} 
            />
          )}
        </AnimatePresence>
      </div>

      <div className="fixed top-24 right-6 z-[9999] pointer-events-none flex flex-col items-end max-h-[80vh] overflow-visible">
        <AnimatePresence mode="popLayout">
          {sideToasts.map(notification => (
            <SeverityAlert 
              key={notification.id} 
              notification={notification} 
              onClose={() => removeAlert(notification.id)} 
            />
          ))}
        </AnimatePresence>
      </div>
    </>
  );
};

// Help icons
function X({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
  );
}
