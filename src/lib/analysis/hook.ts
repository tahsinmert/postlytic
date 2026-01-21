import { POWER_WORDS } from './constants';
import type { HookAnalysis } from './types';

export function analyzeHook(post: string): HookAnalysis {
  const lines = post.split('\n');
  const hookText = (lines.slice(0, 2).join(' ') || '').toLowerCase();
  const firstLine = (lines[0] || '').toLowerCase();
  let score = 0;
  const patterns: string[] = [];
  const suggestions: string[] = [];

  // Length scoring (more nuanced)
  const hookLength = hookText.trim().length;
  if (hookLength === 0) {
      return {
          score: 0,
          patterns: [],
          suggestions: ['Post is empty or too short to analyze.'],
      }
  } else if (hookLength > 220) {
    score += 10;
    suggestions.push('Your hook is a bit long. Aim for under 220 characters to grab attention on mobile.');
  } else if (hookLength < 30) {
    score += 15;
    suggestions.push('Your hook is very short. This can be effective if punchy, but ensure it creates enough curiosity.');
  } else if (hookLength >= 30 && hookLength <= 100) {
    score += 45; // Optimal range
    patterns.push('Optimal hook length');
  } else if (hookLength <= 220) {
    score += 35; // Good range
  }

  // Question mark (enhanced)
  const questionCount = (hookText.match(/\?/g) || []).length;
  if (questionCount > 0) {
    score += Math.min(30, questionCount * 15);
    patterns.push(`Question-based hook (${questionCount} question${questionCount > 1 ? 's' : ''})`);
  }

  // Power words (enhanced matching)
  const powerWordsFound: string[] = [];
  for (const word of POWER_WORDS) {
    const regex = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (regex.test(hookText)) {
      powerWordsFound.push(word);
    }
  }
  if (powerWordsFound.length > 0) {
    score += Math.min(25, powerWordsFound.length * 8);
    patterns.push(`Contains power words: ${powerWordsFound.slice(0, 3).join(', ')}${powerWordsFound.length > 3 ? '...' : ''}`);
  }

  // Numbers or stats (enhanced)
  const numbers = hookText.match(/\d+/g);
  if (numbers && numbers.length > 0) {
    score += Math.min(25, numbers.length * 10);
    patterns.push(`Uses numbers/data (${numbers.length} instance${numbers.length > 1 ? 's' : ''})`);
  }
  
  // Contrast words (enhanced)
  const contrastPatterns = [
    'but', 'instead of', 'most people', 'everyone thinks', 'common belief',
    'contrary to', 'unlike', 'versus', 'vs', 'rather than', 'not just'
  ];
  const contrastFound = contrastPatterns.filter(pattern => hookText.includes(pattern));
  if (contrastFound.length > 0) {
    score += Math.min(25, contrastFound.length * 12);
    patterns.push(`Uses contrast: ${contrastFound[0]}`);
  }

  // Storytelling hooks
  const storyHooks = ['once', 'imagine', 'picture this', 'let me tell you', 'story', 'journey'];
  const storyFound = storyHooks.filter(hook => firstLine.includes(hook));
  if (storyFound.length > 0) {
    score += 20;
    patterns.push('Storytelling hook');
  }

  // Controversial/attention-grabbing
  const controversialWords = ['wrong', 'myth', 'lie', 'secret', 'hidden', 'truth', 'reality'];
  const controversialFound = controversialWords.filter(word => hookText.includes(word));
  if (controversialFound.length > 0) {
    score += 20;
    patterns.push('Controversial/attention-grabbing hook');
  }

  // Personal connection
  if (hookText.includes(' i ') || hookText.includes(' my ') || hookText.startsWith('i ') || hookText.startsWith('my ')) {
    score += 15;
    patterns.push('Personal hook');
  }

  // Curiosity gap
  const curiosityWords = ['secret', 'discover', 'reveal', 'uncover', 'behind', 'inside'];
  const curiosityFound = curiosityWords.filter(word => hookText.includes(word));
  if (curiosityFound.length > 0) {
    score += 20;
    patterns.push('Curiosity gap hook');
  }

  // First word analysis
  const firstWord = firstLine.trim().split(/\s+/)[0];
  const strongStarters = ['how', 'why', 'what', 'when', 'where', 'imagine', 'picture', 'think', 'consider'];
  if (strongStarters.includes(firstWord)) {
    score += 10;
    patterns.push(`Strong opening word: "${firstWord}"`);
  }

  // Generate suggestions if score is low
  if (score < 50) {
    const missingElements: string[] = [];
    if (questionCount === 0) missingElements.push('a question');
    if (powerWordsFound.length === 0) missingElements.push('power words');
    if (!numbers || numbers.length === 0) missingElements.push('numbers or statistics');
    if (contrastFound.length === 0) missingElements.push('contrast or controversy');
    
    if (missingElements.length > 0) {
      suggestions.push(`Your hook is weak. Try adding ${missingElements.slice(0, 2).join(' or ')} to make it more engaging.`);
    } else {
      suggestions.push('Your hook needs improvement. Consider making it more specific, personal, or attention-grabbing.');
    }
  } else if (score >= 70) {
    patterns.push('Strong hook detected');
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    patterns,
    suggestions,
  };
}
