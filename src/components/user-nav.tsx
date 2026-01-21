'use client';

import {
  ChevronDown,
  X
} from 'lucide-react';
import * as Avatar from '@/components/ui/avatar';
import { Button } from './ui/button';
import { useAuth } from '@/hooks/use-auth';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface UserNavProps {
  onMenuStateChange?: (isOpen: boolean) => void;
}

export function UserNav({ onMenuStateChange }: UserNavProps) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    onMenuStateChange?.(isOpen);
  }, [isOpen, onMenuStateChange]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  if (!user) return null;

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('');
  };

  return (
    <>
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="relative h-10 w-auto rounded-full pl-2 pr-4 hover:bg-muted/50 transition-all duration-200 border border-transparent hover:border-border-default/30 flex items-center gap-3 group z-30"
      >
        <Avatar.Root className="h-8 w-8 ring-2 ring-emerald-500/20 group-hover:ring-emerald-500/30 transition-all">
          <Avatar.Image src={user.photoURL ?? ''} alt={user.displayName ?? ''} />
          <Avatar.Fallback className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white font-medium">
            {getInitials(user.displayName)}
          </Avatar.Fallback>
        </Avatar.Root>

        <div className="hidden md:flex flex-col items-start gap-0.5">
          <span className="text-sm font-semibold leading-none">{user.displayName?.split(' ')[0]}</span>
          <span className="text-[10px] text-muted-foreground font-medium">Free Plan</span>
        </div>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isOpen ? (
            <X className="h-4 w-4 text-muted-foreground opacity-50" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground opacity-50" />
          )}
        </motion.div>
      </Button>
    </>
  );
}
