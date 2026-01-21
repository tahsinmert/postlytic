'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import {
  Loader2,
  BarChart3,
  Rocket,
  ArrowRight,
  Building2,
  BookOpen,
  Clock,
  TestTube,
  Fingerprint,
  Users,
  Eye
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const tools = [
  {
    id: 'compare',
    title: 'Post Comparison',
    description: 'Compare two or more LinkedIn posts and learn which one is more effective.',
    icon: BarChart3,
    href: '/compare',
    color: 'emerald',
    badge: 'Analysis',
    features: [
      'Detailed metric analysis',
      'Side-by-side comparison',
      'Performance scores',
      'Improvement suggestions'
    ]
  },
  {
    id: 'engagement-predictor',
    title: 'Engagement Predictor',
    description: 'See potential engagement and reach predictions for your post before you publish.',
    icon: Rocket,
    href: '/engagement-predictor',
    color: 'blue',
    badge: 'Prediction',
    features: [
      'Engagement prediction',
      'Reach prediction',
      'Performance scores',
      'Optimization suggestions'
    ]
  },
  {
    id: 'viral-patterns',
    title: 'Viral Pattern Decoder',
    description: 'Decode the hidden psychological frameworks behind viral posts (PAS, AIDA, Hero\'s Journey).',
    icon: Fingerprint,
    href: '/viral-patterns',
    color: 'rose',
    badge: 'New & Hot',
    features: [
      'Detect viral frameworks',
      'Structural analysis',
      'Pattern matching score',
      'Missing element detection'
    ]
  },
  {
    id: 'audience-simulator',
    title: 'Audience Simulator',
    description: 'Simulate how specific personas (Recruiters, VCs, Devs) would react to your content.',
    icon: Users,
    href: '/audience-simulator',
    color: 'cyan',
    badge: 'AI Lab',
    features: [
      'Persona-based simulation',
      'Reaction prediction',
      'Specific feedback',
      'Red flag detection'
    ]
  },
  {
    id: 'hook-optimizer',
    title: 'Hook & Fold Optimizer',
    description: 'Optimize the first 210 characters to ensure your audience clicks "See More".',
    icon: Eye,
    href: '/hook-optimizer',
    color: 'amber',
    badge: 'Utility',
    features: [
      'Fold preview (Mobile/Desktop)',
      'Hook strength score',
      'Curiosity gap analysis',
      'Visual density check'
    ]
  },
  {
    id: 'competitor-analysis',
    title: 'Competitor Analysis',
    description: 'Analyze competitor posts and benchmark your content against industry standards.',
    icon: Building2,
    href: '/competitor-analysis',
    color: 'purple',
    badge: 'Advanced',
    features: [
      'Competitor post analysis',
      'Benchmark comparison',
      'Industry average positioning',
      'Competitive insights'
    ]
  },
  {
    id: 'optimal-posting-times',
    title: 'Optimal Posting Times',
    description: 'Discover the best times to post on LinkedIn based on your historical data.',
    icon: Clock,
    href: '/optimal-posting-times',
    color: 'indigo',
    badge: 'Optimization',
    features: [
      'LinkedIn active hours analysis',
      'Personalized recommendations',
      'Timing suggestions',
      'Historical data insights'
    ]
  },
  {
    id: 'ab-testing',
    title: 'A/B Testing',
    description: 'Create multiple post variations with different hooks and CTAs to maximize engagement.',
    icon: TestTube,
    href: '/ab-testing',
    color: 'pink',
    badge: 'Testing',
    features: [
      'Create different versions',
      'Hook variations',
      'CTA variations',
      'Hashtag combinations'
    ]
  },
  {
    id: 'best-practices',
    title: 'Best Practices Guide',
    description: 'Master LinkedIn post writing with proven strategies and category-based guides.',
    icon: BookOpen,
    href: '/best-practices',
    color: 'orange',
    badge: 'Guide',
    features: [
      'LinkedIn post writing tips',
      'Successful post examples',
      'Category-based guides',
      'Video explanations'
    ]
  }
];

