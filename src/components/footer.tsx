'use client';

import { motion } from 'framer-motion';
import { Heart, Code2 } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
    return (
        <footer className="relative border-t border-white/5 bg-bg-canvas/30 backdrop-blur-md overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-teal-500/50 to-transparent opacity-50" />

            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-fg-muted">

                    {/* Brand / Copyright */}
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-fg-default">Postlytic</span>
                        <span>&copy; {new Date().getFullYear()}</span>
                    </div>

                    {/* Developer Credit - The Star of the Show */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col sm:flex-row items-center gap-2"
                    >
                        <span className="opacity-70 flex items-center gap-1.5">
                            <Code2 className="h-3.5 w-3.5" />
                            <span>Designed & Developed by</span>
                        </span>

                        <Link
                            href="https://www.linkedin.com/in/tahsinmertmutlu/"
                            target="_blank"
                            className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-fg-default/5 px-4 py-1.5 font-medium transition-all duration-300 hover:bg-fg-default/10 hover:scale-105"
                        >
                            <span className="absolute inset-0 bg-gradient-to-r from-teal-500/20 via-cyan-500/20 to-teal-500/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                            <span className="relative bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent group-hover:from-teal-300 group-hover:to-cyan-300 transition-all duration-300">
                                Tahsin Mert Mutlu
                            </span>

                            <Heart className="ml-2 h-3.5 w-3.5 text-red-500 opacity-60 transition-all duration-300 group-hover:scale-110 group-hover:opacity-100 group-hover:text-red-400 animate-pulse" />
                        </Link>
                    </motion.div>

                    {/* Simple Links */}
                    <div className="flex items-center gap-6 text-xs">
                        <Link href="/privacy" className="hover:text-fg-default transition-colors">Privacy</Link>
                        <Link href="/terms" className="hover:text-fg-default transition-colors">Terms</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
