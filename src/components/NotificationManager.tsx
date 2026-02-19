'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppSelector, useAppDispatch } from '@/store';
import { markAsRead, Notification as AppNotification } from '@/store/slices/notificationSlice';
import { AlertCircle, ShieldAlert, BellRing, Octagon, TriangleAlert, Fingerprint, X as LucideX } from 'lucide-react';
import Image from 'next/image';
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
  notification: AppNotification;
  onClose: () => void;
}

const Typewriter = ({ text, delay = 30, onComplete }: { text: string; delay?: number; onComplete?: () => void }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[index]);
        setIndex(prev => prev + 1);
      }, delay);
      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [index, text, delay, onComplete]);

  return <span>{displayedText}<span className="animate-pulse">|</span></span>;
};

const SeverityAlert = ({ notification, onClose }: SeverityProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [typingComplete, setTypingComplete] = useState(false);
  
  const rawClassification = (notification.classification || 'Simple').toLowerCase();
  let classification: 'Simple' | 'Minor' | 'Serious' | 'Severe' | 'Grievous' = 'Simple';
  
  if (rawClassification === 'grevious' || rawClassification === 'grievous') classification = 'Grievous';
  else if (rawClassification === 'severe') classification = 'Severe';
  else if (rawClassification === 'serious') classification = 'Serious';
  else if (rawClassification === 'minor') classification = 'Minor';

  const isHighIntensity = ['Serious', 'Severe', 'Grievous'].includes(classification);

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
    Simple: "bg-blue-600 border-blue-400 text-white",
    Minor: "bg-yellow-500 border-yellow-300 text-slate-900 shadow-yellow-500/20",
    Serious: "bg-red-600 border-red-400 text-white shadow-red-600/30",
    Severe: "bg-red-700 border-red-500 text-white shadow-red-700/40",
    Grievous: "bg-red-800 border-red-500 text-white shadow-red-800/60",
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

  const detailText = `${notification.person_name} has been detected at ${notification.camera_location} and ${new Date(notification.timestamp).toLocaleTimeString()} on ${notification.camera_id}. Tracking ID: ${notification.tracking_id}.`;

  if (isHighIntensity) {
    return (
      <motion.div 
        initial={{ x: '100vw', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '-100vw', opacity: 0, transition: { duration: 0.3 } }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        className="pointer-events-auto flex items-center justify-center relative z-[9999]"
      >
        <div className="flex items-center">
          {/* Hammer Handle (Body - Left) */}
          <motion.div 
            animate={(variants as any)[classification]}
            className={cn(
              "w-[460px] h-[320px] p-6 border-[3px] border-r-0 relative bg-slate-950 flex flex-col justify-between overflow-hidden",
              cssColors[classification]
            )}
          >
            <div className="flex justify-between items-center text-[10px] opacity-40 uppercase font-mono">
              <span>Investigation_Dossier</span>
              <span className="flex items-center gap-1"><div className="w-1 h-1 bg-red-500 animate-pulse" /> LIVE_SCAN</span>
            </div>

            <div className="flex-1 flex flex-col justify-center gap-6 font-mono">
              {!isExpanded ? (
                <>
                  <div className="space-y-2">
                    <h2 className="text-3xl font-black tracking-tighter uppercase text-red-500 italic leading-none">
                      {classification === 'Grievous' ? 'GRIEVOUS_THREAT' : 'SECURITY_BREACH'}
                    </h2>
                    <p className="text-sm font-black text-white px-2 py-1 bg-red-500/20 w-fit">{notification.person_name}</p>
                  </div>
                  
                  <motion.button 
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => { e.stopPropagation(); setIsExpanded(true); }}
                    className="w-full py-4 bg-red-600/10 text-red-500 font-black text-xs rounded-none border-2 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)] uppercase tracking-[0.3em] hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                  >
                    Click to view details
                  </motion.button>
                </>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-xl font-black tracking-tighter uppercase text-red-500 italic leading-none mb-1">Subject_Log</h2>
                    <div className="h-0.5 w-12 bg-red-500/40" />
                  </div>
                  <div className="text-sm font-bold text-red-100 leading-relaxed min-h-[120px] bg-red-500/5 p-4 border-l-2 border-red-500/30">
                    <Typewriter text={detailText} delay={70} onComplete={() => setTypingComplete(true)} />
                  </div>
                  
                  <motion.button 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => { e.stopPropagation(); onClose(); }}
                    className="w-full py-3 bg-red-600 text-white font-black text-[10px] rounded-none border-2 border-red-400 shadow-[0_0_20px_rgba(239,68,68,0.4)] uppercase tracking-[0.3em] hover:bg-red-500 transition-colors cursor-pointer"
                  >
                    FAST TRACK ARREST
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Hammer Head (Right - Image) */}
          <motion.div 
            animate={(variants as any)[classification]}
            className={cn(
              "w-[300px] h-[400px] border-[3px] relative bg-black shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col items-center justify-center p-2",
              cssColors[classification]
            )}
          >
            <div className="relative w-full h-full border-2 border-red-500/20 bg-slate-900 overflow-hidden">
              <Image src="/poi_profile.png" alt="POI" fill style={{ objectFit: 'cover' }} className={cn("transition-all duration-1000", isExpanded ? "opacity-100 contrast-125 saturate-150" : "opacity-40 grayscale")} />
              <div className="absolute inset-0 bg-red-500/5 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-500/10 to-transparent h-20 w-full animate-scanline pointer-events-none" />
              
              <AnimatePresence>
                {isExpanded && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute top-2 left-2 text-[8px] font-black text-red-500 space-y-1 bg-black/60 p-1 font-mono z-10"
                  >
                    <p>MATCH_ID: {Math.random().toFixed(3)}</p>
                    <p>CONF: 99.2%</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div 
                animate={{ rotate: 360, scale: isExpanded ? 1.2 : 1 }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-4 border border-red-500/30 border-dashed rounded-full pointer-events-none"
              />
            </div>
            
            <div className="mt-2 text-[10px] font-black text-red-500 uppercase flex items-center gap-2 font-mono">
              <div className="w-1.5 h-1.5 bg-red-500 animate-pulse rounded-full" />
              {notification.person_name}
            </div>

            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-red-500" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-red-500" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-red-500" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-red-500" />
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8, x: 50 }}
      layout
      className={cn("pointer-events-auto w-96 rounded-2xl border-2 p-5 shadow-2xl flex items-start gap-4 mb-4", colors[classification])}
    >
      <div className="p-2.5 rounded-xl bg-white/10 shrink-0"><Icon className="h-6 w-6" /></div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-widest opacity-70">{classification} Alert</span>
          <span className="text-[10px] opacity-50 font-mono font-bold">{new Date(notification.timestamp).toLocaleTimeString()}</span>
        </div>
        <p className="text-sm font-bold leading-tight">{notification.person_name} apprehended for a {classification} crime</p>
        <p className="text-[10px] opacity-70 font-bold uppercase tracking-wider">{notification.camera_location}</p>
      </div>
      <motion.button 
        whileTap={{ scale: 0.9 }}
        onPointerDown={(e) => { e.stopPropagation(); onClose(); }}
        className="text-white/30 hover:text-white transition-colors p-1"
      ><LucideX className="h-4 w-4" /></motion.button>
    </motion.div>
  );
};

// Main Exported Component
export const NotificationManager = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(state => state.notifications.notifications);
  const [activeAlerts, setActiveAlerts] = useState<AppNotification[]>([]);
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
    setActiveAlerts(prev => {
      const alertToRemove = prev.find(n => n.id === id);
      if (!alertToRemove) return prev;

      // Grouped removal: remove the specific alert and any duplicates (same person + location)
      const filtered = prev.filter(n => 
        n.id !== id && 
        !(n.person_name === alertToRemove.person_name && n.camera_location === alertToRemove.camera_location)
      );

      // Perform store cleanup side-effects
      dispatch(markAsRead(id));
      prev.forEach(n => {
        if (n.person_name === alertToRemove.person_name && n.camera_location === alertToRemove.camera_location) {
          dispatch(markAsRead(n.id));
        }
      });

      return filtered;
    });
  }, [dispatch]);

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
      <div className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center">
        <AnimatePresence mode="popLayout">
          {latestHighIntensity && (
            <React.Fragment key={latestHighIntensity.id}>
              {/* Cinematic Backdrop linked to alert lifecycle */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-md z-[-1] pointer-events-none"
              />
              <SeverityAlert 
                notification={latestHighIntensity} 
                onClose={() => removeAlert(latestHighIntensity.id)} 
              />
            </React.Fragment>
          )}
        </AnimatePresence>
      </div>

      <div className="fixed top-24 right-6 z-[9999] pointer-events-none flex flex-col items-end max-h-[80vh] overflow-visible gap-4">
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

// Main Exported Component end
