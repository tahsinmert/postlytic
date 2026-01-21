'use client';

import {
  Search,
  HelpCircle,
  Book,
  MessageCircle,
  Mail,
  ExternalLink,
  ChevronRight,
  Layout,
  Zap,
  Users,
  BarChart,
  Shield,
  PlayCircle,
  FileText,
  Lightbulb,
  ArrowRight,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from '@/lib/utils';

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    { id: 'getting-started', name: 'Getting Started', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { id: 'features', name: 'Features & Tools', icon: Layout, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { id: 'account', name: 'Account & Billing', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { id: 'analysis', name: 'Analysis Guide', icon: BarChart, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { id: 'security', name: 'Privacy & Security', icon: Shield, color: 'text-rose-500', bg: 'bg-rose-500/10' },
    { id: 'faq', name: 'FAQs', icon: HelpCircle, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
  ];

  const articles = [
    {
      id: 1,
      title: 'How does the virality score work?',
      category: 'analysis',
      content: 'Our virality score algorithm analyzes over 50 unique data points including hook strength, formatting, emotional sentiment, and structural flow. It compares your content against millions of high-performing LinkedIn posts to predict engagement potential.'
    },
    {
      id: 2,
      title: 'Connecting your LinkedIn account',
      category: 'getting-started',
      content: 'To connect your account, go to Settings > Integrations and click "Connect LinkedIn". You will be redirected to LinkedIn\'s secure authorization page. We only request read permissions to analyze your content.'
    },
    {
      id: 3,
      title: 'Understanding the Hook Score',
      category: 'features',
      content: 'The Hook Score evaluates the first 3 lines of your post. It checks for curiosity gaps, emotional triggers, and formatting that encourages "See More" clicks. A score above 80 indicates a strong hook.'
    },
    {
      id: 4,
      title: 'Exporting your data',
      category: 'account',
      content: 'You can export all your analysis history from the Settings page. We support CSV and JSON formats. Data exports typically process within minutes and verified download links are sent to your email.'
    },
    {
      id: 5,
      title: 'Data privacy policy',
      category: 'security',
      content: 'We take data privacy seriously. Your content is analyzed in real-time and we do not store the full text of your posts unless you explicitly save them to your library. We never sell your data to third parties.'
    },
    {
      id: 6,
      title: 'What counts as a "credit"?',
      category: 'account',
      content: 'One credit is consumed for each full post analysis. Using the Hook Optimizer or generating variation suggestions costs 0.5 credits. Your credits refresh automatically at the start of your billing cycle.'
    },
  ];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? article.category === selectedCategory || (selectedCategory === 'faq' && true) : true; // Show all for FAQ for demo
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-bg-canvas relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto max-w-6xl px-4 pt-24 pb-12 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-12"
        >
          {/* Hero / Search Section */}
          <div className="text-center space-y-6 max-w-2xl mx-auto">
            <Badge variant="outline" className="bg-indigo-500/10 text-indigo-600 border-indigo-200">
              Help Center
            </Badge>
            <h1 className="text-4xl md:text-5xl font-black text-fg-default tracking-tight">
              How can we help you?
            </h1>
            <p className="text-lg text-fg-muted">
              Search for guides, learn features, or contact support.
            </p>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all opacity-50" />
              <div className="relative flex items-center bg-bg-surface/80 backdrop-blur-md border border-indigo-500/30 rounded-2xl p-2 shadow-lg hover:shadow-indigo-500/10 transition-shadow">
                <Search className="w-6 h-6 text-indigo-500 ml-4 mr-2" />
                <input
                  type="text"
                  placeholder="Search for answers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent border-none text-lg px-2 py-3 focus:outline-none text-fg-default placeholder:text-fg-muted"
                />
                <Button className="rounded-xl px-6 bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20">
                  Search
                </Button>
              </div>
            </div>
          </div>

          {/* Categories Grid */}
          <div>
            <h2 className="text-xl font-bold text-fg-default mb-6 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" /> Browse Categories
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category) => (
                <motion.div
                  key={category.id}
                  whileHover={{ y: -4 }}
                  onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                >
                  <Card className={cn(
                    "h-full p-4 cursor-pointer flex flex-col items-center justify-center text-center gap-3 transition-all duration-300 border-border-default/40 backdrop-blur-sm",
                    selectedCategory === category.id
                      ? "bg-indigo-500/10 border-indigo-500/50 shadow-lg shadow-indigo-500/10"
                      : "bg-bg-surface/40 hover:bg-bg-surface/60 hover:border-indigo-500/30"
                  )}>
                    <div className={cn("p-3 rounded-full", category.bg, category.color)}>
                      <category.icon className="w-6 h-6" />
                    </div>
                    <span className={cn("text-sm font-semibold", selectedCategory === category.id ? "text-indigo-600" : "text-fg-default")}>
                      {category.name}
                    </span>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content (Articles/FAQ) */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-fg-default">
                  {selectedCategory ? categories.find(c => c.id === selectedCategory)?.name : 'Popular Articles'}
                </h2>
                {selectedCategory && (
                  <Button variant="ghost" size="sm" onClick={() => setSelectedCategory(null)}>
                    View All
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {filteredArticles.length > 0 ? (
                    filteredArticles.map((article) => (
                      <motion.div
                        key={article.id}
                        layout
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                      >
                        <Accordion type="single" collapsible className="bg-bg-surface/40 border border-border-default/40 rounded-xl px-4 backdrop-blur-sm hover:border-indigo-500/20 transition-colors">
                          <AccordionItem value={`item-${article.id}`} className="border-0">
                            <AccordionTrigger className="py-4 text-base font-semibold text-fg-default hover:text-indigo-600 hover:no-underline">
                              <div className="flex items-center gap-3 text-left">
                                <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500">
                                  <FileText className="w-4 h-4" />
                                </span>
                                {article.title}
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="text-fg-muted leading-relaxed pb-4 pl-12 text-base">
                              {article.content}
                              <div className="mt-4 flex gap-2">
                                <Button size="sm" variant="outline" className="text-xs h-8">
                                  Did this help?
                                </Button>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-12 bg-bg-surface/30 rounded-xl border border-dashed border-border-default">
                      <Search className="w-8 h-8 text-fg-muted mx-auto mb-3" />
                      <p className="text-fg-muted font-medium">No articles found matching your search.</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Sidebar (Support & Featured) */}
            <div className="space-y-6">
              <Card className="p-6 border-border-default/40 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 backdrop-blur-sm">
                <h3 className="font-bold text-fg-default mb-4 flex items-center gap-2">
                  <PlayCircle className="w-5 h-5 text-purple-500" /> Video Tutorials
                </h3>
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <div key={i} className="group cursor-pointer">
                      <div className="relative aspect-video rounded-lg bg-black/10 overflow-hidden mb-2 border border-border-default/30">
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                            <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-1" />
                          </div>
                        </div>
                      </div>
                      <p className="font-medium text-sm text-fg-default group-hover:text-indigo-600 transition-colors">
                        Getting Started in 5 Minutes
                      </p>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6 border-indigo-200/50 bg-indigo-500/10 backdrop-blur-sm">
                <h3 className="font-bold text-indigo-900 dark:text-indigo-100 mb-2">Still need help?</h3>
                <p className="text-sm text-indigo-800/80 dark:text-indigo-200/70 mb-4">
                  Our support team is available 24/7 to assist you.
                </p>
                <div className="space-y-2">
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md">
                    <MessageCircle className="w-4 h-4 mr-2" /> Live Chat
                  </Button>
                  <Button variant="outline" className="w-full border-indigo-200 hover:bg-indigo-100 text-indigo-700 dark:border-indigo-700 dark:hover:bg-indigo-900/50 dark:text-indigo-300">
                    <Mail className="w-4 h-4 mr-2" /> Email Support
                  </Button>
                </div>
              </Card>
            </div>
          </div>

          {/* Quick Links Footer-ish */}
          <div className="grid md:grid-cols-3 gap-6 pt-8 border-t border-border-default/30">
            <a href="#" className="flex items-center gap-4 p-4 rounded-xl hover:bg-bg-surface/50 transition-colors group">
              <div className="p-3 rounded-lg bg-pink-500/10 text-pink-500 group-hover:bg-pink-500 group-hover:text-white transition-colors">
                <Book className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-fg-default">Documentation</h4>
                <p className="text-xs text-fg-muted">Detailed technical guides</p>
              </div>
              <ArrowRight className="w-4 h-4 text-fg-muted ml-auto group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="#" className="flex items-center gap-4 p-4 rounded-xl hover:bg-bg-surface/50 transition-colors group">
              <div className="p-3 rounded-lg bg-cyan-500/10 text-cyan-500 group-hover:bg-cyan-500 group-hover:text-white transition-colors">
                <Globe className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-fg-default">Community</h4>
                <p className="text-xs text-fg-muted">Join the discussion</p>
              </div>
              <ArrowRight className="w-4 h-4 text-fg-muted ml-auto group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="#" className="flex items-center gap-4 p-4 rounded-xl hover:bg-bg-surface/50 transition-colors group">
              <div className="p-3 rounded-lg bg-green-500/10 text-green-500 group-hover:bg-green-500 group-hover:text-white transition-colors">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-fg-default">Status</h4>
                <p className="text-xs text-fg-muted">All systems operational</p>
              </div>
              <ArrowRight className="w-4 h-4 text-fg-muted ml-auto group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

        </motion.div>
      </div>
    </div>
  );
}
