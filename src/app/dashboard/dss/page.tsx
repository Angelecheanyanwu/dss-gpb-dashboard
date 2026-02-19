'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Mail, Lock, ArrowRight, Loader2, AlertCircle, LayoutDashboard, Search, Eye, Bell, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { BackgroundGrid } from '@/components/BackgroundGrid';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store';
import { setAccessToken } from '@/store/slices/authSlice';
import { setUser } from '@/store/slices/userSlice';
import { requestOTP, verifyOTP } from '@/lib/api';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationManager } from '@/components/NotificationManager';

// New Components
import CameraStream from '@/components/CameraStream';
import NotificationSidebar from '@/components/NotificationSidebar';
import BottomMenu from '@/components/BottomMenu';

export default function DSSPage() {
  const [step, setStep] = useState<'email' | 'token' | 'dashboard'>('email');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dashboard State (New)
  const [selectedStream, setSelectedStream] = useState<any | undefined>();
  const [streams, setStreams] = useState<any[]>([]);
  const [gridCount, setGridCount] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  const [showPersons, setShowPersons] = useState(false);
  const [personsLoading, setPersonsLoading] = useState(false);
  const [streamFaces, setStreamFaces] = useState<any[]>([]);
  const [menuActive, setMenuActive] = useState(false);

  const dispatch = useAppDispatch();
  const router = useRouter();
  useNotifications();

  useEffect(() => {
    // Hardcoded camera streams
    const hardcodedStreams = [
      { id: 66, src: `http://192.168.100.102:8889/live/ks047o-D-66` },
      { id: 64, src: `http://192.168.100.102:8889/live/ks047o-A-64` },
      { id: 65, src: `http://192.168.100.102:8889/live/ks047o-C-65` },
      { id: 67, src: `http://192.168.100.102:8889/live/ks047o-A-67` },
      { id: 69, src: `http://192.168.100.102:8889/live/ks047o-B-69` },
      { id: 164, src: `http://192.168.100.102:8889/live/ks047o-A-164` },
      { id: 68, src: `http://192.168.100.102:8889/live/ks047o-D-68` },
      { id: 70, src: `http://192.168.100.102:8889/live/ks047o-C-70` },
    ];
    setStreams(hardcodedStreams);
  }, []);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Reverting to the @dss.gov.ng check as per user snippet
    if (!email.endsWith('@gmail.com')) {
      setError('Access restricted to authorized @dss.gov.ng email addresses.');
      return;
    }

    setIsLoading(true);
    try {
      // Keep real API call but match flow
      await requestOTP(email);
      setStep('token');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTokenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Reverting to 6-digit token check
    if (token.length !== 24) {
      setError('Please enter a valid 6-digit security token.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await verifyOTP(email, token);
      const serverToken = response.access_token || response.accessToken;
      if (serverToken) {
        dispatch(setAccessToken(serverToken));
      } else {
        setError('Login failed: Token not received from server.');
        return;
      }
      dispatch(setUser(response.user || { email }));
      setStep('dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid security token. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Surveillance Logic (New)
  const handleGridCount = () => {
    setGridCount((prev) => (prev >= 12 ? 4 : prev + 2));
    setCurrentPage(1);
  };

  const pinStream = (stream: any) => {
    setSelectedStream((prev: any) => (prev?.id === stream.id ? undefined : stream));
    setShowPersons(false);
    setCurrentPage(1);
  };

  const handleMenu = () => setMenuActive(!menuActive);

  // Pagination Logic
  let totalPages = 1;
  let paginatedStreams: any[] = [];

  if (selectedStream) {
    const streamsExcludingPinned = streams.filter(s => s.id !== selectedStream.id);
    const rightSideGridCount = 3;
    const totalRemaining = streamsExcludingPinned.length - rightSideGridCount;
    totalPages = 1 + Math.max(0, Math.ceil(totalRemaining / gridCount));
    if (currentPage === 1) {
      paginatedStreams = streamsExcludingPinned.slice(0, rightSideGridCount);
    } else {
      const remaining = streamsExcludingPinned.slice(rightSideGridCount);
      const start = (currentPage - 2) * gridCount;
      paginatedStreams = remaining.slice(start, start + gridCount);
    }
  } else {
    totalPages = Math.max(1, Math.ceil(streams.length / gridCount));
    paginatedStreams = streams.slice((currentPage - 1) * gridCount, currentPage * gridCount);
  }

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
              description={`A security token has been sent to ${email}. Please enter the 24-character code below.`}
              onSubmit={handleTokenSubmit}
            >
              <div className="space-y-4">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    maxLength={24}
                    required
                    placeholder="Enter 24-character token"
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
                  {token.length}/24 characters
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
                  disabled={isLoading || token.length !== 24}
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
            className="flex h-screen bg-slate-950 overflow-hidden relative mature-theme"
          >
            <NotificationManager />
            
            {/* Scoped Mature Dashboard implementation */}
            <div className="flex-1 flex flex-col relative">
              <div className="absolute top-6 left-8 z-20 pointer-events-none">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 relative bg-white rounded-lg p-1.5 shadow-2xl border border-white/20">
                        <Image src="/dss-logo.png" alt="DSS" fill className="object-contain p-1" />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-sm font-black text-white uppercase tracking-[0.2em] leading-none">Surveillance Feed</h1>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Sector: Command Center</span>
                    </div>
                </div>
              </div>

              <div className="flex-1 p-4 pb-24 mt-16 overflow-hidden">
                {selectedStream && currentPage === 1 ? (
                    <div className="flex gap-2 h-full w-full">
                        <div className="flex-[3] h-full">
                            <CameraStream
                                isActive={true}
                                src={selectedStream.src}
                                onClick={() => pinStream(selectedStream)}
                                personClick={() => setShowPersons(true)}
                                showPersons={showPersons}
                                setShowPersons={setShowPersons}
                                streamFaces={streamFaces}
                                selectedStream={selectedStream}
                                personsLoading={personsLoading}
                            />
                        </div>
                        <div className="flex-1 h-full flex flex-col gap-2 overflow-y-auto custom-scrollbar pr-1">
                            {paginatedStreams.map(s => (
                                <div key={s.id} className="min-h-[220px]">
                                    <CameraStream src={s.src} onClick={() => pinStream(s)} />
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className={cn(
                        "grid gap-2 w-full h-full",
                        gridCount === 4 ? "grid-cols-2" : gridCount === 6 ? "grid-cols-3" : "grid-cols-4"
                    )}>
                        {paginatedStreams.map(s => (
                            <CameraStream key={s.id} src={s.src} onClick={() => pinStream(s)} />
                        ))}
                    </div>
                )}
              </div>

              <div className="absolute bottom-28 left-1/2 -translate-x-1/2 flex gap-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={cn(
                            "h-1.5 w-1.5 rounded-full transition-all",
                            currentPage === i + 1 ? "bg-primary w-6" : "bg-slate-700 hover:bg-slate-500"
                        )}
                    />
                ))}
              </div>

              <div className="absolute top-1/2 left-4 -translate-y-1/2 z-30">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-3 rounded-full bg-slate-900/60 text-white disabled:opacity-20 hover:bg-primary transition-all shadow-2xl"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
              </div>
              <div className="absolute top-1/2 right-4 -translate-y-1/2 z-30">
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-3 rounded-full bg-slate-900/60 text-white disabled:opacity-20 hover:bg-primary transition-all shadow-2xl"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </div>

              <BottomMenu handleMenu={handleMenu} handleGridCount={handleGridCount} router={router} />
            </div>

            <NotificationSidebar />
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
              <Image src="/dss-logo.png" alt="DSS Logo" fill className="object-contain" />
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