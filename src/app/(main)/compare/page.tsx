'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Loader2,
  Plus,
  Trash2,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Minus,
  Award,
  Target,
  Hash,
  MessageSquare,
  Zap,
  BookOpen,
  Heart,
  Sparkles,
  Copy,
  X,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Gauge,
  Activity,
  FileText,
  Lightbulb,
  Trophy,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { runAnalysis } from '@/lib/analysis/engine';
import type { AnalysisData } from '@/lib/analysis/types';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';

interface PostAnalysis {
  id: string;
  text: string;
  analysis: AnalysisData | null;
  isLoading: boolean;
  name: string;
}

const getColorClasses = (color: string) => {
  const colors: Record<string, { icon: string; gradient: string }> = {
    emerald: { icon: 'text-emerald-500', gradient: 'from-emerald-400 to-emerald-600' },
    blue: { icon: 'text-blue-500', gradient: 'from-blue-400 to-blue-600' },
    purple: { icon: 'text-purple-500', gradient: 'from-purple-400 to-purple-600' },
    pink: { icon: 'text-pink-500', gradient: 'from-pink-400 to-pink-600' },
    red: { icon: 'text-red-500', gradient: 'from-red-400 to-red-600' },
    orange: { icon: 'text-orange-500', gradient: 'from-orange-400 to-orange-600' },
    yellow: { icon: 'text-yellow-500', gradient: 'from-yellow-400 to-yellow-600' },
    cyan: { icon: 'text-cyan-500', gradient: 'from-cyan-400 to-cyan-600' },
  };
  return colors[color] || colors.emerald;
};

const METRIC_CONFIG = [
  { key: 'hook', label: 'Hook', icon: Zap, color: 'emerald', weight: 0.2 },
  { key: 'structure', label: 'Structure', icon: FileText, color: 'blue', weight: 0.15 },
  { key: 'cta', label: 'CTA', icon: Target, color: 'purple', weight: 0.15 },
  { key: 'hashtags', label: 'Hashtags', icon: Hash, color: 'pink', weight: 0.1 },
  { key: 'engagement', label: 'Engagement', icon: Heart, color: 'red', weight: 0.15 },
  { key: 'storytelling', label: 'Storytelling', icon: BookOpen, color: 'orange', weight: 0.1 },
  { key: 'sentiment', label: 'Sentiment', icon: Sparkles, color: 'yellow', weight: 0.05 },
  { key: 'readability', label: 'Readability', icon: Activity, color: 'cyan', weight: 0.05 },
] as const;

