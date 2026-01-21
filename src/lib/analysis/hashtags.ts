import { GENERIC_HASHTAGS } from './constants';
import type { HashtagAnalysis } from './types';

const HASHTAG_REGEX = /#(\w+)/g;

export function analyzeHashtags(post: string): HashtagAnalysis {
  const matches = [...post.matchAll(HASHTAG_REGEX)];
  const hashtags = matches.map(match => match[1].toLowerCase());
  
  let score = 100;
  const issues: string[] = [];
  const recommendations: string[] = [];

  // Count
  if (hashtags.length === 0) {
    score = 20;
    issues.push('No hashtags found.');
    recommendations.push('Add 3-5 relevant hashtags to increase discoverability.');
  } else if (hashtags.length > 5) {
    score -= (hashtags.length - 5) * 10;
    issues.push('Hashtag overuse detected.');
    recommendations.push('Using more than 5 hashtags can look spammy and dilute your message. Stick to 3-5 highly relevant tags.');
  }

  // Duplicates
  const uniqueHashtags = new Set(hashtags);
  if (uniqueHashtags.size < hashtags.length) {
    score -= 20;
    issues.push('Duplicate hashtags found.');
    recommendations.push('Each hashtag should be unique.');
  }

  // Generic vs niche
  const genericCount = hashtags.filter(tag => GENERIC_HASHTAGS.includes(`#${tag}`)).length;
  if (genericCount > 2 && hashtags.length > 0) {
    score -= genericCount * 5;
    issues.push('Contains generic hashtags.');
    recommendations.push('Mix broad hashtags with niche ones to reach a more targeted audience. e.g., instead of just #marketing, try #contentstrategyforb2b.');
  }

  // Placement
  const lastLine = post.split('\n').pop() || '';
  const hashtagsInLastLine = (lastLine.match(HASHTAG_REGEX) || []).length;
  if (hashtags.length > 0 && hashtagsInLastLine < hashtags.length) {
    score -= 15;
    issues.push('Hashtags are mixed inside the post body.');
    recommendations.push('For better readability, group your hashtags at the very end of the post.');
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    issues,
    recommendations,
  };
}
