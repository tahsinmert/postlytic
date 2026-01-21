export interface Score {
  score: number;
  explanation: string;
}

export interface HookAnalysis {
  score: number;
  patterns: string[];
  suggestions: string[];
}

export interface StructureAnalysis {
  score: number;
  problems: string[];
  fixes: string[];
  readabilityScore: number;
}

export interface CtaAnalysis {
  ctaExists: boolean;
  score: number;
  suggestions: string[];
}

export interface HashtagAnalysis {
  score: number;
  issues: string[];
  recommendations: string[];
}

export interface EmojiAnalysis {
  density: 'Low' | 'Good' | 'High' | 'None';
  notes: string[];
  suggestions: string[];
}

export interface ViralityScore extends Score {
  breakdown: {
    hook: number;
    structure: number;
    cta: number;
    hashtags: number;
    emojis: number;
  };
}

export interface RewriteStrategy {
  hookExamples: string[];
  ctaExamples: string[];
  structureChecklist: string[];
}

export interface SentimentAnalysis {
  sentiment: 'positive' | 'neutral' | 'negative';
  sentimentScore: number;
  primaryTone: string;
  detectedTones: string[];
  personalProfessionalBalance: 'personal' | 'balanced' | 'professional';
  insights: string[];
  suggestions: string[];
}

export interface TopicAnalysis {
  primaryTopic: string;
  detectedTopics: string[];
  topKeywords: string[];
  topicDiversity: number;
  diversityScore: number;
  insights: string[];
  suggestions: string[];
}

export interface ReadabilityAnalysis {
  fleschKincaidScore: number;
  averageSentenceLength: number;
  averageWordLength: number;
  sentenceVariety: number;
  complexityScore: number;
  readabilityLevel: 'very_easy' | 'easy' | 'fairly_easy' | 'standard' | 'fairly_difficult' | 'difficult' | 'very_difficult';
  insights: string[];
  suggestions: string[];
}

export interface StorytellingAnalysis {
  hasStoryStructure: boolean;
  structureType: 'narrative' | 'case_study' | 'lesson_learned' | 'transformation' | 'minimal';
  storytellingScore: number;
  detectedElements: string[];
  hasCompleteArc: boolean;
  insights: string[];
  suggestions: string[];
}

export interface EngagementAnalysis {
  engagementScore: number;
  engagementPotential: 'low' | 'medium' | 'high' | 'very_high';
  detectedTriggers: string[];
  triggerCounts: Record<string, number>;
  insights: string[];
  suggestions: string[];
}

export interface AnalysisData {
  originalPost: string;
  hook: HookAnalysis;
  structure: StructureAnalysis;
  cta: CtaAnalysis;
  hashtags: HashtagAnalysis;
  emojis: EmojiAnalysis;
  sentiment: SentimentAnalysis;
  topics: TopicAnalysis;
  readability: ReadabilityAnalysis;
  storytelling: StorytellingAnalysis;
  engagement: EngagementAnalysis;
  viralityScore: ViralityScore;
  rewriteStrategy: RewriteStrategy;
}
