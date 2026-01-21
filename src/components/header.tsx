'use client';

import Link from 'next/link';
import { Logo } from './logo';
import { UserNav } from './user-nav';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import {
  LogOut,
  User,
  Settings,
  CreditCard,
  LifeBuoy,
  ArrowLeft,
  BarChart3,
  Wrench,
  Rocket,
} from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';

export default function Header() {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const showLoginButton = !user && !loading && pathname !== '/login';
  const isDashboard = pathname === '/';
  const showBackButton = user && !loading && !isDashboard;

  const menuItems = [
    {
      icon: User,
      label: 'Profile',
      description: 'Account',
      onClick: async () => {
        await router.push('/profile');
      },
    },
    {
      icon: Settings,
      label: 'Settings',
      description: 'Preferences',
      onClick: async () => {
        await router.push('/settings');
      },
    },
    {
      icon: CreditCard,
      label: 'Billing',
      description: 'Subscription',
      onClick: async () => {
        await router.push('/billing');
      },
    },
    {
      icon: LifeBuoy,
      label: 'Help',
      description: 'Support',
      onClick: async () => {
        await router.push('/help');
      },
    },
  ];

  const logoutItem = {
    icon: LogOut,
    label: 'Logout',
    description: 'Sign out',
      onClick: async () => {
        await signOut(auth);
        router.push('/login');
      },
    isDestructive: true,
  };

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "border-b border-border-default/50 bg-bg-canvas/80 backdrop-blur-md shadow-sm"
          : "border-transparent bg-transparent"
      )}
    >
      <div className="container mx-auto max-w-7xl flex h-20 items-center px-4 sm:px-6 lg:px-8 relative">
        <div className="flex-1">
          <Link href="/" className="flex items-center gap-2 group transition-transform hover:scale-[1.02]">
            <Logo />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={cn(
                "h-4 w-[1px] mx-2 hidden sm:block transition-colors",
                isScrolled ? "bg-border-default" : "bg-fg-default/20"
              )}
            />
          </Link>
        </div>

        {/* Center - Post Analyzer / Go Back button */}
        <AnimatePresence>
          {showBackButton && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute left-[35%] -translate-x-1/2"
            >
              <Link
                href="/"
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:bg-muted/50 group"
              >
                <ArrowLeft className="h-4 w-4 text-fg-muted group-hover:text-fg-default transition-colors" />
                <span className="font-medium text-sm text-fg-default hidden sm:inline">
                  Post Analyzer
                </span>
                <span className="font-medium text-sm text-fg-default sm:hidden">
                  Go Back
                </span>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tools Section - Tools Link */}
        {user && !loading && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="hidden lg:flex items-center gap-2 absolute left-[20%] -translate-x-1/2"
            >
              <Link
                href="/tools"
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200",
                  pathname === '/tools'
                    ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 shadow-sm"
                    : "hover:bg-muted/50 text-fg-muted hover:text-fg-default"
                )}
              >
                <BarChart3 className="h-4 w-4 transition-colors" />
                <span className="font-medium text-sm">
                  Tools
                </span>
              </Link>
            </motion.div>
          </AnimatePresence>
        )}

        {/* Menu Items Area - appears when menu is open */}
        <AnimatePresence>
          {isMenuOpen && user && (
            <>
              {/* Regular menu items - slide from left */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="hidden md:flex items-center gap-2 absolute right-56 z-[60]"
              >
                {menuItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.button
                      key={item.label}
                      initial={{ opacity: 0, x: -80 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -80 }}
                      transition={{ 
                        duration: 0.3,
                        delay: index * 0.04,
                        ease: [0.16, 1, 0.3, 1]
                      }}
                      onClick={item.onClick}
                      className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-muted/50 text-fg-default min-w-[70px]"
                    >
                      <div className="flex items-center justify-center h-8 w-8 rounded-lg transition-colors bg-muted/60 group-hover:bg-muted/80">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <span className="text-[11px] font-medium leading-tight">{item.label}</span>
                    </motion.button>
                  );
                })}
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-4">
          {showLoginButton && (
            <Button
              onClick={() => router.push('/login')}
              className="rounded-full bg-emerald-600 hover:bg-emerald-500 text-white px-6 font-bold transition-all shadow-lg shadow-emerald-500/10"
            >
              Sign In
            </Button>
          )}
          {user && (
            <div className={cn(
              "flex items-center gap-2 p-1 rounded-full border transition-all duration-300 relative z-30",
              isScrolled
                ? "bg-muted/20 border-border-default/20 backdrop-blur-sm"
                : "bg-transparent border-transparent"
            )}>
              <UserNav onMenuStateChange={setIsMenuOpen} />
            </div>
          )}
        </div>

      </div>

      {/* Logout item - slide from right - right side of navbar */}
      <AnimatePresence>
        {isMenuOpen && user && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="hidden md:flex items-center absolute right-4 sm:right-6 lg:right-8 top-1/2 -translate-y-1/2 z-[100]"
          >
            <motion.button
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 80 }}
              transition={{ 
                duration: 0.3,
                delay: menuItems.length * 0.04,
                ease: [0.16, 1, 0.3, 1]
              }}
              onClick={logoutItem.onClick}
              className="relative z-[100] flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-red-500/10 text-red-600 dark:text-red-400 min-w-[70px]"
            >
              <div className="flex items-center justify-center h-8 w-8 rounded-lg transition-colors bg-red-500/10 group-hover:bg-red-500/20">
                <LogOut className="h-4 w-4 text-red-600 dark:text-red-400" />
              </div>
              <span className="text-[11px] font-medium leading-tight">{logoutItem.label}</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
