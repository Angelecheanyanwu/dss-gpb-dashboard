"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Shield, Target, MapPin, Fingerprint, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface PersonDetailModalProps {
  notification: any | null;
  onClose: () => void;
}

const TypewriterText: React.FC<{ text: string; delay?: number }> = ({ text, delay = 0 }) => {
  const [displayedText, setDisplayedText] = useState("");
  
  useEffect(() => {
    setDisplayedText("");
    const timeout = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        setDisplayedText(text.slice(0, i + 1));
        i++;
        if (i >= text.length) clearInterval(interval);
      }, 30);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [text, delay]);

  return <span>{displayedText}</span>;
};

const PersonDetailModal: React.FC<PersonDetailModalProps> = ({ notification, onClose }) => {
  if (!notification) return null;

  const mockDetails = [
    { label: "Person Name", value: notification.person_name, icon: User },
    { label: "Location", value: `${notification.camera_location} (${notification.camera_id})`, icon: MapPin },
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
        className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-[0_32px_128px_rgba(0,0,0,0.3)] border border-white/20"
        >
          {/* Mirror Effect */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/95 via-white/80 to-slate-100/40" />
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(135deg,rgba(255,255,255,0.4)_0%,rgba(255,255,255,0)_50%,rgba(255,255,255,0.1)_100%)]" />
          
          <div className="relative z-10 flex flex-col md:flex-row h-full max-h-[80vh]">
            {/* Left side: Face Capture */}
            <div className="w-full md:w-1/2 p-8 flex flex-col items-center justify-center gap-6 border-b md:border-b-0 md:border-r border-slate-100">
               <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-primary/20 shadow-2xl">
                  {/* Mock Capture Box Effects */}
                  <div className="absolute inset-0 z-10 border border-primary/30 animate-pulse pointer-events-none" />
                  <div className="absolute inset-0 z-10 bg-[linear-gradient(transparent_0%,rgba(37,99,235,0.05)_50%,transparent_100%)] h-1/4 w-full animate-scanline pointer-events-none" />
                  
                  <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
                    <User className="h-24 w-24 text-slate-300" />
                  </div>
                  {/* If we had a real image, we'd use it here */}
               </div>
               
               <div className="text-center">
                  <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                    <TypewriterText text={notification.person_name} />
                  </h2>
                  <div className="flex items-center gap-2 justify-center mt-1">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">LIVE DETECTION</span>
                  </div>
               </div>
            </div>

            {/* Right side: Metadata Typewriter */}
            <div className="w-full md:w-1/2 p-8 flex flex-col gap-6 bg-slate-50/30">
               <div className="flex items-center justify-between mb-2">
                 <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Incident Dossier</h3>
                 <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-200 transition-colors">
                   <X className="h-5 w-5 text-slate-500" />
                 </button>
               </div>

               <div className="space-y-4 overflow-y-auto custom-scrollbar pr-2">
                 {mockDetails.map((detail, idx) => (
                   <div key={idx} className="flex items-start gap-4 p-3 rounded-2xl bg-white shadow-sm border border-slate-100">
                     <div className="p-2 rounded-lg bg-blue-50">
                       <detail.icon className="h-4 w-4 text-primary" />
                     </div>
                     <div className="flex flex-col">
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                         {detail.label}
                       </span>
                       <span className="text-xs font-bold text-slate-900">
                         <TypewriterText text={detail.value || "UNKNOWN"} delay={idx * 150 + 500} />
                       </span>
                     </div>
                   </div>
                 ))}
               </div>

               <div className="mt-auto pt-6 flex gap-2">
                 <button className="flex-1 py-3 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] transition-all shadow-lg active:scale-95">
                   Apprehend POI
                 </button>
                 <button onClick={onClose} className="flex-1 py-3 rounded-xl bg-white border border-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95">
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
