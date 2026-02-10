'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Mail, Lock, ArrowRight, Loader2, AlertCircle, LayoutDashboard, Search, Eye, Bell, ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { BackgroundGrid } from '@/components/BackgroundGrid';
import Link from 'next/link';

export default function DSSPage() {
  const [step, setStep] = useState<'email' | 'token' | 'dashboard'>('email');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!email.endsWith('@dss.gov.ng')) {
      setError('Access restricted to authorized @dss.gov.ng email addresses.');
      return;
    }

    setIsLoading(true);
    // Simulate API call to send token
    setTimeout(() => {
      setIsLoading(false);
      setStep('token');
    }, 1500);
  };

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (token.length !== 6) {
      setError('Please enter a valid 6-digit security token.');
      return;
    }

    setIsLoading(true);
    // Simulate token verification
    setTimeout(() => {
      setIsLoading(false);
      if (token === '123456') { // Mock correct token
        setStep('dashboard');
      } else {
        setError('Invalid security token. Please try again.');
      }
    }, 1500);
  };

  return (
    <div className={cn(
      "relative min-h-screen bg-background text-foreground selection:bg-blue-600 selection:text-white",
      step !== 'dashboard' && "overflow-hidden"
    )}>
      {step !== 'dashboard' && <BackgroundGrid />}
      <AnimatePresence mode="wait">
        {step === 'email' && (
          <motion.div
            key="email-step"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex min-h-screen flex-col items-center justify-center p-4"
          >
            <AuthCard
              title="Identity Verification"
              description="Enter your authorized DSS personnel email to receive a secure access token."
              onSubmit={handleEmailSubmit}
            >
              <div className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    required
                    placeholder="angel.eche@dss.gov.ng"
                    style={{ backgroundColor: 'var(--card)', opacity: 1 }}
                    className={cn(
                      "w-full rounded-lg border-2 border-border py-3 pl-10 pr-4 outline-none transition-all placeholder:text-muted-foreground focus:border-secondary focus:ring-0 shadow-sm",
                      error && "border-red-500 focus:border-red-500"
                    )}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 text-sm text-red-400"
                  >
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </motion.div>
                )}
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{ backgroundColor: 'var(--primary)', opacity: 1 }}
                  className="flex w-full items-center justify-center gap-2 rounded-lg py-3 font-bold text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-50 shadow-md"
                >
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Request Access Token"}
                </button>

                <div className="pt-2">
                  <Link 
                    href="/" 
                    style={{ backgroundColor: 'var(--secondary)', opacity: 1 }}
                    className="flex w-full items-center justify-center rounded-lg py-3 text-base font-bold text-white transition-all hover:scale-105 active:scale-95 shadow-md"
                  >
                    Back
                  </Link>
                </div>
              </div>
            </AuthCard>
          </motion.div>
        )}

        {step === 'token' && (
          <motion.div
            key="token-step"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex min-h-screen items-center justify-center p-4"
          >
            <AuthCard
              title="Token Verification"
              description={`A security token has been sent to ${email}. Please enter it below.`}
              onSubmit={handleTokenSubmit}
            >
              <div className="space-y-4">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="Enter 6-digit token"
                    style={{ backgroundColor: 'var(--card)', opacity: 1 }}
                    className={cn(
                      "w-full rounded-lg border-2 border-border py-3 pl-10 pr-4 outline-none transition-all placeholder:text-muted-foreground focus:border-secondary focus:ring-0 shadow-sm",
                      error && "border-red-500 focus:border-red-500"
                    )}
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                  />
                </div>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 text-sm text-red-400"
                  >
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </motion.div>
                )}
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{ backgroundColor: 'var(--primary)', opacity: 1 }}
                  className="flex w-full items-center justify-center gap-2 rounded-lg py-3 font-bold text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-50 shadow-md"
                >
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Authenticate Identity"}
                </button>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setStep('email')}
                    style={{ backgroundColor: 'var(--secondary)', opacity: 1 }}
                    className="flex w-full items-center justify-center rounded-lg py-3 text-base font-bold text-white transition-all hover:scale-105 active:scale-95 shadow-md"
                  >
                    Back 
                  </button>
                </div>
              </div>
            </AuthCard>
          </motion.div>
        )}

        {step === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex min-h-screen flex-col overflow-hidden bg-background lg:flex-row"
          >
            {/* Sidebar (Desktop) */}
            <aside className="hidden w-64 border-r border-border bg-card p-6 lg:block">
              <div className="flex items-center gap-3 mb-10">
                <div className="relative h-10 w-10">
                  <Image src="/dss-logo.png" alt="DSS Logo" fill className="object-contain" />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-blue-600">DSS CMS</h2>
              </div>
              
              <nav className="space-y-2">
                <SidebarItem icon={<LayoutDashboard className="h-5 w-5" />} label="Overview" active />
                <SidebarItem icon={<Search className="h-5 w-5" />} label="Surveillance" />
                <SidebarItem icon={<Eye className="h-5 w-5" />} label="Intelligence" />
                <SidebarItem icon={<Bell className="h-5 w-5" />} label="Incidents" />
              </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 bg-background">
              {/* Header */}
              <header className="flex items-center justify-between border-b border-border bg-card px-6 py-4 shadow-sm">
                <div className="lg:hidden">
                   <Image src="/dss-logo.png" alt="DSS Logo" width={32} height={32} className="object-contain" />
                </div>
                <h1 className="text-lg font-bold lg:text-xl text-slate-800">Surveillance Control Panel</h1>
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-end text-sm">
                    <span className="font-bold text-slate-900">Officer {email.split('@')[0]}</span>
                    <span className="text-xs font-bold text-blue-600">Authorized Personnel</span>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center">
                    <ShieldCheck className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </header>

              {/* Dashboard Content */}
              <div className="flex-1 overflow-auto p-6 space-y-6">
                 {/* Stats Grid */}
                 <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                    <StatsCard label="Active Nodes" value="2,482" change="+12.5%" color="cyan" />
                    <StatsCard label="Traffic Pulse" value="184 GB/s" change="-2.1%" color="emerald" />
                    <StatsCard label="Security Alerts" value="03" change="NORMAL" color="blue" />
                    <StatsCard label="Uptime" value="99.98%" change="OPTIMAL" color="cyan" />
                 </div>

                 {/* Visualization Stubs */}
                   <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div 
                      style={{ borderColor: 'var(--card-border)' }}
                      className="lg:col-span-2 rounded-xl border-2 bg-card p-6 h-[400px] flex flex-col shadow-sm"
                    >
                       <h3 className="text-sm font-bold text-slate-500 mb-6 font-mono tracking-wider uppercase">Surveillance Feed Matrix</h3>
                       <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-2 opacity-50 relative">
                          {[...Array(6)].map((_, i) => (
                             <div key={i} className="bg-slate-100 rounded flex items-center justify-center font-mono text-[10px] text-slate-500 border border-slate-200">
                                CAM_RE_{i+100}
                             </div>
                          ))}
                       </div>
                    </div>
                    <div 
                      style={{ borderColor: 'var(--card-border)' }}
                      className="rounded-xl border-2 bg-card p-6 h-[400px] shadow-sm"
                    >
                       <h3 className="text-sm font-bold text-slate-500 mb-6 font-mono tracking-wider uppercase">Threat Logs</h3>
                       <div className="space-y-4 overflow-hidden">
                          {[...Array(5)].map((_, i) => (
                             <div key={i} className="flex gap-4 text-xs font-mono border-l-4 border-blue-500 pl-3">
                                <span className="text-slate-400">14:0{i}:22</span>
                                <span className="text-slate-700 font-bold">SYSTEM_ALERT_ID_{392+i}</span>
                             </div>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AuthCard({ title, description, children, onSubmit }: { title: string, description: string, children: React.ReactNode, onSubmit: (e: React.FormEvent) => void }) {
  return (
    <div 
      style={{ borderColor: 'var(--card-border)' }}
      className="w-full max-w-md overflow-hidden rounded-2xl border-2 bg-card shadow-2xl"
    >
      <div 
        style={{ background: 'var(--auth-header-bg)', borderBottomColor: 'var(--card-border)' }}
        className="p-8 text-center border-b-2"
      >
        <div className="flex justify-center mb-6">
           <div className="relative h-24 w-24">
              <Image src="/dss-logo.png" alt="DSS Logo" fill className="object-contain" />
           </div>
        </div>
        <h2 
          style={{ color: 'var(--auth-title)' }}
          className="mb-2 text-2xl font-bold tracking-tight"
        >
          {title}
        </h2>
        <p 
          style={{ color: 'var(--auth-desc)' }}
          className="text-sm font-bold"
        >
          {description}
        </p>
      </div>
      <form onSubmit={onSubmit} className="p-8">
        {children}
      </form>
    </div>
  );
}

function SidebarItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <button className={cn(
      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold transition-all",
      active ? "bg-blue-600 text-white shadow-md" : "text-slate-600 hover:bg-muted hover:text-blue-600 hover:shadow-sm"
    )}>
      {icon}
      {label}
    </button>
  );
}

function StatsCard({ label, value, change, color }: { label: string, value: string, change: string, color: 'cyan' | 'emerald' | 'blue' }) {
  const colorClasses = {
    cyan: "text-blue-600 border-blue-600 bg-blue-100 dark:bg-blue-900",
    emerald: "text-emerald-600 border-emerald-600 bg-emerald-100 dark:bg-emerald-900",
    blue: "text-indigo-600 border-indigo-600 bg-indigo-100 dark:bg-indigo-900",
  };

  return (
    <div 
      style={{ backgroundColor: 'var(--card)', borderColor: 'var(--card-border)' }}
      className="rounded-xl border-2 p-5 shadow-md transition-shadow"
    >
      <p className="text-xs font-bold text-muted-foreground font-mono tracking-wider mb-2 uppercase">{label}</p>
      <div className="flex items-end justify-between">
        <h4 className="text-2xl font-bold text-foreground">{value}</h4>
        <div className={cn("rounded-full border-2 px-2.5 py-1 text-[10px] font-bold tracking-tight", colorClasses[color])}>
           {change}
        </div>
      </div>
    </div>
  );
}
