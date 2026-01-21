import type { TopicAnalysis } from './types';

// Advanced topic and keyword extraction
export function analyzeTopics(post: string): TopicAnalysis {
  const lowerPost = post.toLowerCase();
  const words = post.split(/\s+/).map(w => w.toLowerCase().replace(/[^\w]/g, ''));
  
  // Common stop words to filter out
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
    'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been', 'be', 'have', 'has', 'had',
    'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must',
    'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they',
    'my', 'your', 'his', 'her', 'its', 'our', 'their', 'me', 'him', 'us', 'them'
  ]);

  // Topic categories with keywords
  const topicCategories: Record<string, string[]> = {
    technology: ['tech', 'software', 'code', 'programming', 'developer', 'engineering', 'ai', 'ml', 'algorithm', 'api', 'system', 'platform', 'digital', 'innovation', 'startup', 'saas'],
    business: ['business', 'company', 'enterprise', 'corporate', 'strategy', 'management', 'leadership', 'executive', 'organization', 'market', 'industry', 'revenue', 'profit'],
    career: ['career', 'job', 'work', 'professional', 'skills', 'experience', 'interview', 'resume', 'hiring', 'recruitment', 'talent', 'employee', 'employer'],
    marketing: ['marketing', 'brand', 'advertising', 'campaign', 'content', 'social', 'media', 'engagement', 'audience', 'customer', 'client', 'sales', 'growth'],
    entrepreneurship: ['entrepreneur', 'startup', 'founder', 'venture', 'investor', 'funding', 'pitch', 'product', 'launch', 'scale', 'growth'],
    productivity: ['productivity', 'efficiency', 'time', 'management', 'tools', 'workflow', 'process', 'optimize', 'improve', 'system'],
    learning: ['learn', 'education', 'course', 'training', 'skill', 'knowledge', 'expertise', 'master', 'study', 'research'],
    networking: ['network', 'connection', 'relationship', 'community', 'collaboration', 'partnership', 'team', 'together'],
    personal: ['story', 'journey', 'experience', 'life', 'personal', 'reflection', 'lesson', 'learned', 'growth', 'mindset'],
    data: ['data', 'analytics', 'metrics', 'insights', 'analysis', 'statistics', 'numbers', 'research', 'study', 'findings']
  };

  // Extract keywords (words longer than 3 chars, not stop words)
  const keywords = words
    .filter(w => w.length > 3 && !stopWords.has(w))
    .filter((w, i, arr) => arr.indexOf(w) === i); // unique

  // Count word frequency
  const wordFreq: Record<string, number> = {};
  words.forEach(w => {
    if (w.length > 3 && !stopWords.has(w)) {
      wordFreq[w] = (wordFreq[w] || 0) + 1;
    }
  });

  // Detect topics
  const topicScores: Record<string, number> = {};
  const detectedTopics: string[] = [];

  for (const [topic, keywords] of Object.entries(topicCategories)) {
    let score = 0;
    for (const keyword of keywords) {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = lowerPost.match(regex);
      if (matches) {
        score += matches.length;
      }
    }
    if (score > 0) {
      topicScores[topic] = score;
      if (score >= 2) {
        detectedTopics.push(topic);
      }
    }
  }

  // Get top keywords (most frequent)
  const topKeywords = Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);

  // Primary topic
  const primaryTopic = detectedTopics.length > 0
    ? detectedTopics.reduce((a, b) => topicScores[a] > topicScores[b] ? a : b)
    : 'general';

  // Topic diversity score
  const topicDiversity = detectedTopics.length;
  let diversityScore = Math.min(100, topicDiversity * 15);
  if (topicDiversity === 0) diversityScore = 30;
  if (topicDiversity > 5) diversityScore = 100;

  // Generate insights
  const insights: string[] = [];
  
  if (detectedTopics.length === 0) {
    insights.push('No specific topic category detected. Consider using more domain-specific keywords.');
  } else if (detectedTopics.length === 1) {
    insights.push(`Post focuses on ${primaryTopic}. Great for targeted audience engagement.`);
  } else {
    insights.push(`Post covers multiple topics: ${detectedTopics.slice(0, 3).join(', ')}.`);
  }

  if (topKeywords.length > 0) {
    insights.push(`Key themes: ${topKeywords.slice(0, 5).join(', ')}.`);
  }

  const suggestions: string[] = [];

  if (detectedTopics.length === 0) {
    suggestions.push('Add more specific keywords related to your industry or niche.');
  }

  if (detectedTopics.length > 4) {
    suggestions.push('Post covers many topics. Consider focusing on 1-2 main themes for better clarity.');
  }

  if (topKeywords.length < 3) {
    suggestions.push('Use more specific keywords to improve discoverability and SEO.');
  }

  return {
    primaryTopic,
    detectedTopics,
    topKeywords,
    topicDiversity,
    diversityScore,
    insights,
    suggestions,
  };
}
