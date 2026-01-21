'use client';

import { useAuth } from '@/hooks/use-auth';
import {
  Loader2,
  User,
  Mail,
  Calendar,
  Building2,
  Edit2,
  Save,
  X,
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle2,
  FileText,
  Link as LinkIcon,
  Globe,
  Award,
  Target,
  Zap,
  Share2,
  Copy,
  ExternalLink,
  Crown
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import * as Avatar from '@/components/ui/avatar';
import { updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase/client';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [isSaving, setIsSaving] = useState(false);
  const [stats, setStats] = useState({
    totalAnalyses: 0,
    thisMonthAnalyses: 0,
    averageScore: 0,
    bestScore: 0,
    lastAnalysisDate: null as Date | null
  });
  const [recentAnalyses, setRecentAnalyses] = useState<any[]>([]);
  const [isPublic, setIsPublic] = useState(false);

  // Fetch user statistics
  useEffect(() => {
    if (!user) {
      setDisplayName('');
      return;
    }

    setDisplayName(user.displayName || '');

    const fetchStats = async () => {
      try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const analysesQuery = query(
          collection(db, 'analyses'),
          where('userId', '==', user.uid)
        );

        const analysesSnapshot = await getDocs(analysesQuery);
        const analyses: any[] = [];
        let totalScore = 0;
        let bestScore = 0;
        let thisMonthCount = 0;
        let lastAnalysis: Date | null = null;

        analysesSnapshot.forEach((doc) => {
          try {
            const data = doc.data();
            let createdAt: Date;

            if (data.createdAt) {
              try {
                createdAt = data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
              } catch {
                createdAt = new Date();
              }
            } else {
              createdAt = new Date();
            }

            if (createdAt >= startOfMonth) {
              thisMonthCount++;
            }

            if (!lastAnalysis || createdAt > lastAnalysis) {
              lastAnalysis = createdAt;
            }

            const score = data.viralityScore?.overall || 0;
            totalScore += score;
            if (score > bestScore) {
              bestScore = score;
            }

            analyses.push({
              id: doc.id,
              ...data,
              createdAt
            });
          } catch (err) {
            console.warn('Error processing document:', err);
          }
        });

        // Sort by date descending client-side
        analyses.sort((a, b) => {
          const dateA = a.createdAt?.getTime() || 0;
          const dateB = b.createdAt?.getTime() || 0;
          return dateB - dateA;
        });

        setStats({
          totalAnalyses: analyses.length,
          thisMonthAnalyses: thisMonthCount,
          averageScore: analyses.length > 0 ? Math.round(totalScore / analyses.length) : 0,
          bestScore: Math.round(bestScore),
          lastAnalysisDate: lastAnalysis
        });

        setRecentAnalyses(analyses.slice(0, 5));
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Set default values on error
        setStats({
          totalAnalyses: 0,
          thisMonthAnalyses: 0,
          averageScore: 0,
          bestScore: 0,
          lastAnalysisDate: null
        });
        setRecentAnalyses([]);
      }
    };

    fetchStats();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      await updateProfile(auth.currentUser!, {
        displayName: displayName.trim() || user.displayName || 'User'
      });
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive'
      });
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyUserId = () => {
    if (user) {
      navigator.clipboard.writeText(user.uid);
      toast({
        title: 'Copied',
        description: 'User ID copied to clipboard',
      });
    }
  };

  const handleCopyProfileLink = () => {
    if (typeof window === 'undefined' || !user) return;
    const profileLink = `${window.location.origin}/profile/${user.uid}`;
    navigator.clipboard.writeText(profileLink);
    toast({
      title: 'Copied',
      description: 'Profile link copied to clipboard',
    });
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 dark:text-emerald-400';
    if (score >= 60) return 'text-emerald-600 dark:text-emerald-400';
    if (score >= 40) return 'text-amber-600 dark:text-amber-400';
    return 'text-rose-600 dark:text-rose-400';
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-600';
    if (score >= 60) return 'bg-emerald-600';
    if (score >= 40) return 'bg-amber-600';
    return 'bg-rose-600';
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-bg-canvas">
        <Loader2 className="h-12 w-12 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-bg-canvas">
        <div className="text-center space-y-4">
          <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50">
            Authentication Required
          </Badge>
          <h2 className="text-2xl font-bold text-fg-default">Please sign in</h2>
          <p className="text-fg-muted">You need to be logged in to view your profile</p>
          <Link href="/login">
            <Button className="bg-emerald-600 hover:bg-emerald-500 text-white">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-canvas relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto max-w-6xl px-4 pt-24 pb-12 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-200 backdrop-blur-sm">
                  <User className="w-3 h-3 mr-1" />
                  Personal Workspace
                </Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-fg-default tracking-tight">Profile</h1>
              <p className="mt-2 text-lg text-fg-muted">Manage your account and track your performance</p>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="border-border-default/50 hover:bg-bg-surface/50 backdrop-blur-sm">
                <Share2 className="w-4 h-4 mr-2" /> Share Profile
              </Button>
            </div>
          </div>

          {/* Profile Hero Card */}
          <Card className="relative overflow-hidden border-border-default/40 bg-bg-surface/50 backdrop-blur-sm shadow-xl shadow-emerald-500/5">
            {/* Decorative gradient overlay */}
            <div className="absolute top-0 w-full h-32 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-transparent pointer-events-none" />

            <div className="relative p-8 pt-12">
              <div className="flex flex-col md:flex-row gap-8 items-start">

                {/* Avatar */}
                <div className="relative group shrink-0 mx-auto md:mx-0">
                  <div className="absolute -inset-1 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full opacity-70 blur group-hover:opacity-100 transition-opacity duration-500" />
                  <Avatar.Root className="relative h-32 w-32 ring-4 ring-bg-surface rounded-full bg-bg-canvas">
                    <Avatar.Image
                      src={user.photoURL ?? ''}
                      alt={user.displayName ?? ''}
                      className="object-cover h-full w-full rounded-full"
                    />
                    <Avatar.Fallback className="flex items-center justify-center h-full w-full bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-700 font-black text-4xl rounded-full">
                      {getInitials(user.displayName)}
                    </Avatar.Fallback>
                  </Avatar.Root>
                  <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-full ring-4 ring-bg-surface shadow-lg">
                    <Crown className="w-5 h-5 fill-current" />
                  </div>
                </div>

                {/* User Info */}
                <div className="flex-1 space-y-6 w-full text-center md:text-left">
                  <div className="space-y-2">
                    {isEditing ? (
                      <div className="flex gap-3 items-center max-w-md mx-auto md:mx-0">
                        <input
                          type="text"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          className="flex-1 px-4 py-2 rounded-xl border border-emerald-500/50 bg-bg-canvas/50 text-fg-default text-lg font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
                          placeholder="Display Name"
                          autoFocus
                        />
                        <Button
                          size="icon"
                          onClick={handleSave}
                          disabled={isSaving}
                          className="bg-emerald-600 hover:bg-emerald-500 shrink-0"
                        >
                          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            setIsEditing(false);
                            setDisplayName(user.displayName || '');
                          }}
                          className="shrink-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center md:justify-start gap-4 group">
                        <h2 className="text-3xl font-bold text-fg-default">{user.displayName || 'User'}</h2>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setIsEditing(true)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-fg-muted hover:text-emerald-600 hover:bg-emerald-50"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-fg-muted">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-4 h-4 text-emerald-500" />
                        {user.email}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-emerald-500" />
                        Here since {user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'Forever'}
                      </div>
                      <div className="flex items-center gap-1.5 cursor-pointer hover:text-emerald-600 transition-colors" onClick={handleCopyUserId}>
                        <Copy className="w-4 h-4 text-emerald-500" />
                        <span className="font-mono text-xs opacity-70">ID: {user.uid.slice(0, 8)}...</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-border-default/30">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-bg-canvas/40 border border-border-default/30">
                      <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-600">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs text-fg-muted font-medium uppercase tracking-wider">Plan</p>
                        <p className="font-bold text-fg-default">Free Tier</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-bg-canvas/40 border border-border-default/30">
                      <div className="p-2.5 rounded-lg bg-teal-500/10 text-teal-600">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs text-fg-muted font-medium uppercase tracking-wider">Status</p>
                        <p className="font-bold text-fg-default flex items-center gap-1">
                          Active
                          {user.emailVerified && <Badge variant="solid" className="h-5 px-1.5 text-[10px] bg-emerald-500">Verified</Badge>}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300 }}>
              <Card className="p-6 border-border-default/40 bg-bg-surface/50 backdrop-blur-sm flex flex-col items-center text-center shadow-lg hover:shadow-emerald-500/10 transition-shadow">
                <div className="p-4 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 mb-4">
                  <FileText className="w-8 h-8" />
                </div>
                <h3 className="text-4xl font-black text-fg-default mb-1">{stats.totalAnalyses}</h3>
                <p className="text-sm font-medium text-fg-muted uppercase tracking-wider">Total Analyses</p>
                <Badge variant="secondary" className="mt-3 bg-emerald-50 text-emerald-700 border-emerald-100">
                  +{stats.thisMonthAnalyses} this month
                </Badge>
              </Card>
            </motion.div>

            <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300 }}>
              <Card className="p-6 border-border-default/40 bg-bg-surface/50 backdrop-blur-sm flex flex-col items-center text-center shadow-lg hover:shadow-emerald-500/10 transition-shadow">
                <div className="p-4 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-600 mb-4">
                  <TrendingUp className="w-8 h-8" />
                </div>
                <h3 className={cn("text-4xl font-black mb-1", getScoreColor(stats.averageScore))}>
                  {stats.averageScore}
                </h3>
                <p className="text-sm font-medium text-fg-muted uppercase tracking-wider">Avg. Score</p>
                <Badge variant="secondary" className="mt-3 bg-teal-50 text-teal-700 border-teal-100">
                  Across content
                </Badge>
              </Card>
            </motion.div>

            <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300 }}>
              <Card className="p-6 border-border-default/40 bg-bg-surface/50 backdrop-blur-sm flex flex-col items-center text-center shadow-lg hover:shadow-emerald-500/10 transition-shadow">
                <div className="p-4 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 mb-4">
                  <Award className="w-8 h-8" />
                </div>
                <h3 className={cn("text-4xl font-black mb-1", getScoreColor(stats.bestScore))}>
                  {stats.bestScore}
                </h3>
                <p className="text-sm font-medium text-fg-muted uppercase tracking-wider">Best Score</p>
                <Badge variant="secondary" className="mt-3 bg-amber-50 text-amber-700 border-amber-100">
                  Personal Record
                </Badge>
              </Card>
            </motion.div>

            <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300 }}>
              <Card className="p-6 border-border-default/40 bg-bg-surface/50 backdrop-blur-sm flex flex-col items-center text-center shadow-lg hover:shadow-emerald-500/10 transition-shadow">
                <div className="p-4 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 mb-4">
                  <Clock className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-fg-default mb-1 mt-2">
                  {stats.lastAnalysisDate ? formatDistanceToNow(stats.lastAnalysisDate, { addSuffix: true }) : 'N/A'}
                </h3>
                <p className="text-sm font-medium text-fg-muted uppercase tracking-wider">Last Active</p>
                <Badge variant="secondary" className="mt-4 bg-indigo-50 text-indigo-700 border-indigo-100 opacity-0">
                  Placeholder
                </Badge>
              </Card>
            </motion.div>
          </div>

          {/* Recent Activity */}
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-fg-default flex items-center gap-2">
                  <Target className="w-6 h-6 text-emerald-500" /> Recent Analyses
                </h2>
                <Link href="/">
                  <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700">
                    View All <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>

              {recentAnalyses.length > 0 ? (
                <div className="space-y-4">
                  {recentAnalyses.map((analysis, idx) => (
                    <motion.div
                      key={analysis.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <Link href={`/r/${analysis.id}`}>
                        <Card className="group p-4 border border-border-default/40 bg-bg-surface/40 hover:bg-bg-surface/80 hover:border-emerald-500/30 transition-all duration-300">
                          <div className="flex items-center gap-4">
                            <div className={cn(
                              "h-12 w-12 rounded-xl flex items-center justify-center font-bold text-white shadow-sm",
                              getScoreBadgeColor(analysis.viralityScore?.overall || 0)
                            )}>
                              {analysis.viralityScore?.overall || 0}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-fg-default truncate">
                                  Analysis #{recentAnalyses.length - idx}
                                </h4>
                                <Badge variant="outline" className="text-[10px] h-5 px-1.5">
                                  {formatDistanceToNow(analysis.createdAt, { addSuffix: true })}
                                </Badge>
                              </div>
                              <div className="flex gap-1">
                                {/* Mock tags/features for visual density */}
                                <span className="w-12 h-2 rounded-full bg-fg-muted/10" />
                                <span className="w-8 h-2 rounded-full bg-fg-muted/10" />
                              </div>
                            </div>
                            <Button variant="ghost" size="icon" className="group-hover:translate-x-1 transition-transform">
                              <ExternalLink className="w-5 h-5 text-fg-muted group-hover:text-emerald-600" />
                            </Button>
                          </div>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <Card className="p-12 border-dashed border-2 border-border-default/50 bg-bg-canvas/30 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
                    <Zap className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h3 className="text-xl font-bold text-fg-default mb-2">No analyses yet</h3>
                  <p className="text-fg-muted mb-6 max-w-sm">Start analyzing your LinkedIn posts to unlock insights and populate your profile.</p>
                  <Link href="/">
                    <Button className="bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-500/20">
                      Create First Analysis
                    </Button>
                  </Link>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-fg-default flex items-center gap-2">
                  <Globe className="w-6 h-6 text-teal-500" /> Discovery
                </h2>
              </div>

              <Card className="p-6 border-border-default/40 bg-gradient-to-br from-bg-surface/80 to-bg-canvas/80 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-fg-default">Public Profile</h3>
                  <div
                    onClick={() => setIsPublic(!isPublic)}
                    className={cn(
                      "w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300",
                      isPublic ? "bg-emerald-500" : "bg-gray-300 dark:bg-gray-700"
                    )}
                  >
                    <div className={cn(
                      "w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300",
                      isPublic ? "translate-x-6" : "translate-x-0"
                    )} />
                  </div>
                </div>
                <p className="text-sm text-fg-muted mb-6">
                  Allow others to see your stats and analysis history.
                </p>

                {isPublic && (
                  <div className="p-3 rounded-xl bg-bg-canvas border border-border-default/50 flex items-center gap-2">
                    <LinkIcon className="w-4 h-4 text-fg-muted" />
                    <input
                      readOnly
                      value={typeof window !== 'undefined' ? `${window.location.origin}/profile/${user.uid}` : ''}
                      className="flex-1 bg-transparent border-none text-xs font-mono text-fg-default focus:outline-none truncate"
                    />
                    <Button size="icon" variant="ghost" className="h-6 w-6" onClick={handleCopyProfileLink}>
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </Card>

              <Card className="p-6 border-border-default/40 bg-emerald-950/5 border-emerald-500/20">
                <div className="flex items-center gap-3 mb-3">
                  <Crown className="w-5 h-5 text-amber-500" />
                  <h3 className="font-semibold text-fg-default">Pro Features</h3>
                </div>
                <p className="text-sm text-fg-muted mb-4">
                  Upgrade to unlock detailed audience demographics and competitor benchmarking.
                </p>
                <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0 shadow-lg shadow-amber-500/20">
                  Upgrade to Pro
                </Button>
              </Card>
            </div>
          </div>

        </motion.div>
      </div>
    </div>
  );
}
