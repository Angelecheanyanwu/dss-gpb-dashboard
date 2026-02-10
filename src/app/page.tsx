'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Server, Globe, Database, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const [showSignInOptions, setShowSignInOptions] = useState(false);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-950 p-4 font-sans text-slate-100">
      
      {/* Animated Background Grid */}
      <div className="absolute inset-0 z-0 opacity-20">
        <motion.div 
          className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem]"
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
          className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/10 to-transparent"
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

      {/* Hero Content */}
      <div className="z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-8 rounded-full bg-slate-900/80 p-6 shadow-[0_0_50px_-12px_rgba(59,130,246,0.5)] ring-1 ring-blue-500/30 backdrop-blur-sm"
        >
          <ShieldCheck className="h-16 w-16 text-blue-500" />
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mb-4 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-5xl font-extrabold text-transparent sm:text-7xl"
        >
          Secure Data Monitor
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mb-12 max-w-2xl text-lg text-slate-400"
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
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(59, 130, 246, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSignInOptions(true)}
              className="group relative flex items-center gap-3 rounded-full bg-blue-600 px-8 py-4 text-xl font-bold text-white transition-all hover:bg-blue-500"
            >
              <span>Authenticate Access</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              <div className="absolute inset-0 -z-10 rounded-full bg-blue-600 blur-lg transition-all group-hover:blur-xl opacity-50"></div>
            </motion.button>
          ) : (
            <motion.div
              key="options-grid"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="grid w-full max-w-3xl grid-cols-1 gap-6 sm:grid-cols-3"
            >
              <OptionCard 
                href="/dashboard/itl"
                title="ITL"
                icon={<div className="relative mb-4 h-16 w-40 overflow-hidden"><Image src="/itl-logo.png" alt="ITL Logo" fill className="object-contain" /></div>}
                description="Inspired Technologies Limited"
                color="blue"
              />
              <OptionCard 
                href="/dashboard/gbp"
                title="GBP"
                icon={<div className="relative mb-4 h-20 w-32 overflow-hidden"><Image src="/gbp-logo-transparent.png" alt="GBP Logo" fill className="object-contain" /></div>}
                description="Galaxy BackBone"
                color="emerald"
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

      {/* Footer / Status Bar - optional decorative element */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-between px-8 text-xs font-mono text-slate-600">
        <span>Developed by Inspired Technologies Limited </span>
        <span>V.2.0.4</span>
      </div>
    </main>
  );
}

function OptionCard({ href, title, icon, description, color }: { href: string; title: string; icon: React.ReactNode; description: string; color: string }) {
  const colorVariants: Record<string, string> = {
    blue: "hover:border-blue-500/50 hover:bg-blue-950/30",
    emerald: "hover:border-emerald-500/50 hover:bg-emerald-950/30",
    cyan: "hover:border-cyan-500/50 hover:bg-cyan-950/30",
  };

  return (
    <Link href={href} className="w-full">
      <motion.div
        whileHover={{ y: -5 }}
        whileTap={{ scale: 0.98 }}
        className={`flex h-full flex-col items-center rounded-2xl border border-slate-800 bg-slate-900/50 p-6 text-center backdrop-blur-sm transition-colors ${colorVariants[color]}`}
      >
        {icon}
        <h3 className="mb-2 text-2xl font-bold text-slate-100">{title}</h3>
        <p className="text-sm text-slate-400">{description}</p>
      </motion.div>
    </Link>
  );
}
