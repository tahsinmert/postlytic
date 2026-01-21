'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    Briefcase,
    Search,
    Glasses,
    Code2,
    ChevronRight,
    MessageSquare,
    ThumbsUp,
    ThumbsDown,
    Meh,
    Loader2,
    user
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';

const personas = [
    {
        id: 'recruiter',
        name: 'Sarah the Recruiter',
        role: 'Tech Recruiter @ BigTech',
        icon: Search,
        color: 'emerald',
        avatar: 'https://i.pravatar.cc/150?u=sarah',
        traits: ['Scans quickly', 'Looking for keywords', 'Values clarity']
    },
    {
        id: 'vc',
        name: 'David the VC',
        role: 'Partner @ Sequoia',
        icon: Briefcase,
        color: 'violet',
        avatar: 'https://i.pravatar.cc/150?u=david',
        traits: ['Skeptical', 'Market-focused', 'Hates fluff']
    },
    {
        id: 'dev',
        name: 'Alex the Engineer',
        role: 'Senior Dev @ Startup',
        icon: Code2,
        color: 'orange',
        avatar: 'https://i.pravatar.cc/150?u=alex',
        traits: ['Technical', 'Pragmatic', 'Likes code snippets']
    },
    {
        id: 'founder',
        name: 'Jessica the Founder',
        role: 'Series A Founder',
        icon: Glasses,
        color: 'blue',
        avatar: 'https://i.pravatar.cc/150?u=jessica',
        traits: ['Visionary', 'Busy', 'Values actionable insights']
    }
];

