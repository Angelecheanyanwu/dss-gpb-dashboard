'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Server, Globe, Database, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { BackgroundGrid } from '@/components/BackgroundGrid';

export default function Home() {
  const [showSignInOptions, setShowSignInOptions] = useState(false);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background p-4 font-sans text-foreground">
      
      <BackgroundGrid />

      {/* Hero Content */}
      <div className="z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-8 rounded-full bg-card p-6 shadow-xl ring-1 ring-border"
        >
          <ShieldCheck className="h-16 w-16 text-primary" />
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          style={{ backgroundImage: 'var(--heading-gradient)' }}
          className="mb-4 bg-clip-text text-5xl font-extrabold text-transparent sm:text-7xl"
        >
          Secure Data Monitor
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mb-12 max-w-2xl text-lg font-bold text-muted-foreground"
        >
          Advanced real-time surveillance and data integrity system for authorized personnel only. 
          Please identify your department to proceed.
        </motion.p>

        <AnimatePresence mode="wait">
          {!showSignInOptions ? (
            <motion.button
              key="signin-btn"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSignInOptions(true)}
              className="group relative flex items-center gap-3 rounded-full bg-secondary px-8 py-4 text-xl font-bold text-secondary-foreground transition-all hover:scale-105 shadow-xl"
            >
              <span>Authenticate Access</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </motion.button>
          ) : (
            <motion.div
              key="options-grid"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="grid w-full max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2"
            >
              <OptionCard 
                href="/dashboard/itl"
                title="ITL"
                icon={<div className="relative mb-4 h-16 w-40 overflow-hidden"><Image src="/itl-logo-v2-transparent.png" alt="ITL Logo" fill className="object-contain" /></div>}
                description="Inspired Technologies Limited"
                color="blue"
              />
              <OptionCard 
                href="/dashboard/dss"
                title="DSS"
                icon={<div className="relative mb-2 h-16 w-16 overflow-hidden rounded-full"><Image src="/dss-logo.png" alt="DSS Logo" fill className="object-contain" /></div>}
                description="Department of State Services"
                color="cyan"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="absolute bottom-4 left-0 right-0 flex justify-between px-8 text-xs font-mono text-slate-600">
        <span>Developed by Inspired Technologies Limited </span>
        <span>V.2.0.4</span>
      </div>
    </main>
  );
}

function OptionCard({ href, title, icon, description, color }: { href: string; title: string; icon: React.ReactNode; description: string; color: string }) {
  const colorVariants: Record<string, string> = {
    blue: "hover:shadow-blue-900 shadow-blue-900/40",
    emerald: "hover:shadow-emerald-900 shadow-emerald-900/40",
    cyan: "hover:shadow-blue-900 shadow-blue-900/40",
  };

  return (
    <Link href={href} className="w-full">
      <motion.div
        whileHover={{ y: -5 }}
        whileTap={{ scale: 0.98 }}
        style={{ 
          backgroundColor: 'var(--card)',
          opacity: 1
        }}
        className={`flex h-full flex-col items-center rounded-2xl p-6 text-center shadow-2xl transition-all ${colorVariants[color]}`}
      >
        {icon}
        <h3 className="mb-2 text-2xl font-bold text-card-foreground">{title}</h3>
        <p className="text-sm font-bold text-card-foreground/80">{description}</p>
      </motion.div>
    </Link>
  );
}
