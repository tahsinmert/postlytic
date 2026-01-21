'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles,
    Loader2,
    Target,
    Zap,
    CheckCircle2,
    AlertCircle,
    ArrowRight,
    Fingerprint,
    TrendingUp,
    BrainCircuit
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';

export default function ViralPatternsPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [text, setText] = useState('');
    const [analyzing, setAnalyzing] = useState(false);
    const [results, setResults] = useState<any>(null);

    if (!authLoading && !user) {
        router.push('/login');
        return null;
    }

    const handleAnalyze = async () => {
        if (!text.trim()) return;
        setAnalyzing(true);

        // Simulate analysis delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        setResults({
            primaryPattern: 'PAS (Problem-Agitate-Solve)',
            matchScore: 85,
            frameworks: [
                {
                    name: 'PAS Framework',
                    score: 85,
                    color: 'emerald',
                    description: 'Problem, Agitate, Solve structure detected.',
                    details: [
                        { label: 'Problem', status: 'detected', text: 'Struggling with low engagement?' },
                        { label: 'Agitation', status: 'detected', text: 'It feels like shouting into the void.' },
                        { label: 'Solution', status: 'detected', text: 'Try this new framework.' }
                    ]
                },
                {
                    name: 'Hero\'s Journey',
                    score: 45,
                    color: 'amber',
                    description: 'Partial narrative structure found.',
                    details: [
                        { label: 'Call to Adventure', status: 'detected', text: 'I decided to change my strategy.' },
                        { label: 'The Ordeal', status: 'missing', text: null },
                        { label: 'The Return', status: 'detected', text: 'Here are my results.' }
                    ]
                },
                {
                    name: 'AIDA Model',
                    score: 60,
                    color: 'blue',
                    description: 'Attention and Interest are strong.',
                    details: [
                        { label: 'Attention', status: 'detected', text: 'Stop scrolling right now.' },
                        { label: 'Interest', status: 'detected', text: 'This data will shock you.' },
                        { label: 'Desire', status: 'missing', text: null },
                        { label: 'Action', status: 'detected', text: 'Comment "Yes" below.' }
                    ]
                }
            ],
            suggestions: [
                'Strengthen your "Agitation" phase to create more emotional resonance.',
                'Your Call-to-Action is clear but could be more benefit-driven.',
                'Consider adding a "The Ordeal" element to potential Hero\'s Journey narrative.'
            ]
        });
        setAnalyzing(false);
    };

    return (
        <div className="min-h-screen bg-bg-canvas relative overflow-hidden">
            {/* Ambient background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-rose-500/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-20 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <Badge variant="outline" className="mb-4 bg-rose-500/10 text-rose-600 border-rose-200 backdrop-blur-sm">
                        <Fingerprint className="w-3 h-3 mr-1" />
                        Viral DNA Scanner
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-black text-fg-default mb-4 tracking-tight">
                        Viral Pattern Decoder
                    </h1>
                    <p className="text-lg text-fg-muted max-w-2xl mx-auto">
                        Decode the hidden psychological frameworks behind viral posts. See if your content matches the patterns of top creators.
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Input Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Card className="h-full border-rose-200/40 bg-bg-surface/50 backdrop-blur-sm shadow-xl shadow-rose-500/5">
                            <div className="p-6 space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-bold flex items-center gap-2">
                                        <span className="p-2 rounded-lg bg-rose-100 text-rose-600">
                                            <Zap className="w-4 h-4" />
                                        </span>
                                        Your Content
                                    </h3>
                                    <Badge variant="secondary" className="bg-bg-canvas text-fg-muted">
                                        {text.length} chars
                                    </Badge>
                                </div>

                                <Textarea
                                    placeholder="Paste your post content here to scan for viral patterns..."
                                    className="min-h-[400px] resize-none border-border-default/50 bg-bg-canvas/40 focus:bg-bg-canvas/80 rounded-xl text-lg leading-relaxed p-6"
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                />

                                <Button
                                    size="lg"
                                    className="w-full bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-500/20 transition-all hover:scale-[1.02]"
                                    onClick={handleAnalyze}
                                    disabled={!text.trim() || analyzing}
                                >
                                    {analyzing ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            Scanning Patterns...
                                        </>
                                    ) : (
                                        <>
                                            <BrainCircuit className="mr-2 h-5 w-5" />
                                            Decode Viral DNA
                                        </>
                                    )}
                                </Button>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Results Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-6"
                    >
                        {!results ? (
                            <Card className="h-full border-border-default/40 bg-bg-canvas/30 backdrop-blur-sm flex items-center justify-center border-dashed">
                                <div className="text-center p-8 text-fg-muted">
                                    <div className="w-16 h-16 rounded-full bg-bg-surface border border-border-default flex items-center justify-center mx-auto mb-4">
                                        <Target className="w-8 h-8 opacity-20" />
                                    </div>
                                    <p className="text-lg font-medium">Ready to Scan</p>
                                    <p className="text-sm">Enter your content to reveal its structural DNA</p>
                                </div>
                            </Card>
                        ) : (
                            <AnimatePresence mode="wait">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-6"
                                >
                                    {/* Primary Score */}
                                    <Card className="border-rose-200/40 bg-rose-500/5 backdrop-blur-sm overflow-hidden relative">
                                        <div className="absolute top-0 right-0 p-32 bg-gradient-to-br from-rose-500/20 to-transparent blur-3xl" />
                                        <div className="p-6 relative">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-semibold text-rose-600 uppercase tracking-wider">Dominant Pattern</span>
                                                <Sparkles className="w-5 h-5 text-rose-500" />
                                            </div>
                                            <h2 className="text-3xl font-black text-rose-950 dark:text-rose-50 mb-2">
                                                {results.primaryPattern}
                                            </h2>
                                            <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300">
                                                <div className="h-2 flex-1 bg-rose-200 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${results.matchScore}%` }}
                                                        className="h-full bg-rose-500 rounded-full"
                                                    />
                                                </div>
                                                <span className="font-bold">{results.matchScore}% Match</span>
                                            </div>
                                        </div>
                                    </Card>

                                    {/* Frameworks Analysis */}
                                    <div className="space-y-4">
                                        {results.frameworks.map((framework: any, idx: number) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                            >
                                                <Card className="group hover:border-rose-300/50 transition-colors border-border-default/40 bg-bg-surface/40">
                                                    <div className="p-4">
                                                        <div className="flex items-center justify-between mb-3">
                                                            <h4 className="font-bold text-fg-default flex items-center gap-2">
                                                                {framework.name}
                                                                <span className={cn(
                                                                    "text-xs px-2 py-0.5 rounded-full",
                                                                    framework.score > 70 ? "bg-emerald-100 text-emerald-700" :
                                                                        framework.score > 40 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                                                                )}>
                                                                    {framework.score}%
                                                                </span>
                                                            </h4>
                                                            {framework.score > 70 && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                                                        </div>

                                                        <p className="text-sm text-fg-muted mb-4">{framework.description}</p>

                                                        <div className="space-y-2">
                                                            {framework.details.map((detail: any, dIdx: number) => (
                                                                <div key={dIdx} className="flex items-center justify-between text-sm p-2 rounded bg-bg-canvas/50">
                                                                    <span className="font-medium text-fg-default">{detail.label}</span>
                                                                    {detail.status === 'detected' ? (
                                                                        <span className="text-emerald-600 flex items-center text-xs">
                                                                            <CheckCircle2 className="w-3 h-3 mr-1" /> Detected
                                                                        </span>
                                                                    ) : (
                                                                        <span className="text-fg-muted flex items-center text-xs opacity-50">
                                                                            <AlertCircle className="w-3 h-3 mr-1" /> Missing
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </Card>
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* Suggestions */}
                                    <Card className="border-border-default/40 bg-bg-surface/40 p-6">
                                        <h4 className="font-bold text-fg-default mb-4 flex items-center gap-2">
                                            <TrendingUp className="w-4 h-4 text-rose-500" />
                                            Optimization Tips
                                        </h4>
                                        <ul className="space-y-3">
                                            {results.suggestions.map((tip: string, idx: number) => (
                                                <li key={idx} className="flex items-start gap-2 text-sm text-fg-muted">
                                                    <ArrowRight className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                                                    {tip}
                                                </li>
                                            ))}
                                        </ul>
                                    </Card>
                                </motion.div>
                            </AnimatePresence>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
