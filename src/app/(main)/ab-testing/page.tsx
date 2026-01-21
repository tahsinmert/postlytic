'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Loader2,
  TestTube,
  Sparkles,
  Copy,
  CheckCircle2,
  ArrowRight,
  Lightbulb,
  Target,
  Hash,
  Zap,
  FileText,
  RefreshCw,
  TrendingUp,
  Eye,
  BarChart3,
  AlertCircle,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PostVariation {
  id: string;
  type: 'hook' | 'cta' | 'hashtag';
  version: string;
  description: string;
  expectedEngagement: number;
  strengths: string[];
  useCase: string;
}

interface ABTestVariation {
  id: string;
  name: string;
  content: string;
  hook: string;
  cta: string;
  hashtags: string[];
  expectedEngagement: number;
  strengths: string[];
  weaknesses: string[];
}

const HOOK_VARIATIONS = [
  {
    type: 'question',
    examples: [
      'Have you ever wondered why some LinkedIn posts get thousands of likes while others barely get noticed?',
      'What if I told you there\'s a simple way to triple your LinkedIn engagement?',
      'Why do 90% of LinkedIn posts fail to generate meaningful engagement?',
    ],
    description: 'Questions hook readers by creating curiosity and encouraging them to read further.',
    expectedEngagement: 85,
    strengths: ['Creates curiosity', 'Encourages engagement', 'High click-through rate'],
    useCase: 'Best for educational content and thought leadership',
  },
  {
    type: 'statistic',
    examples: [
      '87% of professionals say LinkedIn is their primary platform for B2B networking.',
      'LinkedIn posts with images get 2x more engagement than text-only posts.',
      'The average LinkedIn user spends 17 minutes per day on the platform.',
    ],
    description: 'Statistics provide credibility and make your post stand out with data-driven insights.',
    expectedEngagement: 82,
    strengths: ['Builds credibility', 'Data-driven', 'Shareable content'],
    useCase: 'Perfect for industry insights and data-driven content',
  },
  {
    type: 'story',
    examples: [
      'Last week, I made a mistake that cost me 10,000 followers. Here\'s what I learned...',
      'Three years ago, I was struggling to get 50 likes on LinkedIn. Today, I have 100K followers. Here\'s my story.',
      'I almost gave up on LinkedIn. Then I discovered this one strategy that changed everything.',
    ],
    description: 'Stories create emotional connection and make your content relatable and memorable.',
    expectedEngagement: 88,
    strengths: ['Emotional connection', 'Relatable', 'Memorable'],
    useCase: 'Ideal for personal branding and authentic storytelling',
  },
  {
    type: 'bold-statement',
    examples: [
      'Most LinkedIn advice is wrong. Here\'s what actually works.',
      'Stop posting on LinkedIn if you\'re not doing this one thing.',
      'I\'m going to share the LinkedIn strategy that nobody talks about.',
    ],
    description: 'Bold statements grab attention and position you as a thought leader.',
    expectedEngagement: 90,
    strengths: ['Attention-grabbing', 'Thought leadership', 'High engagement'],
    useCase: 'Great for controversial takes and expert positioning',
  },
];

const CTA_VARIATIONS = [
  {
    type: 'question',
    examples: [
      'What\'s your experience with this? Share your thoughts in the comments below.',
      'Have you tried this approach? Let me know what worked for you.',
      'What would you add to this list? I\'d love to hear your perspective.',
    ],
    description: 'Questions encourage comments and create a two-way conversation.',
    expectedEngagement: 78,
    strengths: ['Encourages comments', 'Creates dialogue', 'Builds community'],
    useCase: 'Best for discussion-driven content',
  },
  {
    type: 'action',
    examples: [
      'Save this post for later and share it with your network.',
      'Follow me for more insights on [topic].',
      'Try this strategy and let me know how it works for you.',
    ],
    description: 'Direct action CTAs guide readers on what to do next.',
    expectedEngagement: 72,
    strengths: ['Clear direction', 'Drives specific actions', 'Measurable results'],
    useCase: 'Perfect for actionable content and lead generation',
  },
  {
    type: 'value',
    examples: [
      'If you found this helpful, repost it to help others in your network.',
      'This took me 3 years to learn. Save it so you don\'t have to.',
      'Bookmark this post - you\'ll want to reference it later.',
    ],
    description: 'Value-focused CTAs emphasize the benefit to the reader.',
    expectedEngagement: 75,
    strengths: ['Reader-focused', 'Builds trust', 'Encourages saves'],
    useCase: 'Great for educational and resource content',
  },
  {
    type: 'soft',
    examples: [
      'Thoughts?',
      'What do you think?',
      'Agree or disagree?',
    ],
    description: 'Soft CTAs are subtle and don\'t feel pushy, creating a natural conversation.',
    expectedEngagement: 70,
    strengths: ['Non-intrusive', 'Natural', 'Conversational'],
    useCase: 'Ideal for opinion pieces and casual content',
  },
];

