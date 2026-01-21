'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase/client';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Loader2, TrendingUp, BarChart3, Terminal, Sparkles } from 'lucide-react';
import { Logo } from '@/components/logo';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { NetworkVisualization } from '@/components/network-visualization';
import { motion } from 'framer-motion';

// Google "G" logo – official multicolor
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

const INSIGHT_CARDS = [
  { label: 'Post Engagement', value: '+20%', icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
  { label: 'Avg. Reach', value: '+35%', icon: BarChart3, color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
];

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (user) router.push('/');
  }, [user, router]);

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    setAuthError(null);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push('/');
    } catch (error: unknown) {
      console.error('Error signing in with Google:', error);
      const err = error as { code?: string };
      if (err.code === 'auth/unauthorized-domain') {
        const projectId = auth.app.options.projectId;
        const consoleUrl = `https://console.firebase.google.com/project/${projectId}/authentication/settings`;
        setAuthError(`This domain is not authorized for authentication. Please add it to the list of authorized domains in your Firebase project settings. <a href="${consoleUrl}" target="_blank" rel="noopener noreferrer" class="underline">Open Firebase Console</a>`);
      } else {
        setAuthError('An unexpected error occurred during sign-in. Please try again.');
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  if (loading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-canvas">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[0.45fr_0.55fr]">
      {/* Left: Premium Dark Panel with Glassmorphism */}
      <div className="relative hidden overflow-hidden bg-[#0A0A0B] lg:block">
        <NetworkVisualization />

        {/* Deep mesh gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/50 via-[#0A0A0B] to-[#0A0A0B]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(16,185,129,0.15),transparent_50%)]" />
        <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-emerald-600/5 blur-[120px]" />

        {/* Grain Overlay */}
        <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} />

        <div className="relative z-10 flex h-full flex-col justify-between p-12">
          <div className="[&>div]:!text-white">
            <Logo />
          </div>

          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="font-headline text-3xl font-bold leading-tight tracking-tight text-white/95 lg:text-4xl">
                Turn your network <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                  into net worth.
                </span>
              </h2>
              <p className="mt-4 max-w-sm text-lg text-white/60">
                Unlock the power of your LinkedIn connections with AI-driven insights.
              </p>
            </motion.div>

            <div className="flex flex-col gap-4 sm:flex-row">
              {INSIGHT_CARDS.map(({ label, value, icon: Icon, color, bg, border }, i) => (
                <motion.div
                  key={label}
                  className={`flex items-center gap-4 rounded-2xl border ${border} ${bg} px-5 py-4 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/10`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                >
                  <div className={`rounded-full ${bg} p-2.5`}>
                    <Icon className={`h-5 w-5 ${color}`} />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-white/50">{label}</p>
                    <p className="font-headline text-xl font-bold text-white">{value}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right: Clean Modern Login Form */}
      <div className="relative flex flex-col items-center justify-center bg-bg-canvas px-6 py-12 lg:px-12">
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.03),transparent_60%)] pointer-events-none" />

        <motion.div
          className="w-full max-w-sm"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Mobile-only Card Wrapper */}
          <div className="rounded-3xl border border-border-default/40 bg-bg-default/60 p-8 shadow-2xl backdrop-blur-xl dark:border-white/5 dark:bg-bg-default/40 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none lg:backdrop-blur-none">

            <div className="mb-2 flex justify-center lg:justify-start">
              <div className="lg:hidden">
                <Logo />
              </div>
            </div>

            <div className="text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-50/50 px-3 py-1 text-xs font-medium text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
              >
                <Sparkles className="h-3 w-3" />
                <span>Beta Access</span>
              </motion.div>

              <motion.h1
                className="font-headline text-3xl font-extrabold tracking-tight text-fg-default sm:text-4xl"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                Welcome back
              </motion.h1>
              <motion.p
                className="mt-2 text-fg-muted"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                Sign in to continue your analytics journey.
              </motion.p>
            </div>

            <div className="mt-10 space-y-6">
              {authError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                >
                  <Alert variant="destructive" className="rounded-xl border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Authentication Error</AlertTitle>
                    <AlertDescription dangerouslySetInnerHTML={{ __html: authError }} />
                  </Alert>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isSigningIn}
                  className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl border border-border-default bg-bg-default px-5 py-4 font-semibold text-fg-default shadow-sm transition-all duration-300 hover:border-emerald-500/30 hover:shadow-emerald-500/10 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-70 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  {isSigningIn ? (
                    <Loader2 className="h-5 w-5 shrink-0 animate-spin" />
                  ) : (
                    <GoogleIcon className="h-5 w-5 shrink-0 grayscale transition-all duration-300 group-hover:scale-110 group-hover:grayscale-0" />
                  )}
                  <span className="relative">{isSigningIn ? 'Signing in…' : 'Continue with Google'}</span>
                </button>

                <p className="mt-6 text-center text-xs text-fg-muted/60">
                  By clicking continue, you agree to our <a href="#" className="underline decoration-emerald-500/30 hover:text-emerald-500">Terms of Service</a> and <a href="#" className="underline decoration-emerald-500/30 hover:text-emerald-500">Privacy Policy</a>.
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