export default function ComparePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [posts, setPosts] = useState<PostAnalysis[]>([
    { id: '1', text: '', analysis: null, isLoading: false, name: 'Post 1' },
    { id: '2', text: '', analysis: null, isLoading: false, name: 'Post 2' },
  ]);
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

  const addPost = () => {
    const newId = String(posts.length + 1);
    setPosts([...posts, { id: newId, text: '', analysis: null, isLoading: false, name: `Post ${newId}` }]);
  };

  const removePost = (id: string) => {
    if (posts.length <= 2) {
      toast({
        title: 'Minimum 2 posts required',
        description: 'At least 2 posts are required for comparison.',
        variant: 'destructive',
      });
      return;
    }
    setPosts(posts.filter(p => p.id !== id));
  };

  const updatePostText = (id: string, text: string) => {
    setPosts(posts.map(p => p.id === id ? { ...p, text, analysis: null } : p));
  };

  const updatePostName = (id: string, name: string) => {
    setPosts(posts.map(p => p.id === id ? { ...p, name } : p));
  };

  const analyzePost = async (id: string) => {
    const post = posts.find(p => p.id === id);
    if (!post || !post.text.trim()) {
      toast({
        title: 'Post is empty',
        description: 'Please enter a post to compare.',
        variant: 'destructive',
      });
      return;
    }

    setPosts(posts.map(p => p.id === id ? { ...p, isLoading: true } : p));

    try {
      const analysis = runAnalysis(post.text);
      setPosts(posts.map(p => p.id === id ? { ...p, analysis, isLoading: false } : p));
      toast({
        title: 'Analysis completed',
        description: `${post.name} successfully analyzed.`,
      });
    } catch (error) {
      console.error('Analysis error:', error);
      setPosts(posts.map(p => p.id === id ? { ...p, isLoading: false } : p));
      toast({
        title: 'Analysis error',
        description: 'An error occurred while analyzing the post.',
        variant: 'destructive',
      });
    }
  };

  const analyzeAll = async () => {
    const postsToAnalyze = posts.filter(p => p.text.trim() && !p.analysis);
    if (postsToAnalyze.length === 0) {
      toast({
        title: 'All posts analyzed',
        description: 'All posts are already analyzed.',
      });
      return;
    }

    for (const post of postsToAnalyze) {
      await analyzePost(post.id);
    }
  };

  const getMetricScore = (analysis: AnalysisData, metricKey: string): number => {
    switch (metricKey) {
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
      case 'sentiment':
        return analysis.sentiment.sentimentScore;
      case 'readability':
        return analysis.readability.fleschKincaidScore;
      default:
        return 0;
    }
  };

  const getWinner = (metricKey: string): string | null => {
    const analyzedPosts = posts.filter(p => p.analysis);
    if (analyzedPosts.length < 2) return null;

    const scores = analyzedPosts.map(p => ({
      id: p.id,
      score: getMetricScore(p.analysis!, metricKey),
    }));

    const maxScore = Math.max(...scores.map(s => s.score));
    const winners = scores.filter(s => s.score === maxScore);

    if (winners.length === 1) return winners[0].id;
    return null; // Tie
  };

  const getOverallWinner = (): string | null => {
    const analyzedPosts = posts.filter(p => p.analysis);
    if (analyzedPosts.length < 2) return null;

    const scores = analyzedPosts.map(p => ({
      id: p.id,
      score: p.analysis!.viralityScore.score,
    }));

    const maxScore = Math.max(...scores.map(s => s.score));
    const winners = scores.filter(s => s.score === maxScore);

    if (winners.length === 1) return winners[0].id;
    return null;
  };

  const analyzedPosts = posts.filter(p => p.analysis);
  const allAnalyzed = posts.filter(p => p.text.trim()).every(p => p.analysis);
  const overallWinner = getOverallWinner();

  return (
    <div className="relative min-h-screen bg-bg-canvas pt-24 pb-16 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 right-1/2 translate-x-1/2 w-full max-w-7xl h-96 bg-teal-500/5 rounded-[4rem] blur-[120px] -z-10" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-teal-500/10 px-4 py-1.5 text-xs font-semibold text-teal-600 mb-6">
            <BarChart3 className="h-3.5 w-3.5" />
            <span>Strategy Comparison</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-fg-default mb-4">
            Compare Performance
          </h1>
          <p className="text-lg text-fg-muted max-w-2xl mx-auto">
            Analyze multiple posts side-by-side to identify the winning strategy.
          </p>
        </motion.div>

        {/* Action Bar */}
        <div className="flex justify-end mb-8 gap-3">
          <Button
            onClick={analyzeAll}
            disabled={!allAnalyzed && analyzedPosts.length === 0}
            className="bg-emerald-600 hover:bg-emerald-500 text-white"
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
          <Button
            onClick={addPost}
            variant="outline"
            className="border-emerald-200 hover:bg-emerald-50 dark:border-emerald-800 dark:hover:bg-emerald-950"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Post
          </Button>
        </div>

        {/* Post Inputs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          <AnimatePresence>
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="h-full flex flex-col border-2 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="text"
                          value={post.name}
                          onChange={(e) => updatePostName(post.id, e.target.value)}
                          className="text-lg font-semibold bg-transparent border-none outline-none focus:ring-2 focus:ring-emerald-500 rounded px-2 -ml-2 flex-1"
                          placeholder="Post name"
                        />
                        <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                          #{index + 1}
                        </Badge>
                      </div>
                      {posts.length > 2 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removePost(post.id)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col gap-3">
                    <Textarea
                      value={post.text}
                      onChange={(e) => updatePostText(post.id, e.target.value)}
                      placeholder="Paste post text here to compare..."
                      className="min-h-[200px] resize-none flex-1"
                    />
                    <Button
                      onClick={() => analyzePost(post.id)}
                      disabled={!post.text.trim() || post.isLoading}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white"
                    >
                      {post.isLoading ? (
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
                    {post.analysis && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2"
                      >
                        <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg">
                          <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                            Virality Score
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                              {post.analysis.viralityScore.score}
                            </span>
                            <Trophy className={`h-5 w-5 ${overallWinner === post.id
                                ? 'text-yellow-500'
                                : 'text-gray-300 dark:text-gray-600'
                              }`} />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Comparison Results */}
        {analyzedPosts.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Overall Winner Banner */}
            {overallWinner && (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative overflow-hidden rounded-xl bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 p-6 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                      <Trophy className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">
                        Winner: {posts.find(p => p.id === overallWinner)?.name}
                      </h3>
                      <p className="text-yellow-100">
                        Post with highest virality score
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-white">
                      {posts.find(p => p.id === overallWinner)?.analysis?.viralityScore.score}
                    </div>
                    <div className="text-yellow-100 text-sm">Total Score</div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Summary Statistics */}
            {analyzedPosts.length >= 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Gauge className="h-5 w-5 text-emerald-500" />
                      Summary Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {analyzedPosts.map((post) => {
                        const analysis = post.analysis!;
                        const avgScore = Math.round(
                          (analysis.hook.score +
                            analysis.structure.score +
                            analysis.cta.score +
                            analysis.hashtags.score +
                            analysis.engagement.engagementScore +
                            analysis.storytelling.storytellingScore +
                            analysis.sentiment.sentimentScore +
                            analysis.readability.fleschKincaidScore) / 8
                        );

                        return (
                          <div
                            key={post.id}
                            className={`p-4 rounded-lg border-2 ${overallWinner === post.id
                                ? 'border-yellow-400 bg-yellow-50/50 dark:bg-yellow-950/20'
                                : 'border-border bg-muted/30'
                              }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold">{post.name}</h4>
                              {overallWinner === post.id && (
                                <Trophy className="h-4 w-4 text-yellow-500" />
                              )}
                            </div>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Virality:</span>
                                <span className="font-bold text-emerald-600">
                                  {analysis.viralityScore.score}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Average:</span>
                                <span className="font-semibold">{avgScore}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Words:</span>
                                <span className="font-semibold">
                                  {post.text.split(/\s+/).filter(w => w.length > 0).length}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Characters:</span>
                                <span className="font-semibold">{post.text.length}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Metrics Comparison */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <BarChart3 className="h-6 w-6 text-emerald-500" />
                  Metric Comparison
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {METRIC_CONFIG.map((metric) => {
                  const winnerId = getWinner(metric.key);
                  const Icon = metric.icon;

                  return (
                    <motion.div
                      key={metric.key}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Icon className={`h-5 w-5 ${getColorClasses(metric.color).icon}`} />
                          <h4 className="font-semibold text-lg">{metric.label}</h4>
                          <Badge className="bg-muted text-muted-foreground text-xs">
                            Weight: {Math.round(metric.weight * 100)}%
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newExpanded = new Set(expandedMetrics);
                            if (newExpanded.has(metric.key)) {
                              newExpanded.delete(metric.key);
                            } else {
                              newExpanded.add(metric.key);
                            }
                            setExpandedMetrics(newExpanded);
                          }}
                        >
                          {expandedMetrics.has(metric.key) ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </div>

                      {/* Score Bars */}
                      <div className="space-y-3">
                        {analyzedPosts.map((post) => {
                          const score = getMetricScore(post.analysis!, metric.key);
                          const isWinner = winnerId === post.id;
                          const isTie = !winnerId && analyzedPosts.some(
                            p => getMetricScore(p.analysis!, metric.key) === score
                          );

                          return (
                            <div key={post.id} className="space-y-1">
                              <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{post.name}</span>
                                  {isWinner && (
                                    <Badge className="bg-yellow-500 text-white text-xs px-1.5 py-0">
                                      <Trophy className="h-3 w-3 mr-1" />
                                      Winner
                                    </Badge>
                                  )}
                                  {isTie && !isWinner && (
                                    <Badge className="bg-gray-500 text-white text-xs px-1.5 py-0">
                                      Tie
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-lg">{score}</span>
                                  {isWinner ? (
                                    <TrendingUp className="h-4 w-4 text-green-500" />
                                  ) : analyzedPosts.some(
                                    p => p.id !== post.id && getMetricScore(p.analysis!, metric.key) > score
                                  ) ? (
                                    <TrendingDown className="h-4 w-4 text-red-500" />
                                  ) : null}
                                </div>
                              </div>
                              <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${score}%` }}
                                  transition={{ duration: 0.8, delay: 0.1 }}
                                  className={`h-full rounded-full bg-gradient-to-r ${isWinner
                                      ? 'from-yellow-400 to-yellow-600'
                                      : getColorClasses(metric.color).gradient
                                    }`}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Detailed Breakdown */}
                      {expandedMetrics.has(metric.key) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 pt-4 border-t space-y-3"
                        >
                          {analyzedPosts.map((post) => {
                            const analysis = post.analysis!;
                            let details: string[] = [];

                            switch (metric.key) {
                              case 'hook':
                                details = [...analysis.hook.patterns, ...analysis.hook.suggestions];
                                break;
                              case 'structure':
                                details = [...analysis.structure.problems, ...analysis.structure.fixes];
                                break;
                              case 'cta':
                                details = analysis.cta.suggestions;
                                break;
                              case 'hashtags':
                                details = [...analysis.hashtags.issues, ...analysis.hashtags.recommendations];
                                break;
                              case 'engagement':
                                details = [...analysis.engagement.insights, ...analysis.engagement.suggestions];
                                break;
                              case 'storytelling':
                                details = [...analysis.storytelling.insights, ...analysis.storytelling.suggestions];
                                break;
                              case 'sentiment':
                                details = [...analysis.sentiment.insights, ...analysis.sentiment.suggestions];
                                break;
                              case 'readability':
                                details = [...analysis.readability.insights, ...analysis.readability.suggestions];
                                break;
                            }

                            return (
                              <div key={post.id} className="bg-muted/50 rounded-lg p-3">
                                <h5 className="font-semibold mb-2 text-sm">{post.name} Details:</h5>
                                <ul className="space-y-1 text-sm text-muted-foreground">
                                  {details.slice(0, 3).map((detail, idx) => (
                                    <li key={idx} className="flex items-start gap-2">
                                      <span className="text-emerald-500 mt-1">•</span>
                                      <span>{detail}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            );
                          })}
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Side-by-Side Comparison */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <FileText className="h-6 w-6 text-emerald-500" />
                  Side by Side Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {analyzedPosts.map((post) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-lg border-2 ${overallWinner === post.id
                          ? 'border-yellow-400 bg-yellow-50/50 dark:bg-yellow-950/20'
                          : 'border-border'
                        }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-lg">{post.name}</h3>
                        {overallWinner === post.id && (
                          <Badge className="bg-yellow-500 text-white">
                            <Trophy className="h-3 w-3 mr-1" />
                            Winner
                          </Badge>
                        )}
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <div className="font-semibold mb-1">Virality Score:</div>
                          <div className="text-2xl font-bold text-emerald-600">
                            {post.analysis!.viralityScore.score}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="p-2 bg-muted/30 rounded">
                            <div className="text-muted-foreground">Hook</div>
                            <div className="font-bold">{post.analysis!.hook.score}</div>
                          </div>
                          <div className="p-2 bg-muted/30 rounded">
                            <div className="text-muted-foreground">CTA</div>
                            <div className="font-bold">{post.analysis!.cta.score}</div>
                          </div>
                          <div className="p-2 bg-muted/30 rounded">
                            <div className="text-muted-foreground">Hashtags</div>
                            <div className="font-bold">{post.analysis!.hashtags.score}</div>
                          </div>
                          <div className="p-2 bg-muted/30 rounded">
                            <div className="text-muted-foreground">Engagement</div>
                            <div className="font-bold">{post.analysis!.engagement.engagementScore}</div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Empty State */}
        {analyzedPosts.length < 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Analyze at least 2 posts for comparison</h3>
            <p className="text-muted-foreground">
              Fill in and analyze the posts above, results will appear here.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
