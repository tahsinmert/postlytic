'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
    ArrowRight,
    ArrowLeft,
    Check,
    Sparkles,
    TrendingUp,
    Zap,
    BarChart3,
    Target,
    Users,
    Brain,
    Rocket,
    Star,
    Shield,
    Clock,
    ChevronRight,
    Play,
    CheckCircle2,
    Crown,
    Infinity,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// Step data
const STEPS = [
    { id: 1, title: 'Welcome', icon: Sparkles },
    { id: 2, title: 'Features', icon: Zap },
    { id: 3, title: 'Pricing', icon: Crown },
    { id: 4, title: 'Get Started', icon: Rocket },
];

const FEATURES = [
    {
        icon: Brain,
        title: 'AI-Powered Analysis',
        description: 'Deep learning models trained on millions of viral posts to predict your content performance.',
        color: 'from-violet-500 to-purple-500',
        bgColor: 'bg-violet-500/10',
        borderColor: 'border-violet-500/20',
    },
    {
        icon: TrendingUp,
        title: 'Virality Scoring',
        description: 'Get instant predictions on how well your post will perform before you publish.',
        color: 'from-emerald-500 to-teal-500',
        bgColor: 'bg-emerald-500/10',
        borderColor: 'border-emerald-500/20',
    },
    {
        icon: Target,
        title: 'Hook Optimization',
        description: 'Craft the perfect opening line that stops the scroll and captures attention.',
        color: 'from-amber-500 to-orange-500',
        bgColor: 'bg-amber-500/10',
        borderColor: 'border-amber-500/20',
    },
    {
        icon: Users,
        title: 'Audience Simulator',
        description: 'See how different audience segments will perceive and engage with your content.',
        color: 'from-cyan-500 to-blue-500',
        bgColor: 'bg-cyan-500/10',
        borderColor: 'border-cyan-500/20',
    },
    {
        icon: BarChart3,
        title: 'Engagement Predictor',
        description: 'Forecast likes, comments, and shares with remarkable accuracy.',
        color: 'from-pink-500 to-rose-500',
        bgColor: 'bg-pink-500/10',
        borderColor: 'border-pink-500/20',
    },
    {
        icon: Clock,
        title: 'Optimal Timing',
        description: 'Discover the perfect moment to post for maximum visibility and reach.',
        color: 'from-indigo-500 to-violet-500',
        bgColor: 'bg-indigo-500/10',
        borderColor: 'border-indigo-500/20',
    },
];

const PLANS = [
    {
        name: 'Free',
        price: '$0',
        period: 'forever',
        description: 'Perfect for getting started',
        features: [
            '5 post analyses per month',
            'Basic virality score',
            'Hook suggestions',
            'Community support',
        ],
        cta: 'Start Free',
        popular: false,
        gradient: 'from-gray-500 to-gray-600',
    },
    {
        name: 'Pro',
        price: '$19',
        period: '/month',
        description: 'For serious content creators',
        features: [
            'Unlimited post analyses',
            'Advanced AI insights',
            'Audience simulator',
            'Engagement predictor',
            'Optimal posting times',
            'Priority support',
        ],
        cta: 'Go Pro',
        popular: true,
        gradient: 'from-emerald-500 to-teal-500',
    },
    {
        name: 'Enterprise',
        price: 'Custom',
        period: '',
        description: 'For teams and agencies',
        features: [
            'Everything in Pro',
            'Team collaboration',
            'API access',
            'Custom integrations',
            'Dedicated account manager',
            'SLA guarantee',
        ],
        cta: 'Contact Sales',
        popular: false,
        gradient: 'from-violet-500 to-purple-500',
    },
];

const TESTIMONIALS = [
    {
        quote: "Postlytic helped me 10x my LinkedIn impressions in just 30 days. The AI suggestions are incredibly accurate.",
        author: "Sarah Chen",
        role: "Marketing Director at TechCorp",
        avatar: "SC",
    },
    {
        quote: "I went from 500 to 50,000 followers using the insights from this tool. Game changer for my personal brand.",
        author: "Marcus Johnson",
        role: "Founder & CEO at StartupXYZ",
        avatar: "MJ",
    },
    {
        quote: "The hook optimizer alone is worth the subscription. Every post I write now gets 3x more engagement.",
        author: "Emily Rodriguez",
        role: "Content Strategist",
        avatar: "ER",
    },
];

