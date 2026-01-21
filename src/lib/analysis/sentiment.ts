import type { SentimentAnalysis } from './types';

// Advanced sentiment and emotional tone analysis
export function analyzeSentiment(post: string): SentimentAnalysis {
  const lowerPost = post.toLowerCase();
  const words = post.split(/\s+/);
  const sentences = post.split(/[.!?]+/).filter(Boolean);

  // Positive sentiment indicators
  const positiveWords = [
    'amazing', 'excellent', 'great', 'wonderful', 'fantastic', 'brilliant', 'outstanding',
    'success', 'achievement', 'win', 'victory', 'breakthrough', 'innovation', 'growth',
    'inspiring', 'motivating', 'empowering', 'transformative', 'revolutionary', 'game-changing',
    'grateful', 'thankful', 'appreciate', 'love', 'passion', 'excited', 'thrilled',
    'opportunity', 'potential', 'future', 'progress', 'improvement', 'better', 'best'
  ];

  // Negative sentiment indicators
  const negativeWords = [
    'problem', 'issue', 'challenge', 'difficulty', 'struggle', 'failure', 'mistake',
    'wrong', 'bad', 'terrible', 'awful', 'disappointing', 'frustrating', 'difficult',
    'crisis', 'risk', 'danger', 'concern', 'worry', 'fear', 'anxiety', 'stress'
  ];

  // Emotional tone indicators
  const emotionalTones = {
    professional: ['analysis', 'data', 'research', 'study', 'findings', 'evidence', 'strategy', 'framework', 'methodology'],
    personal: ['i', 'my', 'me', 'myself', 'experience', 'story', 'journey', 'learned', 'felt'],
    inspirational: ['believe', 'dream', 'aspire', 'achieve', 'overcome', 'persevere', 'determination', 'courage'],
    analytical: ['because', 'therefore', 'however', 'furthermore', 'analysis', 'data', 'statistics', 'research'],
    conversational: ['you', 'your', 'we', 'us', 'let\'s', 'think about', 'imagine', 'consider'],
    urgent: ['now', 'today', 'immediately', 'urgent', 'critical', 'important', 'must', 'need'],
    confident: ['proven', 'guaranteed', 'certain', 'definitely', 'absolutely', 'sure', 'know'],
    humble: ['might', 'perhaps', 'maybe', 'could', 'possibly', 'think', 'believe', 'opinion']
  };

  // Count sentiment words
  let positiveCount = 0;
  let negativeCount = 0;
  
  for (const word of words) {
    const lowerWord = word.toLowerCase().replace(/[^\w]/g, '');
    if (positiveWords.some(pw => lowerWord.includes(pw))) positiveCount++;
    if (negativeWords.some(nw => lowerWord.includes(nw))) negativeCount++;
  }

  // Calculate sentiment score
  const totalSentimentWords = positiveCount + negativeCount;
  let sentimentScore = 50; // Neutral baseline
  
  if (totalSentimentWords > 0) {
    const positiveRatio = positiveCount / totalSentimentWords;
    sentimentScore = 50 + (positiveRatio * 50) - ((1 - positiveRatio) * 30);
  }

  // Detect emotional tones
  const detectedTones: string[] = [];
  const toneScores: Record<string, number> = {};

  for (const [tone, indicators] of Object.entries(emotionalTones)) {
    let count = 0;
    for (const indicator of indicators) {
      const regex = new RegExp(`\\b${indicator}\\b`, 'gi');
      const matches = lowerPost.match(regex);
      if (matches) count += matches.length;
    }
    if (count > 0) {
      toneScores[tone] = count;
      if (count >= 2) {
        detectedTones.push(tone);
      }
    }
  }

  // Determine primary tone
  const primaryTone = detectedTones.length > 0 
    ? detectedTones.reduce((a, b) => toneScores[a] > toneScores[b] ? a : b)
    : 'neutral';

  // Sentiment classification
  let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
  if (sentimentScore > 60) sentiment = 'positive';
  else if (sentimentScore < 40) sentiment = 'negative';

  // Personal vs Professional balance
  const personalScore = toneScores.personal || 0;
  const professionalScore = toneScores.professional || 0;
  const totalToneScore = personalScore + professionalScore;
  
  let personalProfessionalBalance: 'personal' | 'balanced' | 'professional' = 'balanced';
  if (totalToneScore > 0) {
    const personalRatio = personalScore / totalToneScore;
    if (personalRatio > 0.6) personalProfessionalBalance = 'personal';
    else if (personalRatio < 0.4) personalProfessionalBalance = 'professional';
  }

  // Generate insights
  const insights: string[] = [];
  
  if (sentiment === 'positive' && sentimentScore > 75) {
    insights.push('Strong positive sentiment detected. This creates an uplifting and engaging tone.');
  } else if (sentiment === 'negative') {
    insights.push('Negative sentiment detected. Consider reframing challenges as opportunities.');
  }

  if (detectedTones.length > 3) {
    insights.push('Multiple emotional tones detected. Consider focusing on one primary tone for clarity.');
  }

  if (personalProfessionalBalance === 'personal') {
    insights.push('Post has a personal tone. Great for storytelling and building connections.');
  } else if (personalProfessionalBalance === 'professional') {
    insights.push('Post has a professional tone. Ideal for thought leadership and expertise sharing.');
  }

  const suggestions: string[] = [];
  
  if (sentimentScore < 50 && negativeCount > positiveCount) {
    suggestions.push('Balance negative points with positive outcomes or solutions.');
  }

  if (!detectedTones.includes('conversational') && !detectedTones.includes('personal')) {
    suggestions.push('Add more "you" and "we" language to create a conversational tone.');
  }

  if (detectedTones.includes('urgent') && detectedTones.length === 1) {
    suggestions.push('Urgency is good, but balance it with value to avoid sounding pushy.');
  }

  return {
    sentiment,
    sentimentScore: Math.max(0, Math.min(100, Math.round(sentimentScore))),
    primaryTone,
    detectedTones,
    personalProfessionalBalance,
    insights,
    suggestions,
  };
}
