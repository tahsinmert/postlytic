import { runAnalysis } from './engine';
import type { AnalysisData } from './types';

export interface EngagementPrediction {
  expectedEngagement: {
    likes: number;
    comments: number;
    shares: number;
    reactions: number;
    totalEngagement: number;
  };
  reach: {
    estimatedReach: number;
    organicReach: number;
    viralPotential: number;
    reachMultiplier: number;
  };
  detailedPredictions: {
    likesPrediction: {
      min: number;
      max: number;
      expected: number;
      confidence: number;
      factors: string[];
    };
    commentsPrediction: {
      min: number;
      max: number;
      expected: number;
      confidence: number;
      factors: string[];
    };
    sharesPrediction: {
      min: number;
      max: number;
      expected: number;
      confidence: number;
      factors: string[];
    };
  };
  performanceMetrics: {
    engagementRate: number;
    commentRate: number;
    shareRate: number;
    viralScore: number;
  };
  insights: string[];
  recommendations: string[];
}

interface PredictionFactors {
  viralityScore: number;
  engagementScore: number;
  hookScore: number;
  ctaScore: number;
  hashtagScore: number;
  storytellingScore: number;
  sentimentScore: number;
  readabilityScore: number;
  wordCount: number;
  hasQuestions: boolean;
  questionCount: number;
  hasNumbers: boolean;
  hasPersonalStory: boolean;
  hasControversialElements: boolean;
  hashtagCount: number;
  emojiCount: number;
}

