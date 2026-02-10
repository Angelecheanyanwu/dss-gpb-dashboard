'use client';

import { Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeContext';
import { motion } from 'framer-motion';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="fixed top-6 right-6 z-50">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleTheme}
        className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-border bg-card shadow-xl transition-all hover:scale-110"
        aria-label="Toggle theme"
      >
        {theme === 'light' ? (
          <Moon className="h-6 w-6 text-foreground" />
        ) : (
          <Sun className="h-6 w-6 text-amber-400" />
        )}
      </motion.button>
    </div>
  );
}