const HASHTAG_STRATEGIES = [
  {
    name: 'Broad + Niche Mix',
    description: 'Combine broad industry hashtags with niche-specific ones for maximum reach.',
    examples: [
      ['#LinkedIn', '#Marketing', '#ContentStrategy', '#B2BMarketing', '#DigitalMarketing'],
      ['#Leadership', '#Business', '#Management', '#ExecutiveCoaching', '#TeamBuilding'],
      ['#Entrepreneurship', '#Startup', '#Business', '#Innovation', '#Growth'],
    ],
    expectedEngagement: 80,
    strengths: ['Balanced reach', 'Targeted audience', 'Discoverable'],
  },
  {
    name: 'Trending + Evergreen',
    description: 'Mix trending hashtags with evergreen ones to capture both current and long-term visibility.',
    examples: [
      ['#AI', '#Technology', '#FutureOfWork', '#Innovation', '#TechTrends'],
      ['#RemoteWork', '#WorkLifeBalance', '#Productivity', '#Career', '#ProfessionalDevelopment'],
      ['#Sustainability', '#ESG', '#GreenBusiness', '#CorporateResponsibility', '#ClimateAction'],
    ],
    expectedEngagement: 85,
    strengths: ['Current relevance', 'Long-term value', 'High visibility'],
  },
  {
    name: 'Community-Focused',
    description: 'Use hashtags that connect you with specific communities and conversations.',
    examples: [
      ['#LinkedInTips', '#LinkedInStrategy', '#LinkedInGrowth', '#LinkedInMarketing', '#LinkedInContent'],
      ['#WomenInBusiness', '#DiversityAndInclusion', '#WomenLeaders', '#Empowerment', '#Leadership'],
      ['#SaaS', '#SaaSMarketing', '#SaaSGrowth', '#B2BSaaS', '#SaaSFounders'],
    ],
    expectedEngagement: 82,
    strengths: ['Community connection', 'Targeted audience', 'Engaged followers'],
  },
  {
    name: 'Minimal & Focused',
    description: 'Use fewer, highly relevant hashtags for a cleaner look and focused reach.',
    examples: [
      ['#Marketing', '#Business', '#Strategy'],
      ['#Leadership', '#Management', '#Growth'],
      ['#Innovation', '#Technology', '#Future'],
    ],
    expectedEngagement: 75,
    strengths: ['Clean appearance', 'Focused reach', 'Professional'],
  },
];

