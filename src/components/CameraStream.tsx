"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Maximize2, Minimize2, User, Loader2, Pin, PinOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CameraStreamProps {
  src: string;
  isActive?: boolean;
  onClick?: () => void;
  personClick?: () => void;
  showPersons?: boolean;
  setShowPersons?: (show: boolean) => void;
  streamFaces?: any[];
  selectedStream?: any;
  personsLoading?: boolean;
}

const CameraStream: React.FC<CameraStreamProps> = ({
  src,
  isActive = false,
  onClick,
  personClick,
  showPersons = false,
  setShowPersons,
  streamFaces = [],
  selectedStream,
  personsLoading = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div 
      className={cn(
        "relative group h-full w-full overflow-hidden rounded-xl bg-slate-900 border-2 transition-all duration-300",
        isActive ? "border-primary shadow-lg scale-[0.99]" : "border-slate-800 hover:border-slate-700"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Stream Video Stub / Placeholder */}
      <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
        <div className="text-slate-700 font-mono text-xs animate-pulse">
          CONNECTING_STREAM_{src.split('/').pop()?.toUpperCase() || 'UNK'}...
        </div>
      </div>

      {/* Actual Video would go here, using an iframe or video tag depending on the source type */}
      {/* For now, we'll keep it as a "mature" looking placeholder that looks like a live feed */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
        <div className="w-full h-1 bg-primary/20 animate-scanline" />
      </div>

      {/* Controls Overlay */}
      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button 
          onClick={(e) => { e.stopPropagation(); onClick?.(); }}
          className="p-1.5 rounded-lg bg-black/40 backdrop-blur-md text-white border border-white/20 hover:bg-black/60 transition-colors"
          title={isActive ? "Unpin Stream" : "Pin Stream"}
        >
          {isActive ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); personClick?.(); }}
          className="p-1.5 rounded-lg bg-black/40 backdrop-blur-md text-white border border-white/20 hover:bg-black/60 transition-colors"
          title="Identify Persons"
        >
          <User className="h-4 w-4" />
        </button>
      </div>

      {/* Label Overlay */}
      <div className="absolute bottom-3 left-3 flex flex-col gap-0.5">
        <span className="text-[10px] font-black text-white px-2 py-0.5 bg-black/40 backdrop-blur-md rounded border border-white/10 uppercase tracking-widest">
          {src.split('/').pop()?.toUpperCase() || 'CAM_UNKNOWN'}
        </span>
        <div className="flex items-center gap-1.5 ml-0.5">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[8px] font-bold text-emerald-500/80 uppercase tracking-tighter">Live Feed</span>
        </div>
      </div>

      {/* Person Identification Overlay */}
      {showPersons && selectedStream?.id && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm p-4 flex flex-col gap-2 overflow-y-auto">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Identified Personnel</h4>
            <button onClick={() => setShowPersons?.(false)} className="text-white/60 hover:text-white">
              <Maximize2 className="h-3 w-3" />
            </button>
          </div>
          
          {personsLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="h-6 w-6 text-white animate-spin opacity-50" />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {streamFaces.map((face, idx) => (
                <div key={idx} className="bg-white/10 border border-white/10 rounded-lg p-2 flex flex-col gap-1 items-center">
                  <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden">
                    <User className="h-5 w-5 text-white/40" />
                  </div>
                  <span className="text-[8px] font-bold text-white truncate w-full text-center">{face.name || 'Unknown'}</span>
                  <span className="text-[6px] font-medium text-emerald-400 capitalize">{face.confidence || '98% Match'}</span>
                </div>
              ))}
              {streamFaces.length === 0 && (
                <div className="col-span-2 text-center text-white/40 text-[10px] py-4">
                  No matches found in frame
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CameraStream;
