'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import {
  Loader2,
  BookOpen,
  Lightbulb,
  TrendingUp,
  Video,
  PlayCircle,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Target,
  MessageSquare,
  Hash,
  Clock,
  Eye,
  Heart,
  Share2,
  Users,
  User,
  Zap,
  Award,
  BarChart3,
  FileText,
  Code,
  Image as ImageIcon,
  Link as LinkIcon,
  Quote,
  List,
  Type,
  Calendar,
  Bell,
  ThumbsUp,
  Repeat,
  Bookmark,
  Building2,
  GraduationCap,
  Briefcase,
  Rocket,
  Star,
  AlertCircle,
  Info,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const categories = [
  { id: 'all', label: 'All Tips', icon: Sparkles },
  { id: 'structure', label: 'Structure', icon: FileText },
  { id: 'engagement', label: 'Engagement', icon: Heart },
  { id: 'timing', label: 'Timing', icon: Clock },
  { id: 'visuals', label: 'Visuals', icon: ImageIcon },
  { id: 'hashtags', label: 'Hashtags', icon: Hash },
  { id: 'cta', label: 'Call-to-Action', icon: Target },
];

const writingTips = [
  {
    id: 'hook',
    category: 'structure',
    title: 'Start with a Strong Hook',
    description: 'Capture attention in the first 2-3 lines',
    icon: Zap,
    content: `The first 125 characters of your LinkedIn post are crucial. They appear in the feed preview and determine whether someone clicks to read more.

**Best Practices:**
- Start with a question, bold statement, or surprising statistic
- Create curiosity or urgency
- Avoid generic openings like "I'm excited to share..."

**Example:**
❌ "I wanted to share some thoughts about leadership..."
✅ "Last week, I fired my best employee. Here's why it was the right decision..."`,
    videoExplanation: 'Hook writing techniques',
    examples: [
      {
        title: 'Question Hook',
        text: 'What if I told you that 90% of LinkedIn posts get zero engagement? Here\'s what the top 1% do differently...',
        metrics: { engagement: 95, virality: 88 }
      },
      {
        title: 'Statistic Hook',
        text: 'Only 3% of LinkedIn users post weekly. That means 97% are missing out on building their personal brand. Here\'s how to join the 3%...',
        metrics: { engagement: 92, virality: 85 }
      },
      {
        title: 'Story Hook',
        text: 'I made $0 from LinkedIn for 2 years. Then I changed one thing and made $50K in 6 months. Here\'s what changed...',
        metrics: { engagement: 98, virality: 94 }
      }
    ]
  },
  {
    id: 'storytelling',
    category: 'structure',
    title: 'Use the Power of Storytelling',
    description: 'Stories are 22x more memorable than facts',
    icon: BookOpen,
    content: `Humans are wired for stories. Posts that tell a story perform significantly better than those that just state facts.

**Story Structure:**
1. **Setup** - Set the context (who, what, when, where)
2. **Conflict** - Introduce a challenge or problem
3. **Resolution** - Show how it was solved
4. **Lesson** - Extract the key takeaway

**Example:**
"I was terrified of public speaking. My hands would shake, my voice would crack. Then I discovered one technique that changed everything: speaking to one person, not a crowd. Last month, I gave a keynote to 500 people. The technique? I imagined I was explaining my idea to my best friend over coffee. Simple, but it works."`,
    videoExplanation: 'Storytelling framework for LinkedIn',
    examples: [
      {
        title: 'Personal Story',
        text: 'I failed 3 startups before this one succeeded. Each failure taught me something crucial. Failure #1 taught me to validate before building. Failure #2 taught me that great products don\'t sell themselves. Failure #3 taught me the importance of timing. Now, on my 4th attempt, I\'m applying all three lessons. Sometimes the best education is expensive...',
        metrics: { engagement: 96, virality: 91 }
      }
    ]
  },
  {
    id: 'formatting',
    category: 'structure',
    title: 'Master Post Formatting',
    description: 'Break up text for better readability',
    icon: Type,
    content: `LinkedIn's algorithm favors posts that keep users engaged. Proper formatting increases read time and engagement.

**Formatting Rules:**
- Use line breaks every 1-3 sentences
- Create white space for visual breathing room
- Use emojis strategically (1-3 per post)
- Break long paragraphs into shorter ones
- Use bullet points or numbered lists for clarity

**Line Break Strategy:**
- Single line break = new paragraph
- Double line break = major section break
- Triple line break = visual separator`,
    videoExplanation: 'Formatting techniques for maximum readability',
    examples: [
      {
        title: 'Well-Formatted Post',
        text: `5 mistakes that kill your LinkedIn engagement:

1. Posting without a hook
2. Writing walls of text
3. Ignoring your audience
4. No clear call-to-action
5. Posting inconsistently

Which one are you guilty of? 👇`,
        metrics: { engagement: 94, virality: 87 }
      }
    ]
  },
  {
    id: 'first-comment',
    category: 'engagement',
    title: 'Use the First Comment Strategy',
    description: 'Post your main content in the first comment',
    icon: MessageSquare,
    content: `The "first comment" strategy can dramatically increase your post's reach and engagement.

**How it Works:**
1. Write a compelling hook in the main post
2. Post the full content as the first comment
3. This creates two engagement opportunities
4. Comments boost visibility in the algorithm

**Why it Works:**
- Double engagement opportunity (post + comment)
- Comments signal high engagement to LinkedIn
- Creates curiosity that drives clicks
- More comments = more visibility`,
    videoExplanation: 'First comment strategy explained',
    examples: [
      {
        title: 'First Comment Example',
        text: 'Main Post: "I just discovered the #1 mistake 99% of LinkedIn creators make. It\'s costing them thousands of followers and engagement. 👇 (Full explanation in comments)',
        metrics: { engagement: 97, virality: 93 }
      }
    ]
  },
  {
    id: 'questions',
    category: 'engagement',
    title: 'End with Questions',
    description: 'Questions drive 2x more comments',
    icon: MessageSquare,
    content: `Posts that end with questions receive significantly more comments, which boosts visibility.

**Question Types:**
- **Open-ended**: "What's your biggest challenge with...?"
- **Choice-based**: "Do you prefer A or B? Why?"
- **Experience-based**: "Have you experienced...? What happened?"
- **Opinion-based**: "What do you think about...?"

**Best Practices:**
- Ask one clear question
- Make it easy to answer
- Relate it to your content
- Respond to every comment`,
    videoExplanation: 'How to craft engaging questions',
    examples: [
      {
        title: 'Question Hook',
        text: 'I\'ve tried 10 different productivity systems. Some worked, some didn\'t. The one I use now increased my output by 300%. What productivity system are you using? And more importantly - is it actually working?',
        metrics: { engagement: 93, virality: 89 }
      }
    ]
  },
  {
    id: 'posting-time',
    category: 'timing',
    title: 'Post at Optimal Times',
    description: 'Timing can double your engagement',
    icon: Clock,
    content: `Posting at the right time can significantly impact your reach and engagement.

**Best Times to Post:**
- **Tuesday-Thursday**: 8-10 AM (local time)
- **Monday**: 9-11 AM
- **Friday**: 1-3 PM
- **Weekends**: Generally lower engagement

**Time Zone Considerations:**
- Post when your target audience is active
- Consider international audiences
- Test different times for your specific audience
- Use LinkedIn Analytics to find your best times

**Pro Tip:** Post when your audience is commuting or taking breaks - they're more likely to engage.`,
    videoExplanation: 'Optimal posting times explained',
    examples: []
  },
  {
    id: 'consistency',
    category: 'timing',
    title: 'Post Consistently',
    description: 'Consistency beats perfection',
    icon: Calendar,
    content: `LinkedIn's algorithm favors creators who post consistently. Regular posting signals active engagement.

**Consistency Guidelines:**
- **Minimum**: 3-5 posts per week
- **Optimal**: 1 post per day
- **Maximum**: 2-3 posts per day (avoid over-posting)

**Why Consistency Matters:**
- Algorithm learns your posting pattern
- Builds audience expectations
- Increases overall visibility
- Establishes you as a thought leader

**Pro Tip:** Use a content calendar and batch-create posts. Quality + consistency = growth.`,
    videoExplanation: 'Building a consistent posting schedule',
    examples: []
  },
  {
    id: 'images',
    category: 'visuals',
    title: 'Use High-Quality Images',
    description: 'Visuals increase engagement by 2.3x',
    icon: ImageIcon,
    content: `Posts with images receive significantly more engagement than text-only posts.

**Image Best Practices:**
- Use high-resolution images (1200x627px optimal)
- Include text overlays for key points
- Use branded colors consistently
- Create custom graphics vs. stock photos
- Use carousels for multiple points

**Image Types That Work:**
- Quote graphics
- Infographics
- Behind-the-scenes photos
- Screenshots with annotations
- Custom illustrations

**Pro Tip:** Create a template library for consistent branding.`,
    videoExplanation: 'Creating engaging LinkedIn visuals',
    examples: []
  },
  {
    id: 'carousels',
    category: 'visuals',
    title: 'Leverage Carousel Posts',
    description: 'Carousels drive 3x more engagement',
    icon: ImageIcon,
    content: `Carousel posts (multiple images) are one of the highest-performing content types on LinkedIn.

**Why Carousels Work:**
- Keep users on your post longer
- Higher engagement rates
- More shareable content
- Better for storytelling

**Carousel Best Practices:**
- 5-10 slides optimal
- Each slide should stand alone
- Create a narrative flow
- Include a clear CTA on the last slide
- Use consistent design

**Pro Tip:** Tell a complete story across slides. Each slide should add value.`,
    videoExplanation: 'Creating high-performing carousels',
    examples: []
  },
  {
    id: 'hashtag-strategy',
    category: 'hashtags',
    title: 'Strategic Hashtag Use',
    description: '3-5 hashtags is the sweet spot',
    icon: Hash,
    content: `Hashtags help your content get discovered, but too many can hurt performance.

**Hashtag Strategy:**
- Use 3-5 hashtags per post
- Mix of broad and niche hashtags
- Research trending hashtags in your industry
- Create your own branded hashtag
- Place hashtags at the end or in comments

**Hashtag Types:**
- **Broad**: #leadership, #business, #marketing
- **Niche**: #saasfounders, #productmanagement
- **Trending**: Monitor LinkedIn's trending topics
- **Branded**: Create your own unique hashtag

**Pro Tip:** Test placing hashtags in the first comment vs. main post.`,
    videoExplanation: 'Hashtag strategy for maximum reach',
    examples: []
  },
  {
    id: 'cta-placement',
    category: 'cta',
    title: 'Clear Call-to-Action',
    description: 'Every post needs a clear CTA',
    icon: Target,
    content: `A clear call-to-action guides your audience on what to do next, increasing engagement.

**CTA Types:**
- **Engagement**: "What do you think? Comment below."
- **Share**: "Tag someone who needs to see this."
- **Save**: "Save this post for later."
- **Follow**: "Follow me for more [topic] tips."
- **Click**: "Read the full article in comments."

**CTA Best Practices:**
- Make it specific and actionable
- Place it at the end of your post
- Use action verbs
- Create urgency when appropriate
- Test different CTAs to see what works

**Pro Tip:** Match your CTA to your goal. Want comments? Ask a question. Want shares? Make it valuable.`,
    videoExplanation: 'Crafting effective CTAs',
    examples: [
      {
        title: 'Strong CTA',
        text: 'I\'ve helped 500+ professionals land their dream jobs. The #1 mistake? Not optimizing their LinkedIn profile. Want me to review yours? Drop "REVIEW" in the comments and I\'ll pick 5 to analyze this week.',
        metrics: { engagement: 99, virality: 95 }
      }
    ]
  },
];

