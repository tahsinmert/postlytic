'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Loader2,
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  Target,
  BarChart3,
  Users,
  Award,
  Zap,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Gauge,
  Activity,
  FileText,
  Hash,
  Heart,
  MessageSquare,
  Share2,
  Trophy,
  ChevronDown,
  ChevronUp,
  Building2,
  Globe,
  LineChart,
  PieChart,
  Lightbulb,
  BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { runAnalysis } from '@/lib/analysis/engine';
import type { AnalysisData } from '@/lib/analysis/types';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface CompetitorPost {
  id: string;
  name: string;
  text: string;
  analysis: AnalysisData | null;
  isLoading: boolean;
  company?: string;
  industry?: string;
}

interface BenchmarkData {
  industry: string;
  averageVirality: number;
  averageEngagement: number;
  averageHook: number;
  averageStructure: number;
  averageCTA: number;
  averageHashtags: number;
  topPerformers: {
    virality: number;
    engagement: number;
  };
}

// Industry benchmarks (simulated data - in production, this would come from real analytics)
const INDUSTRY_BENCHMARKS: Record<string, BenchmarkData> = {
  'Technology': {
    industry: 'Technology',
    averageVirality: 72,
    averageEngagement: 68,
    averageHook: 75,
    averageStructure: 70,
    averageCTA: 65,
    averageHashtags: 70,
    topPerformers: { virality: 88, engagement: 85 },
  },
  'Marketing': {
    industry: 'Marketing',
    averageVirality: 75,
    averageEngagement: 72,
    averageHook: 78,
    averageStructure: 73,
    averageCTA: 70,
    averageHashtags: 75,
    topPerformers: { virality: 90, engagement: 88 },
  },
  'Finance': {
    industry: 'Finance',
    averageVirality: 68,
    averageEngagement: 65,
    averageHook: 70,
    averageStructure: 68,
    averageCTA: 65,
    averageHashtags: 65,
    topPerformers: { virality: 85, engagement: 82 },
  },
  'Healthcare': {
    industry: 'Healthcare',
    averageVirality: 70,
    averageEngagement: 67,
    averageHook: 72,
    averageStructure: 70,
    averageCTA: 68,
    averageHashtags: 68,
    topPerformers: { virality: 87, engagement: 84 },
  },
  'Education': {
    industry: 'Education',
    averageVirality: 73,
    averageEngagement: 70,
    averageHook: 76,
    averageStructure: 72,
    averageCTA: 68,
    averageHashtags: 72,
    topPerformers: { virality: 89, engagement: 86 },
  },
  'General': {
    industry: 'General',
    averageVirality: 70,
    averageEngagement: 68,
    averageHook: 73,
    averageStructure: 70,
    averageCTA: 67,
    averageHashtags: 70,
    topPerformers: { virality: 86, engagement: 83 },
  },
};

const getColorClasses = (color: string) => {
  const colors: Record<string, { icon: string }> = {
    emerald: { icon: 'text-emerald-500' },
    blue: { icon: 'text-blue-500' },
    purple: { icon: 'text-purple-500' },
    pink: { icon: 'text-pink-500' },
    orange: { icon: 'text-orange-500' },
    red: { icon: 'text-red-500' },
    yellow: { icon: 'text-yellow-500' },
    cyan: { icon: 'text-cyan-500' },
  };
  return colors[color] || colors.emerald;
};

const METRIC_CONFIG = [
  { key: 'virality', label: 'Virality Score', icon: Zap, color: 'emerald', weight: 1.0 },
  { key: 'hook', label: 'Hook', icon: Target, color: 'blue', weight: 0.2 },
  { key: 'structure', label: 'Structure', icon: FileText, color: 'purple', weight: 0.15 },
  { key: 'cta', label: 'CTA', icon: ArrowRight, color: 'pink', weight: 0.15 },
  { key: 'hashtags', label: 'Hashtags', icon: Hash, color: 'orange', weight: 0.1 },
  { key: 'engagement', label: 'Engagement', icon: Heart, color: 'red', weight: 0.15 },
  { key: 'storytelling', label: 'Storytelling', icon: BookOpen, color: 'yellow', weight: 0.1 },
  { key: 'readability', label: 'Readability', icon: Activity, color: 'cyan', weight: 0.05 },
] as const;

