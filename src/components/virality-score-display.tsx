'use client';

import { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface ViralityScoreDisplayProps {
  score: number;
}

export function ViralityScoreDisplay({ score }: ViralityScoreDisplayProps) {
  const springScore = useSpring(0, { stiffness: 40, damping: 20 });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    springScore.set(score);
  }, [score, springScore]);

  useEffect(() => {
    return springScore.on('change', (latest) => {
      setDisplayValue(Math.round(latest));
    });
  }, [springScore]);

  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = useTransform(springScore, [0, 100], [circumference, 0]);

  const getScoreColor = (value: number) => {
    if (value < 40) return 'from-red-500 to-rose-600';
    if (value < 70) return 'from-amber-400 to-orange-500';
    return 'from-emerald-400 to-indigo-500';
  };

  const getGlowColor = (value: number) => {
    if (value < 40) return 'rgba(244, 63, 94, 0.2)';
    if (value < 70) return 'rgba(245, 158, 11, 0.2)';
    return 'rgba(99, 102, 241, 0.2)';
  };

  return (
    <div className="relative flex h-56 w-56 items-center justify-center p-4">
      {/* Dynamic Glow Background */}
      <motion.div
        className="absolute inset-4 rounded-full blur-[32px]"
        animate={{
          backgroundColor: getGlowColor(score),
          scale: [1, 1.05, 1],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      <svg className="relative h-full w-full -rotate-90" viewBox="0 0 120 120">
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" className="stop-color-emerald-400" />
            <stop offset="100%" className="stop-color-indigo-500" />
          </linearGradient>
          {/* We'll use classes for control or inline styles for simplicity since dynamic IDs are tricky in SVG defs in some SSR scenarios */}
          <linearGradient id="dynamicGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={score < 40 ? '#f43f5e' : score < 70 ? '#fbbf24' : '#34d399'} />
            <stop offset="100%" stopColor={score < 40 ? '#e11d48' : score < 70 ? '#f59e0b' : '#6366f1'} />
          </linearGradient>
        </defs>

        {/* Background Track */}
        <circle
          className="text-muted/10 dark:text-white/5"
          strokeWidth="8"
          stroke="currentColor"
          fill="transparent"
          r="54"
          cx="60"
          cy="60"
        />

        {/* Animated Progress Circle */}
        <motion.circle
          style={{ strokeDashoffset, strokeDasharray: circumference }}
          strokeWidth="8"
          strokeLinecap="round"
          stroke="url(#dynamicGradient)"
          fill="transparent"
          r="54"
          cx="60"
          cy="60"
          className="drop-shadow-[0_0_8px_rgba(99,102,241,0.4)]"
        />
      </svg>

      <div className="absolute flex flex-col items-center justify-center text-center">
        <motion.span
          className="font-headline text-6xl font-black tracking-tighter text-fg-default"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {displayValue}
        </motion.span>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-fg-muted/60">
          Virality Score
        </span>
      </div>
    </div>
  );
}