export default function AudienceSimulatorPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [text, setText] = useState('');
    const [selectedPersona, setSelectedPersona] = useState(personas[0]);
    const [simulating, setSimulating] = useState(false);
    const [simulation, setSimulation] = useState<any>(null);

    if (!authLoading && !user) {
        router.push('/login');
        return null;
    }

    const handleSimulate = async () => {
        if (!text.trim()) return;
        setSimulating(true);
        setSimulation(null);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 2500));

        const reactions = {
            recruiter: {
                mood: 'positive',
                score: 8,
                comment: "This catches my eye! Specifically the part about 'optimizing workflow' suggests you're process-oriented. However, I'd love to see more concrete metrics.",
                highlights: ['optimizing workflow', 'team leadership'],
                redFlags: ['maybe too much jargon']
            },
            vc: {
                mood: 'negative',
                score: 4,
                comment: "Too much buzzword bingo. What's the actual TAM here? You're talking about 'revolutionizing' but I don't see the unique insight.",
                highlights: ['market gap'],
                redFlags: ['revolutionizing', 'game-changer']
            },
            dev: {
                mood: 'neutral',
                score: 6,
                comment: "The concept is cool, but how does it handle scale? You mentioned 'seamless integration' but didn't specify the API protocols.",
                highlights: ['architecture'],
                redFlags: ['seamless integration']
            },
            founder: {
                mood: 'positive',
                score: 9,
                comment: "Love the hustle energy here. The problem statement is crystal clear. I'd definitely click 'Read More'.",
                highlights: ['problem statement', 'hustle'],
                redFlags: []
            }
        };

        setSimulation(reactions[selectedPersona.id as keyof typeof reactions]);
        setSimulating(false);
    };

    return (
        <div className="min-h-screen bg-bg-canvas relative overflow-hidden">
            {/* Ambient background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <Badge variant="outline" className="mb-4 bg-cyan-500/10 text-cyan-600 border-cyan-200 backdrop-blur-sm">
                        <Users className="w-3 h-3 mr-1" />
                        AI Persona Lab
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-black text-fg-default mb-4 tracking-tight">
                        Audience Simulator
                    </h1>
                    <p className="text-lg text-fg-muted max-w-2xl mx-auto">
                        Test your content against AI-simulated personas. See how a Recruiter, VC, or Developer would really react.
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Main Input Area */}
                    <div className="lg:col-span-7 space-y-6">
                        <Card className="p-6 border-cyan-200/40 bg-bg-surface/50 backdrop-blur-sm shadow-xl shadow-cyan-500/5">
                            <Textarea
                                placeholder="Draft your post here..."
                                className="min-h-[300px] resize-none border-border-default/50 bg-bg-canvas/40 focus:bg-bg-canvas/80 rounded-xl text-lg p-6 mb-4"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                            />
                            <div className="flex justify-end">
                                <Button
                                    size="lg"
                                    onClick={handleSimulate}
                                    disabled={!text.trim() || simulating}
                                    className="bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-500/20 w-full sm:w-auto"
                                >
                                    {simulating ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Simulating Reaction...
                                        </>
                                    ) : (
                                        <>
                                            <MessageSquare className="mr-2 h-4 w-4" />
                                            Get Feedback
                                        </>
                                    )}
                                </Button>
                            </div>
                        </Card>

                        {/* Persona Selector */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {personas.map((p) => (
                                <button
                                    key={p.id}
                                    onClick={() => {
                                        setSelectedPersona(p);
                                        setSimulation(null);
                                    }}
                                    className={cn(
                                        "relative p-4 rounded-xl border transition-all duration-200 text-left hover:scale-[1.02]",
                                        selectedPersona.id === p.id
                                            ? "bg-cyan-500/10 border-cyan-500/50 shadow-lg ring-1 ring-cyan-500/20"
                                            : "bg-bg-surface/40 border-border-default/40 hover:bg-bg-surface/60"
                                    )}
                                >
                                    <Avatar className="h-10 w-10 mb-3 border-2 border-white shadow-sm">
                                        <AvatarImage src={p.avatar} />
                                        <AvatarFallback>{p.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <p className="font-bold text-sm text-fg-default truncate">{p.name}</p>
                                    <p className="text-xs text-fg-muted truncate">{p.role}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Simulation Result Area */}
                    <div className="lg:col-span-5 relative">
                        <Card className="h-full min-h-[500px] border-cyan-200/40 bg-gradient-to-b from-bg-surface/80 to-bg-canvas/80 backdrop-blur-md p-6 flex flex-col relative overflow-hidden">
                            {/* Decorative background elements */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                            <div className="flex items-center gap-4 mb-8 relative z-10">
                                <Avatar className="h-16 w-16 border-4 border-bg-surface shadow-xl">
                                    <AvatarImage src={selectedPersona.avatar} />
                                    <AvatarFallback>{selectedPersona.name[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="text-xl font-bold text-fg-default">{selectedPersona.name}</h3>
                                    <p className="text-sm text-fg-muted">{selectedPersona.role}</p>
                                    <div className="flex gap-2 mt-2">
                                        {selectedPersona.traits.map((trait, i) => (
                                            <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-bg-canvas border border-border-default/50 text-fg-muted">
                                                {trait}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 relative z-10">
                                <AnimatePresence mode="wait">
                                    {simulation ? (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="space-y-6"
                                        >
                                            {/* Chat Bubble */}
                                            <div className="relative bg-bg-surface p-6 rounded-2xl rounded-tl-none shadow-sm border border-border-default/50">
                                                <div className="absolute -left-2 top-0 w-4 h-4 bg-bg-surface transform rotate-45 border-l border-t border-border-default/50" />
                                                <p className="text-lg text-fg-default italic leading-relaxed">
                                                    "{simulation.comment}"
                                                </p>
                                            </div>

                                            {/* Score Board */}
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-4 rounded-xl bg-bg-surface/50 border border-border-default/40 text-center">
                                                    <p className="text-xs text-fg-muted uppercase tracking-wider mb-1">Impact Score</p>
                                                    <p className="text-3xl font-black text-cyan-600">{simulation.score}/10</p>
                                                </div>
                                                <div className="p-4 rounded-xl bg-bg-surface/50 border border-border-default/40 text-center flex flex-col items-center justify-center">
                                                    <p className="text-xs text-fg-muted uppercase tracking-wider mb-1">Reaction</p>
                                                    {simulation.mood === 'positive' && <ThumbsUp className="w-6 h-6 text-emerald-500" />}
                                                    {simulation.mood === 'negative' && <ThumbsDown className="w-6 h-6 text-rose-500" />}
                                                    {simulation.mood === 'neutral' && <Meh className="w-6 h-6 text-amber-500" />}
                                                </div>
                                            </div>

                                            {/* Analysis Tags */}
                                            <div className="space-y-3">
                                                <div className="flex flex-wrap gap-2">
                                                    <span className="text-xs font-semibold text-emerald-600">Loved:</span>
                                                    {simulation.highlights.map((h: string, i: number) => (
                                                        <Badge key={i} variant="outline" className="bg-emerald-500/5 text-emerald-700 border-emerald-200">
                                                            {h}
                                                        </Badge>
                                                    ))}
                                                </div>
                                                {simulation.redFlags.length > 0 && (
                                                    <div className="flex flex-wrap gap-2">
                                                        <span className="text-xs font-semibold text-rose-600">Hated:</span>
                                                        {simulation.redFlags.map((h: string, i: number) => (
                                                            <Badge key={i} variant="outline" className="bg-rose-500/5 text-rose-700 border-rose-200">
                                                                {h}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                        </motion.div>
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-center p-8 opacity-50">
                                            <div>
                                                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-cyan-300" />
                                                <p className="text-sm">Click "Get Feedback" to hear what {selectedPersona.name.split(' ')[0]} thinks.</p>
                                            </div>
                                        </div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