export default function ABTestingPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [postText, setPostText] = useState('');
  const [variations, setVariations] = useState<ABTestVariation[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

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

  const generateVariations = async () => {
    if (!postText.trim()) {
      toast({
        title: 'Post is empty',
        description: 'Please enter a post to generate variations.',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    try {
      // Simulate generation delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      const generatedVariations: ABTestVariation[] = [];

      // Generate variations with different hooks, CTAs, and hashtags
      HOOK_VARIATIONS.slice(0, 2).forEach((hook, hookIndex) => {
        CTA_VARIATIONS.slice(0, 2).forEach((cta, ctaIndex) => {
          HASHTAG_STRATEGIES.slice(0, 2).forEach((hashtagStrategy, hashtagIndex) => {
            const variationId = `var-${hookIndex}-${ctaIndex}-${hashtagIndex}`;
            const hookExample = hook.examples[0];
            const ctaExample = cta.examples[0];
            const hashtags = hashtagStrategy.examples[0];

            // Extract main content (remove existing hook/CTA if present)
            let mainContent = postText;

            // Create variation content
            const variationContent = `${hookExample}\n\n${mainContent}\n\n${ctaExample}\n\n${hashtags.join(' ')}`;

            const expectedEngagement = Math.round(
              (hook.expectedEngagement + cta.expectedEngagement + hashtagStrategy.expectedEngagement) / 3
            );

            generatedVariations.push({
              id: variationId,
              name: `Variation ${generatedVariations.length + 1}`,
              content: variationContent,
              hook: hookExample,
              cta: ctaExample,
              hashtags,
              expectedEngagement,
              strengths: [
                ...hook.strengths.slice(0, 2),
                ...cta.strengths.slice(0, 1),
                ...hashtagStrategy.strengths.slice(0, 1),
              ],
              weaknesses: [
                hookIndex === 0 ? 'May be too direct for some audiences' : 'Requires strong opening',
                ctaIndex === 0 ? 'Could be more specific' : 'Might need stronger call',
              ],
            });
          });
        });
      });

      // Limit to 4 variations
      setVariations(generatedVariations.slice(0, 4));
      toast({
        title: 'Variations generated',
        description: `Created ${generatedVariations.slice(0, 4).length} A/B test variations for your post!`,
      });
    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: 'Generation error',
        description: 'An error occurred while generating variations.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast({
      title: 'Copied!',
      description: 'Post variation copied to clipboard.',
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getEngagementColor = (engagement: number) => {
    if (engagement >= 85) return 'text-emerald-600 dark:text-emerald-400';
    if (engagement >= 75) return 'text-blue-600 dark:text-blue-400';
    if (engagement >= 65) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-orange-600 dark:text-orange-400';
  };

  const getEngagementBadgeColor = (engagement: number) => {
    if (engagement >= 85) return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300';
    if (engagement >= 75) return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
    if (engagement >= 65) return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
    return 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300';
  };

  return (
    <div className="relative min-h-screen bg-bg-canvas pt-24 pb-16 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 right-1/2 translate-x-1/2 w-full max-w-7xl h-96 bg-pink-500/5 rounded-[4rem] blur-[120px] -z-10" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-pink-500/10 px-4 py-1.5 text-xs font-semibold text-pink-600 mb-6">
            <TestTube className="h-3.5 w-3.5" />
            <span>Variation Testing</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-fg-default mb-4">
            A/B Testing Studio
          </h1>
          <p className="text-lg text-fg-muted max-w-2xl mx-auto">
            Generate and test multiple post variations to find your winning formula.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border border-border-default/40 bg-bg-surface/50 backdrop-blur-sm rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <FileText className="h-5 w-5 text-pink-500" />
                  Your Post Content
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={postText}
                  onChange={(e) => {
                    setPostText(e.target.value);
                    setVariations([]);
                  }}
                  placeholder="Enter your LinkedIn post content here. We'll generate variations with different hooks, CTAs, and hashtag combinations..."
                  className="min-h-[300px] resize-none text-base border-border-default/50 bg-bg-canvas/40 focus:bg-bg-canvas/80 rounded-xl"
                />
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    {postText.length} characters • {postText.split(/\s+/).filter(w => w.length > 0).length} words
                  </div>
                  <Button
                    onClick={generateVariations}
                    disabled={!postText.trim() || isGenerating}
                    className="bg-pink-600 hover:bg-pink-500 text-white px-8 rounded-xl h-11"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate Variations
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Generated Variations */}
            {variations.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-fg-default">Generated Variations</h2>
                {variations.map((variation, index) => (
                  <motion.div
                    key={variation.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="border border-border-default/40 bg-bg-surface/30 backdrop-blur-sm hover:border-pink-500/30 hover:shadow-lg transition-all rounded-xl overflow-hidden group">
                      <CardHeader className="pb-3 border-b border-border-default/30 bg-bg-surface/50">
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400">
                              <TestTube className="h-4 w-4" />
                            </span>
                            {variation.name}
                          </CardTitle>
                          <Badge variant="outline" className={getEngagementBadgeColor(variation.expectedEngagement)}>
                            {variation.expectedEngagement}% expected
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4 pt-4">
                        <div className="p-4 bg-bg-canvas/50 rounded-xl border border-border-default/30 text-fg-default/90">
                          <pre className="whitespace-pre-wrap text-sm font-sans leading-relaxed">{variation.content}</pre>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                              <Zap className="h-3.5 w-3.5 text-pink-500" />
                              Strengths
                            </div>
                            <ul className="space-y-1.5">
                              {variation.strengths.map((strength, idx) => (
                                <li key={idx} className="flex items-center gap-2 text-sm text-fg-muted">
                                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                                  {strength}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                              <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                              Considerations
                            </div>
                            <ul className="space-y-1.5">
                              {variation.weaknesses.map((weakness, idx) => (
                                <li key={idx} className="flex items-center gap-2 text-sm text-fg-muted">
                                  <div className="h-1.5 w-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                                  {weakness}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                          <Button
                            onClick={() => copyToClipboard(variation.content, variation.id)}
                            variant="outline"
                            className="flex-1 border-border-default hover:bg-pink-500/5 hover:border-pink-500/20 hover:text-pink-600"
                          >
                            {copiedId === variation.id ? (
                              <>
                                <CheckCircle2 className="h-4 w-4 mr-2 text-emerald-500" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="h-4 w-4 mr-2" />
                                Copy Variation
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {variations.length === 0 && !isGenerating && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <TestTube className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Generate A/B Test Variations</h3>
                <p className="text-muted-foreground">
                  Enter your post content and we'll create multiple variations with different hooks, CTAs, and hashtag combinations.
                </p>
              </motion.div>
            )}
          </div>

          {/* Sidebar - Strategies */}
          <div className="space-y-6">
            <Tabs defaultValue="hooks" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="hooks">Hooks</TabsTrigger>
                <TabsTrigger value="ctas">CTAs</TabsTrigger>
                <TabsTrigger value="hashtags">Hashtags</TabsTrigger>
              </TabsList>

              {/* Hook Variations */}
              <TabsContent value="hooks" className="space-y-4">
                {HOOK_VARIATIONS.map((hook, index) => (
                  <Card key={hook.type} className="border">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base capitalize">{hook.type} Hook</CardTitle>
                        <Badge variant="outline">{hook.expectedEngagement}%</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">{hook.description}</p>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm italic">"{hook.examples[0]}"</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold mb-1">Strengths:</p>
                        <div className="flex flex-wrap gap-1">
                          {hook.strengths.map((strength, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {strength}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">{hook.useCase}</p>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              {/* CTA Variations */}
              <TabsContent value="ctas" className="space-y-4">
                {CTA_VARIATIONS.map((cta, index) => (
                  <Card key={cta.type} className="border">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base capitalize">{cta.type} CTA</CardTitle>
                        <Badge variant="outline">{cta.expectedEngagement}%</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">{cta.description}</p>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm italic">"{cta.examples[0]}"</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold mb-1">Strengths:</p>
                        <div className="flex flex-wrap gap-1">
                          {cta.strengths.map((strength, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {strength}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">{cta.useCase}</p>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              {/* Hashtag Strategies */}
              <TabsContent value="hashtags" className="space-y-4">
                {HASHTAG_STRATEGIES.map((strategy, index) => (
                  <Card key={strategy.name} className="border">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{strategy.name}</CardTitle>
                        <Badge variant="outline">{strategy.expectedEngagement}%</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">{strategy.description}</p>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <div className="flex flex-wrap gap-1">
                          {strategy.examples[0].map((tag, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-semibold mb-1">Strengths:</p>
                        <div className="flex flex-wrap gap-1">
                          {strategy.strengths.map((strength, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {strength}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>

            {/* Tips Card */}
            <Card className="border border-pink-500/20 bg-pink-500/5 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-pink-600 dark:text-pink-400 text-base">
                  <Lightbulb className="h-4 w-4" />
                  A/B Testing Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-pink-600 dark:text-pink-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-fg-muted font-medium">Test one variable at a time for accurate results.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-pink-600 dark:text-pink-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-fg-muted font-medium">Post variations at similar times for fair comparison.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-pink-600 dark:text-pink-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-fg-muted font-medium">Give each variation at least 48 hours to gather data.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-pink-600 dark:text-pink-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-fg-muted font-medium">Track metrics: engagement rate, comments, shares, and reach.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
