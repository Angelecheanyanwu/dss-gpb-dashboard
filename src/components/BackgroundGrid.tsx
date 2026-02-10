'use client';

import { motion } from 'framer-motion';

export function BackgroundGrid() {
  return (
    <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
      <motion.div 
        className="absolute inset-0 bg-[linear-gradient(to_right,var(--grid-color)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid-color)_1px,transparent_1px)] bg-[size:4rem_4rem]"
        animate={{
          backgroundPosition: ["0rem 0rem", "4rem 4rem"]
        }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: "linear"
        }}
      />
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent"
        animate={{
          y: ['-100%', '100%']
        }}
        transition={{
          repeat: Infinity,
          duration: 10,
          ease: "linear"
        }}
      />
    </div>
  );
}
