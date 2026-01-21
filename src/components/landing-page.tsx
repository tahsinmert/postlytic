'use client';

import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, TrendingUp, Zap, BarChart3, CheckCircle2, Shield, MousePointer2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Footer } from '@/components/footer';

export function LandingPage() {
    const router = useRouter();
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: containerRef });
    const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

    // Navigation State
    const [isExiting, setIsExiting] = useState(false);

    const handleNavigation = (path: string) => {
        setIsExiting(true);
        setTimeout(() => {
            router.push(path);
        }, 800);
    };

    // Mouse move effect for hero
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    useEffect(() => {
        function handleMouseMove({ clientX, clientY }: MouseEvent) {
            mouseX.set(clientX);
            mouseY.set(clientY);
        }
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <div ref={containerRef} className="relative min-h-screen overflow-hidden bg-bg-canvas text-fg-default selection:bg-teal-500/30">
            {/* Transition Overlay */}
            <AnimatePresence>
                {isExiting && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0, borderRadius: "100%" }}
                        animate={{ scale: 4, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: [0.32, 0, 0.67, 0] }}
                        className="fixed inset-0 z-[100] bg-teal-500 origin-center pointer-events-none"
                        style={{
                            left: '50%',
                            top: '50%',
                            width: '100vmax',
                            height: '100vmax',
                            x: '-50%',
                            y: '-50%',
                        }}
                    />
                )}
            </AnimatePresence>

            {/* Main Content with Exit Animation */}
            <motion.div
                animate={isExiting ? { opacity: 0, scale: 0.95, filter: "blur(10px)" } : { opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.5 }}
            >
                {/* Cinematic Background Noise & Gradients */}
                <div className="fixed inset-0 pointer-events-none z-0">
                    <div className="absolute inset-0 bg-bg-canvas" />
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.15, 0.1, 0.15],
                        }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        className="absolute -top-[20%] -left-[10%] h-[1000px] w-[1000px] rounded-full bg-teal-500/20 blur-[120px]"
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.1, 0.05, 0.1],
                            x: [0, 100, 0]
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute top-[20%] right-[0%] h-[800px] w-[800px] rounded-full bg-cyan-500/10 blur-[150px]"
                    />
                    <motion.div
                        animate={{
                            opacity: [0.1, 0.05, 0.1],
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[600px] w-[1000px] rounded-full bg-indigo-500/10 blur-[120px]"
                    />

                    {/* Noise Texture */}
                    <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
                        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
                    />
                </div>

                {/* Navigation (Transparent) */}
                <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto w-full">
                    <div className="flex items-center gap-2">
                        <img src="/logo.png" alt="Logo" className="w-24 h-24 object-contain" />
                        <span className="text-3xl md:text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-teal-400 ml-3 drop-shadow-[0_0_10px_rgba(20,184,166,0.5)]">Postlytic</span>
                    </div>
                    <div className="flex items-center gap-2 md:gap-4">
                        <Button variant="ghost" onClick={() => handleNavigation('/login')} className="hidden sm:inline-flex text-fg-muted hover:text-fg-default font-medium">Log in</Button>
                        <Button onClick={() => handleNavigation('/get-started')} className="rounded-full bg-white text-black hover:bg-gray-100 font-bold px-4 md:px-6 shadow-lg shadow-white/10 text-sm md:text-base">
                            Get Started
                        </Button>
                    </div>
                </nav>

                {/* HERO SECTION */}
                <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden z-10">
                    <div className="container mx-auto px-4 relative">
                        <div className="flex flex-col items-center text-center">

                            {/* Badge */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-4 py-1.5 text-xs font-bold text-teal-400 mb-8 backdrop-blur-md shadow-[0_0_20px_rgba(20,184,166,0.2)]"
                            >
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                                </span>
                                <span>The #1 AI Tool for LinkedIn Growth</span>
                            </motion.div>

                            {/* Main Title */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className="relative z-10"
                            >
                                <h1 className="mx-auto max-w-5xl text-5xl sm:text-6xl md:text-8xl font-black tracking-tight leading-[0.9]">
                                    Words that <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-400 to-emerald-400 animate-gradient-x">
                                        go viral.
                                    </span>
                                </h1>
                            </motion.div>

                            <motion.p
                                className="mx-auto mt-8 max-w-2xl text-xl lg:text-2xl text-fg-muted leading-relaxed font-light"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                Stop guessing. Use AI that understands the <span className="text-fg-default font-medium">algorithm</span> to score, optimize, and perfect your content.
                            </motion.p>

                            <motion.div
                                className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                            >
                                <Button
                                    size="lg"
                                    className="group relative h-16 rounded-full px-10 text-lg font-bold bg-gradient-to-b from-white to-gray-200 text-black hover:to-white shadow-[0_0_40px_-5px_rgba(255,255,255,0.3)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_60px_-10px_rgba(255,255,255,0.4)]"
                                    onClick={() => handleNavigation('/login')}
                                >
                                    Start Analyzing for Free
                                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </motion.div>

                            {/* Live Analysis Terminal Demo */}
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.5 }}
                                className="mt-20 w-full max-w-4xl mx-auto text-left relative z-20"
                            >
                                <div className="relative rounded-2xl bg-[#0F172A] border border-white/10 shadow-2xl shadow-teal-500/20 overflow-hidden ring-1 ring-white/10">
                                    {/* Window Controls */}
                                    <div className="h-10 border-b border-white/10 bg-white/5 flex items-center px-4 gap-2">
                                        <div className="flex gap-1.5 opacity-80">
                                            <div className="w-3 h-3 rounded-full bg-red-400" />
                                            <div className="w-3 h-3 rounded-full bg-amber-400" />
                                            <div className="w-3 h-3 rounded-full bg-emerald-400" />
                                        </div>
                                        <div className="ml-4 text-[10px] font-mono text-white/40 flex items-center gap-2">
                                            <Sparkles className="w-3 h-3 text-teal-400" />
                                            AI Analysis Engine v2.0
                                        </div>
                                    </div>

                                    <div className="p-6 md:p-8 grid md:grid-cols-2 gap-8 bg-[#0F172A]">
                                        {/* Input Side (Typing Animation) */}
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between text-xs text-indigo-300 font-mono mb-2">
                                                <span>INPUT: post_draft.txt</span>
                                                <span className="text-emerald-400">● Live</span>
                                            </div>
                                            <div className="font-mono text-sm md:text-base leading-relaxed text-slate-300 min-h-[140px]">
                                                <span className="text-teal-400">→</span> Scaling a startup is
                                                <motion.span
                                                    animate={{ opacity: [1, 0, 1] }}
                                                    transition={{ duration: 0.8, repeat: Infinity }}
                                                    className="inline-block w-2 h-4 bg-teal-400 ml-1 align-middle"
                                                />
                                                <span className="opacity-0"> hard. It requires grit, patience, and a lot of coffee. But the rewards are worth it.</span>
                                            </div>
                                        </div>

                                        {/* Output Side (Analysis) */}
                                        <div className="relative">
                                            <div className="absolute -inset-4 bg-teal-500/10 blur-xl rounded-full" />
                                            <div className="relative space-y-3">
                                                <div className="flex items-center justify-between text-xs text-indigo-300 font-mono mb-4">
                                                    <span>ANALYSIS_RESULT</span>
                                                    <span className="text-xs px-2 py-0.5 rounded bg-teal-500/20 text-teal-400 border border-teal-500/30">92/100</span>
                                                </div>

                                                {/* Analysis Items */}
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: "100%" }}
                                                    transition={{ duration: 1.5, delay: 1 }}
                                                    className="h-1 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full mb-6"
                                                />

                                                <div className="space-y-3 font-mono text-xs md:text-sm">
                                                    <div className="flex items-start gap-3 text-emerald-400 bg-emerald-500/5 p-2 rounded border border-emerald-500/10">
                                                        <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                                        <div>
                                                            <span className="font-bold block mb-0.5">Strong Hook Detected</span>
                                                            <span className="text-emerald-400/70">"Scaling a startup is..." generates curiosity.</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-3 text-amber-300 bg-amber-500/5 p-2 rounded border border-amber-500/10 opacity-60">
                                                        <Zap className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                                        <div>
                                                            <span className="font-bold block mb-0.5">Suggestion</span>
                                                            <span className="text-amber-300/70">Add a specific metric to increase credibility.</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* SOCIAL PROOF */}
                <section className="py-12 border-y border-white/5 bg-white/[0.02]">
                    <div className="container mx-auto px-4 text-center">
                        <p className="text-sm font-semibold text-fg-muted uppercase tracking-widest mb-8">Trusted by creators from</p>
                        <div className="relative flex w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]">
                            <motion.div
                                className="flex min-w-full items-center justify-around gap-16 whitespace-nowrap px-4"
                                animate={{ x: ["0%", "-50%"] }}
                                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                            >
                                {[...Array(2)].map((_, setIndex) => (
                                    <div key={setIndex} className="flex gap-16 items-center">
                                        {['Google', 'Microsoft', 'Shopify', 'Notion', 'Spotify', 'Airbnb', 'Figma', 'Stripe', 'Vercel'].map((name, i) => (
                                            <span key={`${name}-${i}`} className="text-2xl font-bold text-fg-muted/50 hover:text-fg-default transition-colors cursor-default select-none">
                                                {name}
                                            </span>
                                        ))}
                                    </div>
                                ))}
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* BENTO GRID FEATURES */}
                <section className="py-32 relative z-10">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <div className="mb-20 text-center max-w-3xl mx-auto">
                            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
                                Everything you need to <span className="text-teal-400">dominate</span>.
                            </h2>
                            <p className="text-xl text-fg-muted">
                                Comprehensive tools designed to reverse-engineer the LinkedIn algorithm.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-2 gap-6 h-auto md:h-[800px]">

                            {/* 1. Virality Score (Tall Card) */}
                            <BentoCard className="md:col-span-1 md:row-span-2 relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-emerald-500/10 to-transparent pointer-events-none" />
                                <div className="relative z-10 h-full flex flex-col">
                                    <div className="mb-6 p-3 w-fit rounded-xl bg-emerald-500/20 text-emerald-400">
                                        <TrendingUp className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">Virality Score</h3>
                                    <p className="text-fg-muted mb-8">Predict performance before you hit publish with our proprietary algorithm.</p>

                                    <div className="mt-auto relative">
                                        <div className="bg-bg-canvas/50 border border-emerald-500/20 rounded-2xl p-4 backdrop-blur-md">
                                            <div className="flex items-end gap-2 h-32 px-2 pb-2">
                                                {[30, 45, 25, 60, 85].map((h, i) => (
                                                    <motion.div
                                                        key={i}
                                                        initial={{ height: 0 }}
                                                        whileInView={{ height: `${h}%` }}
                                                        transition={{ duration: 1, delay: i * 0.1 }}
                                                        className={cn(
                                                            "flex-1 rounded-t-sm",
                                                            i === 4 ? "bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.4)]" : "bg-emerald-500/20"
                                                        )}
                                                    />
                                                ))}
                                            </div>
                                            <div className="mt-4 flex items-center justify-between text-sm">
                                                <span className="text-fg-default font-bold">Score: 85/100</span>
                                                <span className="text-emerald-400 font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Excellent</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </BentoCard>

                            {/* 2. AI Editor (Wide Card) */}
                            <BentoCard className="md:col-span-2 relative group overflow-hidden">
                                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-cyan-500/10 blur-[100px] pointer-events-none" />
                                <div className="relative z-10 flex flex-col md:flex-row h-full">
                                    <div className="flex-1 p-2 flex flex-col justify-between">
                                        <div>
                                            <div className="mb-6 p-3 w-fit rounded-xl bg-cyan-500/20 text-cyan-400">
                                                <Sparkles className="w-8 h-8" />
                                            </div>
                                            <h3 className="text-2xl font-bold mb-2">Deep AI Analysis</h3>
                                            <p className="text-fg-muted">Real-time feedback on structure, tone, and hook strength.</p>
                                        </div>
                                    </div>

                                    {/* Interactive Editor Animation */}
                                    <div className="flex-1 mt-6 md:mt-0 relative">
                                        <div className="bg-bg-canvas/50 border border-white/10 rounded-xl p-4 font-mono text-sm leading-relaxed text-fg-muted/80 relative overflow-hidden backdrop-blur-sm">
                                            <div className="space-y-4">
                                                <div>
                                                    "I just launched my new startup." <br />
                                                    <span className="text-red-400 line-through opacity-50">It was really hard.</span>
                                                    <br />
                                                    <motion.span
                                                        initial={{ opacity: 0 }}
                                                        whileInView={{ opacity: 1 }}
                                                        transition={{ delay: 1, duration: 0.5 }}
                                                        className="text-emerald-400 bg-emerald-500/10 px-1 rounded inline-block"
                                                    >
                                                        Here's the brutal truth about building from scratch.
                                                    </motion.span>
                                                    <motion.div
                                                        className="w-0.5 h-4 bg-emerald-400 inline-block ml-1 align-middle"
                                                        animate={{ opacity: [1, 0] }}
                                                        transition={{ repeat: Infinity, duration: 0.8 }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="absolute top-2 right-2 flex gap-1.5">
                                                <div className="w-2 h-2 rounded-full bg-red-500/50" />
                                                <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                                                <div className="w-2 h-2 rounded-full bg-green-500/50" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </BentoCard>

                            {/* 3. Hook Optimizer (Checkers) */}
                            <BentoCard className="md:col-span-1 relative group overflow-hidden">
                                <div className="relative z-10 flex flex-col h-full">
                                    <div className="mb-6 p-3 w-fit rounded-xl bg-amber-500/20 text-amber-400">
                                        <MousePointer2 className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">Hook Optimization</h3>
                                    <p className="text-fg-muted text-sm">Stop scanning. Start reading.</p>

                                    <div className="mt-auto pt-6 flex items-center justify-center">
                                        <div className="relative">
                                            <div className="absolute -inset-4 bg-amber-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <Button variant="outline" className="border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white transition-all">
                                                Optimize Hook
                                            </Button>
                                            <MousePointer2 className="absolute top-6 left-12 w-8 h-8 text-white drop-shadow-lg fill-black animate-bounce" />
                                        </div>
                                    </div>
                                </div>
                            </BentoCard>

                            {/* 4. Audience Persona (Persona) */}
                            <BentoCard className="md:col-span-1 relative group overflow-hidden">
                                <div className="relative z-10 h-full flex flex-col">
                                    <div className="mb-6 p-3 w-fit rounded-xl bg-purple-500/20 text-purple-400">
                                        <Shield className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">Audience Simulator</h3>
                                    <p className="text-fg-muted text-sm">See through their eyes.</p>

                                    <div className="mt-8 flex justify-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-bg-surface border-2 border-purple-500 flex items-center justify-center text-[10px] font-bold shadow-lg shadow-purple-500/20 z-10">
                                            VC
                                        </div>
                                        <div className="w-12 h-12 rounded-full bg-bg-surface border-2 border-blue-500 flex items-center justify-center text-[10px] font-bold -ml-6 z-0 opacity-60 scale-90">
                                            Dev
                                        </div>
                                    </div>
                                </div>
                            </BentoCard>

                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-24 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-teal-900/10 to-transparent pointer-events-none" />
                    <div className="container mx-auto px-4 text-center relative z-10">
                        <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter">
                            Ready to go <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">viral?</span>
                        </h2>
                        <p className="text-xl text-fg-muted max-w-2xl mx-auto mb-12">
                            Join 10,000+ creators writing consistently better content.
                            No credit card required for the free workspace.
                        </p>
                        <Button
                            size="lg"
                            className="h-16 rounded-full px-12 text-xl font-bold bg-white text-black hover:bg-gray-100 shadow-[0_0_50px_-10px_rgba(255,255,255,0.4)] transition-all hover:scale-105"
                            onClick={() => handleNavigation('/login')}
                        >
                            Get Started Now
                        </Button>
                    </div>
                </section>

                <Footer />

            </motion.div>
        </div>
    );
}

function BentoCard({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            className={cn(
                "rounded-3xl border border-white/5 bg-bg-surface/30 backdrop-blur-xl p-8 transition-all duration-300 hover:bg-bg-surface/50 hover:border-white/10 hover:shadow-2xl hover:shadow-teal-900/20",
                className
            )}
        >
            {children}
        </motion.div>
    );
}
