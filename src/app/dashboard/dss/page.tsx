'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, Loader2, AlertCircle, LayoutDashboard, Search, Eye, Bell, ChevronLeft, Menu, X, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { BackgroundGrid } from '@/components/BackgroundGrid';
import Link from 'next/link';
import { useAppDispatch } from '@/store';
import { setAccessToken } from '@/store/slices/authSlice';
import { setUser } from '@/store/slices/userSlice';
import { requestOTP, verifyOTP } from '@/lib/api';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationBell } from '@/components/NotificationBell';
import { NotificationManager } from '@/components/NotificationManager';

export default function DSSPage() {
  const [step, setStep] = useState<'email' | 'token' | 'dashboard'>('email');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  const TOKEN_LENGTH = 24; // Length of the alphanumeric token
  
  const dispatch = useAppDispatch();
  useNotifications();

  // Automatic Sidebar Collapse for smaller screens (Tablets/Small Laptops)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarCollapsed(true);
      } else {
        setIsSidebarCollapsed(false);
      }
    };

    // Set initial state
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Removed email domain restriction - now accepts all emails
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }







    
    setIsLoading(true);
    
    try {
      const response = await requestOTP(email);
      setStep('token');
    } catch (err: any) {
      console.error('OTP request error:', err);
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTokenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (token.length !== TOKEN_LENGTH) {
      setError(`Please enter a valid ${TOKEN_LENGTH}-character security token.`);
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await verifyOTP(email, token);
      console.log('--- OTP Verification Response ---');
      console.log(response);

      // Extract the JWT access_token from the backend response
      const serverToken = response.access_token || response.accessToken;
      
      if (serverToken) {
        dispatch(setAccessToken(serverToken));
      } else {
        console.error('❌ Authentication failed: No access_token found in response.');
        setError('Login failed: Token not received from server.');
        return;
      }
      
      // Store user data in Redux if provided
      if (response.user) {
        dispatch(setUser(response.user));
      } else {
        // If user data not provided, create basic user object
        dispatch(setUser({ email }));
      }
      
      setStep('dashboard');
    } catch (err: any) {
      console.error('OTP verification error:', err);
      setError(err.response?.data?.message || 'Invalid security token. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
            className="relative z-10 flex min-h-screen flex-col items-center justify-center p-4"
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
                    style={{ backgroundColor: '#ffffff', opacity: 1 }}
                    className={cn(
                      "w-full rounded-lg border-2 border-border py-3 pl-10 pr-4 outline-none transition-all text-slate-900 focus:border-blue-600 focus:ring-0 shadow-sm",
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
                  className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-white/20 py-3 font-bold text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-50 shadow-md"
                >
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Request Access Token"}
                </button>

                <div className="pt-2">
                  <Link 
                    href="/" 
                    style={{ backgroundColor: '#94a3b8', opacity: 1 }}
                    className="flex w-full items-center justify-center rounded-lg border-2 border-white/20 py-3 text-base font-bold text-white transition-all hover:scale-105 active:scale-95 shadow-md"
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
            className="relative z-10 flex min-h-screen items-center justify-center p-4"
          >
            <AuthCard
              title="Token Verification"
              description={`A security token has been sent to ${email}. Please enter the ${TOKEN_LENGTH}-character code.`}
              onSubmit={handleTokenSubmit}
            >
              <div className="space-y-4">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    maxLength={TOKEN_LENGTH}
                    required
                    placeholder={`Enter ${TOKEN_LENGTH}-character token`}
                    style={{ backgroundColor: '#ffffff', opacity: 1 }}
                    className={cn(
                      "w-full rounded-lg border-2 border-border py-3 pl-10 pr-4 outline-none transition-all text-slate-900 font-mono text-sm tracking-wider uppercase focus:border-blue-600 focus:ring-0 shadow-sm",
                      error && "border-red-500 focus:border-red-500"
                    )}
                    value={token}
                    onChange={(e) => {
                      const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                      setToken(val);
                    }}
                  />
                </div>
                <div className="text-xs text-center text-slate-400 font-mono">
                  {token.length}/{TOKEN_LENGTH} characters
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
                  disabled={isLoading || token.length !== TOKEN_LENGTH}
                  style={{ backgroundColor: 'var(--primary)', opacity: 1 }}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-white/20 py-3 font-bold text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-50 shadow-md"
                >
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Authenticate Identity"}
                </button>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setStep('email')}
                    style={{ backgroundColor: '#94a3b8', opacity: 1 }}
                    className="flex w-full items-center justify-center rounded-lg border-2 border-white/20 py-3 text-base font-bold text-white transition-all hover:scale-105 active:scale-95 shadow-md"
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
            className="flex min-h-screen flex-col overflow-hidden bg-background lg:flex-row relative"
          >
            <NotificationManager />
            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
              {isMobileMenuOpen && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
                  />
                  <motion.aside
                    initial={{ x: '-100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '-100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="fixed inset-y-0 left-0 z-50 w-64 bg-card p-6 shadow-2xl lg:hidden"
                  >
                    <div className="flex items-center justify-between mb-10">
                      <div className="flex items-center gap-2">
                        <div className="bg-primary/10 px-2 py-6 rounded text-[10px] font-black tracking-[0.2em] text-primary uppercase">
                          Menu
                        </div>
                      </div>
                      <button 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="rounded-lg p-1 text-slate-500 hover:bg-muted"
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </div>
                    
                    <nav className="space-y-2">
                      <SidebarItem icon={<LayoutDashboard className="h-5 w-5" />} label="Overview" active onClick={() => setIsMobileMenuOpen(false)} />
                      <SidebarItem icon={<Search className="h-5 w-5" />} label="Surveillance" onClick={() => setIsMobileMenuOpen(false)} />
                      <SidebarItem icon={<Eye className="h-5 w-5" />} label="Intelligence" onClick={() => setIsMobileMenuOpen(false)} />
                      <SidebarItem icon={<Bell className="h-5 w-5" />} label="Incidents" onClick={() => setIsMobileMenuOpen(false)} />
                    </nav>
                  </motion.aside>
                </>
              )}
            </AnimatePresence>
            {/* Sidebar (Desktop/Tablet) */}
            <aside 
              className={cn(
                "hidden border-r border-border bg-card p-4 md:block transition-all duration-300 ease-in-out relative",
                isSidebarCollapsed ? "w-20" : "w-64"
              )}
            >
              <div className={cn("mb-8 flex items-center gap-3 px-2", isSidebarCollapsed && "justify-center px-0")}>
                <button 
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  className="flex items-center gap-2 rounded-md hover:bg-accent p-1.5 transition-all group"
                  title={isSidebarCollapsed ? "Expand Menu" : "Collapse Menu"}
                >
                  {isSidebarCollapsed ? <PanelLeftOpen className="h-5 w-5 text-primary" /> : <PanelLeftClose className="h-5 w-5 text-primary" />}
                  {!isSidebarCollapsed && (
                    <span className="text-xs font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">Menu</span>
                  )}
                </button>
              </div>
              
              <nav className="space-y-2">
                <SidebarItem icon={<LayoutDashboard className="h-5 w-5" />} label="Overview" active collapsed={isSidebarCollapsed} />
                <SidebarItem icon={<Search className="h-5 w-5" />} label="Surveil" collapsed={isSidebarCollapsed} />
                <SidebarItem icon={<Eye className="h-5 w-5" />} label="Intel" collapsed={isSidebarCollapsed} />
                <SidebarItem icon={<Bell className="h-5 w-5" />} label="Events" collapsed={isSidebarCollapsed} />
              </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 bg-background">
              {/* Header */}
              <header className="sticky top-0 z-50 bg-card shadow-md border-b border-border">
                <div className="mx-auto w-full px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-white p-1 shadow-sm border border-border/50">
                        <Image src="/dss-logo.png" alt="App Logo" fill className="object-contain p-1" sizes="40px" />
                      </div>
                      <div>
                        <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight leading-none">Secure Data Monitor</h1>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest hidden sm:block mt-1 opacity-70"> DSS</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="hidden md:flex flex-col items-end text-sm">
                        <span className="font-bold text-foreground">Officer {email.split('@')[0]}</span>
                        <span className="text-xs font-bold text-muted-foreground opacity-80">Authorized Access</span>
                      </div>
                      <div className="relative">
                        <NotificationBell />
                      </div>
                    </div>
                  </div>
                </div>
              </header>

              <div className="bg-background px-6 py-6 border-b border-border/50">
                <div className="max-w-7xl mx-auto">
                   <h2 className="text-3xl font-black text-foreground tracking-tight">Overview</h2>
                   <div className="h-1.5 w-12 bg-primary rounded-full mt-2" />
                </div>
              </div>

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
                             <div key={i} className="bg-muted rounded flex items-center justify-center font-mono text-[10px] text-muted-foreground border border-border">
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
                                <span className="text-muted-foreground/60">14:0{i}:22</span>
                                <span className="text-foreground font-bold">SYSTEM_ALERT_ID_{392+i}</span>
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
      style={{ backgroundColor: '#5F6B7A', opacity: 1, borderColor: 'var(--card-border)' }}
      className="relative z-20 w-full max-w-md overflow-hidden rounded-2xl border-2 p-8 shadow-2xl"
    >
      <div className="mb-6 text-center">
        <div className="flex justify-center mb-6">
           <div className="relative h-24 w-24">
              <Image src="/dss-logo.png" alt="DSS Logo" fill className="object-contain" sizes="(max-width: 768px) 96px, 96px" />
           </div>
        </div>
        <h2 
          className="mb-2 text-2xl font-bold tracking-tight text-white"
        >
          {title}
        </h2>
        <p 
          className="text-sm font-bold text-white/80"
        >
          {description}
        </p>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        {children}
      </form>
    </div>
  );
}

function SidebarItem({ icon, label, active = false, onClick, collapsed = false }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void, collapsed?: boolean }) {
  return (
    <button 
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={cn(
      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold transition-all",
      active ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:shadow-sm",
      collapsed && "justify-center px-0"
    )}>
      <div className={cn("min-w-[20px]", collapsed && "flex justify-center")}>{icon}</div>
      {!collapsed && <span className="whitespace-nowrap">{label}</span>}
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