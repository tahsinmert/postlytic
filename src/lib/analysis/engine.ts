import { analyzeHook } from './hook';
import { analyzeStructure } from './structure';
import { analyzeCta } from './cta';
import { analyzeHashtags } from './hashtags';
import { analyzeEmojis } from './emojis';
import { analyzeSentiment } from './sentiment';
import { analyzeTopics } from './topics';
import { analyzeReadability } from './readability';
import { analyzeStorytelling } from './storytelling';
import { analyzeEngagement } from './engagement';
import { getRewriteStrategy } from './rewrite';
import type { AnalysisData, ViralityScore } from './types';

function calculateViralityScore(
  hookScore: number,
  structureScore: number,
  ctaScore: number,
  hashtagScore: number,
  engagementScore: number,
  storytellingScore: number,
  sentimentScore: number,
  readabilityScore: number
): ViralityScore {
  // Enhanced weights with new factors
  const weights = { 
    hook: 0.2, 
    structure: 0.15, 
    cta: 0.15, 
    hashtags: 0.1, 
    emojis: 0.05,
    engagement: 0.15,
    storytelling: 0.1,
    sentiment: 0.05,
    readability: 0.05
  };
  
  // For simplicity, we'll derive an "emoji score" from the structure score,
  // as good emoji usage contributes to good structure.
  const emojiScore = structureScore; 

  const finalScore =
    hookScore * weights.hook +
    structureScore * weights.structure +
    ctaScore * weights.cta +
    hashtagScore * weights.hashtags +
    emojiScore * weights.emojis +
    engagementScore * weights.engagement +
    storytellingScore * weights.storytelling +
    sentimentScore * weights.sentiment +
    readabilityScore * weights.readability;

  const score = Math.round(finalScore);
  
  let explanation = "Your virality score is calculated using advanced AI analysis across multiple dimensions. ";
  if (score > 85) {
      explanation += "Exceptional! This post has outstanding potential for viral reach. The combination of strong engagement triggers, storytelling, and structure makes it highly shareable.";
  } else if (score > 75) {
      explanation += "Excellent! This post has strong potential for high engagement. The content is well-structured with effective hooks and clear calls to action.";
  } else if (score > 60) {
      explanation += "Good! This is a solid post with several strong elements. A few strategic improvements could significantly boost its performance.";
  } else if (score > 45) {
      explanation += "Fair. This post has potential but needs improvement in key areas like engagement triggers, storytelling, or structure.";
  } else {
      explanation += "Needs work. Focus on strengthening the hook, adding engagement triggers, improving structure, and incorporating storytelling elements.";
  }

  return {
    score,
    explanation,
    breakdown: {
      hook: hookScore,
      structure: structureScore,
      cta: ctaScore,
      hashtags: hashtagScore,
      emojis: emojiScore,
    },
  };
}

export function runAnalysis(postText: string): AnalysisData {
  const originalPost = postText;
  
  // Core analyses
  const hook = analyzeHook(originalPost);
  const structure = analyzeStructure(originalPost);
  const cta = analyzeCta(originalPost);
  const hashtags = analyzeHashtags(originalPost);
  const emojis = analyzeEmojis(originalPost);
  
  // Advanced analyses
  const sentiment = analyzeSentiment(originalPost);
  const topics = analyzeTopics(originalPost);
  const readability = analyzeReadability(originalPost);
  const storytelling = analyzeStorytelling(originalPost);
  const engagement = analyzeEngagement(originalPost);
  
  // Calculate enhanced virality score
  const readabilityScore = readability.fleschKincaidScore;
  const viralityScore = calculateViralityScore(
    hook.score, 
    structure.score, 
    cta.score, 
    hashtags.score,
    engagement.engagementScore,
    storytelling.storytellingScore,
    sentiment.sentimentScore,
    readabilityScore
  );
  
  const rewriteStrategy = getRewriteStrategy();

  return {
    originalPost,
    hook,
    structure,
    cta,
    hashtags,
    emojis,
    sentiment,
    topics,
    readability,
    storytelling,
    engagement,
    viralityScore,
    rewriteStrategy,
  };
}