const getColorClasses = (color: string) => {
  const colors: Record<string, {
    bg: string;
    border: string;
    text: string;
    iconBg: string;
    iconColor: string;
    listMarker: string;
    hoverBorder: string;
    badgeBg: string;
    badgeText: string;
    badgeBorder: string;
  }> = {
    emerald: {
      bg: 'hover:bg-emerald-500/5',
      border: 'border-border-default/40',
      text: 'group-hover:text-emerald-600 dark:group-hover:text-emerald-400',
      iconBg: 'bg-emerald-500/10',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      listMarker: 'bg-emerald-500',
      hoverBorder: 'hover:border-emerald-500/30',
      badgeBg: 'bg-emerald-100 dark:bg-emerald-900/30',
      badgeText: 'text-emerald-700 dark:text-emerald-300',
      badgeBorder: 'border-emerald-200 dark:border-emerald-800',
    },
    blue: {
      bg: 'hover:bg-blue-500/5',
      border: 'border-border-default/40',
      text: 'group-hover:text-blue-600 dark:group-hover:text-blue-400',
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-600 dark:text-blue-400',
      listMarker: 'bg-blue-500',
      hoverBorder: 'hover:border-blue-500/30',
      badgeBg: 'bg-blue-100 dark:bg-blue-900/30',
      badgeText: 'text-blue-700 dark:text-blue-300',
      badgeBorder: 'border-blue-200 dark:border-blue-800',
    },
    purple: {
      bg: 'hover:bg-purple-500/5',
      border: 'border-border-default/40',
      text: 'group-hover:text-purple-600 dark:group-hover:text-purple-400',
      iconBg: 'bg-purple-500/10',
      iconColor: 'text-purple-600 dark:text-purple-400',
      listMarker: 'bg-purple-500',
      hoverBorder: 'hover:border-purple-500/30',
      badgeBg: 'bg-purple-100 dark:bg-purple-900/30',
      badgeText: 'text-purple-700 dark:text-purple-300',
      badgeBorder: 'border-purple-200 dark:border-purple-800',
    },
    indigo: {
      bg: 'hover:bg-indigo-500/5',
      border: 'border-border-default/40',
      text: 'group-hover:text-indigo-600 dark:group-hover:text-indigo-400',
      iconBg: 'bg-indigo-500/10',
      iconColor: 'text-indigo-600 dark:text-indigo-400',
      listMarker: 'bg-indigo-500',
      hoverBorder: 'hover:border-indigo-500/30',
      badgeBg: 'bg-indigo-100 dark:bg-indigo-900/30',
      badgeText: 'text-indigo-700 dark:text-indigo-300',
      badgeBorder: 'border-indigo-200 dark:border-indigo-800',
    },
    pink: {
      bg: 'hover:bg-pink-500/5',
      border: 'border-border-default/40',
      text: 'group-hover:text-pink-600 dark:group-hover:text-pink-400',
      iconBg: 'bg-pink-500/10',
      iconColor: 'text-pink-600 dark:text-pink-400',
      listMarker: 'bg-pink-500',
      hoverBorder: 'hover:border-pink-500/30',
      badgeBg: 'bg-pink-100 dark:bg-pink-900/30',
      badgeText: 'text-pink-700 dark:text-pink-300',
      badgeBorder: 'border-pink-200 dark:border-pink-800',
    },
    orange: {
      bg: 'hover:bg-orange-500/5',
      border: 'border-border-default/40',
      text: 'group-hover:text-orange-600 dark:group-hover:text-orange-400',
      iconBg: 'bg-orange-500/10',
      iconColor: 'text-orange-600 dark:text-orange-400',
      listMarker: 'bg-orange-500',
      hoverBorder: 'hover:border-orange-500/30',
      badgeBg: 'bg-orange-100 dark:bg-orange-900/30',
      badgeText: 'text-orange-700 dark:text-orange-300',
      badgeBorder: 'border-orange-200 dark:border-orange-800',
    },
    // New Color Themes
    rose: {
      bg: 'hover:bg-rose-500/5',
      border: 'border-border-default/40',
      text: 'group-hover:text-rose-600 dark:group-hover:text-rose-400',
      iconBg: 'bg-rose-500/10',
      iconColor: 'text-rose-600 dark:text-rose-400',
      listMarker: 'bg-rose-500',
      hoverBorder: 'hover:border-rose-500/30',
      badgeBg: 'bg-rose-100 dark:bg-rose-900/30',
      badgeText: 'text-rose-700 dark:text-rose-300',
      badgeBorder: 'border-rose-200 dark:border-rose-800',
    },
    cyan: {
      bg: 'hover:bg-cyan-500/5',
      border: 'border-border-default/40',
      text: 'group-hover:text-cyan-600 dark:group-hover:text-cyan-400',
      iconBg: 'bg-cyan-500/10',
      iconColor: 'text-cyan-600 dark:text-cyan-400',
      listMarker: 'bg-cyan-500',
      hoverBorder: 'hover:border-cyan-500/30',
      badgeBg: 'bg-cyan-100 dark:bg-cyan-900/30',
      badgeText: 'text-cyan-700 dark:text-cyan-300',
      badgeBorder: 'border-cyan-200 dark:border-cyan-800',
    },
    amber: {
      bg: 'hover:bg-amber-500/5',
      border: 'border-border-default/40',
      text: 'group-hover:text-amber-600 dark:group-hover:text-amber-400',
      iconBg: 'bg-amber-500/10',
      iconColor: 'text-amber-600 dark:text-amber-400',
      listMarker: 'bg-amber-500',
      hoverBorder: 'hover:border-amber-500/30',
      badgeBg: 'bg-amber-100 dark:bg-amber-900/30',
      badgeText: 'text-amber-700 dark:text-amber-300',
      badgeBorder: 'border-amber-200 dark:border-amber-800',
    },
  };
  return colors[color] || colors.emerald;
};