export default function CompetitorAnalysisPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [yourPost, setYourPost] = useState({ text: '', analysis: null as AnalysisData | null, isLoading: false });
  const [competitors, setCompetitors] = useState<CompetitorPost[]>([
    { id: '1', name: 'Competitor 1', text: '', analysis: null, isLoading: false },
  ]);
  const [selectedIndustry, setSelectedIndustry] = useState<string>('General');
  const [expandedMetrics, setExpandedMetrics] = useState<Set<string>>(new Set());

  // Redirect if not authenticated
  if (!authLoading && !user) {
    router.push('/login');
    return null;
  }

  if (authLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-emerald-500" />
      </div>
    );
  }

  const addCompetitor = () => {
    const newId = String(competitors.length + 1);
    setCompetitors([
      ...competitors,
      { id: newId, name: `Competitor ${newId}`, text: '', analysis: null, isLoading: false },
    ]);
  };

  const removeCompetitor = (id: string) => {
    if (competitors.length <= 1) {
      toast({
        title: 'Minimum 1 competitor required',
        description: 'At least 1 competitor is required for analysis.',
        variant: 'destructive',
      });
      return;
    }
    setCompetitors(competitors.filter(c => c.id !== id));
  };

  const updateCompetitor = (id: string, updates: Partial<CompetitorPost>) => {
    setCompetitors(competitors.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const analyzePost = async (text: string, isYourPost: boolean = false) => {
    if (!text.trim()) {
      toast({
        title: 'Post is empty',
        description: 'Please enter a post to analyze.',
        variant: 'destructive',
      });
      return;
    }

    if (isYourPost) {
      setYourPost({ ...yourPost, isLoading: true });
    } else {
      setCompetitors(competitors.map(c => c.text === text ? { ...c, isLoading: true } : c));
    }

    try {
      const analysis = runAnalysis(text);
      if (isYourPost) {
        setYourPost({ text, analysis, isLoading: false });
      } else {
        setCompetitors(competitors.map(c => c.text === text ? { ...c, analysis, isLoading: false } : c));
      }
      toast({
        title: 'Analysis completed',
        description: 'Post successfully analyzed.',
      });
    } catch (error) {
      console.error('Analysis error:', error);
      if (isYourPost) {
        setYourPost({ ...yourPost, isLoading: false });
      } else {
        setCompetitors(competitors.map(c => c.text === text ? { ...c, isLoading: false } : c));
      }
      toast({
        title: 'Analysis error',
        description: 'An error occurred while analyzing the post.',
        variant: 'destructive',
      });
    }
  };

  const analyzeAll = async () => {
    if (yourPost.text.trim() && !yourPost.analysis) {
      await analyzePost(yourPost.text, true);
    }
    for (const competitor of competitors) {
      if (competitor.text.trim() && !competitor.analysis) {
        await analyzePost(competitor.text, false);
      }
    }
  };

  const getMetricScore = (analysis: AnalysisData, metricKey: string): number => {
    switch (metricKey) {
      case 'virality':
        return analysis.viralityScore.score;
      case 'hook':
        return analysis.hook.score;
      case 'structure':
        return analysis.structure.score;
      case 'cta':
        return analysis.cta.score;
      case 'hashtags':
        return analysis.hashtags.score;
      case 'engagement':
        return analysis.engagement.engagementScore;
      case 'storytelling':
        return analysis.storytelling.storytellingScore;
      case 'readability':
        return analysis.readability.fleschKincaidScore;
      default:
        return 0;
    }
  };

  const benchmark = INDUSTRY_BENCHMARKS[selectedIndustry] || INDUSTRY_BENCHMARKS['General'];
  const analyzedCompetitors = competitors.filter(c => c.analysis);
  const allAnalyzed = yourPost.analysis && analyzedCompetitors.length > 0;

  // Calculate positioning
  const calculatePositioning = () => {
    if (!yourPost.analysis || analyzedCompetitors.length === 0) return null;

    const yourVirality = yourPost.analysis.viralityScore.score;
    const competitorVirality = analyzedCompetitors.map(c => c.analysis!.viralityScore.score);
    const avgCompetitorVirality = competitorVirality.reduce((a, b) => a + b, 0) / competitorVirality.length;
    const maxCompetitorVirality = Math.max(...competitorVirality);

    const position = {
      vsIndustry: yourVirality - benchmark.averageVirality,
      vsCompetitors: yourVirality - avgCompetitorVirality,
      vsTopCompetitor: yourVirality - maxCompetitorVirality,
      percentile: 0,
    };

    // Calculate percentile
    const allScores = [yourVirality, ...competitorVirality, benchmark.averageVirality];
    const sortedScores = [...allScores].sort((a, b) => b - a);
    const yourRank = sortedScores.indexOf(yourVirality) + 1;
    position.percentile = ((allScores.length - yourRank) / allScores.length) * 100;

    return position;
  };

  const positioning = calculatePositioning();

  // Calculate competitive insights
  const getCompetitiveInsights = () => {
    if (!yourPost.analysis || analyzedCompetitors.length === 0) return [];

    const insights: string[] = [];
    const yourAnalysis = yourPost.analysis;

    // Virality comparison
    const yourVirality = yourAnalysis.viralityScore.score;
    const avgCompetitorVirality = analyzedCompetitors.reduce(
      (sum, c) => sum + c.analysis!.viralityScore.score,
      0
    ) / analyzedCompetitors.length;

    if (yourVirality > avgCompetitorVirality + 5) {
      insights.push(`Your post outperforms competitors by ${Math.round(yourVirality - avgCompetitorVirality)} points in virality score.`);
    } else if (yourVirality < avgCompetitorVirality - 5) {
      insights.push(`Your post is ${Math.round(avgCompetitorVirality - yourVirality)} points below competitor average. Focus on improving hook and engagement.`);
    }

    // Hook comparison
    const yourHook = yourAnalysis.hook.score;
    const avgCompetitorHook = analyzedCompetitors.reduce(
      (sum, c) => sum + c.analysis!.hook.score,
      0
    ) / analyzedCompetitors.length;

    if (yourHook < avgCompetitorHook - 10) {
      insights.push(`Your hook score is ${Math.round(avgCompetitorHook - yourHook)} points below competitors. Consider stronger opening lines.`);
    }

    // Engagement comparison
    const yourEngagement = yourAnalysis.engagement.engagementScore;
    const avgCompetitorEngagement = analyzedCompetitors.reduce(
      (sum, c) => sum + c.analysis!.engagement.engagementScore,
      0
    ) / analyzedCompetitors.length;

    if (yourEngagement < avgCompetitorEngagement - 10) {
      insights.push(`Your engagement potential is ${Math.round(avgCompetitorEngagement - yourEngagement)} points lower. Add more questions and emotional triggers.`);
    }

    // Structure comparison
    const yourStructure = yourAnalysis.structure.score;
    const avgCompetitorStructure = analyzedCompetitors.reduce(
      (sum, c) => sum + c.analysis!.structure.score,
      0
    ) / analyzedCompetitors.length;

    if (yourStructure > avgCompetitorStructure + 5) {
      insights.push(`Your post structure is superior to competitors - maintain this advantage.`);
    }

    return insights;
  };

  const competitiveInsights = getCompetitiveInsights();

  return (
    <div className="relative min-h-screen bg-bg-canvas pt-24 pb-16 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 right-1/2 translate-x-1/2 w-full max-w-7xl h-96 bg-emerald-500/5 rounded-[4rem] blur-[120px] -z-10" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-600 mb-6">
                <Users className="h-3.5 w-3.5" />
                <span>Market Intelligence</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-fg-default mb-4">
                Competitor Analysis
              </h1>
              <p className="text-lg text-fg-muted">
                Benchmark your content against industry leaders and competitors.
              </p>
            </div>
            <div className="flex gap-2 flex-wrap items-end">
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="h-10 px-4 rounded-xl border border-border-default bg-bg-surface text-fg-default text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none"
              >
                {Object.keys(INDUSTRY_BENCHMARKS).map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
              <Button
                onClick={analyzeAll}
                disabled={!allAnalyzed && (!yourPost.text.trim() || analyzedCompetitors.length === 0)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 h-10 rounded-xl"
              >
                {allAnalyzed ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    All Analyzed
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Analyze All
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Your Post Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-sm rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                <Target className="h-5 w-5" />
                Your Post
              </CardTitle>
              <CardDescription>
                Enter your LinkedIn post to compare against competitors
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={yourPost.text}
                onChange={(e) => setYourPost({ ...yourPost, text: e.target.value, analysis: null })}
                placeholder="Paste your LinkedIn post here..."
                className="min-h-[200px] resize-none border-emerald-500/10 bg-white/50 dark:bg-black/20 focus:bg-white/80 dark:focus:bg-black/40 rounded-xl"
              />
              <Button
                onClick={() => analyzePost(yourPost.text, true)}
                disabled={!yourPost.text.trim() || yourPost.isLoading}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl h-11"
              >
                {yourPost.isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Analyze Your Post
                  </>
                )}
              </Button>
              {yourPost.analysis && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-emerald-700 dark:text-emerald-300">
                      Your Virality Score
                    </span>
                    <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                      {yourPost.analysis.viralityScore.score}
                    </span>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Competitors Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-fg-default flex items-center gap-2">
              <Users className="h-6 w-6 text-emerald-500" />
              Competitor Posts
            </h2>
            <Button
              onClick={addCompetitor}
              variant="outline"
              className="border-emerald-200 hover:bg-emerald-50 dark:border-emerald-800 dark:hover:bg-emerald-950"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Competitor
            </Button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AnimatePresence>
              {competitors.map((competitor, index) => (
                <motion.div
                  key={competitor.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="h-full flex flex-col border border-border-default/40 bg-bg-surface/50 backdrop-blur-sm rounded-2xl hover:border-blue-500/30 hover:shadow-lg transition-all">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-1">
                          <input
                            type="text"
                            value={competitor.name}
                            onChange={(e) => updateCompetitor(competitor.id, { name: e.target.value })}
                            className="text-lg font-bold bg-transparent border-none outline-none focus:ring-0 px-0 flex-1 text-fg-default placeholder:text-muted-foreground/50"
                            placeholder="Competitor name"
                          />
                          <Badge variant="outline" className="text-xs border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-300">
                            #{index + 1}
                          </Badge>
                        </div>
                        {competitors.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeCompetitor(competitor.id)}
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col gap-4">
                      <Textarea
                        value={competitor.text}
                        onChange={(e) => updateCompetitor(competitor.id, { text: e.target.value, analysis: null })}
                        placeholder="Paste competitor post text here..."
                        className="min-h-[200px] resize-none flex-1 border-border-default/50 bg-bg-canvas/50 rounded-xl"
                      />
                      <Button
                        onClick={() => analyzePost(competitor.text, false)}
                        disabled={!competitor.text.trim() || competitor.isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-xl h-11"
                      >
                        {competitor.isLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4 mr-2" />
                            Analyze
                          </>
                        )}
                      </Button>
                      {competitor.analysis && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2"
                        >
                          <div className="flex items-center justify-between p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                              Virality Score
                            </span>
                            <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
                              {competitor.analysis.viralityScore.score}
                            </span>
                          </div>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
          </AnimatePresence>
      </div>
    </motion.div>

        {/* Results Section */ }
  {
    allAnalyzed && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-6"
      >
        {/* Positioning Card */}
        {positioning && (
          <Card className="border-2 border-emerald-500/50">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Gauge className="h-6 w-6 text-emerald-500" />
                Industry Positioning
              </CardTitle>
              <CardDescription>
                How your post compares to industry benchmarks and competitors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="p-4 rounded-lg border-2 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/30 dark:to-emerald-900/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                      vs Industry Avg
                    </span>
                    {positioning.vsIndustry >= 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {positioning.vsIndustry >= 0 ? '+' : ''}{positioning.vsIndustry.toFixed(1)}
                  </div>
                  <div className="text-xs text-emerald-600/70 dark:text-emerald-400/70 mt-1">
                    Industry: {benchmark.averageVirality}
                  </div>
                </div>
                <div className="p-4 rounded-lg border-2 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                      vs Competitors Avg
                    </span>
                    {positioning.vsCompetitors >= 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {positioning.vsCompetitors >= 0 ? '+' : ''}{positioning.vsCompetitors.toFixed(1)}
                  </div>
                  <div className="text-xs text-blue-600/70 dark:text-blue-400/70 mt-1">
                    Avg: {(
                      analyzedCompetitors.reduce((sum, c) => sum + c.analysis!.viralityScore.score, 0) /
                      analyzedCompetitors.length
                    ).toFixed(1)}
                  </div>
                </div>
                <div className="p-4 rounded-lg border-2 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                      vs Top Competitor
                    </span>
                    {positioning.vsTopCompetitor >= 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {positioning.vsTopCompetitor >= 0 ? '+' : ''}{positioning.vsTopCompetitor.toFixed(1)}
                  </div>
                  <div className="text-xs text-purple-600/70 dark:text-purple-400/70 mt-1">
                    Top: {Math.max(...analyzedCompetitors.map(c => c.analysis!.viralityScore.score))}
                  </div>
                </div>
                <div className="p-4 rounded-lg border-2 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950/30 dark:to-yellow-900/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                      Percentile Rank
                    </span>
                    <Trophy className="h-4 w-4 text-yellow-500" />
                  </div>
                  <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                    {positioning.percentile.toFixed(0)}%
                  </div>
                  <div className="text-xs text-yellow-600/70 dark:text-yellow-400/70 mt-1">
                    Top {100 - positioning.percentile.toFixed(0)}% performer
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Benchmark Comparison */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-emerald-500" />
              Benchmark Comparison
            </CardTitle>
            <CardDescription>
              Detailed comparison against {selectedIndustry} industry benchmarks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {METRIC_CONFIG.map((metric) => {
                if (!yourPost.analysis) return null;
                const Icon = metric.icon;
                const yourScore = getMetricScore(yourPost.analysis, metric.key);
                let benchmarkScore = 0;

                switch (metric.key) {
                  case 'virality':
                    benchmarkScore = benchmark.averageVirality;
                    break;
                  case 'hook':
                    benchmarkScore = benchmark.averageHook;
                    break;
                  case 'structure':
                    benchmarkScore = benchmark.averageStructure;
                    break;
                  case 'cta':
                    benchmarkScore = benchmark.averageCTA;
                    break;
                  case 'hashtags':
                    benchmarkScore = benchmark.averageHashtags;
                    break;
                  case 'engagement':
                    benchmarkScore = benchmark.averageEngagement;
                    break;
                  default:
                    benchmarkScore = 70; // Default benchmark
                }

                const difference = yourScore - benchmarkScore;
                const isAboveBenchmark = difference >= 0;
                const competitorScores = analyzedCompetitors.map(c => getMetricScore(c.analysis!, metric.key));
                const avgCompetitorScore = competitorScores.length > 0
                  ? competitorScores.reduce((a, b) => a + b, 0) / competitorScores.length
                  : 0;

                return (
                  <motion.div
                    key={metric.key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Icon className={cn("h-5 w-5", getColorClasses(metric.color).icon)} />
                        <h4 className="font-semibold text-lg">{metric.label}</h4>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">Your Score</div>
                          <div className="text-xl font-bold">{yourScore}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">Benchmark</div>
                          <div className="text-lg font-semibold">{benchmarkScore}</div>
                        </div>
                        {avgCompetitorScore > 0 && (
                          <div className="text-right">
                            <div className="text-sm text-muted-foreground">Competitor Avg</div>
                            <div className="text-lg font-semibold">{avgCompetitorScore.toFixed(1)}</div>
                          </div>
                        )}
                        <Badge
                          className={cn(
                            isAboveBenchmark
                              ? 'bg-green-500 text-white'
                              : 'bg-red-500 text-white'
                          )}
                        >
                          {isAboveBenchmark ? '+' : ''}{difference.toFixed(1)}
                        </Badge>
                      </div>
                    </div>

                    {/* Score Bars */}
                    <div className="space-y-2">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium">Your Post</span>
                          <span>{yourScore}</span>
                        </div>
                        <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${yourScore}%` }}
                            transition={{ duration: 0.8 }}
                            className={cn(
                              "h-full rounded-full",
                              isAboveBenchmark
                                ? "bg-gradient-to-r from-green-400 to-green-600"
                                : "bg-gradient-to-r from-red-400 to-red-600"
                            )}
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Industry Benchmark</span>
                          <span>{benchmarkScore}</span>
                        </div>
                        <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-gray-400 to-gray-600"
                            style={{ width: `${benchmarkScore}%` }}
                          />
                        </div>
                      </div>
                      {avgCompetitorScore > 0 && (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Competitor Average</span>
                            <span>{avgCompetitorScore.toFixed(1)}</span>
                          </div>
                          <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-600"
                              style={{ width: `${avgCompetitorScore}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Competitive Insights */}
        {competitiveInsights.length > 0 && (
          <Card className="border-2 border-blue-500/50">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-blue-500" />
                Competitive Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {competitiveInsights.map((insight, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg"
                  >
                    <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-blue-900 dark:text-blue-100">{insight}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Detailed Comparison Table */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <PieChart className="h-6 w-6 text-emerald-500" />
              Detailed Metric Comparison
            </CardTitle>
            <CardDescription>
              Side-by-side comparison of all metrics across your post and competitors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-semibold">Metric</th>
                    <th className="text-center p-3 font-semibold">Your Post</th>
                    {analyzedCompetitors.map((c, idx) => (
                      <th key={c.id} className="text-center p-3 font-semibold">
                        {c.name}
                      </th>
                    ))}
                    <th className="text-center p-3 font-semibold">Industry Avg</th>
                    <th className="text-center p-3 font-semibold">Top Performers</th>
                  </tr>
                </thead>
                <tbody>
                  {METRIC_CONFIG.map((metric, metricIdx) => {
                    if (!yourPost.analysis) return null;
                    const Icon = metric.icon;
                    const yourScore = getMetricScore(yourPost.analysis, metric.key);
                    let benchmarkScore = 0;
                    let topPerformerScore = 0;

                    switch (metric.key) {
                      case 'virality':
                        benchmarkScore = benchmark.averageVirality;
                        topPerformerScore = benchmark.topPerformers.virality;
                        break;
                      case 'hook':
                        benchmarkScore = benchmark.averageHook;
                        topPerformerScore = 90;
                        break;
                      case 'engagement':
                        benchmarkScore = benchmark.averageEngagement;
                        topPerformerScore = benchmark.topPerformers.engagement;
                        break;
                      default:
                        benchmarkScore = 70;
                        topPerformerScore = 85;
                    }

                    return (
                      <tr key={metric.key} className={cn("border-b", metricIdx % 2 === 0 && "bg-muted/30")}>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <Icon className={cn("h-4 w-4", getColorClasses(metric.color).icon)} />
                            <span className="font-medium">{metric.label}</span>
                          </div>
                        </td>
                        <td className="text-center p-3">
                          <div className="flex items-center justify-center gap-2">
                            <span className="font-bold text-lg">{yourScore}</span>
                            {yourScore >= benchmarkScore ? (
                              <TrendingUp className="h-4 w-4 text-green-500" />
                            ) : (
                              <TrendingDown className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                        </td>
                        {analyzedCompetitors.map((c) => {
                          const score = getMetricScore(c.analysis!, metric.key);
                          return (
                            <td key={c.id} className="text-center p-3">
                              <span className="font-semibold">{score}</span>
                            </td>
                          );
                        })}
                        <td className="text-center p-3">
                          <span className="text-muted-foreground">{benchmarkScore}</span>
                        </td>
                        <td className="text-center p-3">
                          <span className="text-muted-foreground font-semibold">{topPerformerScore}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  {/* Empty State */ }
  {
    !allAnalyzed && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-16"
      >
        <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Ready to analyze competitors?</h3>
        <p className="text-muted-foreground">
          Enter your post and at least one competitor post, then click "Analyze All" to get started.
        </p>
      </motion.div>
    )
  }
      </div >
    </div >
  );
}