export default function GetStartedPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [isExiting, setIsExiting] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<string | null>('Pro');

    const handleNavigation = (path: string) => {
        setIsExiting(true);
        setTimeout(() => {
            router.push(path);
        }, 600);
    };

    const nextStep = () => {
        if (currentStep < STEPS.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <div className="min-h-screen w-full bg-bg-canvas text-fg-default relative overflow-hidden font-sans selection:bg-teal-500/30">
            {/* Transition Overlay */}
            <AnimatePresence>
                {isExiting && (
                    <motion.div
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="fixed inset-0 z-[100] bg-gradient-to-b from-teal-500 to-emerald-600 origin-bottom"
                    />
                )}
            </AnimatePresence>

            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-bg-canvas" />
                <div className="absolute -top-[20%] -left-[10%] h-[1000px] w-[1000px] rounded-full bg-teal-500/20 blur-[120px] animate-pulse" />
                <div className="absolute top-[20%] right-[0%] h-[800px] w-[800px] rounded-full bg-cyan-500/10 blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[600px] w-[1000px] rounded-full bg-violet-500/10 blur-[120px] animate-pulse" style={{ animationDelay: '4s' }} />
                {/* Noise Texture */}
                <div
                    className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
                    style={{
                        backgroundImage:
                            'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")',
                    }}
                />
            </div>

            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto w-full">
                <Link href="/" className="flex items-center gap-2 group">
                    <img src="/logo.png" alt="Logo" className="w-16 h-16 object-contain" />
                    <span className="text-3xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-teal-400 ml-2">
                        Postlytic
                    </span>
                </Link>
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        onClick={() => handleNavigation('/login')}
                        className="text-fg-muted hover:text-fg-default font-medium"
                    >
                        Log in
                    </Button>
                </div>
            </nav>

            {/* Progress Steps */}
            <div className="fixed top-24 md:top-28 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none">
                <div className="flex items-center gap-2 bg-white/5 backdrop-blur-xl rounded-full p-2 border border-white/10 pointer-events-auto overflow-x-auto max-w-full no-scrollbar">
                    {STEPS.map((step, index) => {
                        const Icon = step.icon;
                        const isActive = currentStep === step.id;
                        const isCompleted = currentStep > step.id;

                        return (
                            <motion.button
                                key={step.id}
                                onClick={() => setCurrentStep(step.id)}
                                className={cn(
                                    "flex items-center gap-2 px-3 md:px-4 py-2 rounded-full transition-all duration-300 whitespace-nowrap",
                                    isActive
                                        ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg shadow-teal-500/25"
                                        : isCompleted
                                            ? "bg-white/10 text-teal-400"
                                            : "text-fg-muted hover:text-fg-default hover:bg-white/5"
                                )}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {isCompleted ? (
                                    <CheckCircle2 className="w-4 h-4" />
                                ) : (
                                    <Icon className="w-4 h-4" />
                                )}
                                <span className={cn("text-xs md:text-sm font-medium", isActive ? "inline" : "hidden sm:inline")}>{step.title}</span>
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            {/* Main Content */}
            <main className="relative z-10 pt-44 pb-32 px-6">
                <div className="max-w-6xl mx-auto">
                    <AnimatePresence mode="wait">
                        {/* Step 1: Welcome */}
                        {currentStep === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                                className="text-center"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                    className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500 mb-8 shadow-2xl shadow-teal-500/30"
                                >
                                    <Sparkles className="w-10 h-10 text-white" />
                                </motion.div>

                                <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6">
                                    Welcome to{' '}
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-400 to-emerald-400">
                                        Postlytic
                                    </span>
                                </h1>

                                <p className="text-xl md:text-2xl text-fg-muted max-w-2xl mx-auto mb-12 leading-relaxed">
                                    The AI-powered platform that helps you create viral LinkedIn content
                                    and grow your professional presence.
                                </p>

                                {/* Stats */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16">
                                    {[
                                        { value: '10K+', label: 'Active Users' },
                                        { value: '500K+', label: 'Posts Analyzed' },
                                        { value: '89%', label: 'Accuracy Rate' },
                                        { value: '3x', label: 'Avg. Engagement Boost' },
                                    ].map((stat, index) => (
                                        <motion.div
                                            key={stat.label}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 + index * 0.1 }}
                                            className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
                                        >
                                            <div className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400 mb-2">
                                                {stat.value}
                                            </div>
                                            <div className="text-sm text-fg-muted">{stat.label}</div>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Testimonial Carousel */}
                                <div className="relative max-w-3xl mx-auto mb-12">
                                    <TestimonialCarousel testimonials={TESTIMONIALS} />
                                </div>

                                <Button
                                    size="lg"
                                    onClick={nextStep}
                                    className="h-14 px-8 text-lg font-bold bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white rounded-full shadow-xl shadow-teal-500/25 transition-all hover:scale-105"
                                >
                                    Explore Features
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </motion.div>
                        )}

                        {/* Step 2: Features */}
                        {currentStep === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="text-center mb-16">
                                    <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
                                        Powerful Features for{' '}
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">
                                            Growth
                                        </span>
                                    </h2>
                                    <p className="text-xl text-fg-muted max-w-2xl mx-auto">
                                        Everything you need to dominate LinkedIn and build your personal brand.
                                    </p>
                                </div>

                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                                    {FEATURES.map((feature, index) => {
                                        const Icon = feature.icon;
                                        return (
                                            <motion.div
                                                key={feature.title}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className={cn(
                                                    "group relative p-6 rounded-2xl border backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl",
                                                    feature.bgColor,
                                                    feature.borderColor
                                                )}
                                            >
                                                <div
                                                    className={cn(
                                                        "w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br shadow-lg",
                                                        feature.color
                                                    )}
                                                >
                                                    <Icon className="w-6 h-6 text-white" />
                                                </div>
                                                <h3 className="text-xl font-bold mb-2 text-fg-default">
                                                    {feature.title}
                                                </h3>
                                                <p className="text-fg-muted">{feature.description}</p>
                                            </motion.div>
                                        );
                                    })}
                                </div>

                                {/* Feature Demo Video Placeholder */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="relative max-w-4xl mx-auto mb-16 group cursor-pointer"
                                >
                                    <div className="aspect-video rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 border border-white/10 overflow-hidden relative">
                                        <div className="absolute inset-0 bg-[url('/logo.png')] bg-center bg-no-repeat bg-contain opacity-10" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform">
                                                <Play className="w-8 h-8 text-white ml-1" />
                                            </div>
                                        </div>
                                        <div className="absolute bottom-4 left-4 text-white/60 text-sm font-medium">
                                            Watch 2-min demo
                                        </div>
                                    </div>
                                </motion.div>

                                <div className="flex justify-center gap-4">
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        onClick={prevStep}
                                        className="h-14 px-8 text-lg font-bold rounded-full border-white/20 hover:bg-white/10"
                                    >
                                        <ArrowLeft className="mr-2 w-5 h-5" />
                                        Back
                                    </Button>
                                    <Button
                                        size="lg"
                                        onClick={nextStep}
                                        className="h-14 px-8 text-lg font-bold bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white rounded-full shadow-xl shadow-teal-500/25 transition-all hover:scale-105"
                                    >
                                        View Pricing
                                        <ArrowRight className="ml-2 w-5 h-5" />
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 3: Pricing */}
                        {currentStep === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="text-center mb-16">
                                    <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
                                        Simple, Transparent{' '}
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
                                            Pricing
                                        </span>
                                    </h2>
                                    <p className="text-xl text-fg-muted max-w-2xl mx-auto">
                                        Start for free, upgrade when you&apos;re ready to grow faster.
                                    </p>
                                </div>

                                <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
                                    {PLANS.map((plan, index) => (
                                        <motion.div
                                            key={plan.name}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            onClick={() => setSelectedPlan(plan.name)}
                                            className={cn(
                                                "relative p-8 rounded-2xl border backdrop-blur-xl transition-all duration-300 cursor-pointer",
                                                plan.popular
                                                    ? "bg-gradient-to-b from-teal-500/10 to-emerald-500/5 border-teal-500/30 scale-105"
                                                    : "bg-white/5 border-white/10 hover:bg-white/10",
                                                selectedPlan === plan.name &&
                                                !plan.popular &&
                                                "ring-2 ring-teal-500/50"
                                            )}
                                        >
                                            {plan.popular && (
                                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-sm font-bold rounded-full shadow-lg">
                                                    Most Popular
                                                </div>
                                            )}

                                            <div className="text-center mb-6">
                                                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                                                <div className="flex items-end justify-center gap-1">
                                                    <span className="text-4xl font-black">{plan.price}</span>
                                                    <span className="text-fg-muted mb-1">{plan.period}</span>
                                                </div>
                                                <p className="text-sm text-fg-muted mt-2">{plan.description}</p>
                                            </div>

                                            <ul className="space-y-3 mb-8">
                                                {plan.features.map((feature) => (
                                                    <li key={feature} className="flex items-start gap-3">
                                                        <Check className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                                                        <span className="text-sm text-fg-muted">{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>

                                            <Button
                                                className={cn(
                                                    "w-full h-12 font-bold rounded-xl transition-all",
                                                    plan.popular
                                                        ? "bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white shadow-lg shadow-teal-500/25"
                                                        : "bg-white/10 hover:bg-white/20 text-fg-default border border-white/10"
                                                )}
                                            >
                                                {plan.cta}
                                            </Button>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Trust Badges */}
                                <div className="flex flex-wrap items-center justify-center gap-8 mb-16">
                                    {[
                                        { icon: Shield, label: 'SSL Secure' },
                                        { icon: Clock, label: 'Cancel Anytime' },
                                        { icon: Infinity, label: 'No Hidden Fees' },
                                    ].map((badge) => {
                                        const Icon = badge.icon;
                                        return (
                                            <div
                                                key={badge.label}
                                                className="flex items-center gap-2 text-fg-muted"
                                            >
                                                <Icon className="w-5 h-5 text-teal-400" />
                                                <span className="text-sm font-medium">{badge.label}</span>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="flex justify-center gap-4">
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        onClick={prevStep}
                                        className="h-14 px-8 text-lg font-bold rounded-full border-white/20 hover:bg-white/10"
                                    >
                                        <ArrowLeft className="mr-2 w-5 h-5" />
                                        Back
                                    </Button>
                                    <Button
                                        size="lg"
                                        onClick={nextStep}
                                        className="h-14 px-8 text-lg font-bold bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white rounded-full shadow-xl shadow-teal-500/25 transition-all hover:scale-105"
                                    >
                                        Continue
                                        <ArrowRight className="ml-2 w-5 h-5" />
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 4: Final CTA */}
                        {currentStep === 4 && (
                            <motion.div
                                key="step4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                                className="text-center"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                    className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-teal-500 via-emerald-500 to-cyan-500 mb-8 shadow-2xl shadow-teal-500/40"
                                >
                                    <Rocket className="w-12 h-12 text-white" />
                                </motion.div>

                                <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6">
                                    Ready to{' '}
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-400 to-emerald-400 animate-gradient-x">
                                        Go Viral?
                                    </span>
                                </h1>

                                <p className="text-xl md:text-2xl text-fg-muted max-w-2xl mx-auto mb-12 leading-relaxed">
                                    Join thousands of creators who are already dominating LinkedIn with
                                    AI-powered insights.
                                </p>

                                {/* What you get */}
                                <div className="max-w-md mx-auto mb-12">
                                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 text-left">
                                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                            <Star className="w-5 h-5 text-amber-400" />
                                            What you get for free:
                                        </h3>
                                        <ul className="space-y-3">
                                            {[
                                                '5 post analyses per month',
                                                'Virality score predictions',
                                                'Hook optimization suggestions',
                                                'Basic engagement metrics',
                                                'No credit card required',
                                            ].map((item) => (
                                                <li key={item} className="flex items-center gap-3">
                                                    <div className="w-5 h-5 rounded-full bg-teal-500/20 flex items-center justify-center flex-shrink-0">
                                                        <Check className="w-3 h-3 text-teal-400" />
                                                    </div>
                                                    <span className="text-fg-muted">{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                                    <Button
                                        size="lg"
                                        onClick={() => handleNavigation('/login')}
                                        className="h-16 px-10 text-xl font-bold bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white rounded-full shadow-xl shadow-teal-500/25 transition-all hover:scale-105"
                                    >
                                        Create Free Account
                                        <ArrowRight className="ml-2 w-6 h-6" />
                                    </Button>
                                </div>

                                <Button
                                    variant="ghost"
                                    onClick={prevStep}
                                    className="text-fg-muted hover:text-fg-default"
                                >
                                    <ArrowLeft className="mr-2 w-4 h-4" />
                                    Go back
                                </Button>

                                <p className="text-sm text-fg-muted mt-8">
                                    Already have an account?{' '}
                                    <Link
                                        href="/login"
                                        className="text-teal-400 hover:text-teal-300 font-medium"
                                    >
                                        Log in here
                                    </Link>
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 py-8 border-t border-white/5 text-center text-fg-muted/40 text-sm">
                <p>&copy; {new Date().getFullYear()} Postlytic. All rights reserved.</p>
            </footer>
        </div>
    );
}

// Testimonial Carousel Component
function TestimonialCarousel({ testimonials }: { testimonials: typeof TESTIMONIALS }) {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [testimonials.length]);

    return (
        <div className="relative">
            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10"
                >
                    <div className="flex items-center gap-1 text-amber-400 mb-4 justify-center">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 fill-amber-400" />
                        ))}
                    </div>
                    <p className="text-lg text-fg-default italic mb-6">
                        &ldquo;{testimonials[current].quote}&rdquo;
                    </p>
                    <div className="flex items-center justify-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-white font-bold text-sm">
                            {testimonials[current].avatar}
                        </div>
                        <div className="text-left">
                            <p className="font-bold text-fg-default">{testimonials[current].author}</p>
                            <p className="text-sm text-fg-muted">{testimonials[current].role}</p>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-4">
                {testimonials.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={cn(
                            "w-2 h-2 rounded-full transition-all",
                            current === index
                                ? "w-6 bg-teal-500"
                                : "bg-white/20 hover:bg-white/40"
                        )}
                    />
                ))}
            </div>
        </div>
    );
}
