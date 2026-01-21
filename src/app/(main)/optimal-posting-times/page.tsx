'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Loader2,
  Clock,
  Calendar,
  TrendingUp,
  BarChart3,
  Target,
  Zap,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Lightbulb,
  Activity,
  Users,
  Clock3,
  CalendarDays,
  Sparkles,
  Info,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface OptimalTime {
  day: string;
  hour: number;
  score: number;
  engagementMultiplier: number;
  reason: string;
}

interface PersonalizedRecommendation {
  bestTime: OptimalTime;
  alternativeTimes: OptimalTime[];
  weeklyPattern: {
    day: string;
    avgEngagement: number;
    bestHours: number[];
  }[];
  insights: string[];
  suggestions: string[];
}

const LINKEDIN_ACTIVE_HOURS = [
  { hour: 8, label: '8 AM', engagement: 85, description: 'Morning commute peak' },
  { hour: 9, label: '9 AM', engagement: 92, description: 'Start of workday' },
  { hour: 10, label: '10 AM', engagement: 78, description: 'Mid-morning break' },
  { hour: 12, label: '12 PM', engagement: 95, description: 'Lunch break peak' },
  { hour: 13, label: '1 PM', engagement: 88, description: 'Post-lunch engagement' },
  { hour: 17, label: '5 PM', engagement: 90, description: 'End of workday' },
  { hour: 18, label: '6 PM', engagement: 82, description: 'Evening commute' },
  { hour: 20, label: '8 PM', engagement: 75, description: 'Evening browsing' },
];

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function OptimalPostingTimesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendations, setRecommendations] = useState<PersonalizedRecommendation | null>(null);
  const [selectedDay, setSelectedDay] = useState<string>('Monday');

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

  const generatePersonalizedRecommendations = (): PersonalizedRecommendation => {
    // Simulate personalized analysis based on user's historical data
    const bestTime: OptimalTime = {
      day: 'Tuesday',
      hour: 12,
      score: 95,
      engagementMultiplier: 2.3,
      reason: 'Your posts perform best during lunch hours on Tuesdays, with 2.3x higher engagement than average.',
    };

    const alternativeTimes: OptimalTime[] = [
      {
        day: 'Wednesday',
        hour: 9,
        score: 88,
        engagementMultiplier: 2.0,
        reason: 'Strong performance during morning hours mid-week.',
      },
      {
        day: 'Thursday',
        hour: 17,
        score: 85,
        engagementMultiplier: 1.9,
        reason: 'Good engagement at end of workday.',
      },
      {
        day: 'Monday',
        hour: 8,
        score: 82,
        engagementMultiplier: 1.8,
        reason: 'Solid start-of-week engagement.',
      },
    ];

    const weeklyPattern = DAYS_OF_WEEK.map((day, index) => ({
      day,
      avgEngagement: 60 + Math.random() * 30,
      bestHours: index === 1 ? [9, 12, 17] : index === 2 ? [9, 13] : index === 3 ? [12, 17] : [8, 12],
    }));

    const insights = [
      'Your audience is most active on Tuesdays and Wednesdays between 9 AM and 1 PM.',
      'Posts published at 12 PM on weekdays receive 2.3x more engagement than average.',
      'Avoid posting on weekends - your engagement drops by 40% compared to weekdays.',
      'Your best performing posts were published between 9 AM - 1 PM on weekdays.',
    ];

    const suggestions = [
      'Schedule your most important posts for Tuesday at 12 PM for maximum visibility.',
      'Consider posting 2-3 times per week during peak hours (9 AM - 1 PM) for optimal reach.',
      'Test posting at 5 PM on Thursdays - your engagement shows potential for growth.',
      'Avoid posting after 8 PM or before 7 AM - your audience engagement is minimal.',
    ];

    return {
      bestTime,
      alternativeTimes,
      weeklyPattern,
      insights,
      suggestions,
    };
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      // Simulate analysis delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      const result = generatePersonalizedRecommendations();
      setRecommendations(result);
      toast({
        title: 'Analysis completed',
        description: 'Your personalized posting time recommendations are ready!',
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: 'Analysis error',
        description: 'An error occurred while analyzing your posting times.',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600 dark:text-emerald-400';
    if (score >= 75) return 'text-blue-600 dark:text-blue-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-orange-600 dark:text-orange-400';
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 90) return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300';
    if (score >= 75) return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
    if (score >= 60) return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
    return 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300';
  };

  return (
    <div className="relative min-h-screen bg-bg-canvas pt-24 pb-16 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/3 w-full max-w-7xl h-96 bg-indigo-500/5 rounded-[4rem] blur-[120px] -z-10" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-600 mb-6">
            <Clock className="h-3.5 w-3.5" />
            <span>Smart Scheduling</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-fg-default mb-4">
            Optimal Posting Times
          </h1>
          <p className="text-lg text-fg-muted max-w-2xl mx-auto">
            Maximize your reach by posting when your audience is most active.
          </p>
        </motion.div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="general">General Insights</TabsTrigger>
            <TabsTrigger value="personalized">Personalized</TabsTrigger>
          </TabsList>

          {/* General Insights Tab */}
          <TabsContent value="general" className="space-y-6">
            {/* LinkedIn Active Hours */}
            <Card className="border border-border-default/40 bg-bg-surface/50 backdrop-blur-sm shadow-sm rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Activity className="h-5 w-5 text-indigo-500" />
                  LinkedIn Active Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {LINKEDIN_ACTIVE_HOURS.map((hour, index) => (
                    <motion.div
                      key={hour.hour}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 border border-border-default/50 rounded-xl bg-bg-canvas/50 hover:border-indigo-500/30 transition-all"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Clock3 className="h-4 w-4 text-indigo-500" />
                          <span className="font-bold text-fg-default">{hour.label}</span>
                        </div>
                        <Badge variant="outline" className={hour.engagement >= 90 ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-blue-500/10 text-blue-600 border-blue-500/20'}>
                          {hour.engagement}%
                        </Badge>
                      </div>
                      <p className="text-sm text-fg-muted mb-3">{hour.description}</p>
                      <div>
                        <div className="h-1.5 bg-muted/50 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${hour.engagement}%` }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            className={`h-full rounded-full ${hour.engagement >= 90 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Weekly Pattern */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-indigo-500" />
                  Weekly Engagement Pattern
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {DAYS_OF_WEEK.map((day, index) => {
                    const isWeekend = day === 'Saturday' || day === 'Sunday';
                    const avgEngagement = isWeekend ? 45 + Math.random() * 15 : 70 + Math.random() * 20;
                    return (
                      <div key={day} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{day}</span>
                          <Badge variant="outline">{avgEngagement.toFixed(0)}% avg engagement</Badge>
                        </div>
                        <div className="h-3 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${avgEngagement}%` }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            className={`h-full rounded-full ${isWeekend ? 'bg-orange-500' : 'bg-indigo-500'}`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Best Practices */}
            <Card className="border-2 border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
                  <Lightbulb className="h-5 w-5" />
                  Best Practices
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
                    <span className="text-fg-default">Post during business hours (8 AM - 6 PM) for maximum visibility.</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
                    <span className="text-fg-default">Tuesday, Wednesday, and Thursday are the most active days on LinkedIn.</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
                    <span className="text-fg-default">Lunch hours (12 PM - 1 PM) show peak engagement rates.</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
                    <span className="text-fg-default">Avoid posting on weekends unless targeting a specific audience.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Personalized Recommendations Tab */}
          <TabsContent value="personalized" className="space-y-6">
            {!recommendations && !isAnalyzing && (
              <Card className="border-2">
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <Target className="h-16 w-16 text-indigo-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Get Personalized Recommendations</h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      Analyze your historical posting data to receive personalized optimal posting time recommendations.
                    </p>
                    <Button
                      onClick={handleAnalyze}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white px-8"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Analyze My Posting Times
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {isAnalyzing && (
              <Card className="border-2">
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <Loader2 className="h-12 w-12 animate-spin text-indigo-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Analyzing Your Data</h3>
                    <p className="text-muted-foreground">
                      We're analyzing your historical posting patterns to provide personalized recommendations...
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {recommendations && (
              <div className="space-y-6">
                {/* Best Time */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="border-2 border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                        <Zap className="h-5 w-5" />
                        Your Optimal Posting Time
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="p-4 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl">
                          <Calendar className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div className="flex-1">
                          <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                            {recommendations.bestTime.day} at {recommendations.bestTime.hour}:00
                          </div>
                          <p className="text-sm text-muted-foreground">{recommendations.bestTime.reason}</p>
                        </div>
                        <div className="text-right">
                          <Badge className={getScoreBadgeColor(recommendations.bestTime.score)}>
                            Score: {recommendations.bestTime.score}
                          </Badge>
                          <div className="mt-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                            {recommendations.bestTime.engagementMultiplier}x engagement
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Alternative Times */}
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-indigo-500" />
                      Alternative Optimal Times
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {recommendations.alternativeTimes.map((time, index) => (
                        <motion.div
                          key={`${time.day}-${time.hour}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-4 border rounded-lg hover:shadow-md transition-all"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <div className="font-semibold text-lg">
                                {time.day} at {time.hour}:00
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">{time.reason}</p>
                            </div>
                            <Badge className={getScoreBadgeColor(time.score)}>
                              {time.score}
                            </Badge>
                          </div>
                          <div className="mt-3 flex items-center gap-2 text-sm">
                            <TrendingUp className="h-4 w-4 text-emerald-500" />
                            <span className="text-muted-foreground">
                              {time.engagementMultiplier}x engagement multiplier
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Weekly Pattern */}
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-indigo-500" />
                      Your Weekly Engagement Pattern
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recommendations.weeklyPattern.map((day, index) => (
                        <div key={day.day} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{day.day}</span>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{day.avgEngagement.toFixed(0)}% avg</Badge>
                              <span className="text-xs text-muted-foreground">
                                Best: {day.bestHours.map(h => `${h}:00`).join(', ')}
                              </span>
                            </div>
                          </div>
                          <div className="h-3 bg-muted rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${day.avgEngagement}%` }}
                              transition={{ duration: 0.8, delay: index * 0.1 }}
                              className="h-full bg-indigo-500 rounded-full"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Insights */}
                <Card className="border-2 border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                      <Info className="h-5 w-5" />
                      Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {recommendations.insights.map((insight, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                          <span className="text-fg-default">{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Suggestions */}
                <Card className="border-2 border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
                      <Target className="h-5 w-5" />
                      Timing Suggestions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {recommendations.suggestions.map((suggestion, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <ArrowRight className="h-4 w-4 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                          <span className="text-fg-default">{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Re-analyze Button */}
                <div className="text-center">
                  <Button
                    onClick={handleAnalyze}
                    variant="outline"
                    className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-400 dark:hover:bg-indigo-950"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Refresh Analysis
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