const categoryGuides = [
  {
    id: 'thought-leadership',
    title: 'Thought Leadership Posts',
    icon: Award,
    description: 'Establish yourself as an industry expert',
    tips: [
      'Share unique insights from your experience',
      'Challenge conventional wisdom',
      'Provide data-backed opinions',
      'Share lessons learned from failures',
      'Comment on industry trends',
    ],
    example: {
      title: 'Thought Leadership Example',
      text: `The biggest lie in tech: "We're building the future."

Reality? Most startups are building solutions to problems that don't exist.

I've reviewed 200+ pitch decks. Here's what I found:
- 60% solve problems people don't have
- 25% solve problems people don't know they have
- 15% solve real problems

The difference? The 15% talked to customers BEFORE building.

Stop building. Start talking.

What problem are you solving? And more importantly - did your customers tell you it's a problem?`,
      metrics: { engagement: 96, virality: 92 }
    }
  },
  {
    id: 'personal-branding',
    title: 'Personal Branding Posts',
    icon: User,
    description: 'Build your personal brand authentically',
    tips: [
      'Share your journey and struggles',
      'Show behind-the-scenes content',
      'Be vulnerable and authentic',
      'Share your values and beliefs',
      'Tell your origin story',
    ],
    example: {
      title: 'Personal Branding Example',
      text: `5 years ago, I was broke, unemployed, and living in my parents' basement.

Today, I run a 7-figure business.

Here's what changed (and it wasn't what you think):

❌ I didn't "hustle harder"
❌ I didn't work 80-hour weeks
❌ I didn't sacrifice everything

✅ I focused on ONE thing
✅ I said no to everything else
✅ I built systems, not willpower

The secret? Focus beats hustle every time.

What's the ONE thing you need to focus on right now?`,
      metrics: { engagement: 98, virality: 94 }
    }
  },
  {
    id: 'educational',
    title: 'Educational Content',
    icon: GraduationCap,
    description: 'Teach your audience something valuable',
    tips: [
      'Break down complex topics simply',
      'Use frameworks and models',
      'Provide actionable takeaways',
      'Use examples and case studies',
      'Create step-by-step guides',
    ],
    example: {
      title: 'Educational Example',
      text: `How to write LinkedIn posts that get 10,000+ views:

The 3-2-1 Framework:

3️⃣ Hook lines (first 3 lines)
- Create curiosity
- Ask a question
- Share a surprising stat

2️⃣ Value paragraphs (middle section)
- Tell a story
- Share insights
- Provide examples

1️⃣ Call-to-action (end)
- Ask a question
- Request engagement
- Guide next steps

Example:
"I made $50K from LinkedIn in 6 months. Here's my exact framework: [story] [insights] [examples] What's your biggest LinkedIn challenge?"

Try it. Tag me when it works.`,
      metrics: { engagement: 95, virality: 90 }
    }
  },
  {
    id: 'business',
    title: 'Business & Industry Posts',
    icon: Building2,
    description: 'Share industry insights and business tips',
    tips: [
      'Comment on industry news',
      'Share business lessons',
      'Provide market insights',
      'Discuss trends and predictions',
      'Share case studies',
    ],
    example: {
      title: 'Business Example',
      text: `The SaaS industry is changing. Fast.

Here's what I'm seeing:

📉 Traditional sales models are dying
📈 Product-led growth is winning
🔄 Customer success is the new sales
💡 Community is the new marketing

Companies that adapt: thriving
Companies that don't: struggling

The shift? From "sell more" to "help more."

What industry shifts are you noticing?`,
      metrics: { engagement: 94, virality: 88 }
    }
  },
];

