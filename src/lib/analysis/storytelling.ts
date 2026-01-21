import type { StorytellingAnalysis } from './types';

// Detect storytelling structure and narrative elements
export function analyzeStorytelling(post: string): StorytellingAnalysis {
  const lowerPost = post.toLowerCase();
  const sentences = post.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const paragraphs = post.split('\n\n').filter(p => p.trim().length > 0);
  
  // Storytelling elements
  const storytellingElements = {
    // Opening hooks
    hook: ['once', 'imagine', 'picture this', 'let me tell you', 'story', 'journey', 'experience'],
    // Personal pronouns
    personal: ['i', 'my', 'me', 'myself', 'we', 'our', 'us'],
    // Time markers (story progression)
    timeMarkers: ['first', 'then', 'next', 'after', 'before', 'finally', 'eventually', 'suddenly', 'meanwhile'],
    // Emotional markers
    emotions: ['felt', 'feeling', 'excited', 'nervous', 'proud', 'grateful', 'surprised', 'disappointed', 'happy', 'sad'],
    // Conflict/challenge
    conflict: ['challenge', 'problem', 'struggle', 'difficulty', 'obstacle', 'failure', 'mistake', 'wrong'],
    // Resolution/outcome
    resolution: ['solution', 'learned', 'realized', 'discovered', 'achieved', 'succeeded', 'overcame', 'won'],
    // Lessons/insights
    lessons: ['lesson', 'learned', 'takeaway', 'insight', 'realization', 'key', 'important', 'remember'],
    // Numbers/stats (concrete details)
    concrete: ['days', 'weeks', 'months', 'years', 'percent', '%', 'times', 'first', 'second', 'third']
  };

  // Detect storytelling patterns
  const elementCounts: Record<string, number> = {};
  const detectedElements: string[] = [];

  for (const [element, keywords] of Object.entries(storytellingElements)) {
    let count = 0;
    for (const keyword of keywords) {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = lowerPost.match(regex);
      if (matches) count += matches.length;
    }
    elementCounts[element] = count;
    if (count > 0) {
      detectedElements.push(element);
    }
  }

  // Story structure detection
  let hasHook = elementCounts.hook > 0 || elementCounts.personal > 2;
  let hasPersonal = elementCounts.personal > 2;
  let hasConflict = elementCounts.conflict > 0;
  let hasResolution = elementCounts.resolution > 0 || elementCounts.lessons > 0;
  let hasTimeProgression = elementCounts.timeMarkers > 0;
  let hasEmotionalArc = elementCounts.emotions > 0;
  let hasConcreteDetails = elementCounts.concrete > 0;
  let hasLessons = elementCounts.lessons > 0;

  // Calculate storytelling score
  let score = 0;
  
  if (hasHook) score += 20;
  if (hasPersonal) score += 15;
  if (hasConflict) score += 15;
  if (hasResolution) score += 20;
  if (hasTimeProgression) score += 10;
  if (hasEmotionalArc) score += 10;
  if (hasConcreteDetails) score += 10;

  // Determine story structure type
  let structureType: 'narrative' | 'case_study' | 'lesson_learned' | 'transformation' | 'minimal' = 'minimal';
  
  if (hasHook && hasConflict && hasResolution && hasPersonal) {
    if (hasTimeProgression && hasEmotionalArc) {
      structureType = 'narrative';
    } else if (hasConcreteDetails && hasLessons) {
      structureType = 'case_study';
    } else {
      structureType = 'lesson_learned';
    }
  } else if (hasConflict && hasResolution && hasPersonal) {
    structureType = 'transformation';
  }

  // Check for classic story arc (beginning, middle, end)
  const hasBeginning = hasHook && (paragraphs.length > 0 || sentences.length > 2);
  const hasMiddle = hasConflict || elementCounts.timeMarkers > 0;
  const hasEnd = hasResolution || elementCounts.lessons > 0;
  
  const hasCompleteArc = hasBeginning && hasMiddle && hasEnd;

  // Generate insights
  const insights: string[] = [];
  
  if (structureType === 'narrative') {
    insights.push('Strong narrative structure detected. This creates an engaging story that readers can follow.');
  } else if (structureType === 'case_study') {
    insights.push('Case study structure detected. Great for demonstrating expertise and results.');
  } else if (structureType === 'transformation') {
    insights.push('Transformation story detected. Effective for inspiring and motivating readers.');
  } else if (structureType === 'lesson_learned') {
    insights.push('Lesson-learned structure detected. Valuable for sharing insights and knowledge.');
  } else {
    insights.push('Limited storytelling elements detected. Consider adding narrative structure.');
  }

  if (hasCompleteArc) {
    insights.push('Complete story arc detected (beginning, middle, end). Excellent storytelling!');
  }

  if (hasEmotionalArc) {
    insights.push('Emotional elements detected. This helps readers connect with your story.');
  }

  if (hasConcreteDetails) {
    insights.push('Concrete details and specifics detected. This makes your story more credible and memorable.');
  }

  const suggestions: string[] = [];

  if (!hasHook) {
    suggestions.push('Start with a compelling hook: "Let me tell you a story..." or "Imagine..."');
  }

  if (!hasPersonal) {
    suggestions.push('Add personal pronouns (I, my, we) to make the story more relatable.');
  }

  if (!hasConflict) {
    suggestions.push('Include a challenge or problem to create tension and interest.');
  }

  if (!hasResolution) {
    suggestions.push('Add a resolution or lesson learned to complete the story arc.');
  }

  if (!hasTimeProgression) {
    suggestions.push('Use time markers (first, then, finally) to guide readers through the story.');
  }

  if (!hasEmotionalArc) {
    suggestions.push('Include emotional elements to help readers connect with your story.');
  }

  if (!hasConcreteDetails) {
    suggestions.push('Add specific details, numbers, or concrete examples to make your story more vivid.');
  }

  if (!hasCompleteArc && score < 50) {
    suggestions.push('Build a complete story arc: Set up the situation, introduce a challenge, and share the resolution.');
  }

  return {
    hasStoryStructure: score >= 40,
    structureType,
    storytellingScore: Math.max(0, Math.min(100, score)),
    detectedElements,
    hasCompleteArc,
    insights,
    suggestions,
  };
}
