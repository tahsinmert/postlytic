'use client';

import {
  BarChart2,
  Check,
  ClipboardCheck,
  FileText,
  Hash,
  Lightbulb,
  Loader2,
  MessageSquare,
  Share2,
  X,
  Sparkles,
  ArrowRight,
  Copy,
  Trash2,
  Zap,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Info,
  FileUp,
  History,
  Wand2,
  Type,
  AlignLeft,
  Hash as HashIcon,
  AtSign,
  HelpCircle,
  Clock,
  SearchCheck,
  Atom,
  Brain,
  MessageCircle,
  BrainCircuit,
  LayoutTemplate,
  Megaphone,
  Tags,
  Target,
  Rocket,
  ScanEye,
  Microscope,
  Waypoints,
  Scroll,
  MessageCircleQuestion,
  Fingerprint,
  Pilcrow,
  ScanLine,
  Blocks,
  GitBranch,
  Import,
  RotateCcw,
  Cpu,
  Search,
  Briefcase,
  Users,
  Award,
  BookOpen,
  Code,
  TrendingDown,
  Star,
  Filter,
  Activity,
  Gauge,
  BarChart3,
  PieChart,
  LineChart,
  Eye,
  ThumbsUp,
  Repeat,
  Bookmark,
  FileDown,
  Heart,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { addDoc, collection, serverTimestamp, query, where, orderBy, limit, getDocs } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { runAnalysis } from '@/app/actions';
import type { AnalysisData } from '@/lib/analysis/types';
import { db } from '@/lib/firebase/client';
import { useAuth } from '@/hooks/use-auth';
import { ViralityScoreDisplay } from './virality-score-display';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { motion, AnimatePresence } from 'framer-motion';

const formSchema = z.object({
  postText: z
    .string()
    .min(50, 'Post must be at least 50 characters long.')
    .max(5000, 'Post cannot exceed 5000 characters.'),
});

const ResultSkeleton = () => (
  <div className="space-y-6">
    <div className="h-[200px] w-full animate-pulse rounded-2xl bg-muted/20" />
    <div className="h-[400px] w-full animate-pulse rounded-2xl bg-muted/20" />
  </div>
);

export function AnalysisDashboard() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisData | null>(null);
  const [resultId, setResultId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showRecentPosts, setShowRecentPosts] = useState(false);
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [wordCount, setWordCount] = useState(0);
  const [hashtagCount, setHashtagCount] = useState(0);
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const [templateSearchQuery, setTemplateSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sentenceCount, setSentenceCount] = useState(0);
  const [paragraphCount, setParagraphCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [avgWordsPerSentence, setAvgWordsPerSentence] = useState(0);
  const [mentionsCount, setMentionsCount] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [exclamationCount, setExclamationCount] = useState(0);
  const [linkCount, setLinkCount] = useState(0);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      postText: '',
    },
  });

  const watchText = form.watch('postText');

  // Load recent posts from Firestore
  useEffect(() => {
    const loadRecentPosts = async () => {
      if (!user) return;
      try {
        const q = query(
          collection(db, 'analyses'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc'),
          limit(5)
        );
        const snapshot = await getDocs(q);
        const posts = snapshot.docs.map(doc => ({
          id: doc.id,
          text: doc.data().originalPost || '',
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        }));
        setRecentPosts(posts);
      } catch (error) {
        console.error('Error loading recent posts:', error);
      }
    };
    loadRecentPosts();
  }, [user]);

  // Calculate comprehensive metrics and auto-save draft
  useEffect(() => {
    const text = watchText || '';
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    setWordCount(words.length);

    const hashtags = text.match(/#\w+/g) || [];
    setHashtagCount(hashtags.length);

    // Sentence count (sentences ending with . ! ?)
    const sentences = text.match(/[.!?]+/g) || [];
    setSentenceCount(sentences.length || (text.length > 0 ? 1 : 0));

    // Paragraph count (split by double newlines)
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    setParagraphCount(paragraphs.length || (text.length > 0 ? 1 : 0));

    // Reading time (average 200 words per minute)
    const readingTimeMinutes = Math.ceil(words.length / 200);
    setReadingTime(readingTimeMinutes);

    // Average words per sentence
    const avgWords = sentenceCount > 0 ? Math.round(words.length / sentenceCount) : 0;
    setAvgWordsPerSentence(avgWords);

    // Mentions (@)
    const mentions = text.match(/@\w+/g) || [];
    setMentionsCount(mentions.length);

    // Questions
    const questions = text.match(/\?/g) || [];
    setQuestionCount(questions.length);

    // Exclamations
    const exclamations = text.match(/!/g) || [];
    setExclamationCount(exclamations.length);

    // Links (http/https)
    const links = text.match(/https?:\/\/[^\s]+/g) || [];
    setLinkCount(links.length);

    // Auto-save draft to localStorage
    if (text.length > 0) {
      localStorage.setItem('linkedin-post-draft', text);
      setIsDraftSaved(true);
      setTimeout(() => setIsDraftSaved(false), 2000);
    }
  }, [watchText, sentenceCount]);

  // Load draft from localStorage on mount
  useEffect(() => {
    const draft = localStorage.getItem('linkedin-post-draft');
    if (draft && !watchText) {
      form.setValue('postText', draft);
    }
  }, []);

  const postTemplates = [
    {
      title: 'Product Launch',
      icon: Rocket,
      category: 'business',
      description: 'Announce your product with impact',
      difficulty: 'easy',
      popular: true,
      text: 'Major Update: I\'m deploying [Product Name] to production today.\n\nIt solves [core problem] by [mechanism].\n\nStack:\n- [Tech 1]\n- [Tech 2]\n- [Tech 3]\n\nLive demo in comments.\n\n#ShipIt #TechStack #BuildInPublic',
    },
    {
      title: 'Thought Leadership',
      icon: Brain,
      category: 'leadership',
      description: 'Share insights that position you as an expert',
      difficulty: 'medium',
      popular: true,
      text: 'Pattern Recognition: After analyzing [number] projects, I realized [insight].\n\nThe common vector? [Observation].\n\nWhy this breaks the paradigm:\n\n1. [Point 1]\n2. [Point 2]\n3. [Point 3]\n\nCounter-arguments? Debug them in the comments.\n\n#SystemThinking #Engineering #Architecture',
    },
    {
      title: 'Personal Story',
      icon: Scroll,
      category: 'storytelling',
      description: 'Connect through authentic experiences',
      difficulty: 'easy',
      popular: false,
      text: 'The logs don\'t lie: [timeframe] ago, I encountered a critical error in my career.\n\nException: [failure/challenge].\n\nStack trace:\n- [Cause 1]\n- [Cause 2]\n\nPatch:\n[How you fixed it]\n\nOutput: [Result].\n\n#Refactoring #CareerGrowth #Learning',
    },
    {
      title: 'Question Post',
      icon: MessageCircleQuestion,
      category: 'engagement',
      description: 'Spark discussions and gather opinions',
      difficulty: 'easy',
      popular: true,
      text: 'Peer Review Requested:\n\n[Scenario/Question]\n\nArguments for A: [Arg A]\nArguments for B: [Arg B]\n\nWhich implementation do you prefer?\n\nCommit your thoughts below.\n\n#CodeReview #DevDiscuss #Architecture',
    },
    {
      title: 'Career Milestone',
      icon: Award,
      category: 'career',
      description: 'Celebrate achievements professionally',
      difficulty: 'easy',
      popular: false,
      text: 'I\'m excited to share that I\'ve [achievement].\n\nThis journey taught me:\n\n1. [Lesson 1]\n2. [Lesson 2]\n3. [Lesson 3]\n\nGrateful to [mentors/team] for their support.\n\nWhat\'s your biggest career lesson?\n\n#CareerGrowth #ProfessionalDevelopment #Gratitude',
    },
    {
      title: 'Industry Analysis',
      icon: TrendingUp,
      category: 'leadership',
      description: 'Analyze trends and share predictions',
      difficulty: 'hard',
      popular: false,
      text: 'The [industry] landscape is shifting.\n\nHere\'s what I\'m seeing:\n\nTrend 1: [Observation]\nTrend 2: [Observation]\nTrend 3: [Observation]\n\nWhy this matters:\n[Impact analysis]\n\nWhat trends are you watching?\n\n#IndustryInsights #TrendAnalysis #FutureOfWork',
    },
    {
      title: 'Learning Journey',
      icon: BookOpen,
      category: 'storytelling',
      description: 'Document your learning process',
      difficulty: 'easy',
      popular: false,
      text: 'I just completed [course/certification/project].\n\nKey takeaways:\n\n1. [Insight 1]\n2. [Insight 2]\n3. [Insight 3]\n\nMost surprising discovery: [Discovery]\n\nNext up: [Next step]\n\nWhat are you learning right now?\n\n#ContinuousLearning #ProfessionalDevelopment #Growth',
    },
    {
      title: 'Team Appreciation',
      icon: Users,
      category: 'engagement',
      description: 'Recognize and celebrate your team',
      difficulty: 'easy',
      popular: false,
      text: 'Shoutout to my incredible team for [achievement].\n\nWhat made this special:\n\n- [Team member 1] brought [contribution]\n- [Team member 2] delivered [contribution]\n- [Team member 3] solved [challenge]\n\nTogether we [outcome].\n\n#TeamWork #Gratitude #Leadership',
    },
    {
      title: 'Tech Deep Dive',
      icon: Code,
      category: 'technical',
      description: 'Share technical knowledge and expertise',
      difficulty: 'hard',
      popular: true,
      text: 'Deep dive: [Technology/Concept]\n\nHow it works:\n\n[Technical explanation]\n\nWhy it matters:\n[Significance]\n\nReal-world application:\n[Use case]\n\nHave you worked with [Technology]? Share your experience.\n\n#TechTalk #SoftwareEngineering #DeepDive',
    },
    {
      title: 'Failure & Recovery',
      icon: TrendingDown,
      category: 'storytelling',
      description: 'Share failures and lessons learned',
      difficulty: 'medium',
      popular: true,
      text: 'I failed at [project/task].\n\nWhat went wrong:\n\n1. [Mistake 1]\n2. [Mistake 2]\n\nWhat I learned:\n[Lessons]\n\nHow I recovered:\n[Recovery process]\n\nFailure is data. What\'s your biggest learning from failure?\n\n#FailureIsLearning #GrowthMindset #Resilience',
    },
    {
      title: 'Job Opportunity',
      icon: Briefcase,
      category: 'business',
      description: 'Post job openings effectively',
      difficulty: 'easy',
      popular: false,
      text: 'We\'re hiring! [Role Title] at [Company].\n\nWhat we\'re looking for:\n\n- [Requirement 1]\n- [Requirement 2]\n- [Requirement 3]\n\nWhat we offer:\n[Benefits]\n\nWhy this role matters:\n[Impact]\n\nInterested? Drop a comment or DM.\n\n#Hiring #Jobs #CareerOpportunity',
    },
    {
      title: 'Case Study',
      icon: FileText,
      category: 'business',
      description: 'Showcase results and methodology',
      difficulty: 'hard',
      popular: false,
      text: 'Case Study: How we [achievement] for [client/project].\n\nChallenge:\n[Problem statement]\n\nApproach:\n[Methodology]\n\nResults:\n- [Result 1]\n- [Result 2]\n- [Result 3]\n\nKey takeaway:\n[Insight]\n\n#CaseStudy #Results #BusinessImpact',
    },
  ];

  const categories = [
    { id: 'all', label: 'All Templates', icon: Blocks },
    { id: 'business', label: 'Business', icon: Briefcase },
    { id: 'leadership', label: 'Leadership', icon: Brain },
    { id: 'storytelling', label: 'Storytelling', icon: Scroll },
    { id: 'engagement', label: 'Engagement', icon: MessageCircle },
    { id: 'technical', label: 'Technical', icon: Code },
    { id: 'career', label: 'Career', icon: Award },
  ];

  const filteredTemplates = postTemplates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(templateSearchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(templateSearchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      toast({
        title: 'Authentication Error',
        description: 'You must be logged in to analyze a post.',
        type: 'error',
      });
      return;
    }

    setIsLoading(true);
    setAnalysisResult(null);
    setResultId(null);
    let analysisData: AnalysisData | null = null;

    try {
      const response = await runAnalysis(values.postText);
      if (response.error) {
        toast({
          title: 'Analysis Failed',
          description: response.error,
          type: 'error',
        });
        return;
      }
      analysisData = response.data;
      setAnalysisResult(response.data);
    } finally {
      setIsLoading(false);
    }

    if (analysisData && user) {
      try {
        const docRef = await addDoc(collection(db, 'analyses'), {
          ...analysisData,
          userId: user.uid,
          createdAt: serverTimestamp(),
        });
        setResultId(docRef.id);
      } catch (error) {
        console.error('Error saving analysis to Firestore:', error);
        toast({
          title: 'Failed to Save',
          description: 'Your analysis was completed but could not be saved for sharing.',
          type: 'error',
        });
      }
    }
  }

  // Auto-scroll to results when analysis completes with smooth animation
  useEffect(() => {
    if (analysisResult && !isLoading && resultsRef.current) {
      // Wait for results to render and animate before scrolling
      const timer = setTimeout(() => {
        if (resultsRef.current) {
          // Calculate offset for better positioning (accounting for header/nav)
          const elementPosition = resultsRef.current.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - 100; // 100px offset from top

          // Smooth scroll with custom offset
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 800); // Delay to allow results to fully render and animate

      return () => clearTimeout(timer);
    }
  }, [analysisResult, isLoading]);

  const handleShare = () => {
    if (!resultId) return;
    const shareUrl = `${window.location.origin}/r/${resultId}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setIsCopied(true);
      toast({ title: 'Share link copied to clipboard!', type: 'success' });
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedText(text);
      toast({ title: `${label} copied to clipboard!`, type: 'success' });
      setTimeout(() => setCopiedText(null), 2000);
    });
  };

  const handleExportPDF = () => {
    toast({ title: 'Export feature coming soon!', type: 'info' });
  };

  // Calculate engagement score estimate
  const calculateEngagementScore = () => {
    if (!analysisResult) return 0;
    const scores = [
      analysisResult.viralityScore.breakdown.hook,
      analysisResult.viralityScore.breakdown.structure,
      analysisResult.viralityScore.breakdown.cta,
      analysisResult.viralityScore.breakdown.hashtags,
    ];
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  };

  const engagementScore = calculateEngagementScore();

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      form.setValue('postText', text);
      toast({ title: 'Pasted from clipboard', type: 'success' });
    } catch (error) {
      toast({ title: 'Failed to paste', description: 'Please paste manually', type: 'error' });
    }
  };

  const handleClear = () => {
    form.setValue('postText', '');
    localStorage.removeItem('linkedin-post-draft');
    textareaRef.current?.focus();
    toast({ title: 'Cleared', type: 'success' });
  };

  const handleUseTemplate = (template: string) => {
    form.setValue('postText', template);
    setShowTemplates(false);
    textareaRef.current?.focus();
    toast({ title: 'Template loaded', type: 'success' });
  };

  const handleUseRecentPost = (post: any) => {
    form.setValue('postText', post.text);
    setShowRecentPosts(false);
    textareaRef.current?.focus();
    toast({ title: 'Post loaded', type: 'success' });
  };

  const getCharacterCountColor = () => {
    const length = watchText?.length || 0;
    if (length < 50) return 'text-rose-500';
    if (length < 150) return 'text-amber-500';
    if (length < 300) return 'text-emerald-500';
    if (length < 5000) return 'text-teal-600';
    return 'text-rose-500';
  };

  const getWordCountStatus = () => {
    if (wordCount < 25) return { text: 'Too short', color: 'text-rose-500', icon: AlertCircle, score: 30 };
    if (wordCount < 50) return { text: 'Good', color: 'text-emerald-500', icon: CheckCircle2, score: 60 };
    if (wordCount < 100) return { text: 'Optimal', color: 'text-teal-600', icon: TrendingUp, score: 90 };
    if (wordCount < 300) return { text: 'Long', color: 'text-amber-500', icon: Info, score: 70 };
    return { text: 'Very Long', color: 'text-rose-500', icon: AlertCircle, score: 40 };
  };

  const wordCountStatus = getWordCountStatus();

  // Calculate overall post quality score
  const calculateQualityScore = () => {
    if (!watchText || watchText.length === 0) return 0;

    let score = 0;
    let factors = 0;

    // Length score (optimal: 150-300 chars)
    if (watchText.length >= 50 && watchText.length <= 5000) {
      const lengthScore = watchText.length >= 150 && watchText.length <= 300 ? 100 :
        watchText.length >= 100 && watchText.length < 150 ? 80 :
          watchText.length >= 50 && watchText.length < 100 ? 60 : 40;
      score += lengthScore;
      factors++;
    }

    // Word count score (optimal: 50-100 words)
    if (wordCount >= 25 && wordCount <= 300) {
      const wordScore = wordCount >= 50 && wordCount <= 100 ? 100 :
        wordCount >= 25 && wordCount < 50 ? 70 :
          wordCount > 100 && wordCount <= 200 ? 80 : 50;
      score += wordScore;
      factors++;
    }

    // Hashtag score (optimal: 3-5)
    if (hashtagCount >= 0 && hashtagCount <= 10) {
      const hashtagScore = hashtagCount >= 3 && hashtagCount <= 5 ? 100 :
        hashtagCount === 0 ? 30 :
          hashtagCount === 1 || hashtagCount === 2 ? 60 :
            hashtagCount > 5 && hashtagCount <= 7 ? 70 : 40;
      score += hashtagScore;
      factors++;
    }

    // Structure score (paragraphs and sentences)
    if (paragraphCount >= 1 && paragraphCount <= 10) {
      const paraScore = paragraphCount >= 2 && paragraphCount <= 5 ? 100 :
        paragraphCount === 1 ? 60 : 70;
      score += paraScore;
      factors++;
    }

    // Engagement elements (questions, exclamations)
    const engagementScore = (questionCount > 0 ? 30 : 0) + (exclamationCount > 0 ? 20 : 0);
    score += Math.min(engagementScore, 50);
    factors++;

    return factors > 0 ? Math.round(score / factors) : 0;
  };

  const qualityScore = calculateQualityScore();

  const getQualityScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 60) return 'text-teal-600';
    if (score >= 40) return 'text-amber-500';
    return 'text-rose-500';
  };

  const getQualityScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Work';
  };

  const analysisItems = analysisResult ? [
    { icon: Brain, title: 'Hook' as const, analysis: analysisResult.hook, score: analysisResult.viralityScore.breakdown.hook, color: 'text-amber-500' },
    { icon: LayoutTemplate, title: 'Structure' as const, analysis: analysisResult.structure, score: analysisResult.viralityScore.breakdown.structure, color: 'text-teal-600' },
    { icon: Megaphone, title: 'Call to Action (CTA)' as const, analysis: analysisResult.cta, score: analysisResult.viralityScore.breakdown.cta, color: 'text-emerald-500' },
    { icon: Tags, title: 'Hashtags' as const, analysis: analysisResult.hashtags, score: analysisResult.viralityScore.breakdown.hashtags, color: 'text-rose-500' },
    { icon: BrainCircuit, title: 'Engagement' as const, analysis: analysisResult.engagement, score: analysisResult.engagement.engagementScore, color: 'text-emerald-500' },
    { icon: Scroll, title: 'Storytelling' as const, analysis: analysisResult.storytelling, score: analysisResult.storytelling.storytellingScore, color: 'text-teal-500' },
    { icon: Heart, title: 'Sentiment' as const, analysis: analysisResult.sentiment, score: analysisResult.sentiment.sentimentScore, color: 'text-pink-500' },
    { icon: Search, title: 'Topics' as const, analysis: analysisResult.topics, score: analysisResult.topics.diversityScore, color: 'text-teal-500' },
    { icon: BookOpen, title: 'Readability' as const, analysis: analysisResult.readability, score: analysisResult.readability.fleschKincaidScore, color: 'text-cyan-500' },
  ] : [];

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] py-12 px-4 sm:px-6 lg:px-8 bg-bg-canvas">
      {/* Background patterns */}
      {/* Subtle Gradient Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-teal-500/5 rounded-[4rem] blur-[120px] -z-10" />

      <div className="container mx-auto max-w-6xl">
        <header className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full bg-teal-500/10 px-4 py-1.5 text-xs font-semibold text-teal-600 mb-6"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI-Powered Insights</span>
          </motion.div>
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-fg-default mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            LinkedIn Post Analyzer
          </motion.h1>
          <motion.p
            className="text-lg text-fg-muted max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Paste your content to unlock hidden engagement patterns and skyrocket your reach.
          </motion.p>
        </header>

        <div className="space-y-12">
          {/* Input Form */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border border-border-default/40 bg-bg-surface/50 backdrop-blur-xl shadow-2xl shadow-teal-900/5 rounded-[2rem] overflow-hidden flex flex-col lg:flex-row">

              <div className="flex flex-col lg:flex-row relative z-10">
                {/* Left Sidebar - Analysis Studio - Magazine Style */}
                <div className="lg:w-96 xl:w-[28rem] lg:border-r border-border-default/20 bg-gradient-to-br from-bg-default/60 via-bg-default/40 to-bg-default/60 p-8 lg:p-10 flex-shrink-0 overflow-y-auto max-h-[calc(100vh-8rem)] backdrop-blur-sm">
                  <div className="flex flex-col gap-8">
                    {/* Magazine Header */}
                    <div className="space-y-4 pb-6 border-b-2 border-border-default/20">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          {/* Magazine-style large title */}
                          <div className="flex items-center gap-3 mb-3">
                            <div className="h-1 w-12 bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-teal-600/60">ANALYSIS</span>
                          </div>
                          <CardTitle className="text-4xl lg:text-5xl font-black tracking-tight text-fg-default leading-[0.9] mb-2">
                            STUDIO
                          </CardTitle>
                          <p className="text-sm font-medium text-muted-foreground/80 tracking-wide">Real-time Performance Insights</p>
                        </div>
                        {isDraftSaved && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/15 border-2 border-emerald-500/30 shadow-lg"
                          >
                            <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">Saved</span>
                          </motion.div>
                        )}
                      </div>
                    </div>

                    {/* Magazine-style Quality Score Feature */}
                    {watchText && watchText.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative p-8 rounded-3xl bg-gradient-to-br from-teal-500/15 via-cyan-400/10 to-teal-300/10 border-2 border-teal-500/30 overflow-hidden shadow-2xl"
                      >
                        {/* Decorative background elements */}
                        <div className="absolute top-0 right-0 w-40 h-40 bg-teal-500/10 rounded-full blur-3xl -mr-20 -mt-20" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-400/10 rounded-full blur-2xl -ml-16 -mb-16" />

                        <div className="relative z-10">
                          {/* Magazine label */}
                          <div className="flex items-center gap-2 mb-6">
                            <div className="h-1 w-8 bg-teal-500 rounded-full" />
                            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-teal-600/70">QUALITY METER</span>
                          </div>

                          {/* Large score display - magazine style */}
                          <div className="flex items-end gap-3 mb-6">
                            <span className={`text-7xl lg:text-8xl font-black leading-none ${getQualityScoreColor(qualityScore)}`}>
                              {qualityScore}
                            </span>
                            <div className="pb-2">
                              <span className="text-2xl font-bold text-muted-foreground/60">/100</span>
                              <Badge variant="subtle" className={`ml-3 text-xs font-black uppercase tracking-wider px-3 py-1 ${getQualityScoreColor(qualityScore)}`}>
                                {getQualityScoreLabel(qualityScore)}
                              </Badge>
                            </div>
                          </div>

                          {/* Large progress bar */}
                          <div className="h-3 bg-muted/40 rounded-full overflow-hidden shadow-inner">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${qualityScore}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className={`h-full rounded-full bg-gradient-to-r shadow-lg ${qualityScore >= 80 ? 'from-emerald-500 via-emerald-400 to-emerald-600' :
                                qualityScore >= 60 ? 'from-teal-500 via-cyan-400 to-teal-600' :
                                  qualityScore >= 40 ? 'from-amber-500 via-amber-400 to-amber-600' :
                                    'from-rose-500 via-rose-400 to-rose-600'
                                }`}
                            />
                          </div>

                          {/* Icon decoration */}
                          <div className="absolute top-6 right-6 opacity-10">
                            <Target className="h-24 w-24 text-teal-600" />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Magazine-style Core Metrics */}
                    <div className="space-y-4">
                      {/* Section label */}
                      <div className="flex items-center gap-2 mb-4">
                        <div className="h-0.5 w-6 bg-teal-500 rounded-full" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">KEY METRICS</span>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {/* Words - Magazine style */}
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="relative p-6 rounded-2xl bg-gradient-to-br from-bg-default/80 to-bg-default/40 border-2 border-border-default/20 hover:border-teal-500/30 transition-all shadow-lg hover:shadow-xl group"
                        >
                          <div className="absolute top-3 right-3 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Pilcrow className="h-16 w-16 text-teal-600" />
                          </div>
                          <div className="relative z-10">
                            <div className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-3">WORDS</div>
                            <div className="flex items-baseline gap-2 mb-3">
                              <span className="text-5xl font-black text-fg-default leading-none">{wordCount}</span>
                              {wordCount > 0 && (
                                <Badge variant="subtle" className={`text-[10px] font-black uppercase px-2 py-0.5 ${wordCountStatus.color}`}>
                                  {wordCountStatus.text}
                                </Badge>
                              )}
                            </div>
                            {wordCount > 0 && (
                              <div className="h-1.5 bg-muted/40 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${Math.min((wordCount / 100) * 100, 100)}%` }}
                                  className={`h-full ${wordCountStatus.color.replace('text-', 'bg-')}`}
                                />
                              </div>
                            )}
                          </div>
                        </motion.div>

                        {/* Characters - Magazine style */}
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.05 }}
                          className="relative p-6 rounded-2xl bg-gradient-to-br from-bg-default/80 to-bg-default/40 border-2 border-border-default/20 hover:border-teal-500/30 transition-all shadow-lg hover:shadow-xl group"
                        >
                          <div className="absolute top-3 right-3 opacity-10 group-hover:opacity-20 transition-opacity">
                            <ScanLine className="h-16 w-16 text-teal-600" />
                          </div>
                          <div className="relative z-10">
                            <div className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-3">LENGTH</div>
                            <div className="flex items-baseline gap-2 mb-3">
                              <span className={`text-5xl font-black leading-none ${getCharacterCountColor()}`}>
                                {watchText?.length || 0}
                              </span>
                              <span className="text-sm text-muted-foreground/60 font-bold">/5000</span>
                            </div>
                            {watchText && watchText.length > 0 && (
                              <div className="h-1.5 bg-muted/40 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${Math.min((watchText.length / 5000) * 100, 100)}%` }}
                                  className={`h-full ${getCharacterCountColor().replace('text-', 'bg-')}`}
                                />
                              </div>
                            )}
                          </div>
                        </motion.div>

                        {/* Hashtags - Magazine style */}
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.1 }}
                          className="relative p-6 rounded-2xl bg-gradient-to-br from-bg-default/80 to-bg-default/40 border-2 border-border-default/20 hover:border-teal-500/30 transition-all shadow-lg hover:shadow-xl group"
                        >
                          <div className="absolute top-3 right-3 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Tags className="h-16 w-16 text-teal-600" />
                          </div>
                          <div className="relative z-10">
                            <div className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-3">HASHTAGS</div>
                            <div className="flex items-baseline gap-3 mb-3">
                              <span className="text-5xl font-black text-fg-default leading-none">{hashtagCount}</span>
                              {hashtagCount > 0 && (
                                <Badge variant="subtle" className={`text-[10px] font-black uppercase px-2 py-0.5 ${hashtagCount >= 3 && hashtagCount <= 5 ? 'bg-emerald-500/10 text-emerald-600' :
                                  hashtagCount === 0 ? 'bg-rose-500/10 text-rose-600' :
                                    'bg-amber-500/10 text-amber-600'
                                  }`}>
                                  {hashtagCount >= 3 && hashtagCount <= 5 ? 'OPTIMAL' :
                                    hashtagCount === 0 ? 'ADD' :
                                      hashtagCount > 5 ? 'TOO MANY' : 'GOOD'}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </motion.div>

                        {/* Reading Time - Magazine style */}
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.15 }}
                          className="relative p-6 rounded-2xl bg-gradient-to-br from-bg-default/80 to-bg-default/40 border-2 border-border-default/20 hover:border-teal-500/30 transition-all shadow-lg hover:shadow-xl group"
                        >
                          <div className="absolute top-3 right-3 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Clock className="h-16 w-16 text-teal-600" />
                          </div>
                          <div className="relative z-10">
                            <div className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-3">READ TIME</div>
                            <div className="flex items-baseline gap-2">
                              <span className="text-5xl font-black text-fg-default leading-none">
                                {readingTime || '<1'}
                              </span>
                              <span className="text-lg text-muted-foreground/60 font-bold">min</span>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    </div>

                    {/* Magazine-style Detailed Metrics */}
                    {watchText && watchText.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-5 pt-6 border-t-2 border-border-default/20"
                      >
                        {/* Section label */}
                        <div className="flex items-center gap-2">
                          <div className="h-0.5 w-6 bg-teal-500 rounded-full" />
                          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">
                            DETAILED BREAKDOWN
                          </h3>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-4 rounded-xl bg-gradient-to-br from-bg-default/60 to-bg-default/30 border border-border-default/20 shadow-md">
                            <div className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-2">SENTENCES</div>
                            <div className="text-3xl font-black text-fg-default">{sentenceCount}</div>
                          </div>
                          <div className="p-4 rounded-xl bg-gradient-to-br from-bg-default/60 to-bg-default/30 border border-border-default/20 shadow-md">
                            <div className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-2">PARAGRAPHS</div>
                            <div className="text-3xl font-black text-fg-default">{paragraphCount}</div>
                          </div>
                          <div className="p-4 rounded-xl bg-gradient-to-br from-bg-default/60 to-bg-default/30 border border-border-default/20 shadow-md">
                            <div className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-2">AVG WORDS</div>
                            <div className="text-3xl font-black text-fg-default">{avgWordsPerSentence || '-'}</div>
                          </div>
                          <div className="p-4 rounded-xl bg-gradient-to-br from-bg-default/60 to-bg-default/30 border border-border-default/20 shadow-md">
                            <div className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-2">MENTIONS</div>
                            <div className="text-3xl font-black text-fg-default">{mentionsCount}</div>
                          </div>
                        </div>

                        {/* Engagement Elements */}
                        {(questionCount > 0 || exclamationCount > 0 || linkCount > 0) && (
                          <div className="pt-2 space-y-2">
                            <div className="text-xs font-semibold text-muted-foreground">Engagement Elements</div>
                            <div className="flex flex-wrap gap-2">
                              {questionCount > 0 && (
                                <Badge variant="subtle" className="text-xs bg-teal-500/10 text-teal-600">
                                  <MessageCircleQuestion className="h-3 w-3 mr-1" />
                                  {questionCount} {questionCount === 1 ? 'question' : 'questions'}
                                </Badge>
                              )}
                              {exclamationCount > 0 && (
                                <Badge variant="subtle" className="text-xs bg-cyan-400/10 text-teal-600">
                                  <Zap className="h-3 w-3 mr-1" />
                                  {exclamationCount} {exclamationCount === 1 ? 'exclamation' : 'exclamations'}
                                </Badge>
                              )}
                              {linkCount > 0 && (
                                <Badge variant="subtle" className="text-xs bg-emerald-500/10 text-emerald-600">
                                  <Share2 className="h-3 w-3 mr-1" />
                                  {linkCount} {linkCount === 1 ? 'link' : 'links'}
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Magazine-style Quick Tips */}
                        <div className="pt-6 border-t-2 border-border-default/20">
                          <div className="flex items-center gap-2 mb-4">
                            <Lightbulb className="h-5 w-5 text-teal-600" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">PRO TIPS</span>
                          </div>
                          <div className="space-y-3">
                            {wordCount < 50 && watchText.length >= 50 && (
                              <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500/10 to-amber-500/5 border-l-4 border-amber-500">
                                <div className="text-xs font-bold text-fg-default mb-1">OPTIMIZE WORD COUNT</div>
                                <div className="text-xs text-muted-foreground">Posts with 50-100 words typically perform best on LinkedIn</div>
                              </div>
                            )}
                            {hashtagCount === 0 && watchText.length >= 50 && (
                              <div className="p-3 rounded-xl bg-gradient-to-r from-teal-500/10 to-teal-500/5 border-l-4 border-teal-500">
                                <div className="text-xs font-bold text-fg-default mb-1">ADD HASHTAGS</div>
                                <div className="text-xs text-muted-foreground">Include 3-5 relevant hashtags to significantly increase your reach</div>
                              </div>
                            )}
                            {questionCount === 0 && watchText.length >= 50 && (
                              <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 border-l-4 border-emerald-500">
                                <div className="text-xs font-bold text-fg-default mb-1">BOOST ENGAGEMENT</div>
                                <div className="text-xs text-muted-foreground">Questions drive comments - try adding one to spark conversation</div>
                              </div>
                            )}
                            {paragraphCount === 1 && watchText.length >= 100 && (
                              <div className="p-3 rounded-xl bg-gradient-to-r from-cyan-500/10 to-cyan-500/5 border-l-4 border-cyan-500">
                                <div className="text-xs font-bold text-fg-default mb-1">IMPROVE READABILITY</div>
                                <div className="text-xs text-muted-foreground">Break your content into 2-3 paragraphs for better visual flow</div>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Empty State */}
                    {(!watchText || watchText.length === 0) && (
                      <div className="flex-1 flex flex-col items-center justify-center text-center py-12 px-4 opacity-60">
                        <div className="p-4 rounded-full bg-muted/30 mb-4">
                          <Sparkles className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <p className="text-base font-medium text-fg-default">Ready to Analyze</p>
                        <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">Type your post to unlock real-time insights</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Content */}
                <div className="flex-1 p-8 min-w-0">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                      {/* Quick Actions Bar */}
                      <div className="flex items-center gap-3 flex-wrap mb-6">
                        <Button
                          type="button"
                          variant="outline"
                          size="md"
                          onClick={() => setShowTemplates(!showTemplates)}
                          className={`text-sm h-11 px-5 border-2 transition-all ${showTemplates
                            ? 'border-teal-600 bg-teal-500/10 text-teal-600 dark:text-teal-400'
                            : 'border-border-default/50 hover:border-teal-600/50'
                            }`}
                        >
                          <Blocks className="h-5 w-5 mr-2" />
                          Templates
                        </Button>
                        {recentPosts.length > 0 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="md"
                            onClick={() => setShowRecentPosts(!showRecentPosts)}
                            className={`text-sm h-11 px-5 border-2 transition-all ${showRecentPosts
                              ? 'border-teal-600 bg-teal-500/10 text-teal-600 dark:text-teal-400'
                              : 'border-border-default/50 hover:border-teal-600/50'
                              }`}
                          >
                            <GitBranch className="h-5 w-5 mr-2" />
                            Recent
                            <Badge variant="subtle" className="ml-2 text-xs px-2 py-0.5">{recentPosts.length}</Badge>
                          </Button>
                        )}
                        <Button
                          type="button"
                          variant="outline"
                          size="md"
                          onClick={handlePasteFromClipboard}
                          className="text-sm h-11 px-5 border-2 border-border-default/50 hover:border-teal-600/50 transition-all"
                        >
                          <Import className="h-5 w-5 mr-2" />
                          Paste
                        </Button>
                        {watchText && (
                          <Button
                            type="button"
                            variant="outline"
                            size="md"
                            onClick={handleClear}
                            className="text-sm h-11 px-5 border-2 border-border-default/50 hover:border-border-default text-muted-foreground transition-all"
                          >
                            <RotateCcw className="h-5 w-5 mr-2" />
                            Reset
                          </Button>
                        )}
                      </div>

                      {/* Templates Dropdown */}
                      <AnimatePresence>
                        {showTemplates && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <Card className="border-2 border-border-default/50 bg-bg-default mb-6 shadow-xl">
                              <CardHeader className="pb-4">
                                <div className="flex items-center justify-between mb-4">
                                  <CardTitle className="text-xl font-bold">Post Templates</CardTitle>
                                  <Badge variant="subtle" className="text-xs">
                                    {filteredTemplates.length} templates
                                  </Badge>
                                </div>

                                {/* Search Bar */}
                                <div className="relative mb-4">
                                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                  <input
                                    type="text"
                                    placeholder="Search templates..."
                                    value={templateSearchQuery}
                                    onChange={(e) => setTemplateSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-border-default/50 bg-bg-default focus:border-teal-600/50 focus:ring-2 focus:ring-teal-500/20 outline-none text-sm transition-all"
                                  />
                                </div>

                                {/* Category Filters */}
                                <div className="flex items-center gap-2 flex-wrap">
                                  {categories.map((category) => {
                                    const Icon = category.icon;
                                    return (
                                      <button
                                        key={category.id}
                                        type="button"
                                        onClick={() => setSelectedCategory(category.id)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedCategory === category.id
                                          ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-2 border-teal-600/30'
                                          : 'bg-muted/30 text-muted-foreground border-2 border-transparent hover:border-border-default/50 hover:bg-muted/50'
                                          }`}
                                      >
                                        <Icon className="h-4 w-4" />
                                        {category.label}
                                      </button>
                                    );
                                  })}
                                </div>
                              </CardHeader>

                              <CardContent className="pt-0">
                                {filteredTemplates.length === 0 ? (
                                  <div className="text-center py-12">
                                    <SearchCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                                    <p className="text-sm text-muted-foreground">No templates found matching your search.</p>
                                  </div>
                                ) : (
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2">
                                    {filteredTemplates.map((template, idx) => {
                                      const DifficultyColors = {
                                        easy: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
                                        medium: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
                                        hard: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
                                      };

                                      return (
                                        <motion.button
                                          key={idx}
                                          type="button"
                                          onClick={() => handleUseTemplate(template.text)}
                                          initial={{ opacity: 0, y: 10 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          transition={{ delay: idx * 0.05 }}
                                          className="group relative text-left p-5 rounded-2xl border-2 border-border-default/50 hover:border-teal-600/50 hover:bg-teal-500/5 transition-all bg-bg-default/50 backdrop-blur-sm"
                                        >
                                          {/* Popular Badge */}
                                          {template.popular && (
                                            <div className="absolute top-3 right-3">
                                              <Badge variant="subtle" className="text-xs bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-600/20">
                                                <Star className="h-3 w-3 mr-1 fill-current" />
                                                Popular
                                              </Badge>
                                            </div>
                                          )}

                                          <div className="flex items-start gap-4 mb-3">
                                            <div className={`h-12 w-12 rounded-xl bg-gradient-to-br from-teal-500/10 to-cyan-400/10 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0`}>
                                              <template.icon className={`h-6 w-6 text-teal-600 dark:text-teal-400`} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                              <h3 className="text-base font-bold text-fg-default mb-1 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                                                {template.title}
                                              </h3>
                                              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                                                {template.description}
                                              </p>
                                              <div className="flex items-center gap-2 flex-wrap">
                                                <Badge variant="subtle" className={`text-xs ${DifficultyColors[template.difficulty as keyof typeof DifficultyColors]}`}>
                                                  {template.difficulty}
                                                </Badge>
                                                <Badge variant="subtle" className="text-xs bg-muted/50 text-muted-foreground">
                                                  {categories.find(c => c.id === template.category)?.label}
                                                </Badge>
                                              </div>
                                            </div>
                                          </div>

                                          {/* Preview */}
                                          <div className="mt-3 pt-3 border-t border-border-default/30">
                                            <p className="text-xs text-muted-foreground line-clamp-3 font-mono">
                                              {template.text.substring(0, 120)}...
                                            </p>
                                          </div>

                                          {/* Hover Arrow */}
                                          <ArrowRight className="absolute bottom-4 right-4 h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                        </motion.button>
                                      );
                                    })}
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Recent Posts Dropdown */}
                      <AnimatePresence>
                        {showRecentPosts && recentPosts.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <Card className="border-2 border-border-default/50 bg-bg-default mb-6">
                              <CardContent className="p-6">
                                <div className="space-y-3">
                                  <p className="text-sm font-bold text-fg-default mb-4">Recent analyses:</p>
                                  {recentPosts.map((post, idx) => (
                                    <button
                                      key={post.id}
                                      type="button"
                                      onClick={() => handleUseRecentPost(post)}
                                      className="w-full text-left p-4 rounded-xl border-2 border-border-default/50 hover:border-teal-600/50 hover:bg-teal-500/5 transition-all"
                                    >
                                      <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-muted-foreground">
                                          {new Date(post.createdAt).toLocaleDateString()}
                                        </span>
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                      </div>
                                      <p className="text-sm text-fg-default line-clamp-2">{post.text.substring(0, 120)}...</p>
                                    </button>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Text Input Area */}
                      <FormField
                        control={form.control}
                        name="postText"
                        render={({ field }) => (
                          <FormItem className="relative group">
                            <FormControl>
                              <div className="relative w-full">
                                <Textarea
                                  ref={textareaRef}
                                  placeholder="What's on your mind? Paste or type your LinkedIn post here..."
                                  className="w-full min-h-[300px] max-h-[600px] resize-y border-border-default/50 bg-bg-canvas/30 hover:bg-bg-canvas/50 focus:bg-bg-canvas/80 pl-6 pr-6 py-6 text-lg leading-relaxed focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500/50 rounded-2xl transition-all placeholder:text-muted-foreground/40 shadow-inner"
                                  {...field}
                                />
                                {/* Character counter overlay */}
                                <div className="absolute bottom-4 right-4 flex items-center gap-2">
                                  <div className={`px-2.5 py-1 rounded-md bg-bg-surface/80 backdrop-blur-sm border border-border-default/50 text-xs font-mono font-medium ${getCharacterCountColor()}`}>
                                    {watchText?.length || 0} / 5000
                                  </div>
                                </div>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Validation Tips */}
                      {watchText && watchText.length > 0 && (
                        <AnimatePresence>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                            {watchText.length < 50 && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="flex items-center gap-2 p-3 rounded-lg bg-rose-500/5 border border-rose-500/20 text-xs text-rose-600"
                              >
                                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                                <span>Post too short for analysis (min 50 chars).</span>
                              </motion.div>
                            )}
                            {hashtagCount === 0 && watchText.length >= 50 && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="flex items-center gap-2 p-3 rounded-lg bg-teal-500/5 border border-teal-500/20 text-xs text-teal-600"
                              >
                                <Info className="h-4 w-4 flex-shrink-0" />
                                <span>Tip: Add 3-5 hashtags for reach.</span>
                              </motion.div>
                            )}
                          </div>
                        </AnimatePresence>
                      )}

                      {/* Submit Button */}
                      <div className="pt-4">
                        <Button
                          type="submit"
                          disabled={isLoading || !watchText || watchText.length < 50}
                          className="w-full relative h-14 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-base shadow-lg shadow-teal-500/20 disabled:opacity-50 disabled:shadow-none transition-all"
                        >
                          {isLoading ? (
                            <div className="flex items-center gap-2">
                              <Loader2 className="h-5 w-5 animate-spin" />
                              <span>Analyzing Intelligence...</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Sparkles className="h-5 w-5" />
                              <span>Run Deep Analysis</span>
                            </div>
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Results / Skeleton */}
          <motion.div
            ref={resultsRef}
            id="analysis-results"
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              ...(analysisResult && !isLoading ? {
                scale: [1, 1.02, 1],
                transition: { duration: 0.5, delay: 0.3 }
              } : {})
            }}
            transition={{ delay: 0.3 }}
            className="scroll-mt-8 relative"
          >
            <AnimatePresence mode="wait">
              {isLoading && (
                <motion.div
                  key="skeleton"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <ResultSkeleton />
                </motion.div>
              )}

              {!isLoading && analysisResult && (
                <motion.div
                  key="result"
                  className="space-y-8"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, type: 'spring' }}
                >
                  {/* Enhanced Score Panel with Metrics */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Score Card */}
                    <Card className="lg:col-span-2 border-border-default/40 bg-gradient-to-br from-bg-default/40 via-bg-default/30 to-bg-default/40 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden border-2 border-teal-500/20 relative">
                      {/* Decorative elements */}
                      <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl -mr-32 -mt-32" />
                      <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-400/5 rounded-full blur-2xl -ml-24 -mb-24" />

                      <CardContent className="p-8 relative z-10">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                          <div className="relative">
                            <ViralityScoreDisplay score={analysisResult.viralityScore.score} />
                            {/* Score badge */}
                            <div className="absolute -top-2 -right-2">
                              <Badge variant="subtle" className="bg-teal-500/20 text-teal-600 border-teal-500/30 text-xs font-bold">
                                {analysisResult.viralityScore.score >= 80 ? 'EXCELLENT' :
                                  analysisResult.viralityScore.score >= 60 ? 'GOOD' :
                                    analysisResult.viralityScore.score >= 40 ? 'FAIR' : 'NEEDS WORK'}
                              </Badge>
                            </div>
                          </div>
                          <div className="space-y-4 text-center md:text-left flex-1">
                            <div className="flex items-center gap-3 justify-center md:justify-start">
                              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-teal-500/20 to-cyan-400/20 flex items-center justify-center border border-teal-500/30">
                                <Microscope className="h-5 w-5 text-teal-600" />
                              </div>
                              <div>
                                <h3 className="font-headline text-2xl font-bold tracking-tight">AI Verdict</h3>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider">Comprehensive Analysis</p>
                              </div>
                            </div>
                            <p className="text-lg text-fg-muted font-medium leading-relaxed italic">
                              "{analysisResult.viralityScore.explanation}"
                            </p>

                            <div className="flex flex-wrap items-center gap-3 pt-2">
                              {resultId && (
                                <Button
                                  onClick={handleShare}
                                  variant="secondary"
                                  size="sm"
                                  className="rounded-full bg-teal-500/10 text-teal-600 hover:bg-teal-500/20 border border-teal-600/20"
                                >
                                  {isCopied ? <ClipboardCheck className="mr-2 h-4 w-4" /> : <Share2 className="mr-2 h-4 w-4" />}
                                  {isCopied ? 'Copied' : 'Share'}
                                </Button>
                              )}
                              <Button
                                onClick={handleExportPDF}
                                variant="outline"
                                size="sm"
                                className="rounded-full border-border-default/50"
                              >
                                <FileDown className="mr-2 h-4 w-4" />
                                Export
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Quick Stats Card */}
                    <Card className="border-border-default/40 bg-gradient-to-br from-bg-default/40 to-bg-default/30 backdrop-blur-xl shadow-xl rounded-3xl overflow-hidden border-2 border-teal-500/10">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                          <Activity className="h-5 w-5 text-teal-600" />
                          Quick Stats
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Engagement Score */}
                        <div className="p-4 rounded-xl bg-gradient-to-br from-teal-500/10 to-cyan-400/5 border border-teal-500/20">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Engagement</span>
                            <span className="text-lg font-black text-teal-600">{engagementScore}%</span>
                          </div>
                          <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${engagementScore}%` }}
                              transition={{ duration: 1, delay: 0.5 }}
                              className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full"
                            />
                          </div>
                        </div>

                        {/* Breakdown Scores */}
                        <div className="space-y-3">
                          {analysisItems.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border-default/20">
                              <div className="flex items-center gap-2">
                                <item.icon className={`h-4 w-4 ${item.color}`} />
                                <span className="text-sm font-medium text-fg-default">{item.title}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="h-1.5 w-16 bg-muted/30 rounded-full overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${item.score}%` }}
                                    transition={{ duration: 0.8, delay: 0.7 + idx * 0.1 }}
                                    className={`h-full ${item.color.replace('text-', 'bg-')}`}
                                  />
                                </div>
                                <span className="text-sm font-bold tabular-nums w-10 text-right">{item.score}%</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Industry Benchmark */}
                        <div className="pt-3 border-t border-border-default/20">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Industry Avg</span>
                            <span className="font-bold text-fg-default">65%</span>
                          </div>
                          <div className="mt-2 h-1 bg-muted/30 rounded-full overflow-hidden">
                            <div className="h-full w-[65%] bg-muted-foreground/30 rounded-full" />
                          </div>
                          <div className="mt-2 flex items-center gap-1 text-xs">
                            {analysisResult.viralityScore.score > 65 ? (
                              <>
                                <TrendingUp className="h-3 w-3 text-emerald-500" />
                                <span className="text-emerald-600 font-semibold">
                                  {analysisResult.viralityScore.score - 65}% above average
                                </span>
                              </>
                            ) : (
                              <>
                                <TrendingDown className="h-3 w-3 text-amber-500" />
                                <span className="text-amber-600 font-semibold">
                                  {65 - analysisResult.viralityScore.score}% below average
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Enhanced Detailed Breakdown */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-3xl font-black tracking-tight text-fg-default mb-2">Detailed Analysis</h2>
                        <p className="text-muted-foreground">Comprehensive breakdown of your post's performance factors</p>
                      </div>
                      <Badge variant="subtle" className="text-xs font-bold uppercase tracking-wider bg-teal-500/10 text-teal-600 border-teal-500/20">
                        {analysisItems.length} Categories
                      </Badge>
                    </div>

                    <Accordion type="single" collapsible value={expandedSection ?? ''} onValueChange={(value) => setExpandedSection(value ? String(value) : null)} className="space-y-4 border-none">
                      {analysisItems.map((item, idx) => {
                        const itemValue = item.title;
                        return (
                          <motion.div
                            key={itemValue}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + idx * 0.1 }}
                            className="border-2 border-border-default/30 bg-gradient-to-br from-bg-default/60 to-bg-default/40 rounded-2xl px-6 backdrop-blur-sm overflow-hidden shadow-lg hover:shadow-xl transition-all hover:border-teal-500/30"
                          >
                            <AccordionItem
                              value={itemValue}
                            >
                              <AccordionTrigger className="hover:no-underline py-6 group">
                                <div className="flex items-center gap-4 w-full">
                                  <div className={`p-3 rounded-xl bg-gradient-to-br from-bg-default/80 to-bg-default/60 shadow-md border-2 border-border-default/20 group-hover:scale-110 transition-transform ${item.color.replace('text-', 'border-')}`}>
                                    <item.icon className={`h-6 w-6 ${item.color}`} />
                                  </div>
                                  <div className="flex-1 text-left">
                                    <div className="flex items-center gap-3 mb-1">
                                      <span className="font-headline font-bold text-xl text-fg-default">{item.title}</span>
                                      <Badge variant="subtle" className={`text-xs font-bold ${item.color}`}>
                                        {item.score >= 80 ? 'Excellent' :
                                          item.score >= 60 ? 'Good' :
                                            item.score >= 40 ? 'Fair' : 'Needs Work'}
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                      {item.title === 'Hook' && 'Opening impact and attention-grabbing power'}
                                      {item.title === 'Structure' && 'Content organization and readability'}
                                      {item.title === 'Call to Action (CTA)' && 'Engagement-driving elements'}
                                      {item.title === 'Hashtags' && 'Discoverability and reach potential'}
                                      {item.title === 'Engagement' && 'Triggers and patterns that drive interaction'}
                                      {item.title === 'Storytelling' && 'Narrative structure and story elements'}
                                      {item.title === 'Sentiment' && 'Emotional tone and sentiment analysis'}
                                      {item.title === 'Topics' && 'Subject matter and keyword extraction'}
                                      {item.title === 'Readability' && 'Text complexity and reading ease'}
                                    </p>
                                  </div>
                                  <div className="ml-auto flex items-center gap-4">
                                    <div className="hidden sm:flex flex-col items-end gap-1">
                                      <div className="h-2 w-32 bg-muted/30 rounded-full overflow-hidden">
                                        <motion.div
                                          className={`h-full bg-gradient-to-r ${item.color.replace('text-', 'from-')} ${item.color.replace('text-', 'to-')}`}
                                          initial={{ width: 0 }}
                                          animate={{ width: `${item.score}%` }}
                                          transition={{ duration: 1, delay: 0.5 + idx * 0.1 }}
                                        />
                                      </div>
                                      <span className="text-xs text-muted-foreground">Score</span>
                                    </div>
                                    <div className="text-right">
                                      <span className="text-3xl font-black tabular-nums block leading-none">{item.score}</span>
                                      <span className="text-xs text-muted-foreground">/100</span>
                                    </div>
                                  </div>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="pb-8 pt-4 space-y-8 border-t-2 border-border-default/20">
                                {'patterns' in item.analysis && item.analysis.patterns.length > 0 && (
                                  <div>
                                    <div className="flex items-center justify-between mb-4">
                                      <h4 className="text-sm font-black uppercase tracking-wider text-fg-default flex items-center gap-2">
                                        <Sparkles className="h-4 w-4 text-teal-600" />
                                        Detected Patterns
                                      </h4>
                                      <Badge variant="subtle" className="text-xs bg-teal-500/10 text-teal-600">
                                        {item.analysis.patterns.length} found
                                      </Badge>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                      {item.analysis.patterns.map((s: string, i: number) => (
                                        <motion.div
                                          key={i}
                                          initial={{ opacity: 0, scale: 0.95 }}
                                          animate={{ opacity: 1, scale: 1 }}
                                          transition={{ delay: i * 0.05 }}
                                          className="group relative p-4 rounded-xl bg-gradient-to-br from-bg-default/80 to-bg-default/60 border-2 border-border-default/20 hover:border-teal-500/30 transition-all shadow-md hover:shadow-lg"
                                        >
                                          <div className="flex items-start gap-3">
                                            <div className="h-6 w-6 rounded-lg bg-teal-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                              <Check className="h-3 w-3 text-teal-600" />
                                            </div>
                                            <p className="text-sm font-medium text-fg-default leading-relaxed">{s}</p>
                                          </div>
                                        </motion.div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Handle different analysis types */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  {/* Issues (for hashtags) */}
                                  {'issues' in item.analysis && item.analysis.issues.length > 0 && (
                                    <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-500/10 via-rose-500/5 to-transparent border-2 border-rose-500/20">
                                      <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-sm font-black uppercase tracking-wider text-rose-600 flex items-center gap-2">
                                          <AlertCircle className="h-4 w-4" />
                                          Areas to Improve
                                        </h4>
                                        <Badge variant="subtle" className="text-xs bg-rose-500/20 text-rose-700 border-rose-500/30">
                                          {item.analysis.issues.length}
                                        </Badge>
                                      </div>
                                      <ul className="space-y-3">
                                        {item.analysis.issues.map((s: string, i: number) => (
                                          <motion.li
                                            key={i}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="flex items-start gap-3 p-3 rounded-xl bg-bg-default/50 border border-rose-500/10 hover:border-rose-500/20 transition-colors"
                                          >
                                            <div className="h-5 w-5 rounded-full bg-rose-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                              <X className="h-3 w-3 text-rose-600" />
                                            </div>
                                            <span className="text-sm font-medium text-rose-700 dark:text-rose-300 leading-relaxed">{s}</span>
                                          </motion.li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}

                                  {/* Recommendations (for hashtags) */}
                                  {'recommendations' in item.analysis && item.analysis.recommendations.length > 0 && (
                                    <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border-2 border-emerald-500/20">
                                      <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-sm font-black uppercase tracking-wider text-emerald-600 flex items-center gap-2">
                                          <Lightbulb className="h-4 w-4" />
                                          Recommendations
                                        </h4>
                                        <Badge variant="subtle" className="text-xs bg-emerald-500/20 text-emerald-700 border-emerald-500/30">
                                          {item.analysis.recommendations.length}
                                        </Badge>
                                      </div>
                                      <ul className="space-y-3">
                                        {item.analysis.recommendations.map((s: string, i: number) => (
                                          <motion.li
                                            key={i}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="flex items-start gap-3 p-3 rounded-xl bg-bg-default/50 border border-emerald-500/10 hover:border-emerald-500/20 transition-colors group"
                                          >
                                            <div className="h-5 w-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                                              <Check className="h-3 w-3 text-emerald-600" />
                                            </div>
                                            <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300 leading-relaxed">{s}</span>
                                          </motion.li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}

                                  {/* Suggestions (for hook, CTA, sentiment, topics, readability, storytelling, engagement) */}
                                  {'suggestions' in item.analysis && item.analysis.suggestions.length > 0 && (
                                    <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border-2 border-emerald-500/20">
                                      <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-sm font-black uppercase tracking-wider text-emerald-600 flex items-center gap-2">
                                          <Lightbulb className="h-4 w-4" />
                                          Suggestions
                                        </h4>
                                        <Badge variant="subtle" className="text-xs bg-emerald-500/20 text-emerald-700 border-emerald-500/30">
                                          {item.analysis.suggestions.length}
                                        </Badge>
                                      </div>
                                      <ul className="space-y-3">
                                        {item.analysis.suggestions.map((s: string, i: number) => (
                                          <motion.li
                                            key={i}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="flex items-start gap-3 p-3 rounded-xl bg-bg-default/50 border border-emerald-500/10 hover:border-emerald-500/20 transition-colors group"
                                          >
                                            <div className="h-5 w-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                                              <Check className="h-3 w-3 text-emerald-600" />
                                            </div>
                                            <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300 leading-relaxed">{s}</span>
                                          </motion.li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}

                                  {/* Insights (for sentiment, topics, readability, storytelling, engagement) */}
                                  {'insights' in item.analysis && item.analysis.insights.length > 0 && (
                                    <div className="p-5 rounded-2xl bg-gradient-to-br from-teal-500/10 via-blue-500/5 to-transparent border-2 border-teal-500/20">
                                      <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-sm font-black uppercase tracking-wider text-teal-600 flex items-center gap-2">
                                          <Info className="h-4 w-4" />
                                          Insights
                                        </h4>
                                        <Badge variant="subtle" className="text-xs bg-teal-500/20 text-teal-700 border-teal-500/30">
                                          {item.analysis.insights.length}
                                        </Badge>
                                      </div>
                                      <ul className="space-y-3">
                                        {item.analysis.insights.map((s: string, i: number) => (
                                          <motion.li
                                            key={i}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="flex items-start gap-3 p-3 rounded-xl bg-bg-default/50 border border-teal-500/10 hover:border-teal-500/20 transition-colors"
                                          >
                                            <div className="h-5 w-5 rounded-full bg-teal-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                              <Info className="h-3 w-3 text-teal-600" />
                                            </div>
                                            <span className="text-sm font-medium text-teal-700 dark:text-teal-300 leading-relaxed">{s}</span>
                                          </motion.li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}

                                  {/* Detected Tones (for sentiment) */}
                                  {'detectedTones' in item.analysis && item.analysis.detectedTones.length > 0 && (
                                    <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-purple-500/5 to-transparent border-2 border-emerald-500/20">
                                      <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-sm font-black uppercase tracking-wider text-emerald-600 flex items-center gap-2">
                                          <Sparkles className="h-4 w-4" />
                                          Detected Tones
                                        </h4>
                                        <Badge variant="subtle" className="text-xs bg-emerald-500/20 text-emerald-700 border-emerald-500/30">
                                          {item.analysis.detectedTones.length}
                                        </Badge>
                                      </div>
                                      <div className="flex flex-wrap gap-2">
                                        {item.analysis.detectedTones.map((tone: string, i: number) => (
                                          <motion.div
                                            key={i}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: i * 0.05 }}
                                          >
                                            <Badge variant="subtle" className="bg-emerald-500/20 text-emerald-700 border-emerald-500/30">
                                              {tone.replace(/_/g, ' ')}
                                            </Badge>
                                          </motion.div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* Detected Topics (for topics) */}
                                  {'detectedTopics' in item.analysis && item.analysis.detectedTopics.length > 0 && (
                                    <div className="p-5 rounded-2xl bg-gradient-to-br from-teal-500/10 via-indigo-500/5 to-transparent border-2 border-teal-500/20">
                                      <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-sm font-black uppercase tracking-wider text-teal-600 flex items-center gap-2">
                                          <Search className="h-4 w-4" />
                                          Topics Detected
                                        </h4>
                                        <Badge variant="subtle" className="text-xs bg-teal-500/20 text-teal-700 border-teal-500/30">
                                          {item.analysis.detectedTopics.length}
                                        </Badge>
                                      </div>
                                      <div className="flex flex-wrap gap-2">
                                        {item.analysis.detectedTopics.map((topic: string, i: number) => (
                                          <motion.div
                                            key={i}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: i * 0.05 }}
                                          >
                                            <Badge variant="subtle" className="bg-teal-500/20 text-teal-700 border-teal-500/30">
                                              {topic.replace(/_/g, ' ')}
                                            </Badge>
                                          </motion.div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* Top Keywords (for topics) */}
                                  {'topKeywords' in item.analysis && item.analysis.topKeywords.length > 0 && (
                                    <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-500/10 via-cyan-500/5 to-transparent border-2 border-cyan-500/20">
                                      <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-sm font-black uppercase tracking-wider text-cyan-600 flex items-center gap-2">
                                          <Hash className="h-4 w-4" />
                                          Top Keywords
                                        </h4>
                                        <Badge variant="subtle" className="text-xs bg-cyan-500/20 text-cyan-700 border-cyan-500/30">
                                          {item.analysis.topKeywords.length}
                                        </Badge>
                                      </div>
                                      <div className="flex flex-wrap gap-2">
                                        {item.analysis.topKeywords.slice(0, 10).map((keyword: string, i: number) => (
                                          <motion.div
                                            key={i}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: i * 0.05 }}
                                          >
                                            <Badge variant="subtle" className="bg-cyan-500/20 text-cyan-700 border-cyan-500/30">
                                              {keyword}
                                            </Badge>
                                          </motion.div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* Detected Elements (for storytelling) */}
                                  {'detectedElements' in item.analysis && item.analysis.detectedElements.length > 0 && (
                                    <div className="p-5 rounded-2xl bg-gradient-to-br from-teal-500/10 via-indigo-500/5 to-transparent border-2 border-teal-500/20">
                                      <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-sm font-black uppercase tracking-wider text-teal-600 flex items-center gap-2">
                                          <Scroll className="h-4 w-4" />
                                          Story Elements
                                        </h4>
                                        <Badge variant="subtle" className="text-xs bg-teal-500/20 text-teal-700 border-teal-500/30">
                                          {item.analysis.detectedElements.length}
                                        </Badge>
                                      </div>
                                      <div className="flex flex-wrap gap-2">
                                        {item.analysis.detectedElements.map((element: string, i: number) => (
                                          <motion.div
                                            key={i}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: i * 0.05 }}
                                          >
                                            <Badge variant="subtle" className="bg-teal-500/20 text-teal-700 border-teal-500/30">
                                              {element.replace(/_/g, ' ')}
                                            </Badge>
                                          </motion.div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* Detected Triggers (for engagement) */}
                                  {'detectedTriggers' in item.analysis && item.analysis.detectedTriggers.length > 0 && (
                                    <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-purple-500/5 to-transparent border-2 border-emerald-500/20">
                                      <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-sm font-black uppercase tracking-wider text-emerald-600 flex items-center gap-2">
                                          <Zap className="h-4 w-4" />
                                          Engagement Triggers
                                        </h4>
                                        <Badge variant="subtle" className="text-xs bg-emerald-500/20 text-emerald-700 border-emerald-500/30">
                                          {item.analysis.detectedTriggers.length}
                                        </Badge>
                                      </div>
                                      <div className="flex flex-wrap gap-2">
                                        {item.analysis.detectedTriggers.map((trigger: string, i: number) => (
                                          <motion.div
                                            key={i}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: i * 0.05 }}
                                          >
                                            <Badge variant="subtle" className="bg-emerald-500/20 text-emerald-700 border-emerald-500/30">
                                              {trigger.replace(/_/g, ' ')}
                                            </Badge>
                                          </motion.div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* Problems and Fixes (for structure) */}
                                  {'problems' in item.analysis && item.analysis.problems.length > 0 && (
                                    <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-500/10 via-rose-500/5 to-transparent border-2 border-rose-500/20">
                                      <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-sm font-black uppercase tracking-wider text-rose-600 flex items-center gap-2">
                                          <AlertCircle className="h-4 w-4" />
                                          Problems
                                        </h4>
                                        <Badge variant="subtle" className="text-xs bg-rose-500/20 text-rose-700 border-rose-500/30">
                                          {item.analysis.problems.length}
                                        </Badge>
                                      </div>
                                      <ul className="space-y-3">
                                        {item.analysis.problems.map((s: string, i: number) => (
                                          <motion.li
                                            key={i}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="flex items-start gap-3 p-3 rounded-xl bg-bg-default/50 border border-rose-500/10 hover:border-rose-500/20 transition-colors"
                                          >
                                            <div className="h-5 w-5 rounded-full bg-rose-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                              <X className="h-3 w-3 text-rose-600" />
                                            </div>
                                            <span className="text-sm font-medium text-rose-700 dark:text-rose-300 leading-relaxed">{s}</span>
                                          </motion.li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}

                                  {'fixes' in item.analysis && item.analysis.fixes.length > 0 && (
                                    <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border-2 border-emerald-500/20">
                                      <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-sm font-black uppercase tracking-wider text-emerald-600 flex items-center gap-2">
                                          <CheckCircle2 className="h-4 w-4" />
                                          Fixes
                                        </h4>
                                        <Badge variant="subtle" className="text-xs bg-emerald-500/20 text-emerald-700 border-emerald-500/30">
                                          {item.analysis.fixes.length}
                                        </Badge>
                                      </div>
                                      <ul className="space-y-3">
                                        {item.analysis.fixes.map((s: string, i: number) => (
                                          <motion.li
                                            key={i}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="flex items-start gap-3 p-3 rounded-xl bg-bg-default/50 border border-emerald-500/10 hover:border-emerald-500/20 transition-colors group"
                                          >
                                            <div className="h-5 w-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                                              <Check className="h-3 w-3 text-emerald-600" />
                                            </div>
                                            <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300 leading-relaxed">{s}</span>
                                          </motion.li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </motion.div>
                        );
                      })}
                    </Accordion>
                  </div>

                  {/* Enhanced Rewrite Strategy Card */}
                  <Card className="border-2 border-border-default/40 bg-gradient-to-br from-bg-default/40 via-bg-default/30 to-bg-default/40 shadow-2xl rounded-3xl overflow-hidden relative">
                    {/* Decorative background */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl -mr-48 -mt-48" />

                    <CardHeader className="bg-gradient-to-r from-teal-500/10 via-cyan-400/5 to-teal-500/10 border-b-2 border-border-default/20 px-8 py-6 relative z-10">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-3 text-3xl font-black tracking-tight mb-2">
                            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-teal-600 to-cyan-600 flex items-center justify-center text-white shadow-lg">
                              <Waypoints className="h-6 w-6" />
                            </div>
                            Blueprint for Success
                          </CardTitle>
                          <CardDescription className="text-base font-medium">AI-powered templates and actionable steps to maximize your post's impact</CardDescription>
                        </div>
                        <Badge variant="subtle" className="text-xs font-bold uppercase tracking-wider bg-teal-500/20 text-teal-600 border-teal-500/30">
                          <Sparkles className="h-3 w-3 mr-1" />
                          AI Generated
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                      <div className="space-y-8">
                        <div>
                          <div className="flex items-center justify-between mb-5">
                            <h3 className="text-base font-black uppercase tracking-tighter text-fg-default flex items-center gap-2">
                              <Rocket className="h-4 w-4 text-teal-600" />
                              Elite Hook Templates
                            </h3>
                            <Badge variant="subtle" className="text-xs bg-teal-500/10 text-teal-600">
                              {analysisResult.rewriteStrategy.hookExamples.length} examples
                            </Badge>
                          </div>
                          <div className="space-y-4">
                            {analysisResult.rewriteStrategy.hookExamples.map((ex, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="group relative p-5 pl-10 rounded-2xl bg-gradient-to-br from-bg-default/80 to-bg-default/60 border-2 border-border-default/20 hover:border-teal-500/30 transition-all shadow-md hover:shadow-lg"
                              >
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-1 bg-gradient-to-b from-teal-500 to-cyan-400 rounded-full group-hover:scale-y-110 transition-transform" />
                                <div className="flex items-start justify-between gap-3">
                                  <p className="text-sm font-bold italic tracking-tight leading-relaxed flex-1">"{ex}"</p>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleCopyText(ex, 'Hook template')}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                                  >
                                    {copiedText === ex ? (
                                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                    ) : (
                                      <Copy className="h-4 w-4" />
                                    )}
                                  </Button>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-5">
                            <h3 className="text-base font-black uppercase tracking-tighter text-fg-default flex items-center gap-2">
                              <Megaphone className="h-4 w-4 text-emerald-600" />
                              Power CTA Variants
                            </h3>
                            <Badge variant="subtle" className="text-xs bg-emerald-500/10 text-emerald-600">
                              {analysisResult.rewriteStrategy.ctaExamples.length} examples
                            </Badge>
                          </div>
                          <div className="space-y-4">
                            {analysisResult.rewriteStrategy.ctaExamples.map((ex, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="group relative p-5 pl-10 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-2 border-emerald-500/20 hover:border-emerald-500/40 transition-all shadow-md hover:shadow-lg"
                              >
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-1 bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-full group-hover:scale-y-110 transition-transform" />
                                <div className="flex items-start justify-between gap-3">
                                  <p className="text-sm font-bold italic tracking-tight leading-relaxed flex-1">"{ex}"</p>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleCopyText(ex, 'CTA template')}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                                  >
                                    {copiedText === ex ? (
                                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                    ) : (
                                      <Copy className="h-4 w-4" />
                                    )}
                                  </Button>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-teal-500/[0.08] via-cyan-400/[0.04] to-teal-500/[0.08] rounded-3xl p-8 border-2 border-teal-500/20 shadow-lg relative overflow-hidden">
                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl -mr-16 -mt-16" />

                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-6">
                            <h3 className="text-base font-black uppercase tracking-tighter text-teal-600 flex items-center gap-2">
                              <CheckCircle2 className="h-5 w-5" />
                              Perfection Checklist
                            </h3>
                            <Badge variant="subtle" className="text-xs bg-emerald-500/20 text-emerald-700 border-emerald-500/30">
                              {analysisResult.rewriteStrategy.structureChecklist.length} items
                            </Badge>
                          </div>
                          <ul className="space-y-4">
                            {analysisResult.rewriteStrategy.structureChecklist.map((item, i) => (
                              <motion.li
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="flex items-start gap-4 group p-3 rounded-xl bg-bg-default/50 border border-emerald-500/10 hover:border-emerald-500/30 transition-all"
                              >
                                <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform border border-emerald-500/20">
                                  <Check className="h-4 w-4 text-emerald-600" />
                                </div>
                                <span className="text-sm font-semibold text-fg-default leading-relaxed pt-0.5">{item}</span>
                              </motion.li>
                            ))}
                          </ul>

                          <div className="mt-8 pt-6 border-t-2 border-teal-500/20">
                            <div className="text-center space-y-2">
                              <p className="text-xs font-black uppercase tracking-[0.3em] text-teal-600/80">Ready to go viral?</p>
                              <p className="text-xs text-muted-foreground">Apply these improvements to maximize your reach</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {!analysisResult && !isLoading && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center text-center p-16 space-y-8 border-2 border-dashed border-border-default/20 rounded-3xl opacity-60"
                >
                  <div className="h-28 w-28 rounded-full bg-muted/10 flex items-center justify-center">
                    <FileText className="h-14 w-14 text-muted-foreground" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-3xl font-bold tracking-tight">No analysis yet</h3>
                    <p className="text-lg text-fg-muted max-w-md">Enter your post content above to generate real-time performance insights.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