export default function BestPracticesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedTip, setExpandedTip] = useState<string | null>(null);
  const [selectedGuide, setSelectedGuide] = useState<string | null>(null);

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

  const filteredTips = activeCategory === 'all'
    ? writingTips
    : writingTips.filter(tip => tip.category === activeCategory);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied!',
      description: 'Post example copied to clipboard',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg-canvas to-bg-canvas/50 pt-20 pb-16">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 mb-4">
            <BookOpen className="h-4 w-4" />
            <span className="text-sm font-medium">Best Practices Guide</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-fg-default mb-4">
            Master LinkedIn Post Writing
          </h1>
          <p className="text-lg text-fg-muted max-w-2xl mx-auto">
            Learn proven strategies, see successful examples, and get category-specific guides to create high-performing LinkedIn content
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? 'default' : 'outline'}
                  onClick={() => setActiveCategory(category.id)}
                  className={cn(
                    'gap-2',
                    activeCategory === category.id
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : ''
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {category.label}
                </Button>
              );
            })}
          </div>
        </motion.div>

        {/* Writing Tips Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-6">
            <Lightbulb className="h-6 w-6 text-emerald-500" />
            <h2 className="text-2xl font-bold text-fg-default">Writing Tips & Strategies</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {filteredTips.map((tip, index) => {
              const Icon = tip.icon;
              const isExpanded = expandedTip === tip.id;
              return (
                <motion.div
                  key={tip.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 border-border-default/50">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {categories.find(c => c.id === tip.category)?.label}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl mb-2">{tip.title}</CardTitle>
                      <CardDescription>{tip.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          <div className="whitespace-pre-line text-sm text-fg-muted">
                            {isExpanded ? tip.content : tip.content.split('\n\n')[0] + '...'}
                          </div>
                        </div>

                        {tip.examples && tip.examples.length > 0 && (
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm font-semibold text-fg-default">
                              <Star className="h-4 w-4 text-yellow-500" />
                              Successful Examples
                            </div>
                            {tip.examples.map((example, idx) => (
                              <Card key={idx} className="bg-muted/50 border-border-default/30">
                                <CardContent className="pt-4">
                                  <div className="flex items-start justify-between mb-2">
                                    <Badge variant="outline" className="text-xs">
                                      {example.title}
                                    </Badge>
                                    <div className="flex items-center gap-2">
                                      <Badge className="bg-emerald-500 text-xs">
                                        {example.metrics.engagement}% engagement
                                      </Badge>
                                    </div>
                                  </div>
                                  <p className="text-sm text-fg-muted mb-3 italic">
                                    "{example.text}"
                                  </p>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => copyToClipboard(example.text)}
                                      className="gap-2"
                                    >
                                      <Copy className="h-3 w-3" />
                                      Copy
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setExpandedTip(isExpanded ? null : tip.id)}
                            className="gap-2"
                          >
                            {isExpanded ? 'Show Less' : 'Read More'}
                            <ArrowRight className={cn('h-4 w-4 transition-transform', isExpanded && 'rotate-90')} />
                          </Button>
                          {tip.videoExplanation && (
                            <Badge variant="outline" className="gap-1 text-xs">
                              <PlayCircle className="h-3 w-3" />
                              Video Guide Available
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Category-Based Guides */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-6">
            <Target className="h-6 w-6 text-emerald-500" />
            <h2 className="text-2xl font-bold text-fg-default">Category-Based Guides</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {categoryGuides.map((guide, index) => {
              const Icon = guide.icon;
              const isExpanded = selectedGuide === guide.id;
              return (
                <motion.div
                  key={guide.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 border-border-default/50">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <Badge variant="outline" className="text-xs">Guide</Badge>
                      </div>
                      <CardTitle className="text-xl mb-2">{guide.title}</CardTitle>
                      <CardDescription>{guide.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-semibold mb-2 text-fg-default">Key Tips:</h4>
                          <ul className="space-y-2">
                            {guide.tips.map((tip, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm text-fg-muted">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                <span>{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedGuide(isExpanded ? null : guide.id)}
                          className="w-full gap-2"
                        >
                          {isExpanded ? 'Hide Example' : 'Show Example Post'}
                          <ArrowRight className={cn('h-4 w-4 transition-transform', isExpanded && 'rotate-90')} />
                        </Button>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <Card className="bg-muted/50 border-border-default/30">
                                <CardContent className="pt-4">
                                  <div className="flex items-start justify-between mb-2">
                                    <Badge variant="outline" className="text-xs">
                                      {guide.example.title}
                                    </Badge>
                                    <div className="flex items-center gap-2">
                                      <Badge className="bg-emerald-500 text-xs">
                                        {guide.example.metrics.engagement}% engagement
                                      </Badge>
                                      <Badge className="bg-blue-500 text-xs">
                                        {guide.example.metrics.virality}% virality
                                      </Badge>
                                    </div>
                                  </div>
                                  <p className="text-sm text-fg-muted mb-3 whitespace-pre-line">
                                    {guide.example.text}
                                  </p>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => copyToClipboard(guide.example.text)}
                                    className="gap-2"
                                  >
                                    <Copy className="h-3 w-3" />
                                    Copy Example
                                  </Button>
                                </CardContent>
                              </Card>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Quick Reference Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="border-border-default/50 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-emerald-500" />
                <CardTitle>Quick Reference Checklist</CardTitle>
              </div>
              <CardDescription>
                Use this checklist before posting to ensure maximum engagement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  'Strong hook in first 2-3 lines',
                  'Proper formatting with line breaks',
                  'Clear call-to-action',
                  'Relevant hashtags (3-5)',
                  'Engaging question at the end',
                  'High-quality image or visual',
                  'Posting at optimal time',
                  'Proofread for errors',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                    <span className="text-sm text-fg-muted">{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
