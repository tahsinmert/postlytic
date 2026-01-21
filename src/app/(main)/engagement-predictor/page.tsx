'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Loader2,
  Sparkles,
  TrendingUp,
  Users,
  MessageSquare,
  Share2,
  Heart,
  Target,
  BarChart3,
  Zap,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Lightbulb,
  Gauge,
  Activity,
  Eye,
  ThumbsUp,
  MessageCircle,
  Share,
  Rocket,
  Info,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { predictEngagement } from '@/lib/analysis/predictor';
import type { EngagementPrediction } from '@/lib/analysis/predictor';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';

export default function EngagementPredictorPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [postText, setPostText] = useState('');
  const [prediction, setPrediction] = useState<EngagementPrediction | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

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

  const handleAnalyze = async () => {
    if (!postText.trim()) {
      toast({
        title: 'Post is empty',
        description: 'Please enter a post to analyze.',
        variant: 'destructive',
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      // Simulate analysis delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1500));
      const result = predictEngagement(postText);
      setPrediction(result);
      toast({
        title: 'Prediction completed',
        description: 'Engagement predictions are ready!',
      });
    } catch (error) {
      console.error('Prediction error:', error);
      toast({
        title: 'Prediction error',
        description: 'An error occurred while making the prediction.',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 75) return 'text-emerald-600 dark:text-emerald-400';
    if (confidence >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-orange-600 dark:text-orange-400';
  };

  const getConfidenceBadgeColor = (confidence: number) => {
    if (confidence >= 75) return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300';
    if (confidence >= 60) return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
    return 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300';
  };

  return (
    <div className="relative min-h-screen bg-bg-canvas pt-24 pb-16 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-blue-500/5 rounded-[4rem] blur-[120px] -z-10" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-600 mb-6">
            <Rocket className="h-3.5 w-3.5" />
            <span>AI Forecasting</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-fg-default mb-4">
            Engagement Predictor
          </h1>
          <p className="text-lg text-fg-muted max-w-2xl mx-auto">
            Get accurate forecasts on reach and engagement before you publish.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border border-border-default/40 bg-bg-surface/50 backdrop-blur-sm rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <FileText className="h-5 w-5 text-blue-500" />
                  Post Text
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={postText}
                  onChange={(e) => {
                    setPostText(e.target.value);
                    setPrediction(null);
                  }}
                  placeholder="Paste your LinkedIn post text here to make predictions..."
                  className="min-h-[300px] resize-none text-base border-border-default/50 bg-bg-canvas/40 focus:bg-bg-canvas/80 rounded-xl"
                />
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    {postText.length} characters • {postText.split(/\s+/).filter(w => w.length > 0).length} words
                  </div>
                  <Button
                    onClick={handleAnalyze}
                    disabled={!postText.trim() || isAnalyzing}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-8 rounded-xl h-11 shadow-lg shadow-blue-500/20"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Predicting...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Make Prediction
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Insights & Recommendations */}
            {prediction && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Insights */}
                {prediction.insights.length > 0 && (
                  <Card className="border-2 border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                        <Lightbulb className="h-5 w-5" />
                        Insights
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {prediction.insights.map((insight, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                            <span className="text-fg-default">{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Recommendations */}
                {prediction.recommendations.length > 0 && (
                  <Card className="border-2 border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
                        <Target className="h-5 w-5" />
                        Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {prediction.recommendations.map((rec, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <ArrowRight className="h-4 w-4 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                            <span className="text-fg-default">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            )}
          </div>

          {/* Predictions Sidebar */}
          <div className="space-y-6">
            {/* Reach Prediction */}
            {prediction && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card className="border-2 border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                      <Eye className="h-5 w-5" />
                      Reach Prediction
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                          {formatNumber(prediction.reach.estimatedReach)}
                        </span>
                        <span className="text-sm text-muted-foreground">people</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Estimated Reach</p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-emerald-200 dark:border-emerald-800">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Organic Reach:</span>
                        <span className="font-semibold">{formatNumber(prediction.reach.organicReach)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Viral Potential:</span>
                        <Badge className={prediction.reach.viralPotential >= 70 ? 'bg-emerald-500' : prediction.reach.viralPotential >= 50 ? 'bg-yellow-500' : 'bg-orange-500'}>
                          {prediction.reach.viralPotential}%
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Multiplier:</span>
                        <span className="font-semibold">{prediction.reach.reachMultiplier}x</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Expected Engagement */}
            {prediction && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-emerald-500" />
                      Expected Engagement
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                        <div className="flex items-center gap-2 mb-1">
                          <Heart className="h-4 w-4 text-red-500" />
                          <span className="text-xs font-medium text-muted-foreground">Likes</span>
                        </div>
                        <div className="text-xl font-bold text-red-600 dark:text-red-400">
                          {formatNumber(prediction.expectedEngagement.likes)}
                        </div>
                      </div>

                      <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="flex items-center gap-2 mb-1">
                          <MessageSquare className="h-4 w-4 text-blue-500" />
                          <span className="text-xs font-medium text-muted-foreground">Comments</span>
                        </div>
                        <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                          {formatNumber(prediction.expectedEngagement.comments)}
                        </div>
                      </div>

                      <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="flex items-center gap-2 mb-1">
                          <Share2 className="h-4 w-4 text-green-500" />
                          <span className="text-xs font-medium text-muted-foreground">Shares</span>
                        </div>
                        <div className="text-xl font-bold text-green-600 dark:text-green-400">
                          {formatNumber(prediction.expectedEngagement.shares)}
                        </div>
                      </div>

                      <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                        <div className="flex items-center gap-2 mb-1">
                          <TrendingUp className="h-4 w-4 text-purple-500" />
                          <span className="text-xs font-medium text-muted-foreground">Total</span>
                        </div>
                        <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
                          {formatNumber(prediction.expectedEngagement.totalEngagement)}
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Engagement Rate:</span>
                        <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                          {prediction.performanceMetrics.engagementRate}%
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Performance Metrics */}
            {prediction && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Gauge className="h-5 w-5 text-emerald-500" />
                      Performance Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Comment Rate</span>
                        <span className="text-sm font-semibold">{prediction.performanceMetrics.commentRate}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(prediction.performanceMetrics.commentRate * 10, 100)}%` }}
                          transition={{ duration: 0.8 }}
                          className="h-full bg-blue-500 rounded-full"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Share Rate</span>
                        <span className="text-sm font-semibold">{prediction.performanceMetrics.shareRate}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(prediction.performanceMetrics.shareRate * 50, 100)}%` }}
                          transition={{ duration: 0.8, delay: 0.1 }}
                          className="h-full bg-green-500 rounded-full"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Viral Score</span>
                        <Badge className={prediction.performanceMetrics.viralScore >= 70 ? 'bg-emerald-500' : prediction.performanceMetrics.viralScore >= 50 ? 'bg-yellow-500' : 'bg-orange-500'}>
                          {prediction.performanceMetrics.viralScore}
                        </Badge>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${prediction.performanceMetrics.viralScore}%` }}
                          transition={{ duration: 0.8, delay: 0.2 }}
                          className={`h-full rounded-full ${prediction.performanceMetrics.viralScore >= 70 ? 'bg-emerald-500' :
                            prediction.performanceMetrics.viralScore >= 50 ? 'bg-yellow-500' : 'bg-orange-500'
                            }`}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>

        {/* Detailed Predictions */}
        {prediction && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6"
          >
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-6 w-6 text-emerald-500" />
                  Detailed Predictions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Likes Prediction */}
                  <div className="p-4 border rounded-lg bg-red-50/50 dark:bg-red-950/10">
                    <div className="flex items-center gap-2 mb-3">
                      <ThumbsUp className="h-5 w-5 text-red-500" />
                      <h4 className="font-semibold">Likes Prediction</h4>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="text-2xl font-bold text-red-600 dark:text-red-400 mb-1">
                          {formatNumber(prediction.detailedPredictions.likesPrediction.expected)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatNumber(prediction.detailedPredictions.likesPrediction.min)} - {formatNumber(prediction.detailedPredictions.likesPrediction.max)}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Confidence:</span>
                        <Badge className={getConfidenceBadgeColor(prediction.detailedPredictions.likesPrediction.confidence)}>
                          {prediction.detailedPredictions.likesPrediction.confidence}%
                        </Badge>
                      </div>
                      <div className="pt-2 border-t">
                        <p className="text-xs font-medium mb-1">Factors:</p>
                        <ul className="space-y-1">
                          {prediction.detailedPredictions.likesPrediction.factors.map((factor, idx) => (
                            <li key={idx} className="text-xs text-muted-foreground flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                              {factor}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Comments Prediction */}
                  <div className="p-4 border rounded-lg bg-blue-50/50 dark:bg-blue-950/10">
                    <div className="flex items-center gap-2 mb-3">
                      <MessageCircle className="h-5 w-5 text-blue-500" />
                      <h4 className="font-semibold">Comments Prediction</h4>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                          {formatNumber(prediction.detailedPredictions.commentsPrediction.expected)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatNumber(prediction.detailedPredictions.commentsPrediction.min)} - {formatNumber(prediction.detailedPredictions.commentsPrediction.max)}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Confidence:</span>
                        <Badge className={getConfidenceBadgeColor(prediction.detailedPredictions.commentsPrediction.confidence)}>
                          {prediction.detailedPredictions.commentsPrediction.confidence}%
                        </Badge>
                      </div>
                      <div className="pt-2 border-t">
                        <p className="text-xs font-medium mb-1">Factors:</p>
                        <ul className="space-y-1">
                          {prediction.detailedPredictions.commentsPrediction.factors.map((factor, idx) => (
                            <li key={idx} className="text-xs text-muted-foreground flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                              {factor}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Shares Prediction */}
                  <div className="p-4 border rounded-lg bg-green-50/50 dark:bg-green-950/10">
                    <div className="flex items-center gap-2 mb-3">
                      <Share className="h-5 w-5 text-green-500" />
                      <h4 className="font-semibold">Shares Prediction</h4>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                          {formatNumber(prediction.detailedPredictions.sharesPrediction.expected)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatNumber(prediction.detailedPredictions.sharesPrediction.min)} - {formatNumber(prediction.detailedPredictions.sharesPrediction.max)}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Confidence:</span>
                        <Badge className={getConfidenceBadgeColor(prediction.detailedPredictions.sharesPrediction.confidence)}>
                          {prediction.detailedPredictions.sharesPrediction.confidence}%
                        </Badge>
                      </div>
                      <div className="pt-2 border-t">
                        <p className="text-xs font-medium mb-1">Factors:</p>
                        <ul className="space-y-1">
                          {prediction.detailedPredictions.sharesPrediction.factors.map((factor, idx) => (
                            <li key={idx} className="text-xs text-muted-foreground flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                              {factor}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Empty State */}
        {!prediction && !isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Rocket className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Make Engagement Prediction</h3>
            <p className="text-muted-foreground">
              Enter your post text and view expected engagement, reach, and performance predictions.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
