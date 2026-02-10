'use client';

import { motion } from 'framer-motion';

export function BackgroundGrid() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <motion.div 
        className="absolute inset-0 bg-[linear-gradient(to_right,var(--grid-color)_1.5px,transparent_1.5px),linear-gradient(to_bottom,var(--grid-color)_1.5px,transparent_1.5px)] bg-[size:4rem_4rem]"
        animate={{
          backgroundPosition: ["0rem 0rem", "4rem 4rem"]
        }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "linear"
        }}
      />
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/20 via-[percentage:50%_60%] to-transparent"
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