export default function ToolsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Redirect if not authenticated
  if (!authLoading && !user) {
    router.push('/login');
    return null;
  }

  if (authLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-bg-canvas">
        <Loader2 className="h-12 w-12 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-canvas relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 space-y-4"
        >
          <Badge variant="outline" className="mb-2 bg-emerald-500/10 text-emerald-600 border-emerald-200 backdrop-blur-sm">
            Toolbox
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-fg-default tracking-tight">
            Our Tools
          </h1>
          <p className="text-xl text-fg-muted max-w-2xl mx-auto leading-relaxed">
            Powerful tools to analyze, predict, and optimize your LinkedIn content strategy.
          </p>
        </motion.div>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            const colors = getColorClasses(tool.color);

            return (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="h-full"
              >
                <div
                  className={cn(
                    "group relative h-full flex flex-col p-8 rounded-3xl transition-all duration-300 cursor-pointer overflow-hidden",
                    "bg-bg-surface/50 backdrop-blur-sm border shadow-sm",
                    colors.border,
                    colors.bg,
                    colors.hoverBorder,
                    "hover:shadow-2xl hover:-translate-y-1"
                  )}
                  onClick={() => router.push(tool.href)}
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className={cn(
                      "p-3.5 rounded-2xl transition-transform duration-300 group-hover:scale-110",
                      colors.iconBg
                    )}>
                      <Icon className={cn("h-7 w-7", colors.iconColor)} />
                    </div>
                    <Badge variant="outline" className={cn(
                      "font-medium border",
                      colors.badgeBg,
                      colors.badgeText,
                      colors.badgeBorder
                    )}>
                      {tool.badge}
                    </Badge>
                  </div>

                  {/* Card Content */}
                  <div className="flex-1">
                    <h3 className={cn(
                      "text-2xl font-bold mb-3 transition-colors",
                      "text-fg-default",
                      colors.text
                    )}>
                      {tool.title}
                    </h3>
                    <p className="text-fg-muted leading-relaxed mb-6">
                      {tool.description}
                    </p>

                    <div className="space-y-3 mb-8">
                      {tool.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <div className={cn("h-1.5 w-1.5 rounded-full shrink-0", colors.listMarker)} />
                          <span className="text-sm font-medium text-fg-muted/80">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="mt-auto pt-4 border-t border-border-default/30">
                    <div className={cn(
                      "flex items-center font-semibold text-sm transition-transform duration-300 group-hover:translate-x-1",
                      colors.iconColor
                    )}>
                      Open Tool
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