function extractFactors(analysis: AnalysisData): PredictionFactors {
  const text = analysis.originalPost;
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const questionCount = (text.match(/\?/g) || []).length;
  const hashtagCount = (text.match(/#\w+/g) || []).length;
  const emojiCount = (text.match(/[\u{1F300}-\u{1F9FF}]/gu) || []).length;
  
  const lowerText = text.toLowerCase();
  const hasPersonalStory = ['i', 'my', 'me', 'story', 'journey', 'experience'].some(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    return regex.test(text);
  });
  
  const hasControversialElements = ['wrong', 'mistake', 'myth', 'lie', 'truth', 'reality', 'actually', 'surprisingly'].some(word =>
    lowerText.includes(word)
  );
  
  return {
    viralityScore: analysis.viralityScore.score,
    engagementScore: analysis.engagement.engagementScore,
    hookScore: analysis.hook.score,
    ctaScore: analysis.cta.score,
    hashtagScore: analysis.hashtags.score,
    storytellingScore: analysis.storytelling.storytellingScore,
    sentimentScore: analysis.sentiment.sentimentScore,
    readabilityScore: analysis.readability.fleschKincaidScore,
    wordCount: words.length,
    hasQuestions: questionCount > 0,
    questionCount,
    hasNumbers: (text.match(/\d+/g) || []).length > 0,
    hasPersonalStory,
    hasControversialElements,
    hashtagCount,
    emojiCount,
  };
}

function calculateBaseReach(factors: PredictionFactors): number {
  // Base reach calculation based on multiple factors
  // LinkedIn average reach: 2-5% of followers for organic posts
  // We'll use a base of 1000 and scale based on quality
  
  const baseReach = 1000;
  
  // Virality multiplier (0.5x to 3x)
  const viralityMultiplier = 0.5 + (factors.viralityScore / 100) * 2.5;
  
  // Engagement multiplier (0.7x to 2x)
  const engagementMultiplier = 0.7 + (factors.engagementScore / 100) * 1.3;
  
  // Hook multiplier (0.8x to 1.5x)
  const hookMultiplier = 0.8 + (factors.hookScore / 100) * 0.7;
  
  // Hashtag multiplier (0.9x to 1.3x)
  const hashtagMultiplier = 0.9 + Math.min(factors.hashtagCount / 10, 0.4);
  
  // Storytelling bonus (1x to 1.2x)
  const storytellingMultiplier = 1 + (factors.storytellingScore / 100) * 0.2;
  
  const totalMultiplier = viralityMultiplier * engagementMultiplier * hookMultiplier * hashtagMultiplier * storytellingMultiplier;
  
  return Math.round(baseReach * totalMultiplier);
}

function calculateLikesPrediction(factors: PredictionFactors, reach: number): {
  min: number;
  max: number;
  expected: number;
  confidence: number;
  factors: string[];
} {
  // LinkedIn average engagement rate: 1-3% for organic posts
  // Likes typically represent 60-80% of total engagement
  
  const factorList: string[] = [];
  
  // Base engagement rate (0.5% to 3%)
  let baseRate = 0.5 + (factors.engagementScore / 100) * 2.5;
  
  // Hook quality bonus
  if (factors.hookScore > 70) {
    baseRate += 0.3;
    factorList.push('Strong hook');
  }
  
  // Questions boost (encourages engagement)
  if (factors.hasQuestions) {
    baseRate += 0.2 * Math.min(factors.questionCount, 3);
    factorList.push(`${factors.questionCount} questions`);
  }
  
  // Personal story boost
  if (factors.hasPersonalStory) {
    baseRate += 0.4;
    factorList.push('Personal story');
  }
  
  // Numbers boost (credibility)
  if (factors.hasNumbers) {
    baseRate += 0.2;
    factorList.push('Numerical data');
  }
  
  // Controversial elements boost
  if (factors.hasControversialElements) {
    baseRate += 0.5;
    factorList.push('Controversial content');
  }
  
  // CTA boost
  if (factors.ctaScore > 60) {
    baseRate += 0.2;
    factorList.push('Strong CTA');
  }
  
  // Readability bonus
  if (factors.readabilityScore > 60) {
    baseRate += 0.15;
    factorList.push('Good readability');
  }
  
  // Likes are typically 70% of engagement
  const likesRate = baseRate * 0.7;
  const expected = Math.round(reach * (likesRate / 100));
  
  // Confidence based on score consistency
  const scoreVariance = Math.abs(factors.viralityScore - factors.engagementScore) / 100;
  const confidence = Math.max(60, 100 - scoreVariance * 20);
  
  // Min/Max range (±40% variance)
  const variance = expected * 0.4;
  const min = Math.max(0, Math.round(expected - variance));
  const max = Math.round(expected + variance);
  
  return {
    min,
    max,
    expected,
    confidence: Math.round(confidence),
    factors: factorList.length > 0 ? factorList : ['Standard content'],
  };
}

function calculateCommentsPrediction(factors: PredictionFactors, reach: number): {
  min: number;
  max: number;
  expected: number;
  confidence: number;
  factors: string[];
} {
  // Comments typically represent 10-20% of total engagement
  // More likely with questions, controversial content, and strong CTAs
  
  const factorList: string[] = [];
  
  // Base comment rate (0.1% to 1.5%)
  let baseRate = 0.1 + (factors.engagementScore / 100) * 1.4;
  
  // Questions are HUGE for comments
  if (factors.hasQuestions) {
    baseRate += 0.5 * Math.min(factors.questionCount, 3);
    factorList.push(`${factors.questionCount} questions (increases comments)`);
  }
  
  // Controversial content drives comments
  if (factors.hasControversialElements) {
    baseRate += 0.8;
    factorList.push('Controversial content');
  }
  
  // Personal stories encourage comments
  if (factors.hasPersonalStory) {
    baseRate += 0.3;
    factorList.push('Personal story');
  }
  
  // Strong CTA encourages comments
  if (factors.ctaScore > 70) {
    baseRate += 0.4;
    factorList.push('Strong CTA');
  }
  
  // Storytelling encourages discussion
  if (factors.storytellingScore > 70) {
    baseRate += 0.2;
    factorList.push('Good storytelling');
  }
  
  // Sentiment matters for comments
  if (factors.sentimentScore > 60) {
    baseRate += 0.15;
  }
  
  const expected = Math.round(reach * (baseRate / 100));
  
  // Confidence calculation
  const hasStrongCommentTriggers = factors.hasQuestions || factors.hasControversialElements || factors.ctaScore > 70;
  const confidence = hasStrongCommentTriggers ? 75 : 60;
  
  // Min/Max range (±50% variance - comments are more variable)
  const variance = expected * 0.5;
  const min = Math.max(0, Math.round(expected - variance));
  const max = Math.round(expected + variance);
  
  return {
    min,
    max,
    expected,
    confidence: Math.round(confidence),
    factors: factorList.length > 0 ? factorList : ['Standard content'],
  };
}

function calculateSharesPrediction(factors: PredictionFactors, reach: number): {
  min: number;
  max: number;
  expected: number;
  confidence: number;
  factors: string[];
} {
  // Shares typically represent 5-10% of total engagement
  // Driven by value, insights, and shareability
  
  const factorList: string[] = [];
  
  // Base share rate (0.05% to 0.8%)
  let baseRate = 0.05 + (factors.viralityScore / 100) * 0.75;
  
  // High virality score boosts shares
  if (factors.viralityScore > 75) {
    baseRate += 0.3;
    factorList.push('High virality score');
  }
  
  // Storytelling makes content shareable
  if (factors.storytellingScore > 70) {
    baseRate += 0.2;
    factorList.push('Good storytelling');
  }
  
  // Numbers and insights are shareable
  if (factors.hasNumbers) {
    baseRate += 0.15;
    factorList.push('Numerical data');
  }
  
  // Personal transformation stories
  if (factors.hasPersonalStory && factors.storytellingScore > 60) {
    baseRate += 0.25;
    factorList.push('Transformation story');
  }
  
  // Readability helps shares
  if (factors.readabilityScore > 70) {
    baseRate += 0.1;
    factorList.push('Readable content');
  }
  
  // Hashtags help discoverability and shares
  if (factors.hashtagCount >= 3 && factors.hashtagCount <= 10) {
    baseRate += 0.1;
    factorList.push('Optimal hashtag count');
  }
  
  const expected = Math.round(reach * (baseRate / 100));
  
  // Confidence based on shareability factors
  const shareabilityScore = (factors.viralityScore + factors.storytellingScore + factors.readabilityScore) / 3;
  const confidence = Math.max(55, Math.min(85, shareabilityScore));
  
  // Min/Max range (±60% variance - shares are most variable)
  const variance = expected * 0.6;
  const min = Math.max(0, Math.round(expected - variance));
  const max = Math.round(expected + variance);
  
  return {
    min,
    max,
    expected,
    confidence: Math.round(confidence),
    factors: factorList.length > 0 ? factorList : ['Standard content'],
  };
}

export function predictEngagement(postText: string): EngagementPrediction {
  const analysis = runAnalysis(postText);
  const factors = extractFactors(analysis);
  
  // Calculate base reach
  const estimatedReach = calculateBaseReach(factors);
  
  // Calculate organic reach (typically 60-80% of estimated)
  const organicReach = Math.round(estimatedReach * (0.6 + (factors.viralityScore / 100) * 0.2));
  
  // Calculate viral potential (0-100)
  const viralPotential = Math.min(100, Math.round(
    (factors.viralityScore * 0.4) +
    (factors.engagementScore * 0.3) +
    (factors.hookScore * 0.15) +
    (factors.storytellingScore * 0.15)
  ));
  
  // Reach multiplier based on viral potential
  const reachMultiplier = 1 + (viralPotential / 100) * 2;
  
  // Calculate detailed predictions
  const likesPrediction = calculateLikesPrediction(factors, estimatedReach);
  const commentsPrediction = calculateCommentsPrediction(factors, estimatedReach);
  const sharesPrediction = calculateSharesPrediction(factors, estimatedReach);
  
  // Calculate total engagement
  const totalEngagement = likesPrediction.expected + commentsPrediction.expected + sharesPrediction.expected;
  const reactions = likesPrediction.expected; // Reactions ≈ likes
  
  // Calculate performance metrics
  const engagementRate = estimatedReach > 0 ? (totalEngagement / estimatedReach) * 100 : 0;
  const commentRate = estimatedReach > 0 ? (commentsPrediction.expected / estimatedReach) * 100 : 0;
  const shareRate = estimatedReach > 0 ? (sharesPrediction.expected / estimatedReach) * 100 : 0;
  
  // Generate insights
  const insights: string[] = [];
  
  if (viralPotential > 75) {
    insights.push('This post has high viral potential! It contains strong hook and engagement factors.');
  } else if (viralPotential > 50) {
    insights.push('The post has good engagement potential. It can be further strengthened with some improvements.');
  } else {
    insights.push('The post may show standard performance. Strengthening the hook and CTA is recommended.');
  }
  
  if (likesPrediction.expected > commentsPrediction.expected * 5) {
    insights.push('Likes will be much higher than comments. Add questions to get more comments.');
  }
  
  if (commentsPrediction.expected > likesPrediction.expected * 0.3) {
    insights.push('High comment potential! This post could spark discussion.');
  }
  
  if (sharesPrediction.expected > totalEngagement * 0.15) {
    insights.push('High share potential. The content appears valuable and shareable.');
  }
  
  if (factors.hasQuestions && factors.questionCount >= 2) {
    insights.push(`Contains ${factors.questionCount} questions - this will significantly increase comments.`);
  }
  
  // Generate recommendations
  const recommendations: string[] = [];
  
  if (factors.hookScore < 60) {
    recommendations.push('Make the first sentence more compelling to increase hook score.');
  }
  
  if (!factors.hasQuestions) {
    recommendations.push('Add at least 1-2 questions to increase comment potential.');
  }
  
  if (factors.ctaScore < 60) {
    recommendations.push('Add a strong call-to-action to increase engagement.');
  }
  
  if (factors.hashtagCount < 3) {
    recommendations.push('Add 3-5 hashtags to increase reach.');
  } else if (factors.hashtagCount > 10) {
    recommendations.push('Reduce hashtag count to 5-10 (optimal for LinkedIn).');
  }
  
  if (factors.wordCount < 100) {
    recommendations.push('Longer content (150-300 words) typically performs better.');
  } else if (factors.wordCount > 500) {
    recommendations.push('Shorten the content slightly. 150-300 words is optimal length for LinkedIn.');
  }
  
  if (factors.storytellingScore < 50) {
    recommendations.push('Add a personal story or example to increase storytelling score.');
  }
  
  if (viralPotential < 50) {
    recommendations.push('Strengthen hook, CTA, and engagement factors to increase virality score.');
  }
  
  return {
    expectedEngagement: {
      likes: likesPrediction.expected,
      comments: commentsPrediction.expected,
      shares: sharesPrediction.expected,
      reactions: reactions,
      totalEngagement,
    },
    reach: {
      estimatedReach,
      organicReach,
      viralPotential,
      reachMultiplier: Math.round(reachMultiplier * 10) / 10,
    },
    detailedPredictions: {
      likesPrediction,
      commentsPrediction,
      sharesPrediction,
    },
    performanceMetrics: {
      engagementRate: Math.round(engagementRate * 10) / 10,
      commentRate: Math.round(commentRate * 10) / 10,
      shareRate: Math.round(shareRate * 10) / 10,
      viralScore: viralPotential,
    },
    insights,
    recommendations,
  };
}
