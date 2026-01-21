import type { EngagementAnalysis } from './types';

// Advanced engagement triggers and pattern detection
export function analyzeEngagement(post: string): EngagementAnalysis {
  const lowerPost = post.toLowerCase();
  const sentences = post.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = post.split(/\s+/);
  
  // Engagement triggers
  const engagementTriggers = {
    // Questions (direct engagement)
    questions: (post.match(/\?/g) || []).length,
    
    // Controversial statements
    controversial: ['wrong', 'mistake', 'myth', 'lie', 'truth', 'reality', 'actually', 'surprisingly'].filter(word => 
      lowerPost.includes(word)
    ).length,
    
    // Numbers and statistics
    numbers: (post.match(/\d+/g) || []).length,
    
    // Lists (scannable content)
    lists: (post.match(/^\s*[-*•]\s|\d+\.\s/gm) || []).length,
    
    // Direct address
    directAddress: ['you', 'your', 'yours'].filter(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      return regex.test(post);
    }).length,
    
    // Urgency/scarcity
    urgency: ['now', 'today', 'limited', 'only', 'exclusive', 'don\'t miss', 'hurry'].filter(word =>
      lowerPost.includes(word)
    ).length,
    
    // Social proof
    socialProof: ['thousands', 'millions', 'everyone', 'most people', 'many', 'popular', 'trending'].filter(word =>
      lowerPost.includes(word)
    ).length,
    
    // Curiosity gaps
    curiosity: ['secret', 'hidden', 'reveal', 'discover', 'uncover', 'behind', 'inside', 'truth'].filter(word =>
      lowerPost.includes(word)
    ).length,
    
    // Emotional triggers
    emotional: ['love', 'hate', 'amazing', 'terrible', 'shocking', 'inspiring', 'heartbreaking', 'thrilling'].filter(word =>
      lowerPost.includes(word)
    ).length,
    
    // Action verbs
    actionVerbs: ['build', 'create', 'transform', 'achieve', 'master', 'learn', 'grow', 'scale', 'launch'].filter(word =>
      lowerPost.includes(word)
    ).length,
    
    // Personal stories
    personal: ['i', 'my', 'me', 'story', 'journey', 'experience'].filter(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      return regex.test(post);
    }).length,
  };

  // Calculate engagement score
  let engagementScore = 0;
  const detectedTriggers: string[] = [];
  
  if (engagementTriggers.questions > 0) {
    engagementScore += Math.min(20, engagementTriggers.questions * 5);
    detectedTriggers.push('questions');
  }
  
  if (engagementTriggers.controversial > 0) {
    engagementScore += Math.min(15, engagementTriggers.controversial * 5);
    detectedTriggers.push('controversial_statements');
  }
  
  if (engagementTriggers.numbers > 0) {
    engagementScore += Math.min(15, Math.min(engagementTriggers.numbers, 5) * 3);
    detectedTriggers.push('numbers_statistics');
  }
  
  if (engagementTriggers.lists > 0) {
    engagementScore += Math.min(15, Math.min(engagementTriggers.lists, 5) * 3);
    detectedTriggers.push('lists');
  }
  
  if (engagementTriggers.directAddress > 3) {
    engagementScore += 15;
    detectedTriggers.push('direct_address');
  }
  
  if (engagementTriggers.urgency > 0) {
    engagementScore += Math.min(10, engagementTriggers.urgency * 3);
    detectedTriggers.push('urgency');
  }
  
  if (engagementTriggers.socialProof > 0) {
    engagementScore += Math.min(10, engagementTriggers.socialProof * 3);
    detectedTriggers.push('social_proof');
  }
  
  if (engagementTriggers.curiosity > 0) {
    engagementScore += Math.min(10, engagementTriggers.curiosity * 3);
    detectedTriggers.push('curiosity_gaps');
  }
  
  if (engagementTriggers.emotional > 0) {
    engagementScore += Math.min(10, engagementTriggers.emotional * 2);
    detectedTriggers.push('emotional_triggers');
  }
  
  if (engagementTriggers.actionVerbs > 2) {
    engagementScore += 10;
    detectedTriggers.push('action_oriented');
  }
  
  if (engagementTriggers.personal > 5) {
    engagementScore += 10;
    detectedTriggers.push('personal_story');
  }

  // Engagement potential prediction
  let engagementPotential: 'low' | 'medium' | 'high' | 'very_high' = 'low';
  
  if (engagementScore >= 70) engagementPotential = 'very_high';
  else if (engagementScore >= 50) engagementPotential = 'high';
  else if (engagementScore >= 30) engagementPotential = 'medium';

  // Generate insights
  const insights: string[] = [];
  
  if (engagementPotential === 'very_high') {
    insights.push('Excellent engagement potential! Multiple triggers detected.');
  } else if (engagementPotential === 'high') {
    insights.push('Good engagement potential. Post has several effective triggers.');
  } else if (engagementPotential === 'medium') {
    insights.push('Moderate engagement potential. Consider adding more engagement triggers.');
  } else {
    insights.push('Low engagement potential. Add questions, numbers, or personal elements.');
  }

  if (detectedTriggers.length > 5) {
    insights.push(`Multiple engagement triggers detected: ${detectedTriggers.slice(0, 5).join(', ')}.`);
  }

  if (engagementTriggers.questions === 0) {
    insights.push('No questions detected. Questions are one of the most effective engagement triggers.');
  }

  const suggestions: string[] = [];

  if (engagementTriggers.questions === 0) {
    suggestions.push('Add 1-2 questions to encourage comments and engagement.');
  }

  if (engagementTriggers.numbers === 0) {
    suggestions.push('Include specific numbers or statistics to add credibility and interest.');
  }

  if (engagementTriggers.lists === 0 && sentences.length > 5) {
    suggestions.push('Use bullet points or numbered lists to make content more scannable.');
  }

  if (engagementTriggers.directAddress < 3) {
    suggestions.push('Use more "you" language to directly address your audience.');
  }

  if (engagementTriggers.personal < 3) {
    suggestions.push('Add personal elements (I, my story) to create connection.');
  }

  if (engagementTriggers.curiosity === 0 && engagementScore < 50) {
    suggestions.push('Create curiosity gaps with phrases like "Here\'s what I discovered..." or "The secret is..."');
  }

  return {
    engagementScore: Math.max(0, Math.min(100, engagementScore)),
    engagementPotential,
    detectedTriggers,
    triggerCounts: engagementTriggers,
    insights,
    suggestions,
  };
}
