"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface ActionButton2Props {
  text: string;
  onClick?: () => void;
  bgColor?: string;
  borderColor?: string;
  textSmall?: boolean;
}

const ActionButton2: React.FC<ActionButton2Props> = ({ 
  text, 
  onClick, 
  bgColor = "primary", 
  borderColor = "primary",
  textSmall = false
}) => {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full py-3 rounded-lg font-black uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg border-2",
        bgColor === "blue-grey" ? "bg-blue-grey text-white" : "bg-primary text-primary-foreground",
        borderColor === "blue-grey" ? "border-blue-grey/50" : "border-white/10",
        textSmall ? "text-[10px]" : "text-xs"
      )}
    >
      {text}
    </button>
  );
};

export default ActionButton2;
