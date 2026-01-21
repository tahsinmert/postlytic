'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Eye,
    Smartphone,
    AlertTriangle,
    CheckCheck,
    Zap,
    RefreshCw,
    Copy,
    ChevronDown,
    MousePointerClick
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function HookOptimizerPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [text, setText] = useState('');
    const [device, setDevice] = useState<'mobile' | 'desktop'>('mobile');
    const [score, setScore] = useState(0);

    // Character limits for "See More"
    // Mobile: ~210 chars or 3 lines. Desktop: ~250 chars or 3 lines.
    const CHARACTER_LIMIT = device === 'mobile' ? 210 : 260;
    const VISIBLE_LINES = 3;

    useEffect(() => {
        // Simple mock scoring logic
        let tempScore = 0;
        const cleanText = text.trim();
        if (cleanText.length > 0) {
            tempScore += 20; // Has content
            if (cleanText.length <= CHARACTER_LIMIT) tempScore += 10; // Fits before fold (maybe bad? usually want curiosity gap)
            if (cleanText.includes('?')) tempScore += 10; // Question
            if (cleanText.match(/[!]/)) tempScore += 5; // Excitement
            if (cleanText.match(/\n/g)?.length || 0 > 1) tempScore += 15; // Spacing
            if (cleanText.match(/\d+/)) tempScore += 10; // Numbers
        }
        setScore(Math.min(tempScore, 100));
    }, [text, CHARACTER_LIMIT]);

    if (!authLoading && !user) {
        router.push('/login');
        return null;
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(text);
        toast.success('Hook copied to clipboard!');
    };

    const getVisibleContent = () => {
        return text.slice(0, CHARACTER_LIMIT);
    };

    return (
        <div className="min-h-screen bg-bg-canvas relative overflow-hidden">
            {/* Ambient background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-20 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <Badge variant="outline" className="mb-4 bg-amber-500/10 text-amber-600 border-amber-200 backdrop-blur-sm">
                        <Eye className="w-3 h-3 mr-1" />
                        Attention Engineering
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-black text-fg-default mb-4 tracking-tight">
                        Hook & Fold Optimizer
                    </h1>
                    <p className="text-lg text-fg-muted max-w-2xl mx-auto">
                        Optimize the most critical real estate on LinkedIn used by 99% of top creators. Perfect your first 3 lines before the "See More" click.
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Editor Column */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-6"
                    >
                        <Card className="p-6 border-amber-200/40 bg-bg-surface/50 backdrop-blur-sm shadow-xl shadow-amber-500/5">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold flex items-center gap-2">
                                    <span className="p-2 rounded-lg bg-amber-100 text-amber-600">
                                        <Zap className="w-4 h-4" />
                                    </span>
                                    Hook Editor
                                </h3>
                                <div className="flex items-center gap-2">
                                    <span className={cn(
                                        "text-xs font-mono px-2 py-1 rounded",
                                        text.length > CHARACTER_LIMIT ? "bg-red-100 text-red-600" : "bg-bg-canvas text-fg-muted"
                                    )}>
                                        {text.length}/{CHARACTER_LIMIT} chars
                                    </span>
                                </div>
                            </div>

                            <Textarea
                                placeholder="Write your opening lines here. Make them impossible to stick..."
                                className="min-h-[200px] resize-none border-border-default/50 bg-bg-canvas/40 focus:bg-bg-canvas/80 rounded-xl text-lg p-6 mb-4 font-medium"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                            />

                            {/* Real-time Analysis */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 rounded-lg bg-bg-canvas/50 border border-border-default/30">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-full bg-blue-500/10 text-blue-500">
                                            <MousePointerClick className="w-4 h-4" />
                                        </div>
                                        <div className="text-sm">
                                            <p className="font-semibold text-fg-default">Curiosity Gap</p>
                                            <p className="text-xs text-fg-muted">Does it tease value without giving it away?</p>
                                        </div>
                                    </div>
                                    <Badge variant={text.includes('?') ? 'default' : 'outline'} className={text.includes('?') ? 'bg-emerald-500 hover:bg-emerald-600' : ''}>
                                        {text.includes('?') ? 'Detected' : 'Missing'}
                                    </Badge>
                                </div>

                                <div className="flex items-center justify-between p-3 rounded-lg bg-bg-canvas/50 border border-border-default/30">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-full bg-purple-500/10 text-purple-500">
                                            <RefreshCw className="w-4 h-4" />
                                        </div>
                                        <div className="text-sm">
                                            <p className="font-semibold text-fg-default">Visual Flow</p>
                                            <p className="text-xs text-fg-muted">Are there line breaks for readability?</p>
                                        </div>
                                    </div>
                                    <Badge variant={(text.match(/\n/g)?.length || 0) > 0 ? 'default' : 'outline'} className={(text.match(/\n/g)?.length || 0) > 0 ? 'bg-emerald-500 hover:bg-emerald-600' : ''}>
                                        {(text.match(/\n/g)?.length || 0) > 0 ? 'Good' : 'Dense'}
                                    </Badge>
                                </div>
                            </div>

                        </Card>

                        <div className="flex gap-4">
                            <Button
                                variant="outline"
                                className="flex-1 h-12 border-amber-200/50 hover:bg-amber-50 hover:text-amber-700"
                                onClick={() => setText("Warning: This simple strategy might double your leads.\n\nBut only if you do it exactly right.\n\nHere's the breakdown:")}
                            >
                                <Zap className="w-4 h-4 mr-2" />
                                Generate Example
                            </Button>
                            <Button
                                className="flex-1 h-12 bg-amber-500 hover:bg-amber-600 text-white"
                                onClick={copyToClipboard}
                                disabled={!text}
                            >
                                <Copy className="w-4 h-4 mr-2" />
                                Copy Hook
                            </Button>
                        </div>
                    </motion.div>

                    {/* Preview Column */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="relative"
                    >
                        <div className="flex justify-center mb-6">
                            <div className="bg-bg-surface p-1 rounded-full border border-border-default flex gap-1 shadow-sm">
                                <button
                                    onClick={() => setDevice('mobile')}
                                    className={cn(
                                        "px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2",
                                        device === 'mobile' ? "bg-amber-100 text-amber-700 shadow-sm" : "text-fg-muted hover:bg-bg-canvas"
                                    )}
                                >
                                    <Smartphone className="w-4 h-4" /> Mobile
                                </button>
                                <button
                                    onClick={() => setDevice('desktop')}
                                    className={cn(
                                        "px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2",
                                        device === 'desktop' ? "bg-amber-100 text-amber-700 shadow-sm" : "text-fg-muted hover:bg-bg-canvas"
                                    )}
                                >
                                    <div className="w-4 h-3 border-2 border-currentColor rounded-sm" /> Desktop
                                </button>
                            </div>
                        </div>

                        {/* Mock Phone/Desktop UI */}
                        <div className={cn(
                            "mx-auto bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden transition-all duration-500 ease-in-out",
                            device === 'mobile' ? "w-[375px] rounded-[3rem] min-h-[600px]" : "w-full rounded-xl min-h-[400px]"
                        )}>
                            {/* Mock Header */}
                            <div className="h-14 border-b border-gray-100 dark:border-gray-800 flex items-center px-4 gap-3">
                                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700" />
                                <div className="flex-1">
                                    <div className="h-2 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-1" />
                                    <div className="h-2 w-16 bg-gray-100 dark:bg-gray-800 rounded" />
                                </div>
                            </div>

                            {/* Content Preview */}
                            <div className="p-4">
                                <div className="font-sans text-[15px] leading-relaxed text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                                    {getVisibleContent()}
                                    <span className="text-gray-400">... </span>
                                    <span className="text-gray-500 font-medium cursor-pointer hover:underline hover:text-blue-600 transition-colors">see more</span>
                                </div>

                                {/* Visual indication of cut-off text */}
                                {text.length > CHARACTER_LIMIT && (
                                    <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-900/30 text-xs text-red-600 dark:text-red-400 flex items-start gap-2">
                                        <AlertTriangle className="w-4 h-4 shrink-0" />
                                        <p>
                                            Content below this point is hidden behind the "See More" fold.
                                            <span className="font-bold block mt-1 line-through opacity-70">
                                                {text.slice(CHARACTER_LIMIT, CHARACTER_LIMIT + 50)}...
                                            </span>
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Mock Image/Media Placeholder */}
                            <div className="mt-2 w-full aspect-video bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-300">
                                Media Content
                            </div>

                            {/* Mock Actions */}
                            <div className="h-12 border-t border-gray-100 dark:border-gray-800 mt-2 flex items-center justify-between px-8 text-gray-400">
                                <div className="w-4 h-4 rounded-sm bg-gray-200 dark:bg-gray-700" />
                                <div className="w-4 h-4 rounded-sm bg-gray-200 dark:bg-gray-700" />
                                <div className="w-4 h-4 rounded-sm bg-gray-200 dark:bg-gray-700" />
                                <div className="w-4 h-4 rounded-sm bg-gray-200 dark:bg-gray-700" />
                            </div>
                        </div>

                    </motion.div>
                </div>
            </div>
        </div>
    );
}
